const { supabasePublic } = require('../config/supabase');

// Get all albums with pagination and search
exports.getAlbums = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = 'newest' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabasePublic.from('albums').select('*', { count: 'exact' });

    // Search by event_name
    if (search) {
      query = query.ilike('event_name', `%${search}%`);
    }

    // Sort
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sort === 'name') {
      query = query.order('event_name', { ascending: true });
    }

    // Pagination
    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single album by ID
exports.getAlbumById = async (req, res) => {
  try {
    const { albumId } = req.params;

    const { data, error } = await supabasePublic
      .from('albums')
      .select('*')
      .eq('album_id', albumId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Create album
exports.createAlbum = async (req, res) => {
  try {
    const { album_id, event_name, caption, images } = req.body;

    if (!album_id || !event_name || !images) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabasePublic
      .from('albums')
      .insert({
        album_id,
        event_name,
        caption,
        images,
        total_images: images.length
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update album
exports.updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { event_name, caption, images } = req.body;

    const updateData = {};
    if (event_name) updateData.event_name = event_name;
    if (caption) updateData.caption = caption;
    if (images) {
      updateData.images = images;
      updateData.total_images = images.length;
    }

    const { data, error } = await supabasePublic
      .from('albums')
      .update(updateData)
      .eq('album_id', albumId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete album
exports.deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const { error } = await supabasePublic
      .from('albums')
      .delete()
      .eq('album_id', albumId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
