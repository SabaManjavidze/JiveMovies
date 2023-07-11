import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  primaryKey,
  pgEnum,
  varchar,
  date
} from 'drizzle-orm/pg-core'
import { InferModel, relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: varchar('id', { length: 30 }).primaryKey(),
  username: text('name'),
  gender: text('gender', { enum: ['Male', 'Female'] }),
  email: varchar('email', { length: 320 }),
  password: varchar('password', { length: 200 }),
  birthDate: date('birthDate'),
  picture: varchar('picture', { length: 300 })
})
export type UserType = InferModel<typeof users, 'select'>
export type NewUser = InferModel<typeof users, 'insert'>
export const usersRelations = relations(users, ({ many }) => ({
  usersToMovies: many(usersToMovies)
}))

export const movies = pgTable('movies', {
  id: varchar('id').primaryKey(),
  title: text('title'),
  poster: varchar('poster', { length: 300 }),
  imdbScore: text('imdbScore')
})

export const moviesRelations = relations(movies, ({ many }) => ({
  usersToMovies: many(usersToMovies)
}))

export const usersToMovies = pgTable(
  'users_to_movies',
  {
    userId: varchar('user_id').notNull(),
    movieId: varchar('movie_id').notNull(),
    season: integer('season').default(1),
    episode: integer('episode').default(1),
    time: integer('time').default(0)
  },
  (t) => ({
    pk: primaryKey(t.userId, t.movieId)
  })
)
export type UsersToMoviesType = InferModel<typeof usersToMovies, 'select'>
export const usersToMoviesRelations = relations(usersToMovies, ({ one }) => ({
  movie: one(movies, {
    fields: [usersToMovies.movieId],
    references: [movies.id]
  }),
  user: one(users, {
    fields: [usersToMovies.userId],
    references: [users.id]
  })
}))
