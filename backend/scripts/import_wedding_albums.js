require('dotenv').config();

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { supabaseAdmin } = require('../src/config/supabase');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const ALBUM_ROOT = path.join(ROOT_DIR, 'album_cuoi');
const OUTPUT_MAPPING = path.join(__dirname, 'wedding_album_mapping.json');
const OUTPUT_REPORT = path.join(__dirname, 'import_report.json');
const VALID_SERVICE_CATEGORIES = new Set([
  'Trang Tri Gia Tien',
  'Trang Tri Nha Hang',
  'Trang Tri Tiec Cuoi Ngoai Troi',
]);
const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

function parseArgs(argv) {
  const options = {
    dryRun: true,
    album: null,
    limit: null,
    bucket: 'images',
    upsert: false,
    updateAll: false,
    overwriteImages: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    switch (current) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--execute':
        options.dryRun = false;
        break;
      case '--album':
        options.album = argv[index + 1] || null;
        index += 1;
        break;
      case '--limit':
        options.limit = Number(argv[index + 1]) || null;
        index += 1;
        break;
      case '--bucket':
        options.bucket = argv[index + 1] || options.bucket;
        index += 1;
        break;
      case '--upsert':
        options.upsert = true;
        break;
      case '--update-all':
        options.upsert = true;
        options.updateAll = true;
        break;
      case '--overwrite-images':
        options.overwriteImages = true;
        break;
      default:
        break;
    }
  }

  return options;
}

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return normalizeWhitespace(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

function sanitizeFileName(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  const base = path.basename(fileName, extension);

  const safeBase = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

  return `${safeBase || 'image'}${extension}`;
}

function inferServiceCategory(text) {
  const normalized = slugify(text);

  if (normalized.includes('ngoai-troi')) {
    return 'Trang Tri Tiec Cuoi Ngoai Troi';
  }

  if (normalized.includes('nha-hang') || normalized.includes('trang-tri-nha-hang')) {
    return 'Trang Tri Nha Hang';
  }

  if (
    normalized.includes('vu-quy') ||
    normalized.includes('dinh-hon') ||
    normalized.includes('thanh-hon') ||
    normalized.includes('gia-tien')
  ) {
    return 'Trang Tri Gia Tien';
  }

  return 'Trang Tri Gia Tien';
}

function extractClient(title) {
  const cleaned = normalizeWhitespace(title)
    .replace(/^(le|lễ|tiec|tiệc|trang tri|trang trí|thethanh hon|lê|thanh hon|đính hôn|dính hôn)\s+/i, '')
    .replace(/^(vu quy|đính hôn|thành hôn|nhà hàng|ngoài trời)\s*/i, '')
    .trim();

  const ampersandMatch = cleaned.match(/([^|]+?)\s*&\s*([^|]+)$/);
  if (ampersandMatch) {
    return `${normalizeWhitespace(ampersandMatch[1])} & ${normalizeWhitespace(ampersandMatch[2])}`;
  }

  return null;
}

function inferStyle(serviceCategory) {
  switch (serviceCategory) {
    case 'Trang Tri Tiec Cuoi Ngoai Troi':
      return 'Tiệc cưới ngoài trời';
    case 'Trang Tri Nha Hang':
      return 'Tiệc cưới nhà hàng';
    case 'Trang Tri Gia Tien':
      return 'Lễ cưới gia tiên';
    default:
      return null;
  }
}

function inferVenue(title, description, serviceCategory) {
  const source = `${title} ${description || ''}`;
  const normalized = slugify(source);

  if (serviceCategory === 'Trang Tri Nha Hang') {
    return 'Nhà hàng';
  }

  if (serviceCategory === 'Trang Tri Tiec Cuoi Ngoai Troi') {
    return normalized.includes('da-nang') ? 'Đà Nẵng' : 'Không gian ngoài trời';
  }

  if (normalized.includes('phu-quoc')) {
    return 'Phú Quốc';
  }

  return null;
}

function dedupeStrings(values) {
  const seen = new Set();
  const results = [];

  for (const value of values) {
    const normalized = normalizeWhitespace(value);
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    results.push(normalized);
  }

  return results;
}

function toAbsoluteImagePath(albumDir, albumFolder, relativePath) {
  const normalizedRelative = String(relativePath || '').replace(/[\\/]+/g, path.sep);
  const prefixedAlbumPath = `${albumFolder}${path.sep}`;

  if (normalizedRelative.startsWith(prefixedAlbumPath)) {
    return path.join(ALBUM_ROOT, normalizedRelative);
  }

  return path.join(albumDir, normalizedRelative);
}

async function pathExists(targetPath) {
  try {
    await fsp.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectAlbumDirectories(rootDir) {
  const entries = await fsp.readdir(rootDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort((a, b) => a.localeCompare(b));
}

async function readAlbumMetadata(albumFolder) {
  const albumDir = path.join(ALBUM_ROOT, albumFolder);
  const photosJsonPath = path.join(albumDir, 'photos.json');

  if (!(await pathExists(photosJsonPath))) {
    throw new Error('Missing photos.json');
  }

  const rawJson = await fsp.readFile(photosJsonPath, 'utf8');
  const parsed = JSON.parse(rawJson);
  const record = Array.isArray(parsed) ? parsed[0] : parsed;

  if (!record || typeof record !== 'object') {
    throw new Error('Invalid photos.json payload');
  }

  const title = normalizeWhitespace(record.title || albumFolder);
  const serviceCategorySource = normalizeWhitespace(record.service_category);
  const serviceCategory = VALID_SERVICE_CATEGORIES.has(serviceCategorySource)
    ? serviceCategorySource
    : inferServiceCategory(`${albumFolder} ${title}`);

  const galleryRelative = dedupeStrings(Array.isArray(record.gallery) ? record.gallery : []);
  const thumbnailRelative = normalizeWhitespace(record.thumbnail || galleryRelative[0] || '');
  const galleryAbsolute = [];

  for (const relativeImage of galleryRelative) {
    const absoluteImage = toAbsoluteImagePath(albumDir, albumFolder, relativeImage);
    if (await pathExists(absoluteImage)) {
      galleryAbsolute.push({
        relative: relativeImage,
        absolute: absoluteImage,
      });
    }
  }

  let thumbnailAbsolute = null;
  if (thumbnailRelative) {
    const resolved = toAbsoluteImagePath(albumDir, albumFolder, thumbnailRelative);
    if (await pathExists(resolved)) {
      thumbnailAbsolute = resolved;
    }
  }

  if (!thumbnailAbsolute && galleryAbsolute[0]) {
    thumbnailAbsolute = galleryAbsolute[0].absolute;
  }

  const payload = {
    source_folder: albumFolder,
    title,
    slug: normalizeWhitespace(record.slug) || slugify(title || albumFolder),
    category: 'Wedding',
    service_line: 'decor-tiec-cuoi',
    brand: 'pi-decor',
    service_category: serviceCategory,
    source_service_category: serviceCategorySource || null,
    description: normalizeWhitespace(record.description || ''),
    thumbnail_local_path: thumbnailAbsolute,
    gallery_local_paths: galleryAbsolute.map((image) => image.absolute),
    local_gallery_count: galleryAbsolute.length,
    is_featured: Boolean(record.is_featured),
    client: extractClient(title),
    style: inferStyle(serviceCategory),
    venue: inferVenue(title, record.description, serviceCategory),
    scale: null,
    event_date: null,
    metadata_notes: [],
  };

  if (!VALID_SERVICE_CATEGORIES.has(serviceCategorySource)) {
    payload.metadata_notes.push('service_category_fallback');
  }

  if (!payload.thumbnail_local_path) {
    payload.metadata_notes.push('missing_thumbnail');
  }

  if (!payload.gallery_local_paths.length) {
    payload.metadata_notes.push('missing_gallery');
  }

  return payload;
}

function buildStoragePath(slug, imagePath, index) {
  const extension = path.extname(imagePath).toLowerCase();
  const fileName = sanitizeFileName(path.basename(imagePath, extension));
  const safeExtension = VALID_EXTENSIONS.has(extension) ? extension : '.jpg';
  return `projects/decor-tiec-cuoi/${slug}/${String(index + 1).padStart(3, '0')}_${fileName}${fileName.endsWith(safeExtension) ? '' : safeExtension}`;
}

async function uploadImage(bucket, slug, imagePath, index, overwriteImages) {
  const extension = path.extname(imagePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || 'image/jpeg';
  const storagePath = buildStoragePath(slug, imagePath, index);
  const fileBuffer = await fsp.readFile(imagePath);

  const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(storagePath, fileBuffer, {
    contentType,
    upsert: overwriteImages,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function fetchExistingProject(slug) {
  const { data, error } = await supabaseAdmin.from('projects').select('id, slug').eq('slug', slug).maybeSingle();

  if (error) {
    throw error;
  }

  return data || null;
}

async function saveProject(projectPayload, options) {
  const existing = await fetchExistingProject(projectPayload.slug);

  if (!existing) {
    const { error } = await supabaseAdmin.from('projects').insert([projectPayload]);
    if (error) throw error;
    return 'inserted';
  }

  if (!options.upsert) {
    return 'skipped_existing';
  }

  const { error } = await supabaseAdmin.from('projects').update(projectPayload).eq('id', existing.id);
  if (error) throw error;
  return options.updateAll ? 'updated_all' : 'updated_metadata';
}

async function executeAlbumImport(albumPayload, options) {
  const uploadedGallery = [];

  for (let index = 0; index < albumPayload.gallery_local_paths.length; index += 1) {
    const imagePath = albumPayload.gallery_local_paths[index];
    const publicUrl = await uploadImage(options.bucket, albumPayload.slug, imagePath, index, options.overwriteImages);
    uploadedGallery.push(publicUrl);
  }

  const thumbnailUrl = uploadedGallery[0] || null;

  const projectPayload = {
    title: albumPayload.title,
    slug: albumPayload.slug,
    category: albumPayload.category,
    service_line: albumPayload.service_line,
    brand: albumPayload.brand,
    service_category: albumPayload.service_category,
    venue: albumPayload.venue,
    scale: albumPayload.scale,
    style: albumPayload.style,
    client: albumPayload.client,
    event_date: albumPayload.event_date,
    description: albumPayload.description || null,
    thumbnail: thumbnailUrl,
    gallery: uploadedGallery,
    is_featured: albumPayload.is_featured,
  };

  const dbStatus = await saveProject(projectPayload, options);
  return {
    dbStatus,
    projectPayload,
  };
}

async function writeJsonFile(targetPath, payload) {
  await fsp.writeFile(targetPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = {
    started_at: new Date().toISOString(),
    source_root: ALBUM_ROOT,
    options,
    scanned: 0,
    imported: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    items: [],
  };

  const albumDirectories = await collectAlbumDirectories(ALBUM_ROOT);
  let selectedAlbums = options.album
    ? albumDirectories.filter((folder) => folder === options.album)
    : albumDirectories;

  if (options.limit && options.limit > 0) {
    selectedAlbums = selectedAlbums.slice(0, options.limit);
  }

  if (!selectedAlbums.length) {
    throw new Error('No albums matched the provided filters');
  }

  console.log(`📁 Wedding albums selected: ${selectedAlbums.length}`);
  console.log(`🧪 Mode: ${options.dryRun ? 'dry-run' : 'execute'}`);
  console.log(`🪣 Bucket: ${options.bucket}`);

  for (const folder of selectedAlbums) {
    summary.scanned += 1;
    console.log(`\n• Processing: ${folder}`);

    try {
      const albumPayload = await readAlbumMetadata(folder);
      const mappingEntry = {
        source_folder: albumPayload.source_folder,
        title: albumPayload.title,
        slug: albumPayload.slug,
        source_service_category: albumPayload.source_service_category,
        service_category: albumPayload.service_category,
        category: albumPayload.category,
        service_line: albumPayload.service_line,
        brand: albumPayload.brand,
        client: albumPayload.client,
        style: albumPayload.style,
        venue: albumPayload.venue,
        gallery_count: albumPayload.local_gallery_count,
        metadata_notes: albumPayload.metadata_notes,
      };

      if (options.dryRun) {
        summary.items.push({
          ...mappingEntry,
          status: 'dry_run',
        });
        console.log(`  ↳ ${albumPayload.service_category} | ${albumPayload.slug} | ${albumPayload.local_gallery_count} ảnh`);
        continue;
      }

      const result = await executeAlbumImport(albumPayload, options);
      const isUpdated = ['updated_all', 'updated_metadata'].includes(result.dbStatus);
      const isSkipped = result.dbStatus === 'skipped_existing';

      if (isSkipped) {
        summary.skipped += 1;
      } else if (isUpdated) {
        summary.updated += 1;
      } else {
        summary.imported += 1;
      }

      summary.items.push({
        ...mappingEntry,
        status: result.dbStatus,
        thumbnail: result.projectPayload.thumbnail,
        gallery_count: result.projectPayload.gallery.length,
      });

      console.log(`  ↳ ${result.dbStatus} | ${albumPayload.service_category}`);
    } catch (error) {
      summary.failed += 1;
      summary.items.push({
        source_folder: folder,
        status: 'failed',
        error: error.message,
      });
      console.error(`  ✖ ${error.message}`);
    }
  }

  summary.finished_at = new Date().toISOString();

  await writeJsonFile(OUTPUT_MAPPING, summary.items);
  await writeJsonFile(OUTPUT_REPORT, summary);

  console.log('\n✅ Done');
  console.log(`   Scanned : ${summary.scanned}`);
  console.log(`   Imported: ${summary.imported}`);
  console.log(`   Updated : ${summary.updated}`);
  console.log(`   Skipped : ${summary.skipped}`);
  console.log(`   Failed  : ${summary.failed}`);
  console.log(`   Mapping : ${OUTPUT_MAPPING}`);
  console.log(`   Report  : ${OUTPUT_REPORT}`);
}

main().catch(async (error) => {
  const fallbackReport = {
    started_at: new Date().toISOString(),
    failed: 1,
    error: error.message,
  };

  try {
    await writeJsonFile(OUTPUT_REPORT, fallbackReport);
  } catch {
    // noop
  }

  console.error(`\n❌ Import failed: ${error.message}`);
  process.exit(1);
});
