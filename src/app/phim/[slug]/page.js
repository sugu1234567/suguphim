import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchMovieDetail, getImageUrl } from '@/services/api';
import ImageWithFallback from '@/components/ImageWithFallback';

// Generate dynamic metadata for maximum SEO optimization
export async function generateMetadata({ params }) {
  const detail = await fetchMovieDetail(params.slug);
  if (!detail || !detail.status) {
    return {
      title: 'Phim Không Tồn Tại - SuguPhim',
      description: 'Xin lỗi, bộ phim này không tồn tại trên hệ thống.',
    };
  }
  const movie = detail.movie;
  const cleanContent = movie.content ? movie.content.replace(/<[^>]*>/g, '').substring(0, 160) : '';
  const imgUrl = getImageUrl(movie.poster_url || movie.thumb_url);

  return {
    title: `${movie.name} (${movie.origin_name}) [${movie.year}] - Xem Phim Thuyết Minh Vietsub HD | SuguPhim`,
    description: cleanContent || `Xem phim ${movie.name} vietsub thuyết minh tốc độ cao miễn phí.`,
    openGraph: {
      title: `${movie.name} (${movie.origin_name}) - SuguPhim`,
      description: cleanContent,
      images: [{ url: imgUrl }],
      type: 'video.movie',
    },
  };
}

export default async function MovieDetailPage({ params }) {
  const detail = await fetchMovieDetail(params.slug);

  if (!detail || !detail.status) {
    notFound();
  }

  const { movie, episodes } = detail;
  const posterUrl = getImageUrl(movie.poster_url);
  const thumbUrl = getImageUrl(movie.thumb_url);

  // Determine watch URL (defaults to first episode of the first server)
  let watchUrl = '#';
  let hasEpisodes = false;
  if (episodes && episodes.length > 0 && episodes[0].server_data && episodes[0].server_data.length > 0) {
    const firstEp = episodes[0].server_data[0];
    watchUrl = `/xem-phim/${movie.slug}?server=0&episode=${firstEp.slug}`;
    hasEpisodes = true;
  }

  return (
    <div className="container" style={{ position: 'relative', paddingBottom: '80px' }}>
      {/* Blurred Backdrop */}
      <div className="detail-bg-blur">
        <img src={thumbUrl} alt="" />
      </div>

      <div className="detail-content-wrapper">
        {/* Poster Column */}
        <div className="detail-poster-column">
          <div className="detail-poster-card">
            <ImageWithFallback
              src={posterUrl}
              alt={movie.name}
              className="detail-poster-card-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {hasEpisodes ? (
            <Link href={watchUrl} className="btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Xem Phim Ngay
            </Link>
          ) : (
            <button className="btn-secondary" style={{ width: '100%', cursor: 'not-allowed' }} disabled>
              Chưa Có Tập Phim
            </button>
          )}
        </div>

        {/* Detailed Metadata Column */}
        <div className="detail-info-column">
          <div className="detail-header">
            <h1 className="detail-title">{movie.name}</h1>
            <p className="detail-origin-title">{movie.origin_name}</p>
            
            <div className="detail-quick-stats">
              {movie.year && <span className="stat-badge">{movie.year}</span>}
              {movie.quality && <span className="stat-badge accent">{movie.quality}</span>}
              {movie.lang && <span className="stat-badge accent">{movie.lang}</span>}
              {movie.time && <span className="stat-badge">{movie.time}</span>}
              {movie.episode_current && <span className="stat-badge" style={{borderColor: '#10b981', color: '#34d399'}}>{movie.episode_current}</span>}
            </div>
          </div>

          <div className="detail-metadata-table">
            <div className="metadata-item">
              <span className="metadata-label">Thể loại</span>
              <span className="metadata-value">
                {movie.category?.map(c => c.name).join(', ') || 'Đang cập nhật'}
              </span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Quốc gia</span>
              <span className="metadata-value">
                {movie.country?.map(c => c.name).join(', ') || 'Đang cập nhật'}
              </span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Đạo diễn</span>
              <span className="metadata-value">
                {movie.director?.join(', ') || 'Đang cập nhật'}
              </span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Thời lượng</span>
              <span className="metadata-value">{movie.time || 'Đang cập nhật'}</span>
            </div>
            <div className="metadata-item" style={{ gridColumn: 'span 2' }}>
              <span className="metadata-label">Diễn viên</span>
              <span className="metadata-value">
                {movie.actor?.filter(Boolean).slice(0, 15).join(', ') || 'Đang cập nhật'}
              </span>
            </div>
          </div>

          {/* Plot Content */}
          {movie.content && (
            <div className="detail-plot">
              <h3 className="detail-plot-title">Tóm Tắt Nội Dung</h3>
              <p className="detail-plot-text" dangerouslySetInnerHTML={{ __html: movie.content }}></p>
            </div>
          )}

          {/* Episode List (grouped by Server) */}
          {hasEpisodes && (
            <div className="episodes-card">
              <h3 className="detail-plot-title" style={{ marginBottom: '24px' }}>Danh Sách Tập Phim</h3>
              {episodes.map((server, serverIdx) => (
                <div key={server.server_name} style={{ marginBottom: serverIdx < episodes.length - 1 ? '24px' : '0' }}>
                  <div className="episodes-server-title">Máy chủ: {server.server_name}</div>
                  <div className="episodes-list">
                    {server.server_data.map((ep) => (
                      <Link 
                        key={ep.slug} 
                        href={`/xem-phim/${movie.slug}?server=${serverIdx}&episode=${ep.slug}`}
                        className="episode-btn"
                      >
                        {ep.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
