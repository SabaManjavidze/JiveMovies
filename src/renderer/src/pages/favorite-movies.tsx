import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/NavBar'
import MovieList from '../components/MovieList'
import { Loader2 } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { trpc } from '@renderer/trpcClient'

function FavoriteMovies() {
  const { isLoading, error } = trpc.user.me.useQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page'))
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        navigate('/user/register')
        return
      }
      if (!page) {
        setSearchParams(`page=${page || 1}`)
      }
    }
  }, [isLoading])

  const { data: movies, isLoading: moviesLoading } =
    trpc.movies.getFavoriteMovies.useQuery({
      page
    })

  const arr = useMemo(() => {
    if (page > 2) {
      return [1, page - 1, page, page + 1, page + 9]
    } else {
      return [1, 2, 3, 10]
    }
  }, [page])
  const setPage = (pageNum: number) => setSearchParams(`page=${pageNum}`)

  const handleChangePage = (pageNum: number) => {
    window.scrollTo(0, 0)
    navigate(`/?page=${pageNum}`)
    setPage(pageNum)
  }

  return (
    <div>
      <Navbar setPage={setPage} />
      <div className="bg-background pb-20 text-white">
        <div className="py-12 border-b-[1px] border-white">
          <h1 className="flex text-3xl ml-6">
            <p className="text-light-primary ml-5">Favorite Movies</p>
          </h1>
        </div>
        <div className="flex min-h-screen pt-20">
          {moviesLoading ? (
            <div className="flex w-full justify-center items-center">
              <Loader2 color="pink" size={30} />
            </div>
          ) : (
            <MovieList movies={movies} />
          )}
        </div>
        {movies?.length <= 16 ? null : (
          <div>
            <ul className="mt-12 w-full flex justify-center">
              {arr.map((pageNum, i, arr) => {
                return (
                  <li
                    key={pageNum}
                    className={`text-white text-xl ${
                      pageNum === page ? 'bg-foreground/20' : 'bg-background'
                    }
                   py-2 px-4 text-center border-primary border-[1px] mx-1 cursor-pointer
                  duration-100 hover:bg-foreground/10 hover:scale-105 ${
                    pageNum > 2 && i == 0 && 'mr-12'
                  }
                    ${i === arr.length - 1 && 'ml-12'}`}
                    onClick={() => handleChangePage(pageNum)}
                  >
                    {pageNum}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoriteMovies
