import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SearchBar from "../SearchBar/SearchBar.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import styles from "./App.module.css";

import { fetchMovies } from "../../services/movieService.ts";

import type { Movie } from "../../types/movie.ts";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const {
    data: movies,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies", query],
    queryFn: async () => {
      return await fetchMovies(query);
    },
    enabled: query !== "",
  });
  const [shownMovie, setShownMovie] = useState<Movie | null>(null);

  console.error(error);

  function onMovieSelect(movie: Movie) {
    setShownMovie(movie);
  }

  function onModalClose() {
    setShownMovie(null);
  }

  return (
    <div className={styles.app}>
      <Toaster />
      <SearchBar onSubmit={setQuery} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={onMovieSelect} />
      )}
      {shownMovie && <MovieModal movie={shownMovie} onClose={onModalClose} />}
    </div>
  );
}
