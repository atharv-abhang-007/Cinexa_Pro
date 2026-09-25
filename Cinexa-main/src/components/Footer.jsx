import { Link } from 'react-router-dom';
import { useContext } from 'react';
import LanguageContext from '../contexts/LanguageContext';

const Footer = () => {
  const { language } = useContext(LanguageContext);
  const hindi = language === 'Hindi';

  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>Cinexa</h2>
        <p>{hindi ? 'कभी भी, कहीं भी फिल्में और शो देखें।' : 'Discover movies and shows anytime, anywhere.'}</p>
        <div className="footer-links">
          <Link to="/">{hindi ? 'होम' : 'Home'}</Link>
          <Link to="/movies">{hindi ? 'फिल्में' : 'Movies'}</Link>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Cinexa. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
