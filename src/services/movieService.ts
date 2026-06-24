import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Movie } from "../types/movie.ts";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const FAKE_TMDB = import.meta.env.VITE_FAKE_TMDB === "true";

const tmdb: AxiosInstance = axios.create({
  baseURL: `https://api.themoviedb.org/3/`,
  headers: {
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
});

interface SearchResponse {
  results: Movie[];
}

export async function fetchMovies(
  query: string,
  page: number = 1,
): Promise<Movie[]> {
  if (FAKE_TMDB) {
    await new Promise((res) => setTimeout(res, 2000));
    return [
      {
        id: 1,
        poster_path: "#",
        backdrop_path: "#",
        title: "Dummy Movie",
        overview: "Lorem ipsum dolor dit amen",
        release_date: "2026/06/19",
        vote_average: 4.9,
      },
    ];
  } else {
    const response = await tmdb.get<SearchResponse>("/search/movie", {
      params: { query, page },
    });
    return response.data.results;
  }
}
