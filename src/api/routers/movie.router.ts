import axios from 'axios'
import { z } from 'zod'
import { db, protectedProcedure, publicProcedure, router } from '../trpc'
import { IMOVIE_BASE_URL } from '../utils/constants'
import {
  movies as Movies,
  UsersToMoviesType,
  usersToMovies
} from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { AdjaraMovie } from '@renderer/lib/types/movieTypes'

type UserProgress = { season: number; episode: number; time: number }
const addIfFavorite = async <T extends AdjaraMovie>(
  movies: T[],
  userId?: string
) => {
  const newMovies = []
  let records: UsersToMoviesType[] = []
  if (userId) {
    records = await db.query.usersToMovies.findMany({
      where: (userMovie, { eq }) => eq(userMovie.userId, userId)
    })
  }
  for (let i = 0; i < movies.length; i++) {
    newMovies.push({
      ...movies[i],
      isFavorite: userId
        ? !!records.find((item) => item.movieId == movies[i].id.toString())
        : false
    })
  }
  return newMovies as [T & { isFavorite: boolean }]
}
export const movieRouter = router({
  updateFavoriteMovie: protectedProcedure
    .input(
      z.object({
        movieId: z.string(),
        season: z.number().optional(),
        episode: z.number().optional(),
        time: z.number().optional()
      })
    )
    .mutation(
      async ({ ctx: { req }, input: { movieId, time, episode, season } }) => {
        await db
          .update(usersToMovies)
          .set({ episode, season, time })
          .where(
            and(
              eq(usersToMovies.userId, req.session.userId),
              eq(usersToMovies.movieId, movieId)
            )
          )
      }
    ),
  getFavoriteMovies: protectedProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx: { req } }) => {
      const movies = await db.query.usersToMovies.findMany({
        where: (record, { eq }) => eq(record.userId, req.session.userId),
        with: { movie: true },
        limit: 16
      })
      const newMovies: {
        id: string
        secondaryName: string
        poster: string
        isFavorite: boolean
        rating: { imdb: { score: number } }
        userProgress: { season: number; episode: number; time: number }
      }[] = []
      for (let i = 0; i < movies.length; i++) {
        const { movie, season, episode, time } = movies[i]
        newMovies.push({
          id: movie.id,
          secondaryName: movie.title,
          poster: movie.poster,
          userProgress: {
            season,
            episode,
            time
          },
          isFavorite: true,
          rating: { imdb: { score: parseInt(movie.imdbScore) } }
        })
      }
      return newMovies
    }),
  addFavoriteMovie: protectedProcedure
    .input(
      z.object({
        movieId: z.string().min(1),
        poster: z.string().url(),
        isFavorite: z.boolean(),
        title: z.string(),
        season: z.number().optional(),
        episode: z.number().optional(),
        time: z.number().optional()
      })
    )
    .mutation(
      async ({
        input: { title, poster, movieId, isFavorite, season, episode, time },
        ctx: { req }
      }) => {
        try {
          await db.insert(Movies).values({ title, poster, id: movieId })
        } catch (err) {
          console.log('nothing')
        }
        if (isFavorite) {
          await db
            .delete(usersToMovies)
            .where(
              and(
                eq(usersToMovies.userId, req.session.userId),
                eq(usersToMovies.movieId, movieId)
              )
            )
        } else {
          await db.insert(usersToMovies).values({
            movieId,
            userId: req.session.userId,
            season,
            episode,
            time
          })
        }
      }
    ),
  getEpisodes: publicProcedure
    .input(
      z.object({
        season: z.string().min(1),
        movieId: z.string().min(1)
      })
    )
    .query(async ({ input: { season, movieId } }) => {
      const { data: details } = await axios.get(
        `${IMOVIE_BASE_URL}/movies/${movieId}/season-files/${season}`
      )
      return details.data
    }),
  getMovieById: publicProcedure
    .input(
      z.object({
        movieId: z.string().min(1)
      })
    )
    .query(async ({ input: { movieId }, ctx: { req } }) => {
      const {
        data: { data: details }
      } = await axios.get(`${IMOVIE_BASE_URL}/movies/${movieId}`)
      const [newMovie] = await addIfFavorite(
        [details as AdjaraMovie],
        req.session.userId
      )
      if (req?.session?.userId) {
        const { season, episode, time } =
          await db.query.usersToMovies.findFirst({
            where: (record, { and, eq }) =>
              and(
                eq(record.userId, req.session.userId),
                eq(record.movieId, movieId)
              )
          })
        return Object.assign(newMovie, {
          userProgress: { season, episode, time }
        }) as typeof newMovie & { userProgress: UserProgress | null }
      }
      return Object.assign(newMovie, {
        userProgress: null
      }) as typeof newMovie & { userProgress: UserProgress | null }
    }),
  getMoviesByKeyword: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        page: z.number().default(1).optional()
      })
    )
    .query(async ({ input: { query, page }, ctx: { req } }) => {
      if (query) {
        const movie_filters = `movie_filters[type]=series&movie_filters[without_watched_movies]=no&movie_filters[countries_related]=no&movie_filters[genres_related]=no&filters[type]=movie`
        const search_url = `${IMOVIE_BASE_URL}/search-advanced?${movie_filters}&keywords=${query}&page=${page}&per_page=16`
        const { data: movies } = await axios.get(search_url)
        const newMovies = await addIfFavorite(movies.data, req.session.userId)
        return newMovies as [AdjaraMovie & { isFavorite: boolean }]
      } else {
        const params = `filters[with_files]=yes&filters[type]=movie&sort=-upload_date&page=${page}&per_page=16`
        const { data: details } = await axios.get(
          `${IMOVIE_BASE_URL}/movies?${params}`
        )
        const newMovies = await addIfFavorite(details.data, req.session.userId)
        return newMovies as [AdjaraMovie & { isFavorite: boolean }]
      }
    })
})
