import React from 'react'
import MovieCard from './MovieCard'
import { AdjaraMovie } from '@renderer/lib/types/movieTypes'
import { RouterOutput } from 'src/api/main.router'

interface MovieListProps {
  movies:
    | RouterOutput['movies']['getMoviesByKeyword']
    | RouterOutput['movies']['getFavoriteMovies']
}

const MovieList = ({ movies }: MovieListProps) => {
  return (
    <div
      className="grid w-full px-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-0 
    mt-5"
    >
      {movies?.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.secondaryName}
          isFavorite={movie.isFavorite}
          posterUrl={
            movie.posters?.data[400] ||
            movie.posters?.data[200] ||
            movie?.poster
          }
          overview={`IMDB : ${movie.rating?.imdb?.score || 'Unknown'}`}
        />
      ))}
    </div>
  )
}

export default MovieList
