import { useRouter } from "next/router";
import React from "react";
import { HomeModernIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import {
  IoDisc,
  IoHome,
  IoMusicalNotes,
  IoPeople,
  IoPerson,
} from "react-icons/io5";
import { SiJellyfin } from "react-icons/si";
import { useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/playState";
import { useTheme } from "next-themes";

const Sidebar = () => {
  const router = useRouter();

  const [playingTrack, setPlayingTrack] = useRecoilState(currentTrackState);

const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div
      className={`flex items-center h-full z-20 backdrop:w-56 fixed select-none`}
    >
      <img
        draggable="false"
        onClick={() => router.push("/")}
        src={`${
          resolvedTheme == "dark"
            ? "/FinodyLogoDark.svg"
            : resolvedTheme == "light"
            ? "/FinodyLogoLight.svg"
            : "/FinodyLogoDark.svg"
        }`}
        className="absolute left-3 top-0 block h-16 select-none py-4 mt-1 pl-2 hover:cursor-pointer"
        alt=""
      />
      <div className="border-r border-slate-100 dark:border-slate-800 w-60 h-full flex flex-col justify-start items-start">
        <div className="px-2 w-full flex flex-col gap-1 pt-24">
          <div
            onClick={() => router.push("/")}
            className="relative inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-4 transition duration-300 ease-in-out hover:cursor-pointer"
          >
            <span className="inline-flex gap-2 items-center transition-none">
              <IoHome className="w-4 h-4" />
              Home
            </span>
          </div>
          <div
            onClick={() => router.push("/library")}
            className="relative inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-4 transition duration-300 ease-in-out hover:cursor-pointer"
          >
            <span className="inline-flex gap-2 items-center transition-none">
              <IoMusicalNotes className="w-4 h-4" />
              Library
            </span>
          </div>
          <div
            onClick={() => router.push("/library/artists")}
            className="relative inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-4 transition duration-300 ease-in-out hover:cursor-pointer"
          >
            <span className="inline-flex gap-2 items-center transition-none">
              <IoPeople className="w-4 h-4" />
              Artists
            </span>
          </div>
          <div
            onClick={() => router.push("/library/albums")}
            className="relative inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-4 transition duration-300 ease-in-out hover:cursor-pointer"
          >
            <span className="inline-flex gap-2 items-center transition-none">
              <IoDisc className="w-4 h-4" />
              Albums
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
