import heroMainImage from './photo/new1b.png';
import brandStoryImage from './photo/foot1.png';
import dairyPicture6 from './photo/Dairy/facial/facial Tissues5/Picture6.png';
import videoPlaylist from './videoList.json';

type LocalizedText = string | Partial<Record<'zh' | 'en' | 'ja' | 'hk', string>>;
type LocalizedTextArray =
  | string[]
  | Partial<Record<'zh' | 'en' | 'ja' | 'hk', string[]>>;

export type ProductCatalogImage = {
  src: string;
  caption?: LocalizedText;
};

export type ProductCatalogItem = {
  id: string;
  mainCategory: string;
  subCategory: string;
  productKey: string;
  name?: LocalizedText;
  desc?: LocalizedText;
  features?: LocalizedText;
  specs?: LocalizedTextArray;
  images: ProductCatalogImage[];
};

type RawProductMeta = {
  id?: string;
  name?: LocalizedText;
  desc?: LocalizedText;
  features?: LocalizedText;
  specs?: LocalizedTextArray;
  images?: Array<{ file: string; caption?: LocalizedText }>;
  gallery?: Array<{ file: string; caption?: LocalizedText }>;
};

type VideoPlaylistItem = {
  src: string;
};

const detailImages = Object.entries(
  import.meta.glob('./photo/Detail/*.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    import: 'default',
  }) as Record<string, string>,
)
  .sort(([pathA], [pathB]) =>
    pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: 'base' }),
  )
  .map(([, src]) => src);

