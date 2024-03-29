import { router } from './trpc'
import { movieRouter } from './routers/movie.router'
import { userRouter } from './routers/user.router'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { settingsRouter } from './routers/settings.router'
export const mainRouter = router({
  movies: movieRouter as {
    _def: { _config: { $types: { errorShape: any } } }
  } & typeof movieRouter,
  settings: settingsRouter as {
    _def: { _config: { $types: { errorShape: any } } }
  } & typeof settingsRouter,
  user: userRouter as {
    _def: { _config: { $types: { errorShape: any } } }
  } & typeof userRouter
})

export type AppRouter = typeof mainRouter
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
