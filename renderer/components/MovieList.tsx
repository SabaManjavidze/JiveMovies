import React from "react";
import { AdjaraMovie, Movie } from "../src/utils/types";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: AdjaraMovie[];
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
          posterUrl={
            movie.posters?.data[400] ||
            movie.posters?.data[200] ||
            movie?.poster
          }
          overview={`IMDB : ${movie.rating?.imdb?.score || "Unknown"}`}
        />
      ))}
    </div>
  );
};

export default MovieList;
