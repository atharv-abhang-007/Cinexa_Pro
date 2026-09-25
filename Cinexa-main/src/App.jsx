import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import { movies } from './data';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import LanguageContext from './contexts/LanguageContext';

const App = () => {
  const { language } = useContext(LanguageContext);
  const hindi = language === 'Hindi';

  return (
    <>
      <div className="page">
        <Header />
        <div className="hero-content">
          <h1>{hindi ? 'अनलिमिटेड फिल्में और शो' : 'Unlimited Movies, TV Shows & More'}</h1>
          <p>{hindi ? 'कहीं भी देखें। कभी भी रद्द करें।' : 'Discover something great to watch.'}</p>
          <Link to="/movies" className="primarybtn">
            {hindi ? 'अभी देखें' : 'Explore Now'}
          </Link>
        </div>
      </div>
      <div className="movies-section">
        {movies.map((movie) => (
          <MovieCard key={movie.id} title={movie.title[language]} image={movie.image} category={movie.category} />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default App;
