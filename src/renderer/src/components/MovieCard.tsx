import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { trpc } from '@renderer/trpcClient'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useState } from 'react'

type MovieCardProps = {
  id: string | number
  title: string
  posterUrl: string
  overview: string
  isFavorite: boolean
}

const max_title_len = 25
const MovieCard = ({
  title,
  id,
  posterUrl,
  overview,
  isFavorite: defaultIsFav
}: MovieCardProps) => {
  const [isFavorite, setIsFavorite] = useState(defaultIsFav)
  const { mutateAsync: addToFavorites, isLoading } =
    trpc.movies.addFavoriteMovie.useMutation()
  const handleFavoriteClick = async () => {
    await addToFavorites({
      movieId: id.toString(),
      poster: posterUrl,
      title,
      isFavorite
    })
    setIsFavorite(!isFavorite)
  }
  return (
    <div className="flex justify-center mt-8">
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer 
       hover:animate-wiggle duration-300 flex flex-col items-center"
      >
        <h2 className="text-lg font-medium text-white text-center max-w-4/5 break-words">
          {title?.slice(0, max_title_len)}{' '}
          {title?.length >= max_title_len && '...'}
        </h2>
        <div className="relative">
          <Button
            variant="link"
            isLoading={isLoading}
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2"
          >
            {isFavorite ? (
              <HeartFilledIcon width={25} height={25} />
            ) : (
              <HeartIcon width={25} height={25} />
            )}
          </Button>
          <Link to={`/movie/${id}?season=1`}>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                height={400}
                width={250}
                className="w-full object-fill"
              />
            ) : null}
          </Link>
        </div>
        <div className="p-4">
          <p className="text-gray-500">{overview}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
