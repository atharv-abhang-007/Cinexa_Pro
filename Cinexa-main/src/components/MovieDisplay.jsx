import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiKey, fetchJson, imageBaseUrl, url } from '../data';
import '../MovieDisplay.css';
import useOnlineStatus from '../hooks/useOnlineStatus';
import LanguageContext from '../contexts/LanguageContext';

const MovieDisplay = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const onlineStatus = useOnlineStatus();
  const { language } = useContext(LanguageContext);
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [play, setPlay] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchMovieDetails = async () => {
      if (!movieId) {
        setError('Movie not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const [movieData, videoData] = await Promise.all([
          fetchJson(`${url}${movieId}?api_key=${encodeURIComponent(apiKey)}`),
          fetchJson(`${url}${movieId}/videos?api_key=${encodeURIComponent(apiKey)}`),
        ]);

        if (cancelled) return;
        setMovie(movieData);
        const trailer = (videoData.results ?? []).find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailerKey(trailer?.key ?? '');
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load movie details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMovieDetails();
    return () => {
      cancelled = true;
    };
  }, [movieId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setPlay(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (onlineStatus === false) {
    return (
      <div className="md-error">
        <h2>{language === 'Hindi' ? 'आप ऑफलाइन हैं' : 'You are offline'}</h2>
        <button className="md-play-btn" onClick={() => navigate(-1)}>
          {language === 'Hindi' ? '← वापस जाएं' : '← Go Back'}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="md-shimmer">
        <h1 className="md-shimmer-text">Cinexa</h1>
        <p>Loading movie...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="md-error">
        <h2>{error || 'Movie not found.'}</h2>
        <button className="md-play-btn" onClick={() => navigate(-1)}>
          {language === 'Hindi' ? '← वापस जाएं' : '← Go Back'}
        </button>
      </div>
    );
  }

  return (
    <div className="md-page">
      <button className="md-back-btn" onClick={() => navigate(-1)}>
        {language === 'Hindi' ? '← वापस जाएं' : '← Back'}
      </button>

      <div
        className="md-hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${imageBaseUrl}original${movie.backdrop_path})`
            : undefined,
        }}
      >
        <div className="md-hero-content">
          <h1 className="md-title">{movie.title || movie.name}</h1>
          <p className="md-meta">
            {movie.release_date || 'N/A'} · ⭐ {(movie.vote_average ?? 0).toFixed(1)}
          </p>
          <p className="md-overview">
            {movie.overview || 'No description is available for this movie.'}
          </p>

          {trailerKey && (
            <button className="md-play-btn" onClick={() => setPlay(true)}>
              ▶ {language === 'Hindi' ? 'ट्रेलर चलाएँ' : 'Watch Trailer'}
            </button>
          )}
        </div>
      </div>

      {play && (
        <div
          className="md-trailer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Movie trailer"
          onClick={() => setPlay(false)}
        >
          <button className="md-close-btn" onClick={() => setPlay(false)} aria-label="Close trailer">
            ×
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={`${movie.title || 'Movie'} trailer`}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDisplay;
