import { Link } from 'react-router-dom';

const MovieCard = ({ title, image, category }) => (
  <div className="card">
    <Link to={`/movies/${category}`} aria-label={`Explore ${title}`}>
      <img src={image} alt={title} loading="lazy" />
    </Link>
    <h3>{title}</h3>
  </div>
);

export default MovieCard;
