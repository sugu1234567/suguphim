import { notFound } from 'next/navigation';
import { fetchMovieDetail, getImageUrl } from '@/services/api';
import WatchClient from '@/components/WatchClient';

// Dynamic SEO pre-rendering for Watch pages
export async function generateMetadata({ params, searchParams }) {
  const detail = await fetchMovieDetail(params.slug);
  if (!detail || !detail.status) {
    return { title: 'Đang Xem Phim - SuguPhim' };
  }
  const movie = detail.movie;
  const epSlug = searchParams.episode || '';
  const serverIdx = parseInt(searchParams.server || '0', 10);
  
  const currentServer = detail.episodes[serverIdx] || detail.episodes[0] || null;
  const currentEp = currentServer?.server_data?.find(ep => ep.slug === epSlug) 
    || currentServer?.server_data?.[0] 
    || null;
  
  const epLabel = currentEp ? ` Tập ${currentEp.name}` : '';

  return {
    title: `Đang Xem Phim ${movie.name}${epLabel} (${movie.origin_name}) HD Vietsub Thuyết Minh | SuguPhim`,
    description: `Đang phát sóng phim ${movie.name}${epLabel} chất lượng tốt nhất, tốc độ cao không giật lag. Xem ngay miễn phí!`,
    openGraph: {
      title: `Xem Phim ${movie.name}${epLabel} - SuguPhim`,
      description: movie.content ? movie.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
      images: [{ url: getImageUrl(movie.poster_url || movie.thumb_url) }],
    }
  };
}

export default async function WatchMoviePage({ params, searchParams }) {
  const detail = await fetchMovieDetail(params.slug);

  if (!detail || !detail.status) {
    notFound();
  }

  const { movie, episodes } = detail;

  // Determine initial server and episode
  const initialServer = parseInt(searchParams.server || '0', 10);
  let initialEpisodeSlug = searchParams.episode || '';

  // Fallback to first episode if no valid episode slug was specified in URL
  if (!initialEpisodeSlug && episodes && episodes.length > 0 && episodes[0].server_data && episodes[0].server_data.length > 0) {
    initialEpisodeSlug = episodes[0].server_data[0].slug;
  }

  return (
    <WatchClient 
      movie={movie} 
      episodes={episodes} 
      initialServer={initialServer} 
      initialEpisodeSlug={initialEpisodeSlug} 
    />
  );
}
