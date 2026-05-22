'use client';

import Link from 'next/link';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop';

export default function HeroBanner({ movie, backdropUrl }) {
  if (!movie) return null;

  const heroTitle = movie.name || '';
  const heroOriginalTitle = movie.origin_name || '';
  const heroDesc = movie.content
    ? movie.content.replace(/<[^>]*>/g, '')
    : 'Xem phim vietsub, thuyết minh chất lượng cao miễn phí tại SUGUPHIM.';
  const heroSlug = movie.slug || '';

  return (
    <section className="hero-banner">
      <div className="hero-bg-wrapper">
        <img
          src={backdropUrl || FALLBACK_IMAGE}
          alt={heroTitle}
          className="hero-bg-image"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="container">
          <div className="hero-info-box">
            <span className="hero-badge">Tiêu Điểm</span>
            <h1 className="hero-title">{heroTitle}</h1>
            <div className="hero-meta">
              <span className="gradient-text" style={{ fontWeight: 700 }}>
                {heroOriginalTitle}
              </span>
              {movie.year && <span>• {movie.year}</span>}
              {movie.quality && (
                <span className="stat-badge accent" style={{ padding: '2px 8px' }}>
                  {movie.quality}
                </span>
              )}
            </div>
            <p className="hero-desc">{heroDesc}</p>
            <div className="hero-actions">
              <Link href={`/phim/${heroSlug}`} className="btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Xem Ngay
              </Link>
              <Link href={`/phim/${heroSlug}`} className="btn-secondary">
                Chi Tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
