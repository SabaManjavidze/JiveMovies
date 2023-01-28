import { status_enum } from "@prisma/client";
import axios from "axios";
import { z } from "zod";
import { AdjaraMovie, Episode, Movie } from "../../../utils/types";
import { isAuthed } from "../middlewares/isAuthed";
import { procedure, router } from "../trpc";

const statusType = [
  "PLAN_TO_WATCH",
  "WATCHING",
  "COMPLETED",
  "DROPPED",
] as const;
export const movieRouter = router({
  updateListMovie: procedure
    .input(
      z.object({
        status: z.enum(statusType).optional(),
        movie_id: z.string().min(1),
        episode: z.number().min(1).optional(),
        season: z.number().min(1).optional(),
        score: z.number().min(1).max(10).optional(),
        start_date: z.date().optional(),
        finish_date: z.date().optional(),
      })
    )
    .use(isAuthed)
    .mutation(
      async ({
        input: {
          status,
          movie_id,
          episode,
          season,
          score,
          start_date,
          finish_date,
        },
        ctx: { req },
      }) => {
        await prisma.user_list_movie.update({
          where: {
            user_id_movie_id: { user_id: req.session.userId, movie_id },
          },
          data: {
            status,
            episode,
            season,
            score,
            start_date,
            finish_date,
          },
        });
      }
    ),
  addMovieToList: procedure
    .input(
      z.object({
        status: z.enum(statusType),
        movie_id: z.string().min(1),
        episode: z.number().min(1),
        season: z.number().min(1),
        score: z.number().min(1).max(10),
        start_date: z.date().optional(),
        finish_date: z.date().optional(),
      })
    )
    .use(isAuthed)
    .mutation(
      async ({
        input: {
          status,
          movie_id,
          episode,
          season,
          score,
          start_date,
          finish_date,
        },
        ctx: { req },
      }) => {
        await prisma.user_list_movie.create({
          data: {
            status,
            episode,
            season,
            score,
            movie_id,
            start_date,
            finish_date,
            user_id: req.session.userId,
          },
        });
      }
    ),
  getEpisodes: procedure
    .input(
      z.object({
        season: z.string().min(1),
        movieId: z.string().min(1),
      })
    )
    .query(async ({ input: { season, movieId } }) => {
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
        query: z.string().optional(),
        page: z.string().min(1).default("1").optional(),
      })
    )
    .query(async ({ input: { query, page } }) => {
      console.log({ query, page });
      if (query) {
        const movie_filters = `movie_filters[type]=series&movie_filters[without_watched_movies]=no&movie_filters[countries_related]=no&movie_filters[genres_related]=no&filters[type]=movie`;
        const search_url = `${process.env.IMOVIE_BASE_URL}/search-advanced?${movie_filters}&keywords=${query}&page=${page}&per_page=16`;
        console.log({ search_url });
        const { data: movies } = await axios.get(search_url);

        return movies.data;
      } else {
        const params = `filters[with_files]=yes&filters[type]=movie&sort=-upload_date&page=${page}&per_page=16`;
        const { data: details } = await axios.get(
          `${process.env.IMOVIE_BASE_URL}/movies?${params}`
        );
        return details.data as AdjaraMovie[];
      }
    }),
});