const productDetailImagesByProductId = (() => {
  const entries = Object.entries(
    import.meta.glob('./photo/ProductDetails/*/*.{png,jpg,jpeg,webp,avif}', {
      eager: true,
      import: 'default',
    }) as Record<string, string>,
  );

  const grouped: Record<string, Array<[string, string]>> = {};
  for (const [path, src] of entries) {
    const match = path.match(/\/ProductDetails\/([^/]+)\//);
    if (!match) continue;
    const productId = match[1];
    (grouped[productId] ??= []).push([path, src]);
  }

  const result: Record<string, string[]> = {};
  for (const [productId, items] of Object.entries(grouped)) {
    result[productId] = items
      .sort(([pathA], [pathB]) =>
        pathA.localeCompare(pathB, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      )
      .map(([, src]) => src);
  }
  return result;
})();

const productCatalog = (() => {
  const metaModules = {
    ...(import.meta.glob('./photo/Adult/**/meta.json', {
      eager: true,
      import: 'default',
    }) as Record<string, RawProductMeta>),
    ...(import.meta.glob('./photo/Dairy/**/meta.json', {
      eager: true,
      import: 'default',
    }) as Record<string, RawProductMeta>),
    ...(import.meta.glob('./photo/Personal/**/meta.json', {
      eager: true,
      import: 'default',
    }) as Record<string, RawProductMeta>),
  };

  const imageModules = {
    ...(import.meta.glob('./photo/Adult/**/*.{png,jpg,jpeg,webp,avif}', {
      eager: true,
      import: 'default',
    }) as Record<string, string>),
    ...(import.meta.glob('./photo/Dairy/**/*.{png,jpg,jpeg,webp,avif}', {
      eager: true,
      import: 'default',
    }) as Record<string, string>),
    ...(import.meta.glob('./photo/Personal/**/*.{png,jpg,jpeg,webp,avif}', {
      eager: true,
      import: 'default',
    }) as Record<string, string>),
  };

  const metaByDir: Record<string, RawProductMeta> = {};
  for (const [metaPath, meta] of Object.entries(metaModules)) {
    const dir = metaPath.replace(/\/meta\.json$/, '');
    metaByDir[dir] = meta;
  }

  const imagesByProductDir: Record<string, Array<[string, string]>> = {};
  for (const [path, src] of Object.entries(imageModules)) {
    const parts = path.split('/').filter(Boolean);
    const photoIndex = parts.indexOf('photo');
    if (photoIndex === -1) continue;
    const main = parts[photoIndex + 1];
    if (main !== 'Adult' && main !== 'Dairy' && main !== 'Personal') continue;

    if (main === 'Adult') {
      const sub = parts[photoIndex + 2];
      const maybeProductFolder = parts[photoIndex + 3];
      const file = parts[photoIndex + 4] ?? parts[photoIndex + 3];
      if (!sub || !file) continue;
      const productFolder = parts[photoIndex + 4]
        ? (maybeProductFolder ?? file.replace(/\.[^.]+$/, ''))
        : file.replace(/\.[^.]+$/, '');
      const productDir = `./photo/Adult/${sub}/${productFolder}`;
      (imagesByProductDir[productDir] ??= []).push([path, src]);
      continue;
    }

    const subOrFolder = parts[photoIndex + 2];
    const maybeFolder = parts[photoIndex + 3];
    const file = parts[photoIndex + 4] ?? parts[photoIndex + 3];
    if (!subOrFolder || !file) continue;

    const productDir = parts[photoIndex + 4]
      ? maybeFolder
        ? `./photo/${main}/${subOrFolder}/${maybeFolder}`
        : `./photo/${main}/${subOrFolder}`
      : `./photo/${main}/${subOrFolder}`;

    (imagesByProductDir[productDir] ??= []).push([path, src]);
  }

  const deriveCaptionFromFilename = (filename: string) => {
    const noExt = filename.replace(/\.[^.]+$/, '');
    const candidate = noExt.includes('__') ? noExt.split('__').slice(1).join('__') : noExt;
    const text = candidate.trim();
    if (!text) return undefined;
    if (/^\d+$/.test(text)) return undefined;
    return text;
  };

  const items: ProductCatalogItem[] = [];

  for (const [productDir, rawImages] of Object.entries(imagesByProductDir)) {
    const segments = productDir.split('/').filter(Boolean);
    const photoIndex = segments.indexOf('photo');
    if (photoIndex === -1) continue;
    const mainRaw = segments[photoIndex + 1] ?? '';
    const normalizedMain =
      mainRaw.toLowerCase() === 'adult'
        ? 'Adult'
        : mainRaw.toLowerCase() === 'dairy'
          ? 'Dairy'
          : mainRaw.toLowerCase() === 'personal'
            ? 'Personal'
            : mainRaw;

    let subCategory = 'all';
    let productKey = '';
    let folderId = '';

    if (normalizedMain === 'Adult') {
      subCategory = (segments[photoIndex + 2] ?? '').toLowerCase();
      folderId = segments[photoIndex + 3] ?? '';
      productKey = `${subCategory}/${folderId}`;
    } else {
      const maybeSub = segments[photoIndex + 2] ?? '';
      const maybeFolder = segments[photoIndex + 3];
      if (maybeFolder) {
        subCategory = maybeSub.toLowerCase() || 'all';
        folderId = maybeFolder;
        productKey = `${subCategory}/${folderId}`;
      } else {
        folderId = maybeSub;
        productKey = folderId;
      }
    }

    if (!folderId) continue;

    const meta = metaByDir[productDir];
    const id = meta?.id || folderId;

    const imagesInProduct = rawImages
      .slice()
      .sort(([pathA], [pathB]) =>
        pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: 'base' }),
      );

    const rawGallery = (meta?.images ?? meta?.gallery ?? []).slice();
    const images: ProductCatalogImage[] = [];

    if (rawGallery.length > 0) {
      const byFile = new Map<string, string>();
      for (const [imgPath, imgSrc] of imagesInProduct) {
        const file = imgPath.split('/').pop() ?? imgPath;
        if (!byFile.has(file)) byFile.set(file, imgSrc);
      }

      for (const entry of rawGallery) {
        const src = byFile.get(entry.file);
        if (!src) continue;
        images.push({
          src,
          caption: entry.caption ?? deriveCaptionFromFilename(entry.file),
        });
      }
    } else {
      for (const [imgPath, imgSrc] of imagesInProduct) {
        const file = imgPath.split('/').pop() ?? imgPath;
        images.push({ src: imgSrc, caption: deriveCaptionFromFilename(file) });
      }
    }

    items.push({
      id,
      mainCategory: normalizedMain,
      subCategory,
      productKey,
      name: meta?.name ?? folderId,
      desc: meta?.desc,
      features: meta?.features,
      specs: meta?.specs,
      images,
    });
  }

  items.sort((a, b) => {
    const main = a.mainCategory.localeCompare(b.mainCategory, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    if (main !== 0) return main;
    const sub = a.subCategory.localeCompare(b.subCategory, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    if (sub !== 0) return sub;
    return a.productKey.localeCompare(b.productKey, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });

  return items;
})();

/**
 * Greenzo Asset Configuration
 * Use this file to manage all media content (images, videos).
 * You can use remote URLs or local paths from the public directory.
 */

export const ASSET_CONFIG = {
  hero: {
    mainImage: heroMainImage,
  },

  productDetails: productDetailImagesByProductId,

  productCatalog,

  gallery: [
    ...detailImages,
    dairyPicture6,
  ],

  videos: {
    mainDemo: {
      thumbnail: "https://images.unsplash.com/photo-1544178170-c97216dc8f3e?auto=format&fit=crop&q=80&w=800",
      url: (videoPlaylist as VideoPlaylistItem[] | undefined)?.[0]?.src ?? "#",
    },
    playlist: (videoPlaylist as VideoPlaylistItem[] | undefined) ?? [],
  },

  brand: {
    story: brandStoryImage,
  }
};
