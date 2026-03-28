import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { url, apiKey } from '../data';
import LanguageContext from '../contexts/LanguageContext';

const AllMovies = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState('');

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      setError('');

      const [nowPlayingRes, popularRes, topRatedRes, upcomingRes] =
        await Promise.all([
          fetch(`${url}now_playing?api_key=${apiKey}`),
          fetch(`${url}popular?api_key=${apiKey}`),
          fetch(`${url}top_rated?api_key=${apiKey}`),
          fetch(`${url}upcoming?api_key=${apiKey}`),
        ]);

      const nowPlayingData = await nowPlayingRes.json();
      const popularData = await popularRes.json();
      const topRatedData = await topRatedRes.json();
      const upcomingData = await upcomingRes.json();

      setNowPlaying(nowPlayingData.results);
      setPopular(popularData.results);
      setTopRated(topRatedData.results);
      setUpcoming(upcomingData.results);
    } catch (err) {
      setError('⚠️ Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const renderMovies = (movies, sectionId) => {
    const filtered = movies
      ?.filter((m) => rating === 0 || m.vote_average >= rating) // rating filter
      ?.filter(
        (m) => m.title.toLowerCase().includes(search.toLowerCase()) // search filter
      );

    const scroll = (direction) => {
      const container = document.getElementById(sectionId);
      container.scrollLeft += direction === 'left' ? -400 : 400;
    };

    return (
      <div className="row-container">
        {filtered?.map((movie) => (
          <div key={movie.id} className="row-card">
            <Link to={`/movie/${movie.id}`}>
              <div className="card-img-container">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />

                {/* ⭐ Rating */}
                <div className="rating-badge">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="all-movies-page">
      {/* HEADER */}
      <div className="top-bar">
        <h2 className="logo" onClick={() => navigate('/')}>
          {language === 'Hindi' ? 'सिनेक्सा' : 'Cinexa'}
        </h2>

        <input
          type="text"
          className="search-input"
          placeholder={
            language === 'Hindi' ? '🔍 फिल्म खोजें...' : '🔍 Search movies...'
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="back-btn" onClick={() => navigate('/')}>
          {language === 'Hindi' ? '← होम पर वापस जाएं' : '← Back To Home'}
        </button>
      </div>
      <div className="filter-container">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value="0">
            {language === 'Hindi' ? 'सभी रेटिंग' : 'All Ratings'}
          </option>
          <option value="5">⭐ 5+</option>
          <option value="6">⭐ 6+</option>
          <option value="7">⭐ 7+</option>
          <option value="8">⭐ 8+</option>
        </select>
      </div>

      {loading && <p className="loading-text">Loading Movies...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <section>
            <h2 className="section-title">
              {language === 'Hindi' ? 'अब चल रही फिल्में' : 'Now Playing'}
            </h2>
            {renderMovies(nowPlaying)}
          </section>

          <section>
            <h2 className="section-title">
              {language === 'Hindi' ? 'लोकप्रिय फिल्में' : 'Popular'}
            </h2>
            {renderMovies(popular)}
          </section>

          <section>
            <h2 className="section-title">
              {language === 'Hindi' ? 'टॉप रेटेड' : 'Top Rated'}
            </h2>
            {renderMovies(topRated)}
          </section>

          <section>
            <h2 className="section-title">
              {language === 'Hindi' ? 'आने वाली फिल्में' : 'Upcoming'}
            </h2>
            {renderMovies(upcoming)}
          </section>
        </>
      )}
    </div>
  );
};

export default AllMovies;
