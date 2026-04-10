require('dotenv').config();
const { supabaseAdmin } = require('../src/config/supabase');

/**
 * Create default admin account
 */
async function createAdminAccount() {
  try {
    console.log('🔐 Creating default admin account...');

    const adminEmail = 'admin@mercurywanda.com';
    const adminPassword = 'MercuryWanda2024!';

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ Admin account already exists');
        return;
      }
      throw authError;
    }

    // Insert into admins table
    const { error: insertError } = await supabaseAdmin
      .from('admins')
      .insert([{
        user_id: authData.user.id,
        email: adminEmail,
        role: 'Admin'
      }]);

    if (insertError) {
      throw insertError;
    }

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Please change the password after first login');

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    throw error;
  }
}

/**
 * Seed sample projects
 */
async function seedProjects() {
  try {
    console.log('📦 Seeding sample projects...');

    const sampleProjects = [
      {
        title: 'Tiệc Cưới Hoài Anh & Minh Đức',
        slug: 'tiec-cuoi-hoai-anh-minh-duc',
        category: 'Wedding',
        venue: 'InterContinental Saigon',
        scale: '300 khách',
        style: 'Luxury Classic',
        client: 'Hoài Anh & Minh Đức',
        event_date: '2023-12-15',
        description: 'Một đám cưới sang trọng với phong cách cổ điển, kết hợp màu vàng gold và trắng tinh tế.',
        is_featured: true
      },
      {
        title: 'Year End Party - Tech Corp 2023',
        slug: 'year-end-party-tech-corp-2023',
        category: 'Corporate',
        venue: 'Gem Center',
        scale: '500 nhân viên',
        style: 'Modern Tech',
        client: 'Tech Corp Vietnam',
        event_date: '2023-12-20',
        description: 'Sự kiện year-end party với concept công nghệ hiện đại, ánh sáng LED và màn hình lớn.',
        is_featured: true
      },
      {
        title: 'Sinh Nhật 30 Tuổi - Minh Châu',
        slug: 'sinh-nhat-30-tuoi-minh-chau',
        category: 'Birthday',
        venue: 'The Deck Saigon',
        scale: '80 khách',
        style: 'Garden Party',
        client: 'Minh Châu',
        event_date: '2023-11-10',
        description: 'Tiệc sinh nhật ngoài trời với concept garden party, trang trí hoa tươi và ánh sáng lung linh.',
        is_featured: false
      }
    ];

    const { error } = await supabaseAdmin
      .from('projects')
      .insert(sampleProjects);

    if (error) {
      throw error;
    }

    console.log(`✅ Seeded ${sampleProjects.length} sample projects`);

  } catch (error) {
    console.error('❌ Error seeding projects:', error.message);
  }
}

/**
 * Seed sample library items
 */
async function seedLibrary() {
  try {
    console.log('📚 Seeding sample library items...');

    const sampleLibrary = [
      {
        title: 'Album Ảnh Cưới 2023',
        type: 'album',
        description: 'Bộ sưu tập ảnh cưới đẹp nhất năm 2023'
      },
      {
        title: 'Video Highlight - Wedding',
        type: 'video',
        description: 'Các video highlight từ các đám cưới đã thực hiện'
      },
      {
        title: 'Brochure Dịch Vụ',
        type: 'document',
        description: 'Catalog giới thiệu các gói dịch vụ của Mercury Wanda'
      },
      {
        title: 'Xu Hướng Trang Trí 2024',
        type: 'inspiration',
        description: 'Những xu hướng trang trí sự kiện mới nhất'
      }
    ];

    const { error } = await supabaseAdmin
      .from('library')
      .insert(sampleLibrary);

    if (error) {
      throw error;
    }

    console.log(`✅ Seeded ${sampleLibrary.length} library items`);

  } catch (error) {
    console.error('❌ Error seeding library:', error.message);
  }
}

/**
 * Create storage bucket for images
 */
async function createStorageBucket() {
  try {
    console.log('🗂️  Creating storage bucket...');

    const { data, error } = await supabaseAdmin.storage.createBucket('images', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Storage bucket already exists');
        return;
      }
      throw error;
    }

    console.log('✅ Storage bucket created successfully');

  } catch (error) {
    console.error('❌ Error creating storage bucket:', error.message);
  }
}

/**
 * Main seed function
 */
async function seed() {
  console.log('\n🌱 Starting database seeding...\n');

  try {
    await createAdminAccount();
    await createStorageBucket();
    await seedProjects();
    await seedLibrary();

    console.log('\n✅ Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
