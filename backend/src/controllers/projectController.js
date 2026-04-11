const { supabaseAdmin, supabasePublic } = require('../config/supabase');

function normalizeProjectPayload(input = {}) {
  const payload = { ...input };

  if (!payload.is_featured) {
    payload.featured_order = null;
    payload.featured_note = payload.featured_note || null;
  }

  if (typeof payload.title === 'string') {
    payload.title = payload.title.trim();
  }

  if (typeof payload.slug === 'string') {
    payload.slug = payload.slug.trim() || null;
  }

  return payload;
}

async function getNextFeaturedOrder() {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('featured_order')
    .eq('is_featured', true)
    .order('featured_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.featured_order || 0) + 1;
}

async function hydrateFeaturedOrder(payload, existingProject = null) {
  if (!payload.is_featured) {
    return payload;
  }

  if (payload.featured_order) {
    return payload;
  }

  if (existingProject?.is_featured && existingProject?.featured_order) {
    return {
      ...payload,
      featured_order: existingProject.featured_order,
    };
  }

  return {
    ...payload,
    featured_order: await getNextFeaturedOrder(),
  };
}

async function ensureProjectSlug(projectData) {
  if (projectData.slug) {
    return projectData;
  }

  const { data: slugData, error: slugError } = await supabaseAdmin.rpc('generate_slug', {
    title: projectData.title,
  });

  if (slugError) {
    throw slugError;
  }

  return {
    ...projectData,
    slug: slugData,
  };
}

async function getProjects(req, res) {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      featured,
      search,
      service_line,
      brand,
      service_category,
    } = req.query;

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 12;
    const offset = (pageNumber - 1) * pageSize;

    let query = supabasePublic.from('projects').select('*', { count: 'exact' });

    if (category) query = query.eq('category', category);
    if (service_line) query = query.eq('service_line', service_line);
    if (brand) query = query.eq('brand', brand);
    if (service_category) query = query.eq('service_category', service_category);
    if (featured === 'true') query = query.eq('is_featured', true);

    if (search) {
      const { data: searchResults } = await supabasePublic.rpc('search_projects', {
        search_query: search,
      });

      if (searchResults?.length) {
        query = query.in('id', searchResults.map((result) => result.id));
      } else {
        query = query.in('id', [-1]);
      }
    }

    const orderColumn = featured === 'true' ? 'featured_order' : 'created_at';
    const { data, error, count } = await query
      .order(orderColumn, { ascending: featured === 'true' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách dự án' });
  }
}

async function getAdminProjects(req, res) {
  try {
    const { search, service_line, featured } = req.query;

    let query = supabaseAdmin.from('projects').select('*').order('updated_at', { ascending: false });

    if (service_line) query = query.eq('service_line', service_line);
    if (featured === 'true') query = query.eq('is_featured', true);
    if (search) query = query.or(`title.ilike.%${search}%,client.ilike.%${search}%,venue.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    const sorted = [...(data || [])].sort((a, b) => {
      if (a.is_featured && b.is_featured) {
        return (a.featured_order || Number.MAX_SAFE_INTEGER) - (b.featured_order || Number.MAX_SAFE_INTEGER);
      }
      if (a.is_featured) return -1;
      if (b.is_featured) return 1;
      return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
    });

    res.json({ success: true, data: sorted });
  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách dự án quản trị' });
  }
}

async function getProjectBySlug(req, res) {
  try {
    const { slug } = req.params;

    const { data, error } = await supabasePublic.from('projects').select('*').eq('slug', slug).single();
    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
    }

    const { data: relatedProjects } = await supabasePublic
      .from('projects')
      .select('id, title, slug, category, service_line, service_category, thumbnail, brand')
      .eq('service_line', data.service_line)
      .eq('service_category', data.service_category)
      .neq('id', data.id)
      .limit(3);

    res.json({
      success: true,
      data: {
        ...data,
        related: relatedProjects || [],
      },
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy thông tin dự án' });
  }
}

async function getAdminProjectById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from('projects').select('*').eq('id', id).single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get admin project error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết dự án' });
  }
}

async function createProject(req, res) {
  try {
    const normalized = await hydrateFeaturedOrder(normalizeProjectPayload(req.validatedData));
    const projectData = await ensureProjectSlug(normalized);

    const { data, error } = await supabaseAdmin.from('projects').insert([projectData]).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, message: 'Tạo dự án thành công', data });
  } catch (error) {
    console.error('Create project error:', error);

    if (error?.code === '23505' && error?.message?.includes('projects_slug_key')) {
      return res.status(409).json({
        success: false,
        message: 'Slug dự án đã tồn tại. Vui lòng đổi slug khác hoặc để trống để hệ thống tự tạo.',
      });
    }

    res.status(500).json({ success: false, message: 'Lỗi tạo dự án' });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { data: existingProject, error: existingError } = await supabaseAdmin.from('projects').select('*').eq('id', id).single();

    if (existingError || !existingProject) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án để cập nhật' });
    }

    const normalized = await hydrateFeaturedOrder(normalizeProjectPayload(req.validatedData), existingProject);
    const projectData = await ensureProjectSlug(normalized);

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án để cập nhật' });
    }

    res.json({ success: true, message: 'Cập nhật dự án thành công', data });
  } catch (error) {
    console.error('Update project error:', error);

    if (error?.code === '23505' && error?.message?.includes('projects_slug_key')) {
      return res.status(409).json({
        success: false,
        message: 'Slug dự án đã tồn tại. Vui lòng đổi slug khác hoặc để trống để hệ thống tự tạo.',
      });
    }

    res.status(500).json({ success: false, message: 'Lỗi cập nhật dự án' });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Xóa dự án thành công' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Lỗi xóa dự án' });
  }
}

async function getProjectStats(req, res) {
  try {
    const { count: totalProjects } = await supabaseAdmin.from('projects').select('*', { count: 'exact', head: true });
    const { count: featuredProjects } = await supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).eq('is_featured', true);
    const { count: eventProjects } = await supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).eq('service_line', 'to-chuc-su-kien');
    const { count: decorProjects } = await supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).eq('service_line', 'decor-tiec-cuoi');

    res.json({
      success: true,
      data: {
        totalProjects: totalProjects || 0,
        featuredProjects: featuredProjects || 0,
        eventProjects: eventProjects || 0,
        decorProjects: decorProjects || 0,
      },
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy thống kê dự án' });
  }
}

module.exports = {
  getProjects,
  getAdminProjects,
  getProjectBySlug,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
};
