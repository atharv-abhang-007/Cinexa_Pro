import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiKey, fetchJson, imageBaseUrl, url } from '../data';
import LanguageContext from '../contexts/LanguageContext';

const VALID_CATEGORIES = new Set(['now_playing', 'popular', 'top_rated', 'upcoming']);

const Movies = () => {
  const { movieCategory } = useParams();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      if (!VALID_CATEGORIES.has(movieCategory)) {
        setMovies([]);
        setError('Movie category not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await fetchJson(
          `${url}${movieCategory}?api_key=${encodeURIComponent(apiKey)}`
        );
        if (!cancelled) setMovies(data.results ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "We couldn't load the movies.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, [movieCategory]);

  const filteredMovies = movies.filter(
    (movie) => rating === 0 || (movie.vote_average ?? 0) >= rating
  );

  return (
    <div>
      <div className="top-bar">
        <button className="logo logo-button" onClick={() => navigate('/')}>
          {language === 'Hindi' ? 'सिनेक्सा' : 'Cinexa'}
        </button>
        <button className="back-btn" onClick={() => navigate('/')}>
          {language === 'Hindi' ? '← होम पर वापस जाएं' : '← Back To Home'}
        </button>
      </div>

      <div className="movies-page">
        <div className="filter-container">
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value="0">{language === 'Hindi' ? 'सभी रेटिंग' : 'All Ratings'}</option>
            <option value="7">⭐ 7+</option>
            <option value="8">⭐ 8+</option>
            <option value="8.5">⭐ 8.5+</option>
            <option value="9">⭐ 9+</option>
          </select>
        </div>

        {loading && (
          <div className="movies-container" aria-label="Loading movies">
            {Array.from({ length: 12 }, (_, index) => (
              <div key={index} className="shimmer-card" />
            ))}
          </div>
        )}

        {error && (
          <div className="error-text" role="alert">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && filteredMovies.length > 0 && (
          <div className="movies-container">
            {filteredMovies.map((movie) => {
              const title = movie.title || movie.name || 'Untitled';
              return (
                <div key={movie.id} className="movie-card">
                  <Link to={`/movie/${movie.id}`} aria-label={`Open ${title}`}>
                    {movie.poster_path ? (
                      <img
                        src={`${imageBaseUrl}w500${movie.poster_path}`}
                        alt={title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="poster-placeholder">No poster</div>
                    )}
                  </Link>
                  <div className="movie-rating">⭐ {(movie.vote_average ?? 0).toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredMovies.length === 0 && (
          <p className="no-results">No Results Found</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
