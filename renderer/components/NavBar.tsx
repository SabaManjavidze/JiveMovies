import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { GiSharpSmile } from "react-icons/gi";
import Link from "next/link";
import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RouterInputs } from "../src/server/router/router";
import { useRouter } from "next/router";

type NavBarPropType = {
  getMovies?: ({}: RouterInputs["movie"]["getMovieByKeyword"]) => {};
};
const Navbar = ({ getMovies }: NavBarPropType) => {
  const [showSearch, setShowSearch] = useState(false);
  const [divRef] = useAutoAnimate<HTMLDivElement>();
  const router = useRouter();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && getMovies) {
      const query = e.currentTarget.value;
      getMovies({ query });
      router.push({ pathname: router.pathname, query: { query } });
    }
  };
  return (
    <nav
      className={
        "flex relative items-center justify-between bg-skin-secondary p-4"
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
          <a className="mr-4 text-white hover:text-gray-600">Home</a>
        </Link>
        <Link href="/favorite-movies">
          <a className="mr-4 text-white hover:text-gray-600">Favorite Movies</a>
        </Link>
        <button className="flex items-center px-2 py-1 rounded-full text-white bg-gray-900 hover:bg-gray-800">
          <Image
            src="https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg"
            alt="User"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="ml-2 text-xs">Gela</span>
        </button>
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
