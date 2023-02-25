import axios from "axios";
import { Router, useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdExplicit } from "react-icons/md";
import { HiHeart, HiStar } from "react-icons/hi";
import { fancyTimeFormat } from "../utils/fancyTimeFormat";
import { titleCase } from "title-case";
import { pipedApiUrl } from "../utils/apiUrl";
import { useRecoilState } from "recoil";
import { PlayIcon } from "@heroicons/react/24/solid";

interface Props {
  track: any;
}

const Track = ({ track }: Props) => {
  return (
    <div
      onClick={() => {
        // getCurrentSong(track.videoId);
        // setIsPlaying({
        //   isPlaying: true,
        //   type: "track",
        // });
      }}
      key={track.videoId}
      className="group-one flex h-16 w-full flex-row items-center justify-between gap-3 rounded-md px-3 text-sm text-zinc-700 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-zinc-100 active:bg-zinc-200 dark:text-white dark:hover:bg-zinc-800 dark:active:bg-zinc-800 dark:active:ring-1 dark:active:ring-zinc-700"
    >
      <div className="flex flex-row gap-3">
        <div
          onClick={() => {
            // getCurrentSong(track.videoId);
            // setIsPlaying({
            //   isPlaying: true,
            //   type: "track",
            // });
          }}
          className="group-two relative flex cursor-pointer items-center justify-center overflow-hidden rounded-md transition-all"
        >
          <PlayIcon className="absolute z-10 ml-0.5 h-5 w-5 text-white opacity-0 transition-all duration-300 ease-in-out group-one-hover:opacity-100 group-one-active:opacity-100 group-two-active:brightness-90" />
          <img
            draggable={false}
            className="h-[2.5rem] w-[2.5rem] rounded-md transition duration-300 ease-in-out group-one-hover:scale-110 group-one-hover:blur-sm group-one-active:scale-110 group-one-active:blur-sm group-two-active:brightness-75"
            src={track?.thumbnails[1]?.url}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-row gap-3">
            <span className="inline-flex items-center gap-1 font-semibold">
              {track.title} {track.isExplicit ? <MdExplicit /> : null}
            </span>
          </div>
          <div className="overflow-hidden text-ellipsis">
            <span className="inline-flex items-center gap-1 overflow-hidden text-ellipsis">
              <span className="overflow-hidden text-ellipsis">
                {titleCase(track?.resultType)} ·{" "}
                {track?.artists.map((artist: any, index: number) => (
                  <span>{(index ? ", " : "") + artist?.name}</span>
                ))}{" "}
                &nbsp;· {track?.album?.name}
              </span>
              <HiHeart
                onClick={(e) => {
                  e.stopPropagation();
                }}
                // className={`w-50 h-4 ${
                //   checkIfFavoriteExists(track?.videoId as string)
                //     ? "text-amber-500 hover:text-amber-600 active:text-amber-700"
                //     : "text-zinc-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:hover:text-rose-500"
                // } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
              />
            </span>
          </div>
        </div>
      </div>
      <span className="flex font-medium">
        {fancyTimeFormat(track.duration_seconds)}
      </span>
    </div>
  );
};

export default Track;
