'use client';
import Link from 'next/link';
import { getImageUrl } from '@/services/api';
import ImageWithFallback from './ImageWithFallback';

export default function MovieCard({ movie }) {
  // Extract fields safely as API structures can vary between v1 list API and updates API
  const title = movie.name;
  const originalTitle = movie.origin_name;
  const slug = movie.slug;
  const imgPath = movie.poster_url || movie.thumb_url;
  const fullImgUrl = getImageUrl(imgPath);
  const year = movie.year || '';

  // Badge info (Language, Quality, or Episode Current)
  const badgeText = movie.episode_current || movie.lang || movie.quality || '';

  return (
    <Link href={`/phim/${slug}`} className="movie-card animated-fade-in">
      <div className="movie-card-img-wrapper">
        <ImageWithFallback src={fullImgUrl} alt={title} className="movie-card-img" loading="lazy" />
        <div className="movie-card-overlay"/>
        {badgeText && (
          <span className="movie-card-badge">{badgeText}</span>
        )}
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title" title={title}>{title}</h3>
        <div className="movie-card-meta">
          <span>{originalTitle}</span>
          {year && <span>{year}</span>}
        </div>
      </div>
    </Link>
  );
}
