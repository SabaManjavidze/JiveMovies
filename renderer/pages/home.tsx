import React, { useEffect } from "react";
import Head from "next/head";
import { trpc } from "../src/utils/trpcNext";
import Navbar from "../components/NavBar";
import MovieList from "../components/MovieList";
import { useRouter } from "next/router";

function Home() {
  const { mutateAsync: getMovies, data: movies } =
    trpc.movie.getMovieByKeyword.useMutation();
  const router = useRouter();

  useEffect(() => {
    if (router?.query?.query) {
      getMovies({ query: router.query.query.toString() });
      console.log(router);
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
          <MovieList movies={movies} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
