import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { pipedApiUrl, tildaApiUrl } from "../../utils/apiUrl";
import { resourceLimits } from "worker_threads";
import Tilt from "react-parallax-tilt";
import { titleCase } from "title-case";
import { HiHeart } from "react-icons/hi";
import { PlayIcon } from "@heroicons/react/24/solid";

const Album = (album: any) => {
  const [albumInfo, setAlbumInfo] = useState(album?.album);

  return (
    <div
      // onClick={() =>
      //   router.push(`/playlist?list=${albumData?.audioPlaylistId}`)
      // }
      className="group-one relative flex h-[13rem] w-full cursor-pointer flex-col justify-center rounded-xl bg-white ring-1 ring-stone-100 transition duration-300 ease-in-out hover:bg-stone-100 active:ring-stone-200 dark:bg-stone-900 dark:text-white dark:ring-1 dark:ring-stone-800 dark:hover:bg-stone-800 dark:active:ring-stone-700"
    >
      <div className="relative flex flex-col gap-5 px-6">
        <div className="flex items-center justify-start rounded-md">
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.8}
            glareColor="#ffffff"
            glarePosition="bottom"
            glareBorderRadius="8px"
          >
            <img
              draggable={false}
              className="z-10 w-[5.25rem] rounded-lg"
              src={
                albumInfo?.thumbnails[albumInfo?.thumbnails?.length - 1]?.url
              }
              alt=""
            />
          </Tilt>
        </div>
        <div className="flex flex-col justify-start gap-1.5">
          <div className="flex flex-row">
            <span className="inline-flex gap-1 text-3xl font-semibold text-stone-700 decoration-amber-500 transition duration-300 ease-in-out hover:underline dark:text-white">
              {albumInfo.title}
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="rounded-full bg-stone-700 px-3 py-0.5 text-xs font-normal text-white">
              {titleCase(albumInfo?.type)}
            </span>
            <HiHeart
              onClick={(e) => {
                // e.stopPropagation();
                // handleFavorited();
              }}
              // className={`h-4 w-4 ${
              //   checkIfFavoriteExists(albumInfo?.album?.browseId as string)
              //     ? "text-amber-500 hover:text-amber-600 active:text-amber-700"
              //     : "text-stone-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:hover:text-rose-500 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:text-white dark:hover:text-rose-500 dark:active:text-rose-600"
              // } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
            />
          </div>
        </div>
      </div>
      <button className="absolute right-0 bottom-0 m-4 rounded-full bg-amber-500 p-3 text-white opacity-0 transition duration-300 ease-in-out hover:bg-amber-600 active:bg-amber-700 group-one-hover:opacity-100 group-one-active:opacity-100">
        <PlayIcon className="ml-0.5 h-6 w-6" />
      </button>
    </div>
  );
};

export default Album;
