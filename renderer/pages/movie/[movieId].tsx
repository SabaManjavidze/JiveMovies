import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import { trpc } from "../../src/utils/trpcNext";
import { FaBars } from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Episode } from "../../src/utils/types";
import Image from "next/image";

interface MovieProps {
  title: string;
  poster: string;
  description: string;
}

const Movie = ({ title, poster, description }: MovieProps) => {
  const router = useRouter();
  const { data: movieDetails, isFetching } = trpc.movie.getMovieById.useQuery({
    movieId: router.query?.movieId + "",
  });
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [video, setVideo] = useState("");
  const [divRef] = useAutoAnimate<HTMLDivElement>();

  const {
    data: episodes,
    mutateAsync: getEpisodes,
    isLoading: epsFetching,
  } = trpc.movie.getEpisodes.useMutation();
  const getVideoFromEpisode = (ep: number | string, episodes: Episode[]) => {
    const episode = episodes.find(({ episode }) => episode == ep);
    const engFile = episode?.files.find((file) => file.lang === "ENG");
    const highRes = engFile?.files.find((file) => file.quality === "HIGH");
    return highRes;
  };

  const handleEpisodeClick = (id: number | string) => {
    const highRes = getVideoFromEpisode(id, episodes);
    setVideo(highRes?.src);
    router.push(
      {
        pathname: router.asPath,
        query: { episode: id, season: router.query?.season || 1 },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (!isFetching) {
      // if (movieDetails.isTvShow) {
      getEpisodes({
        movieId: router.query?.movieId + "",
        season: router.query?.season?.toString() || "1",
      }).then((res) => {
        const highRes = getVideoFromEpisode(
          router.query?.episode?.toString() || 0,
          res
        );
        setVideo(highRes?.src);
      });
      // }
    }
  }, [isFetching, router.query]);

  return (
    <div className="w-full min-h-screen bg-skin-main text-white pb-48">
      <NavBar />
      <div className="flex flex-col items-center bg-skin-main">
        {isFetching && !movieDetails ? (
          <h1 className="text-white">loading...</h1>
        ) : (
          <div className="bg-skin-main" ref={divRef}>
            <div className="relative">
              <video className="w-full" src={video} controls />
              <button
                className="absolute top-0 right-0 p-2 z-10"
                onClick={() => setShowEpisodes(!showEpisodes)}
              >
                <FaBars />
              </button>
              {showEpisodes && (
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-800/50 backdrop-blur-sm text-white p-4">
                  <h2 className="text-2xl font-medium">Episodes</h2>
                  <ul className="mt-8 ">
                    {epsFetching ? (
                      <h2>Episodes Loading...</h2>
                    ) : (
                      episodes?.map((episode, index) => (
                        <li
                          key={index}
                          className="text-xl py-2 cursor-pointer"
                          onClick={() => handleEpisodeClick(episode.episode)}
                        >
                          <h3>{episode.title}</h3>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-between pl-5 pt-5">
              <div className="w-64 h-90 relative">
                <Image
                  layout="fill"
                  className="object-contain"
                  src={
                    movieDetails?.poster ||
                    movieDetails.posters?.data[400] ||
                    movieDetails.posters?.data[200]
                  }
                  alt={title}
                />
              </div>
              <div className="flex flex-col w-3/5 mt-5">
                <h1 className="text-2xl font-medium">
                  {movieDetails.secondaryName}
                </h1>
                <p className="text-base mt-5 w-4/5">
                  {
                    movieDetails.plots?.data.find(
                      (item) => item.language === "ENG"
                    ).description
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movie;
