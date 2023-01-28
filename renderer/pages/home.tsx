import React, { useEffect } from "react";
import Head from "next/head";
import { trpc } from "../src/utils/trpcNext";
import Navbar from "../components/NavBar";
import MovieList from "../components/MovieList";
import { useRouter } from "next/router";
import { SyncLoader } from "react-spinners";

function Home() {
  const {
    mutateAsync: getHomePage,
    data: homeMovies,
    isLoading: homeLoading,
  } = trpc.movie.getHomePage.useMutation();
  const {
    mutateAsync: getMovies,
    data: movies,
    isLoading,
  } = trpc.movie.getMovieByKeyword.useMutation();
  const router = useRouter();

  useEffect(() => {
    if (router?.query?.query) {
      getMovies({ query: router.query.query.toString() });
      console.log(router);
    } else {
      getHomePage();
    }
  }, [router.query]);

  return (
    <React.Fragment>
      <Head>
        <title>JiveMovies</title>
      </Head>
      <Navbar getMovies={getMovies} />
      <div className="bg-skin-main">
        <div className="flex min-h-screen">
          {isLoading || homeLoading ? (
            <div className="flex w-full justify-center items-center">
              <SyncLoader color="pink" size={30} />
            </div>
          ) : (
            <MovieList movies={router.query?.query ? movies : homeMovies} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
