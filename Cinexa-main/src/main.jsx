import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Error from './components/Error.jsx';
import Movies from './components/Movies.jsx';
import AllMovies from './components/AllMovies.jsx';
import MovieDisplay from './components/MovieDisplay.jsx';
import { LanguageContextProvider } from './contexts/LanguageContext.jsx';

const appRouter = createBrowserRouter([
  { path: '/', element: <App />, errorElement: <Error /> },
  { path: '/movies/:movieCategory', element: <Movies />, errorElement: <Error /> },
  { path: '/movies', element: <AllMovies />, errorElement: <Error /> },
  { path: '/movie/:movieId', element: <MovieDisplay />, errorElement: <Error /> },
  { path: '*', element: <Error /> },
]);

const Root = () => (
  <LanguageContextProvider>
    <RouterProvider router={appRouter} />
  </LanguageContextProvider>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
