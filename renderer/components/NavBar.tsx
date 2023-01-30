import React, { Dispatch, useEffect, useState } from "react";
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
import { ipcRenderer } from "electron";

type NavBarPropType = {
  setQuery?: Dispatch<string>;
  setPage?: Dispatch<number>;
};
const Navbar = ({ setQuery, setPage }: NavBarPropType) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
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
  const handleProfileClick = () => setShowProfileOptions(!showProfileOptions);

  useEffect(() => {
    function handleMessage(e, message) {
      setShowSearch((shown) => !shown);
    }
    ipcRenderer.on("hello", handleMessage);
    return () => {
      ipcRenderer.off("hello", handleMessage);
    };
  }, []);

  return (
    <nav
      className={
        "flex items-center justify-between bg-skin-secondary p-4 text-white "
      }
      ref={divRef}
    >
      {showProfileOptions ? (
        <div
          onClick={handleProfileClick}
          className="absolute h-screen right-0 left-0 top-0 bottom-0 w-full z-30"
        ></div>
      ) : null}
      <Link href="/home" className="w-10 h-10">
        <a href="/home" className={"font-bold text-white"}>
          <GiSharpSmile className="text-skin-like" size={40} />
        </a>
      </Link>
      <div className="flex items-center relative">
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
            onClick={handleProfileClick}
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
        {showProfileOptions ? (
          <div>
            <ul className="absolute top-20 right-12 z-40 border-[1px] rounded-sm border-white">
              {[
                { title: "My Movies", route: "/me/my-movies" },
                { title: "Settings", route: "/settings" },
                { title: "Log Out", route: "/logout" },
              ].map((item) => (
                <li
                  className="py-6 hover:bg-skin-main duration-150 cursor-pointer 
                text-center px-12 bg-skin-secondary"
                  key={item.title}
                >
                  <Link href={item.route}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
            autoFocus
            placeholder="Search..."
            onKeyDown={handleSearchSubmit}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
