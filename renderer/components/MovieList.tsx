import React from "react";
import { AdjaraMovie, Movie } from "../src/utils/types";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
}

const MovieList = ({ movies }: MovieListProps) => {
  return (
    <div
      className="grid w-full px-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-0 
    mt-5"
    >
      {movies?.map((movie) => (
        <MovieCard
          key={movie.slug}
          id={movie.slug}
          title={movie.title}
          posterUrl={movie.thumbnail_url}
          overview={"No description"}
        />
      ))}
    </div>
  );
};

export default MovieList;
