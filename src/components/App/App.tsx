import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

import SearchBar from "../SearchBar/SearchBar.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import styles from "./App.module.css";

import { fetchMovies } from "../../services/movieService.ts";

import type { Movie } from "../../types/movie.ts";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [shownMovie, setShownMovie] = useState<Movie | null>(null);

  async function onSearch(query: string) {
    try {
      setMovies([]);
      setLoading(true);
      setError(false);

      const result = await fetchMovies(query);
      if (result.length > 0) {
        setMovies(result);
      } else {
        toast.error("No movies found for your request.");
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function onMovieSelect(movie: Movie) {
    setShownMovie(movie);
  }

  function onModalClose() {
    setShownMovie(null);
  }

  return (
    <div className={styles.app}>
      <Toaster />
      <SearchBar onSubmit={onSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={onMovieSelect} />
      )}
      {shownMovie && <MovieModal movie={shownMovie} onClose={onModalClose} />}
    </div>
  );
}
