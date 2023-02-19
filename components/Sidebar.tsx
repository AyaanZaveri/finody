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

const Sidebar = () => {
  const router = useRouter();

  const [playingTrack, setPlayingTrack] = useRecoilState(currentTrackState);

  return (
    <div
      className={`flex items-center ml-3 h-full pt-[4.5rem] 
      ${playingTrack?.url?.length > 3 ? "pb-24" : "pb-5"} 
      rounded-xl w-56 fixed select-none`}
    >
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl w-56 h-full flex flex-col justify-start items-start">
        <div className="px-2 pt-4 w-full flex flex-col gap-1">
          <div
            onClick={() => router.push("/")}
            className="relative inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-3 transition duration-300 ease-in-out hover:cursor-pointer"
          >
            <span className="inline-flex gap-2 items-center transition-none">
              <IoHome className="w-4 h-4" />
              Home
            </span>
          </div>
          <div
            onClick={() => router.push("/library")}
            className="relative inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-3 transition duration-300 ease-in-out hover:cursor-pointer"
          >
            <span className="inline-flex gap-2 items-center transition-none">
              <IoMusicalNotes className="w-4 h-4" />
              Library
            </span>
          </div>
          <div
            onClick={() => router.push("/library/artists")}
            className="relative inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-3 transition duration-300 ease-in-out hover:cursor-pointer"
          >
            <span className="inline-flex gap-2 items-center transition-none">
              <IoPeople className="w-4 h-4" />
              Artists
            </span>
          </div>
          <div
            onClick={() => router.push("/library/albums")}
            className="relative inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-3 transition duration-300 ease-in-out hover:cursor-pointer"
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
