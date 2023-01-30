import React from "react";
import Image from "next/image";
import Link from "next/link";

type MovieCardProps = {
  id: string | number;
  title: string;
  posterUrl: string;
  overview: string;
};

const max_title_len = 25;
const MovieCard = ({ title, id, posterUrl, overview }: MovieCardProps) => {
  return (
    <div className="flex justify-center mt-8">
      <Link href={`/movie/${id}?season=1`}>
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer 
       hover:animate-wiggle duration-300 flex flex-col items-center"
        >
          <h2 className="text-lg font-medium text-white text-center max-w-4/5 break-words">
            {title?.slice(0, max_title_len)}{" "}
            {title?.length >= max_title_len && "..."}
          </h2>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              height={400}
              width={250}
              className="w-full object-cover"
              quality={80}
            />
          ) : null}
          <div className="p-4">
            <p className="text-gray-500">{overview}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
