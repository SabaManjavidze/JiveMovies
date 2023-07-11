import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/NavBar'
import MovieList from '../components/MovieList'
import { Loader2 } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { trpc } from '@renderer/trpcClient'

function Home() {
  const { isLoading, error } = trpc.user.me.useQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = parseInt(searchParams.get('page'))
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        navigate('/user/register')
        return
      }
      if (!query || !page) {
        setSearchParams(`query=${query || ''}&page=${page || 1}`)
      }
    }
  }, [isLoading])

  const { data: movies, isLoading: moviesLoading } =
    trpc.movies.getMoviesByKeyword.useQuery({
      page: page || 1,
      query: query ?? ''
    })

  const arr = useMemo(() => {
    if (page > 2) {
      return [1, page - 1, page, page + 1, page + 9]
    } else {
      return [1, 2, 3, 10]
    }
  }, [page])
  const setQuery = (str: string) => setSearchParams(`query=${str}&page=${page}`)
  const setPage = (pageNum: number) =>
    setSearchParams(`query=${query}&page=${pageNum}`)

  const handleChangePage = (pageNum: number) => {
    window.scrollTo(0, 0)
    navigate(`/?page=${pageNum}`)
    setPage(pageNum)
  }

  return (
    <div>
      <Navbar setQuery={setQuery} setPage={setPage} />
      <div className="bg-background pb-20 text-white">
        {query ? (
          <div className="py-12 border-b-[1px] border-white">
            <h1 className="flex text-3xl ml-6">
              <p>Search Results For:</p>
              <p className="text-light-primary ml-5">"{query}"</p>
            </h1>
          </div>
        ) : null}
        <div className="flex min-h-screen pt-20">
          {moviesLoading ? (
            <div className="flex w-full justify-center items-center">
              <Loader2 color="pink" size={30} />
            </div>
          ) : (
            <MovieList movies={movies} />
          )}
        </div>
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
      </div>
    </div>
  )
}

export default Home
