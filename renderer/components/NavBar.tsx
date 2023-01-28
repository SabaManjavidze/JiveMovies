import React, { Dispatch, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { GiSharpSmile } from "react-icons/gi";
import Link from "next/link";
import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RouterInputs } from "../src/server/router/router";
import { useRouter } from "next/router";
import { trpc } from "../src/utils/trpcNext";
import { EMPTY_IMAGE } from "../src/utils/constants";
import { SyncLoader } from "react-spinners";

type NavBarPropType = {
  setQuery?: Dispatch<string>;
  setPage?: Dispatch<number>;
};
const Navbar = ({ setQuery, setPage }: NavBarPropType) => {
  const [showSearch, setShowSearch] = useState(false);
  const [divRef] = useAutoAnimate<HTMLDivElement>();
  const router = useRouter();
  const { data: user, isFetching } = trpc.user.me.useQuery();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      const query = e.currentTarget.value;
      setQuery(query);
      setPage(1);
      setShowSearch(false);
      router.push({ pathname: router.pathname, query: { query, page: 1 } });
    }
  };
  return (
    <nav
      className={
        "flex relative items-center justify-between bg-skin-secondary p-4 text-white "
      }
      ref={divRef}
    >
      <Link href="/home?query=" className="w-10 h-10">
        <a href="/home?query=haha" className={"font-bold text-white"}>
          <GiSharpSmile className="text-skin-like" size={40} />
        </a>
      </Link>
      <div className="flex items-center">
        <Link href="/">
          <a className="mr-4 text-skin-base duration-150 hover:text-white">
            Home
          </a>
        </Link>
        <Link href="/favorite-movies">
          <a className="mr-4 text-skin-base duration-150 hover:text-white">
            Favorite Movies
          </a>
        </Link>
        {isFetching ? (
          <SyncLoader color="pink" size={10} />
        ) : user ? (
          <button
            className="flex items-center px-2 py-1 rounded-full text-white bg-gray-900
          duration-300 hover:bg-gray-700"
          >
            <Image
              src={user.picture || EMPTY_IMAGE}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="ml-2 text-xl">{user.username}</span>
          </button>
        ) : (
          <Link href="/login">
            <a className="text-skin-like">Log In</a>
          </Link>
        )}
        <button
          className="ml-4 px-2 py-1 rounded-full text-white bg-gray-900 hover:bg-gray-800"
          onClick={() => setShowSearch(!showSearch)}
        >
          <FaSearch />
        </button>
      </div>
      {showSearch && (
        <div className="z-10 bg-skin-secondary absolute top-36 w-4/5 left-1/2 -translate-x-1/2 rounded-lg p-6 mt-2">
          <input
            className="border-2 border-gray-600 rounded-lg p-1 w-full focus:outline-none 
            focus:border-skin-input-field duration-300 bg-gray-700 text-white"
            type="text"
            placeholder="Search..."
            onKeyDown={handleSearchSubmit}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
