import axios from "axios";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdExplicit } from "react-icons/md";
import { HiHeart } from "react-icons/hi";
import { fancyTimeFormat } from "../utils/fancyTimeFormat";
import { titleCase } from "title-case";
import { pipedApiUrl, tildaApiUrl } from "../utils/apiUrl";
import { useRecoilState } from "recoil";
import { PlayIcon } from "@heroicons/react/24/solid";

interface Props {
  video: any;
}

const Video = ({ video }: Props) => {
  return (
    <div
      key={video.videoId}
      className="group-one flex h-16 w-full flex-row items-center justify-between gap-3 rounded-md px-3 text-sm text-stone-700 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-stone-100 active:bg-stone-200 dark:text-white dark:hover:bg-stone-800 dark:active:bg-stone-800 dark:active:ring-1 dark:active:ring-stone-700"
      id={video.videoId}
    >
      <div className="flex flex-row gap-3">
        <div
          // onClick={() => getCurrentSong(video.videoId, "video")}
          className="group-two relative flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-amber-200 transition-all dark:bg-amber-700"
        >
          <PlayIcon className="absolute z-10 ml-0.5 h-5 w-5 text-white opacity-0 transition-all duration-300 ease-in-out group-one-hover:opacity-100 group-one-active:opacity-100 group-two-active:brightness-90" />
          <img
            draggable={false}
            className="h-auto w-12 transition duration-300 ease-in-out group-hover:scale-110 group-hover:blur-sm group-active:blur-sm group-one-hover:scale-110 group-one-hover:blur-sm group-one-active:scale-110 group-one-active:blur-sm group-two-active:brightness-75"
            src={video?.thumbnails[0]?.url}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-row gap-3">
            <span className="inline-flex items-center gap-1 font-semibold">
              {video.title} {video.isExplicit ? <MdExplicit /> : null}
            </span>
          </div>
          <div>
            <span className="inline-flex items-center gap-1 font-normal">
              {titleCase(video?.resultType)} ·{" "}
              {video?.artists.map((artist: any, index: number) => (
                <span>{(index ? ", " : "") + artist?.name}</span>
              ))}{" "}
              <HiHeart
                // onClick={handleFavorited}
                // className={`w-50 h-4 ${
                //   checkIfFavoriteExists(video?.videoId as string)
                //     ? "text-amber-500 hover:text-amber-600 active:text-amber-700"
                //     : "text-stone-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:hover:text-rose-500"
                // } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
