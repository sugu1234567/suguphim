import Link from 'next/link';
import { fetchCountryMovies } from '@/services/api';
import MovieGrid from '@/components/MovieGrid';

// Generate dynamic SEO metadata
export async function generateMetadata({ params, searchParams }) {
  const slug = params.slug;
  const page = parseInt(searchParams.page || '1', 10);
  
  try {
    const res = await fetchCountryMovies(slug, page, 1);
    if (res && res.status === 'success') {
      const countryName = res.data?.titlePage || `Quốc gia ${slug}`;
      return {
        title: `${countryName} - Trang ${page} | SuguPhim`,
        description: `Danh sách phim ${countryName} hot nhất. Xem phim chất lượng cao HD Vietsub, Thuyết minh miễn phí tốc độ cao tại SuguPhim.`,
      };
    }
  } catch (err) {
    console.error('Metadata country fetch error', err);
  }

  return {
    title: `Phim Quốc Gia ${slug} - SuguPhim`,
    description: 'Xem phim trực tuyến chất lượng cao không quảng cáo.',
  };
}

export default async function CountryPage({ params, searchParams }) {
  const slug = params.slug;
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24;

  let movies = [];
  let pagination = { totalItems: 0, totalItemsPerPage: limit, currentPage: page, totalPages: 1 };
  let countryName = '';
  let status = 'success';

  try {
    const res = await fetchCountryMovies(slug, page, limit);
    if (res && res.status === 'success') {
      movies = res.data.items || [];
      pagination = res.data.params?.pagination || pagination;
      countryName = res.data.titlePage || `Quốc gia ${slug}`;
    } else {
      status = 'error';
    }
  } catch (err) {
    console.error('Country page fetch error', err);
    status = 'error';
  }

  const totalPages = pagination.totalPages || Math.ceil(pagination.totalItems / limit) || 1;
  const currentPage = pagination.currentPage || 1;

  // Build pagination helper URLs
  const getPageUrl = (p) => `/quoc-gia/${slug}?page=${p}`;

  return (
    <div className="container animated-fade-in" style={{ paddingTop: '30px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title">
          Quốc Gia: <span className="gradient-text">{countryName}</span>
        </h1>
        {status === 'success' && movies.length > 0 && (
          <p className="empty-state-desc" style={{ marginTop: '-12px' }}>
            Tổng số: <span style={{ color: 'white', fontWeight: 700 }}>{pagination.totalItems}</span> phim.
          </p>
        )}
      </div>

      {status === 'error' ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ color: 'var(--primary-red)' }}>⚠️</div>
          <h3 className="empty-state-title">Đã xảy ra lỗi</h3>
          <p className="empty-state-desc">Không thể tải danh sách phim của quốc gia này lúc này. Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <>
          <MovieGrid movies={movies} emptyMessage={`Hiện tại chưa có phim nào thuộc quốc gia "${countryName}".`} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              {/* Previous Page */}
              <Link
                href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
                className="pagination-btn"
                style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.35 : 1 }}
              >
                ‹
              </Link>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let targetPage = currentPage;
                if (currentPage <= 3) {
                  targetPage = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  targetPage = totalPages - 4 + idx;
                } else {
                  targetPage = currentPage - 2 + idx;
                }

                if (targetPage < 1 || targetPage > totalPages) return null;

                return (
                  <Link
                    key={targetPage}
                    href={getPageUrl(targetPage)}
                    className={`pagination-btn ${currentPage === targetPage ? 'active' : ''}`}
                  >
                    {targetPage}
                  </Link>
                );
              })}

              {/* Next Page */}
              <Link
                href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
                className="pagination-btn"
                style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto', opacity: currentPage === totalPages ? 0.35 : 1 }}
              >
                ›
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
