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

const Artist = (artist: any) => {

  const router = useRouter();

  return (
    <div className="group-one relative flex h-[13rem] w-full cursor-pointer flex-col justify-center rounded-xl bg-white ring-1 ring-slate-100 transition duration-300 ease-in-out hover:bg-slate-100 active:ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-1 dark:ring-slate-800 dark:hover:bg-slate-800 dark:active:ring-slate-700">
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
              className="z-10 h-[5.25rem] w-[5.25rem] rounded-lg"
              src={
                ""
              }
              alt=""
            />
          </Tilt>
        </div>
        <div className="flex flex-col justify-center gap-1.5">
          <div className="flex flex-row">
            <span className="inline-flex items-center gap-1 text-3xl font-semibold text-slate-700 decoration-emerald-500 transition duration-300 ease-in-out hover:underline dark:text-white">
              "artistName"
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="rounded-full bg-slate-700 px-3 py-0.5 text-xs font-normal text-white">
              "artistInfoType"
            </span>
            <HiHeart
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`h-4 w-4 ${
                true
                  ? "text-emerald-500 hover:text-emerald-600 active:text-emerald-700"
                  : "text-slate-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:hover:text-rose-500 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:text-white dark:hover:text-rose-500 dark:active:text-rose-600"
              } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
            />
          </div>
        </div>
      </div>
      <button className="absolute right-0 bottom-0 m-4 rounded-full bg-emerald-500 p-3 text-white opacity-0 transition duration-300 ease-in-out hover:bg-emerald-600 active:bg-emerald-700 group-one-hover:opacity-100 group-one-active:opacity-100">
        <PlayIcon className="ml-0.5 h-6 w-6" />
      </button>
    </div>
  );
};

export default Artist;
