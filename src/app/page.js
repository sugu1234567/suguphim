import Link from 'next/link';
import { fetchNewUpdates, fetchMovieList, fetchMovieDetail, getImageUrl } from '@/services/api';
import MovieGrid from '@/components/MovieGrid';
import HeroBanner from '@/components/HeroBanner';

export const revalidate = 300; // Cache page for 5 minutes

export default async function HomePage() {
  // Fetch lists in parallel on the server
  const [updatesData, seriesData, moviesData, cartoonsData] = await Promise.all([
    fetchNewUpdates(1),
    fetchMovieList('phim-bo', 1, 12),
    fetchMovieList('phim-le', 1, 12),
    fetchMovieList('hoat-hinh', 1, 12),
  ]);

  const newUpdates = updatesData?.items || [];
  const series = seriesData?.data?.items || [];
  const movies = moviesData?.data?.items || [];
  const cartoons = cartoonsData?.data?.items || [];

  // Get full details of the first movie to showcase on the cinematic Hero Banner
  let featuredMovie = null;
  if (newUpdates.length > 0) {
    try {
      const detail = await fetchMovieDetail(newUpdates[0].slug);
      if (detail && detail.status) {
        featuredMovie = detail.movie;
      }
    } catch (err) {
      console.error('Error fetching featured hero details', err);
    }
  }

  // Fallback featured movie in case detail fetch failed
  if (!featuredMovie && newUpdates.length > 0) {
    featuredMovie = newUpdates[0];
  }

  const heroBackdrop = featuredMovie ? getImageUrl(featuredMovie.thumb_url || featuredMovie.poster_url) : '';
  const heroTitle = featuredMovie ? featuredMovie.name : '';
  const heroOriginalTitle = featuredMovie ? featuredMovie.origin_name : '';
  const heroDesc = featuredMovie ? (featuredMovie.content || 'Xem phim vietsub, thuyết minh chất lượng cao miễn phí tại SUGUPHIM.') : '';

  return (
    <div className="animated-fade-in">
      {/* Featured Hero Banner */}
      {featuredMovie && (
        <HeroBanner movie={featuredMovie} backdropUrl={heroBackdrop} />
      )}

      {/* Main Lists Container */}
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '60px' }}>
        
        {/* Phim Mới Cập Nhật */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title" style={{marginBottom: 0}}>Mới Cập Nhật</h2>
            <Link href="/danh-sach/phim-moi" className="nav-link" style={{fontSize: '0.9rem', color: 'var(--accent-red)'}}>
              Xem tất cả →
            </Link>
          </div>
          <MovieGrid movies={newUpdates.slice(0, 12)} />
        </section>

        {/* Phim Lẻ */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title" style={{marginBottom: 0}}>Phim Lẻ Mới</h2>
            <Link href="/danh-sach/phim-le" className="nav-link" style={{fontSize: '0.9rem', color: 'var(--accent-red)'}}>
              Xem tất cả →
            </Link>
          </div>
          <MovieGrid movies={movies.slice(0, 12)} />
        </section>

        {/* Phim Bộ */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title" style={{marginBottom: 0}}>Phim Bộ Hot</h2>
            <Link href="/danh-sach/phim-bo" className="nav-link" style={{fontSize: '0.9rem', color: 'var(--accent-red)'}}>
              Xem tất cả →
            </Link>
          </div>
          <MovieGrid movies={series.slice(0, 12)} />
        </section>

        {/* Hoạt Hình */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title" style={{marginBottom: 0}}>Hoạt Hình Tuyển Chọn</h2>
            <Link href="/danh-sach/hoat-hinh" className="nav-link" style={{fontSize: '0.9rem', color: 'var(--accent-red)'}}>
              Xem tất cả →
            </Link>
          </div>
          <MovieGrid movies={cartoons.slice(0, 12)} />
        </section>

      </div>
    </div>
  );
}
