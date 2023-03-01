import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { HiOutlineSearch } from "react-icons/hi";
import { pipedApiUrl, tildaApiUrl } from "../utils/apiUrl";
import { useRouter } from "next/router";
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { useTheme } from "next-themes";
import { Jellyfin } from "@jellyfin/sdk";
import { useJellyfin } from "../hooks/handleJellyfin";
import { bgColourState } from "../atoms/colourState";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api";
import { sidebarWidthState } from "../atoms/sidebarAtom";

const Navbar = () => {
  const signOut = () => {
    localStorage.removeItem("serverUrl");
    localStorage.removeItem("userName");
    localStorage.removeItem("password");
    window.location.reload();
  };

  const { api, user, serverUrl } = useJellyfin();

  const [sidebarWidth, setSidebarWidth] = useRecoilState(sidebarWidthState);

  const [search, setSearch] = useState<string>("");
  const [searchRes, setSearchRes] = useState<any>();
  const [showSuggestions, setShowSuggestions] = useState<any>(false);
  const [mounted, setMounted] = useState(false);

  const [bgColour, setBgColour] = useRecoilState(bgColourState);

  const searchSuggestionsRef = useRef<any>();

  const getSearchSuggestions = (query: string) => {
    getItemsApi(api)
      .getItems({
        userId: user?.Id,
        searchTerm: query,
        limit: 5,
        recursive: true,
        enableTotalRecordCount: false,
        imageTypeLimit: 1,
        includeItemTypes: "Audio" as any,
      })
      .then((res) => {
        setSearchRes(res.data.Items);
      });
  };

  useEffect(() => {
    if (search) {
      getSearchSuggestions(search);
      setShowSuggestions(true);
    }
  }, [search]);

  const router = useRouter();

  const handleSearch = (e: any, item: any) => {
    e.preventDefault();
    setShowSuggestions(false);
    router.push(`/library/albums/${item?.AlbumId}?indexNumber=${item?.IndexNumber}`);
  };

  useEffect(() => {
    document.addEventListener("mousedown", (event) => {
      if (!searchSuggestionsRef?.current?.contains(event.target)) {
        setShowSuggestions(false);
      }
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const { theme, setTheme, resolvedTheme } = useTheme();

  console.log(searchRes);

  return (
    <div className="fixed z-10 w-full select-none border-b border-stone-100 dark:border-stone-800">
      <div className="flex flex-col relative"
        style={{
          marginLeft: sidebarWidth,
        }}
      >
        <div
          className={`relative flex h-[4.5rem] w-full flex-row items-center bg-white/75 pl-10 backdrop-blur-md 
        dark:bg-stone-900/50`}
        >
          <div className="relative w-6/12 rounded-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <HiOutlineSearch className="text-gray-500 dark:text-stone-100 sm:text-sm" />
            </div>
            <form>
              <input
                className="w-full rounded-md border border-stone-200 bg-stone-100 pl-8 pr-12 shadow-2xl shadow-amber-500/30 transition duration-300 ease-in-out hover:border-stone-300 hover:shadow-amber-500/50 focus:border-amber-500 focus:ring focus:ring-amber-200 active:bg-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:placeholder:text-stone-100 dark:hover:border-stone-600 dark:focus:border-amber-700 dark:focus:ring-amber-400/90 dark:active:bg-stone-900 sm:text-sm"
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <div className="pl-[17rem]">
              <div
                ref={searchSuggestionsRef}
                className="w-full absolute top-[3rem] left-0 rounded-lg"
              >
                {searchRes?.length > 0 &&
                search?.length > 0 &&
                showSuggestions ? (
                  <div className="flex w-full select-none flex-col gap-1 border bg-stone-100 py-3 dark:bg-stone-800 dark:border-stone-700 overflow-hidden rounded-lg text-stone-700 shadow-2xl shadow-amber-500/10 transition duration-300 ease-in-out hover:shadow-amber-500/20 dark:text-white">
                    {searchRes?.slice(0, 5)?.map((item: any, index: any) => (
                      <div
                        onClick={(e: any) => handleSearch(e, item)}
                        key={index}
                      >
                        <div className="flex flex-row items-center w-full cursor-pointer py-2 px-4 text-sm transition hover:bg-amber-400/20 hover:text-white active:bg-amber-400/10 active:text-white">
                          <img
                            src={
                              item?.ImageTags?.Primary
                                ? `${serverUrl}/Items/${item?.Id}/Images/Primary?maxHeight=100&tag=${item?.ImageTags?.Primary}&quality=90`
                                : "/images/album-placeholder.png"
                            }
                            className="w-8 h-8 rounded object-cover mr-2"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold">{item?.Name}</span>
                            <span className="text-stone-300 text-xs">
                              {item?.AlbumArtist}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {user?.Name ? (
            <button
              onClick={() => signOut()}
              className={`absolute right-10 m-3 mr-4 inline-flex h-8 items-center justify-center border border-stone-200 hover:border-stone-300 active:border-stone-300 dark:border-stone-700 dark:hover:border-stone-600 ${
                resolvedTheme == "light"
                  ? "bg-stone-100 active:bg-stone-300"
                  : resolvedTheme == "dark"
                  ? "bg-stone-800 active:bg-stone-700"
                  : "bg-stone-800 active:bg-stone-700"
              } gap-2 overflow-hidden rounded-full px-3 text-stone-800 shadow-xl shadow-amber-500/5 transition duration-300 ease-in-out hover:shadow-amber-500/10 dark:text-white dark:active:border-stone-600`}
            >
              <span className="text-[0.75rem]">{user?.Name}</span>
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                <span className="text-[0.6rem] font-normal text-white">
                  {user?.Name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>
          ) : (
            <button
              className={`absolute right-10 m-3 mr-4 h-8 w-8 border border-stone-200 hover:border-stone-300 active:border-stone-300 dark:border-stone-700 dark:hover:border-stone-600 dark:active:border-stone-600 ${
                resolvedTheme == "light"
                  ? "bg-stone-100 active:bg-stone-300"
                  : resolvedTheme == "dark"
                  ? "bg-stone-800 active:bg-stone-700"
                  : "bg-stone-800 active:bg-stone-700"
              } rounded-full p-1.5 shadow-xl shadow-amber-500/10 transition duration-300 ease-in-out hover:shadow-amber-300/20`}
            >
              <img src="/jellyfin.svg" alt="" />
            </button>
          )}
          <button
            onClick={() =>
              theme == "light"
                ? setTheme("dark")
                : theme == "dark"
                ? setTheme("system")
                : theme == "system"
                ? setTheme("light")
                : ""
            }
            className={`absolute right-0 m-3 mr-4 h-8 border border-stone-200 hover:border-stone-300 active:border-stone-300 dark:border-stone-700 dark:hover:border-stone-600 dark:active:border-stone-600 ${
              resolvedTheme == "light"
                ? "bg-stone-100 active:bg-stone-300"
                : resolvedTheme == "dark"
                ? "bg-stone-800 active:bg-stone-600"
                : "bg-stone-800 active:bg-stone-600"
            } rounded-full shadow-xl shadow-amber-500/10 transition duration-300 ease-in-out hover:shadow-amber-300/20`}
          >
            {theme == "light" ? (
              <SunIcon className="h-full w-full p-1.5 text-stone-700" />
            ) : theme == "dark" ? (
              <MoonIcon className="h-full w-full p-2 text-white" />
            ) : theme == "system" ? (
              <ComputerDesktopIcon
                className={`h-full w-full p-[7px] ${
                  resolvedTheme == "light"
                    ? "text-stone-700"
                    : resolvedTheme == "dark"
                    ? "text-white"
                    : "text-stone-700"
                }`}
              />
            ) : (
              ""
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
