import NavBar from '../components/NavBar'
import { Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { trpc } from '@renderer/trpcClient'
import MoviePlayer from '@renderer/components/MoviePlayer'
import { useEffect } from 'react'

const MovieDetails = () => {
  const { movieId } = useParams()
  const { data: movieDetails, isLoading } = trpc.movies.getMovieById.useQuery({
    movieId
  })

  return (
    <div className="w-full min-h-screen bg-background text-white pb-48">
      <NavBar />
      <div className="flex flex-col items-center bg-background mt-16">
        {isLoading ? (
          <div className="flex w-full justify-center items-center">
            <Loader2 color="pink" size={30} />
          </div>
        ) : (
          <div className="bg-background flex flex-col items-center w-full">
            {isLoading || !movieDetails ? null : (
              <MoviePlayer
                dbEpisode={movieDetails?.userProgress?.episode?.toString()}
                dbSeason={movieDetails?.userProgress?.season?.toString()}
                isFavorite={movieDetails?.isFavorite ?? false}
                isTvShow={movieDetails.isTvShow}
                seasons={movieDetails.seasons.data}
                languages={movieDetails.languages.data}
              />
            )}
            <div className="flex justify-between w-4/5 min-h-[250px] pl-5 pt-5 ">
              <div className="w-64 relative">
                <img
                  className="object-contain"
                  src={
                    movieDetails?.posters?.data[400] ||
                    movieDetails?.posters?.data[200] ||
                    movieDetails?.poster
                  }
                />
              </div>
              <div className="flex flex-col w-3/5 mt-5">
                <h1 className="text-2xl font-medium">
                  {movieDetails?.secondaryName}
                </h1>
                <p className="text-base mt-5 w-4/5">
                  {
                    movieDetails?.plots?.data.find(
                      (item) => item.language === 'ENG'
                    )?.description
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetails
