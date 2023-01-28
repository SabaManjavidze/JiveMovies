import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { trpc } from "../src/utils/trpcNext";
import Navbar from "../components/NavBar";
import MovieList from "../components/MovieList";
import { useRouter } from "next/router";
import { SyncLoader } from "react-spinners";

function Home() {
  const router = useRouter();
  const [currPage, setPage] = useState(
    parseInt(router.query?.page?.toString()) || 1
  );
  const [query, setQuery] = useState<string>(
    router.query?.query?.toString() || ""
  );

  const { data: movies, isFetching } = trpc.movie.getMovieByKeyword.useQuery({
    page: currPage.toString(),
    query: query || router.query?.query?.toString(),
  });

  const arr = useMemo(() => {
    if (currPage > 2) {
      return [1, currPage - 1, currPage, currPage + 1, currPage + 9];
    } else {
      return [1, 2, 3, 10];
    }
  }, [currPage]);

  return (
    <div>
      <Head>
        <title>JiveMovies</title>
      </Head>
      <Navbar setQuery={setQuery} setPage={setPage} />
      <div className="bg-skin-main pb-20 text-white">
        <div className="py-12 border-b-[1px] border-white">
          <h1 className="flex text-3xl ml-6">
            <p>Search Results For:</p>
            <p className="text-light-primary ml-5"> "{router.query?.query}"</p>
          </h1>
        </div>
        <div className="flex min-h-screen mt-20">
          {isFetching ? (
            <div className="flex w-full justify-center items-center">
              <SyncLoader color="pink" size={30} />
            </div>
          ) : (
            <MovieList movies={movies} />
          )}
        </div>
        <div>
          <ul className="mt-12 w-full flex justify-center">
            {arr.map((page, i, arr) => {
              return (
                <li
                  key={page}
                  className={`text-white text-xl ${
                    page === currPage
                      ? "bg-skin-submit-btn/20"
                      : "bg-skin-secondary"
                  }
                   py-2 px-4 text-center border-primary border-[1px] mx-1 cursor-pointer
                  duration-100 hover:scale-105 ${
                    currPage > 2 && i == 0 && "mr-12"
                  }
                    ${i === arr.length - 1 && "ml-12"}`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    router.replace(
                      {
                        pathname: router.pathname,
                        query: {
                          page: currPage,
                          query: router.query?.query,
                        },
                      },
                      undefined,
                      { shallow: true }
                    );
                    setPage(page);
                  }}
                >
                  {page}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
