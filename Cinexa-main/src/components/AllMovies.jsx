import { useEffect, useMemo, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiKey, fetchJson, imageBaseUrl, url } from '../data';
import LanguageContext from '../contexts/LanguageContext';

const categories = [
  ['nowPlaying', 'Now Playing', 'अब चल रही फिल्में'],
  ['popular', 'Popular', 'लोकप्रिय फिल्में'],
  ['topRated', 'Top Rated', 'टॉप रेटेड'],
  ['upcoming', 'Upcoming', 'आने वाली फिल्में'],
];

const AllMovies = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [movieLists, setMovieLists] = useState({
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchAllMovies = async () => {
      try {
        setLoading(true);
        setError('');

        const [nowPlaying, popular, topRated, upcoming] = await Promise.all(
          ['now_playing', 'popular', 'top_rated', 'upcoming'].map((category) =>
            fetchJson(`${url}${category}?api_key=${encodeURIComponent(apiKey)}`)
          )
        );

        if (!cancelled) {
          setMovieLists({
            nowPlaying: nowPlaying.results ?? [],
            popular: popular.results ?? [],
            topRated: topRated.results ?? [],
            upcoming: upcoming.results ?? [],
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load movies.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAllMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLists = useMemo(() => {
    const query = search.trim().toLowerCase();

    return Object.fromEntries(
      Object.entries(movieLists).map(([key, list]) => [
        key,
        list.filter((movie) => {
          const title = movie.title || movie.name || '';
          const matchesSearch = !query || title.toLowerCase().includes(query);
          const matchesRating = rating === 0 || (movie.vote_average ?? 0) >= rating;
          return matchesSearch && matchesRating;
        }),
      ])
    );
  }, [movieLists, rating, search]);

  const renderMovies = (movies, sectionId) => (
    <div className="row-container" id={sectionId}>
      {movies.map((movie) => {
        const title = movie.title || movie.name || 'Untitled';
        return (
          <div key={movie.id} className="row-card">
            <Link to={`/movie/${movie.id}`} aria-label={`Open ${title}`}>
              <div className="card-img-container">
                {movie.poster_path ? (
                  <img
                    src={`${imageBaseUrl}w500${movie.poster_path}`}
                    alt={title}
                    loading="lazy"
                  />
                ) : (
                  <div className="poster-placeholder">No poster</div>
                )}
                <div className="rating-badge">⭐ {(movie.vote_average ?? 0).toFixed(1)}</div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="all-movies-page">
      <div className="top-bar">
        <button className="logo logo-button" onClick={() => navigate('/')}>
          {language === 'Hindi' ? 'सिनेक्सा' : 'Cinexa'}
        </button>

        <input
          type="search"
          className="search-input"
          placeholder={language === 'Hindi' ? '🔍 फिल्म खोजें...' : '🔍 Search movies...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search movies"
        />

        <button className="back-btn" onClick={() => navigate('/')}>
          {language === 'Hindi' ? '← होम पर वापस जाएं' : '← Back To Home'}
        </button>
      </div>

      <div className="filter-container">
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value="0">{language === 'Hindi' ? 'सभी रेटिंग' : 'All Ratings'}</option>
          <option value="7">⭐ 7+</option>
          <option value="8">⭐ 8+</option>
          <option value="8.5">⭐ 8.5+</option>
          <option value="9">⭐ 9+</option>
        </select>
      </div>

      {loading && <p className="loading-text">Loading Movies...</p>}
      {error && (
        <div className="error-text" role="alert">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {categories.map(([key, english, hindi]) => (
            <section key={key}>
              <h2 className="section-title">{language === 'Hindi' ? hindi : english}</h2>
              {filteredLists[key]?.length ? (
                renderMovies(filteredLists[key], key)
              ) : (
                <p className="no-results">No results found.</p>
              )}
            </section>
          ))}
        </>
      )}
    </div>
  );
};

export default AllMovies;
