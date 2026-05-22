import MovieCard from './MovieCard';

export default function MovieGrid({ movies, emptyMessage = 'Không tìm thấy bộ phim nào phù hợp.' }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state animated-fade-in">
        <div className="empty-state-icon">🎬</div>
        <h3 className="empty-state-title">Danh sách trống</h3>
        <p className="empty-state-desc">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.slug} movie={movie} />
      ))}
    </div>
  );
}
