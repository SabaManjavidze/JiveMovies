import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import { trpc } from "../../src/utils/trpcNext";
import { FaBars } from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Episode } from "../../src/utils/types";
import Image from "next/image";
import Head from "next/head";
import { SyncLoader } from "react-spinners";

interface MovieProps {
  title: string;
  poster: string;
  description: string;
}

const Movie = ({ title, poster, description }: MovieProps) => {
  const router = useRouter();
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [video, setVideo] = useState("");
  const [divRef] = useAutoAnimate<HTMLDivElement>();

  const { data: movieDetails, isFetching } = trpc.movie.getMovieById.useQuery({
    movieId: router.query?.movieId + "",
  });

  const { data: episodes, isLoading: epsFetching } =
    trpc.movie.getEpisodes.useQuery({
      movieId: router.query?.movieId?.toString(),
      season: router.query?.season?.toString() || "1",
    });

  const getVideoFromEpisode = (ep: number | string, episodes: Episode[]) => {
    const episode = episodes[ep];
    const engFile = episode?.files.find((file) => file.lang === "ENG");
    const highRes = engFile?.files.find((file) => file.quality === "HIGH");
    return highRes;
  };
  const handleSeasonClick = (season: number | string) => {
    router.replace(
      {
        pathname: `/movie/${router.query.movieId}`,
        query: {
          episode: router.query?.episode || 1,
          season: season,
        },
      },
      undefined,
      { shallow: true }
    );
  };
  const handleEpisodeClick = (id: number | string) => {
    const highRes = getVideoFromEpisode(id, episodes);
    setVideo(highRes?.src);
    router.push(
      {
        pathname: `/movie/${router.query.movieId}`,
        query: {
          episode: id,
          season: router.query?.season || 1,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (!epsFetching) {
      console.log(parseInt(router.query?.episode?.toString()) || 0);
      const highRes = getVideoFromEpisode(
        parseInt(router.query?.episode?.toString()) || episodes[0]?.episode,
        episodes
      );
      setVideo(highRes?.src);
    }
  }, [epsFetching, router.query]);

  return (
    <div className="w-full min-h-screen bg-skin-main text-white pb-48">
      <Head>
        <title>{movieDetails?.secondaryName} - Jive Movies</title>
      </Head>
      <NavBar />
      <div className="flex flex-col items-center bg-skin-main mt-16">
        {isFetching && !movieDetails ? (
          <div className="flex w-full justify-center items-center">
            <SyncLoader color="pink" size={30} />
          </div>
        ) : (
          <div className="bg-skin-main flex flex-col items-center w-full">
            <div
              className="relative w-4/5  flex justify-center bg-black"
              ref={divRef}
            >
              <video className="focus:outline-none" src={video} controls />
              {movieDetails.isTvShow ? (
                <button
                  className="absolute top-0 right-0 p-5 z-10"
                  onClick={() => setShowEpisodes(!showEpisodes)}
                >
                  <FaBars size={40} />
                </button>
              ) : null}
              {movieDetails.isTvShow && showEpisodes && (
                <div className="absolute top-0 right-0 w-1/3 max-h-full overflow-y-scroll bg-gray-800/50 backdrop-blur-sm text-white p-4">
                  <h2 className="text-2xl font-medium">Seasons</h2>
                  <ul className="mt-8 flex">
                    {epsFetching ? (
                      <h2>Seasons Loading...</h2>
                    ) : (
                      movieDetails.seasons.data?.map((season, index) => (
                        <li
                          key={index}
                          className={`text-xl py-2 cursor-pointer p-3 mx-1 
                          ${
                            router.query?.season == season.number + ""
                              ? "bg-skin-submit-btn"
                              : "bg-skin-secondary"
                          }`}
                          onClick={() => handleSeasonClick(season.number)}
                        >
                          <h3>{season.number}</h3>
                        </li>
                      ))
                    )}
                  </ul>
                  <h2 className="text-2xl font-medium mt-5">Episodes</h2>
                  <ul className="mt-8 ">
                    {epsFetching ? (
                      <h2>Episodes Loading...</h2>
                    ) : (
                      episodes &&
                      episodes?.map((episode, index) => (
                        <li
                          key={index}
                          className={`text-xl py-4 cursor-pointer border-t-[1px]
                          ${
                            router.query?.episode == episode.episode + "" &&
                            "bg-skin-submit-btn/40"
                          }`}
                          onClick={() => handleEpisodeClick(episode.episode)}
                        >
                          <h3 className="pl-5">
                            {episode.episode}. {episode.title}
                          </h3>
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
                    )?.description
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
