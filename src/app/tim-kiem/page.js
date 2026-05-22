import Link from 'next/link';
import { searchMovies } from '@/services/api';
import MovieGrid from '@/components/MovieGrid';

// Dynamic Search Page Metadata
export function generateMetadata({ searchParams }) {
  const query = searchParams.q || '';
  return {
    title: query ? `Tìm kiếm: "${query}" - Danh sách kết quả | SuguPhim` : 'Tìm kiếm phim chất lượng cao | SuguPhim',
    description: query ? `Kết quả tìm kiếm bộ phim "${query}" chất lượng HD Vietsub Thuyết Minh tốc độ cao không quảng cáo.` : 'Tìm kiếm phim trực tuyến.',
  };
}

export default async function SearchResultsPage({ searchParams }) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24;

  let movies = [];
  let pagination = { totalItems: 0, totalItemsPerPage: limit, currentPage: page, totalPages: 1 };
  let status = 'success';

  if (query.trim()) {
    try {
      const res = await searchMovies(query, page, limit);
      if (res && res.status === 'success') {
        movies = res.data.items || [];
        pagination = res.data.params.pagination || pagination;
      } else {
        status = 'error';
      }
    } catch (err) {
      console.error('Search page fetch error', err);
      status = 'error';
    }
  }

  const totalPages = pagination.totalPages || 1;
  const currentPage = pagination.currentPage || 1;

  // Build pagination helper URLs
  const getPageUrl = (p) => `/tim-kiem?q=${encodeURIComponent(query)}&page=${p}`;

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title">
          Kết quả tìm kiếm cho: <span className="gradient-text">"{query}"</span>
        </h1>
        <p className="empty-state-desc" style={{ marginTop: '-12px' }}>
          Tìm thấy <span style={{ color: 'white', fontWeight: 700 }}>{pagination.totalItems}</span> kết quả phù hợp.
        </p>
      </div>

      {status === 'error' ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{color: 'var(--primary-red)'}}>⚠️</div>
          <h3 className="empty-state-title">Đã xảy ra lỗi</h3>
          <p className="empty-state-desc">Không thể tải kết quả tìm kiếm vào lúc này. Vui lòng thử lại sau.</p>
        </div>
      ) : (
        <>
          <MovieGrid movies={movies} emptyMessage={`Không tìm thấy kết quả nào phù hợp với từ khóa "${query}".`} />

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
                // Keep the active page centered in the page list
                let targetPage = currentPage;
                if (currentPage <= 3) {
                  targetPage = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  targetPage = totalPages - 4 + idx;
                } else {
                  targetPage = currentPage - 2 + idx;
                }

                // Guard against invalid page ranges
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
