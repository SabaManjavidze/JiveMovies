import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Register from './pages/register'
import Home from './pages/home'
import { nanoid } from 'nanoid'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import Logout from './pages/logout'
import { trpc } from '@renderer/trpcClient'
import './assets/index.css'
import { ipcLink } from 'electron-trpc/renderer'
import SuperJSON from 'superjson'
import FavoriteMovies from './pages/favorite-movies'
import MovieDetails from './pages/movie-details'

const RoutesObj = [
  { path: '/', element: <Home /> },
  { path: '/movie/:movieId', element: <MovieDetails /> },
  { path: '/user/register', element: <Register /> },
  { path: '/user/logout', element: <Logout /> },
  { path: '/user/favorite-movies', element: <FavoriteMovies /> }
]

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: false },
          mutations: { retry: false }
        }
      })
  )
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [ipcLink()],
      transformer: SuperJSON
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div>
            <Routes>
              {RoutesObj.map(({ path, element }) => (
                <Route path={path} element={element} key={nanoid()} />
              ))}
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
