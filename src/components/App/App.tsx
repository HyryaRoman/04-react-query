import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import SearchBar from "../SearchBar/SearchBar.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import css from "./App.module.css";

import { fetchMovies } from "../../services/movieService.ts";

import type { Movie } from "../../types/movie.ts";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

// Далі в jsx використувуємо компонент ReactPaginate звичайним чином.

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const {
    data: movieList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: async () => {
      return await fetchMovies(query, page);
    },
    enabled: query !== "",
    initialData: { movies: [], totalPages: 0 },
  });
  const [shownMovie, setShownMovie] = useState<Movie | null>(null);

  function handleSearch(query: string) {
    setPage(1);
    setQuery(query);
  }

  function onMovieSelect(movie: Movie) {
    setShownMovie(movie);
  }

  function onModalClose() {
    setShownMovie(null);
  }

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movieList.movies.length > 0 && (
        <>
          {movieList.totalPages > 1 && (
            <ReactPaginate
              pageCount={movieList.totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={movieList.movies} onSelect={onMovieSelect} />
        </>
      )}
      {shownMovie && <MovieModal movie={shownMovie} onClose={onModalClose} />}
    </div>
  );
}
