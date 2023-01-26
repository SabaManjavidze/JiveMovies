import axios from "axios";
import { z } from "zod";
import { AdjaraMovie, Episode, Movie } from "../../../utils/types";
import { procedure, router } from "../trpc";

export const movieRouter = router({
  getEpisodes: procedure
    .input(
      z.object({
        season: z.string().min(1),
        movieId: z.string().min(1),
      })
    )
    .mutation(async ({ input: { season, movieId } }) => {
      const { data: details } = await axios.get(
        `${process.env.IMOVIE_BASE_URL}/movies/${movieId}/season-files/${season}`
      );
      return details.data as Episode[];
    }),
  getMovieById: procedure
    .input(
      z.object({
        movieId: z.string().min(1),
      })
    )
    .query(async ({ input: { movieId } }) => {
      const {
        data: { data: details },
      } = await axios.get(`${process.env.IMOVIE_BASE_URL}/movies/${movieId}`);
      return details as AdjaraMovie;
    }),
  getMovieByKeyword: procedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .mutation(async ({ input: { query } }) => {
      const movie_filters =
        "https://api.imovies.cc/api/v1/search-advanced?movie_filters%5B%23%2Fbrowse%2Fmovies%5D=&movie_filters%5Bwith_actors%5D=3&movie_filters%5Bwith_directors%5D=1&filters%5Btype%5D=movie&page=1&per_page=20";
      const search_url = `${process.env.IMOVIE_BASE_URL}/search-advanced?${movie_filters}&keywords=${query}&page=1&per_page=20`;
      const { data: movies } = await axios.get(search_url);
      const parsedMovies = movies.data.map((item: AdjaraMovie) => {
        return {
          movieType: item.isTvShow ? "series" : "movies",
          slug: item?.id?.toString() ?? item?.adjaraId?.toString(),
          thumbnail_url: item.posters.data[400] ?? item.posters.data[240],
          title: item.secondaryName,
        } as Movie;
      });
      return parsedMovies;
    }),
});
