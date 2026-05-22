const BASE_URL = 'https://phimapi.com';

/**
 * Helper to build high-quality image URLs from the KKPhim/TMDB image paths
 */
export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `https://phimimg.com/${path}`;
};

/**
 * Get newly updated movies (phim mới cập nhật)
 * We'll use /danh-sach/phim-moi-cap-nhat as it's the most stable and fast
 */
export async function fetchNewUpdates(page = 1) {
  try {
    const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    if (!res.ok) throw new Error('Failed to fetch new updates');
    return await res.json();
  } catch (error) {
    console.error('Error fetching new updates:', error);
    return { status: false, items: [], pagination: { totalItems: 0, totalItemsPerPage: 20, currentPage: 1 } };
  }
}

/**
 * Get standard list of movies (phim-bo, phim-le, hoat-hinh, tv-shows)
 * Endpoint: /v1/api/danh-sach/{type_list}
 */
export async function fetchMovieList(typeList, page = 1, limit = 24) {
  try {
    const res = await fetch(`${BASE_URL}/v1/api/danh-sach/${typeList}?page=${page}&limit=${limit}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error(`Failed to fetch movie list: ${typeList}`);
    const json = await res.json();
    // Normalize response shape for UI
    const items = json?.items ?? json?.data?.items ?? [];
    const pagination = json?.pagination ?? json?.data?.params?.pagination ?? {
      totalItems: 0,
      totalItemsPerPage: limit,
      currentPage: page,
      totalPages: 1,
    };
    return {
      status: 'success',
      data: { items, params: { pagination } },
    };
  } catch (error) {
    console.error(`Error fetching movie list ${typeList}:`, error);
    return {
      status: 'error',
      data: {
        items: [],
        params: { pagination: { totalItems: 0, totalItemsPerPage: limit, currentPage: page, totalPages: 1 } },
      },
    };
  }
}

/**
 * Get detailed movie info & its episodes
 * Endpoint: /phim/{slug}
 */
export async function fetchMovieDetail(slug) {
  try {
    const res = await fetch(`${BASE_URL}/phim/${slug}`, {
      next: { revalidate: 600 } // Cache detail pages for 10 minutes
    });
    if (!res.ok) throw new Error(`Failed to fetch movie: ${slug}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching movie detail ${slug}:`, error);
    return null;
  }
}

/**
 * Search movies by keyword
 * Endpoint: /v1/api/tim-kiem
 */
export async function searchMovies(keyword, page = 1, limit = 24) {
  try {
    const res = await fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error(`Failed to search keyword: ${keyword}`);
    return await res.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    return { status: 'error', data: { items: [], params: { pagination: { totalItems: 0, currentPage: 1 } } } };
  }
}

/**
 * Get all available categories (thể loại)
 * Endpoint: /the-loai
 */
export async function fetchCategories() {
  try {
    const res = await fetch(`${BASE_URL}/the-loai`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get movies belonging to a category
 * Endpoint: /v1/api/the-loai/{slug}
 */
export async function fetchCategoryMovies(slug, page = 1, limit = 24) {
  try {
    const res = await fetch(`${BASE_URL}/v1/api/the-loai/${slug}?page=${page}&limit=${limit}`, {
      next: { revalidate: 600 }
    });
    if (!res.ok) throw new Error(`Failed to fetch category: ${slug}`);
    const json = await res.json();
    // Normalize response to match UI expectations
    const items = json?.items ?? json?.data?.items ?? [];
    const pagination = json?.pagination ?? json?.data?.params?.pagination ?? {
      totalItems: 0,
      totalItemsPerPage: limit,
      currentPage: page,
      totalPages: 1,
    };
    return {
      status: 'success',
      data: { items, params: { pagination } },
    };
  } catch (error) {
    console.error(`Error fetching category movies ${slug}:`, error);
    return { status: 'error', data: { items: [], params: { pagination: { totalItems: 0, totalItemsPerPage: limit, currentPage: page, totalPages: 1 } } } };
  }
}

/**
 * Get all available countries (quốc gia)
 * Endpoint: /quoc-gia
 */
export async function fetchCountries() {
  try {
    const res = await fetch(`${BASE_URL}/quoc-gia`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!res.ok) throw new Error('Failed to fetch countries');
    return await res.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

/**
 * Get movies belonging to a country
 * Endpoint: /v1/api/quoc-gia/{slug}
 */
export async function fetchCountryMovies(slug, page = 1, limit = 24) {
  try {
    const res = await fetch(`${BASE_URL}/v1/api/quoc-gia/${slug}?page=${page}&limit=${limit}`, {
      next: { revalidate: 600 }
    });
    if (!res.ok) throw new Error(`Failed to fetch country: ${slug}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching country movies ${slug}:`, error);
    return { status: 'error', data: { items: [], params: { pagination: { totalItems: 0, currentPage: 1 } } } };
  }
}
