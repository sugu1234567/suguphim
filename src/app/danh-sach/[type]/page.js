import Link from 'next/link';
import { fetchMovieList, fetchNewUpdates } from '@/services/api';
import MovieGrid from '@/components/MovieGrid';

const TYPE_MAP = {
  'phim-le': { title: 'Phim Lẻ Mới', apiType: 'phim-le', isNewUpdates: false },
  'phim-bo': { title: 'Phim Bộ Mới', apiType: 'phim-bo', isNewUpdates: false },
  'hoat-hinh': { title: 'Phim Hoạt Hình', apiType: 'hoat-hinh', isNewUpdates: false },
  'tv-shows': { title: 'TV Shows', apiType: 'tv-shows', isNewUpdates: false },
  'phim-moi': { title: 'Phim Mới Cập Nhật', apiType: 'phim-moi-cap-nhat', isNewUpdates: true },
};

// Generate dynamic SEO metadata
export function generateMetadata({ params, searchParams }) {
  const type = params.type;
  const page = parseInt(searchParams.page || '1', 10);
  const matched = TYPE_MAP[type] || { title: 'Danh Sách Phim' };

  return {
    title: `${matched.title} - Trang ${page} | SuguPhim`,
    description: `Danh sách ${matched.title} chất lượng cao HD Vietsub, Thuyết minh miễn phí tốc độ cao không giật lag tại SuguPhim.`,
  };
}

export default async function ListPage({ params, searchParams }) {
  const type = params.type;
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24;

  const matched = TYPE_MAP[type];

  if (!matched) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="empty-state">
          <div className="empty-state-icon" style={{ color: 'var(--primary-red)' }}>⚠️</div>
          <h3 className="empty-state-title">Đường dẫn không hợp lệ</h3>
          <p className="empty-state-desc">Danh sách phim bạn yêu cầu không tồn tại.</p>
          <Link href="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
            Quay lại Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  let movies = [];
  let pagination = { totalItems: 0, totalItemsPerPage: limit, currentPage: page, totalPages: 1 };
  let status = 'success';

  try {
    if (matched.isNewUpdates) {
      // fetchNewUpdates has a slightly different format
      const res = await fetchNewUpdates(page);
      if (res && (res.items || res.status)) {
        movies = res.items || [];
        // Extract or calculate pagination
        if (res.pagination) {
          pagination = {
            totalItems: res.pagination.totalItems || 0,
            totalItemsPerPage: res.pagination.totalItemsPerPage || limit,
            currentPage: res.pagination.currentPage || page,
            totalPages: Math.ceil((res.pagination.totalItems || 0) / (res.pagination.totalItemsPerPage || limit)) || 1
          };
        }
      } else {
        status = 'error';
      }
    } else {
      const res = await fetchMovieList(matched.apiType, page, limit);
      if (res && res.status === 'success') {
        movies = res.data.items || [];
        const apiPag = res.data.params?.pagination;
        if (apiPag) {
          pagination = {
            totalItems: apiPag.totalItems || 0,
            totalItemsPerPage: apiPag.totalItemsPerPage || limit,
            currentPage: apiPag.currentPage || page,
            totalPages: apiPag.totalPages || Math.ceil((apiPag.totalItems || 0) / limit) || 1
          };
        }
      } else {
        status = 'error';
      }
    }
  } catch (err) {
    console.error(`List page ${type} fetch error`, err);
    status = 'error';
  }

  const totalPages = pagination.totalPages || 1;
  const currentPage = pagination.currentPage || 1;

  // Build pagination helper URLs
  const getPageUrl = (p) => `/danh-sach/${type}?page=${p}`;

  return (
    <div className="container animated-fade-in" style={{ paddingTop: '30px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title">
          Danh Sách: <span className="gradient-text">{matched.title}</span>
        </h1>
        {status === 'success' && movies.length > 0 && pagination.totalItems > 0 && (
          <p className="empty-state-desc" style={{ marginTop: '-12px' }}>
            Tổng số: <span style={{ color: 'white', fontWeight: 700 }}>{pagination.totalItems}</span> phim.
          </p>
        )}
      </div>

      {status === 'error' ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ color: 'var(--primary-red)' }}>⚠️</div>
          <h3 className="empty-state-title">Đã xảy ra lỗi</h3>
          <p className="empty-state-desc">Không thể tải danh sách phim lúc này. Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <>
          <MovieGrid movies={movies} emptyMessage={`Hiện tại danh sách "${matched.title}" chưa có phim.`} />

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
