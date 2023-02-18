import axios from "axios";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdExplicit } from "react-icons/md";
import { HiHeart } from "react-icons/hi";
import { fancyTimeFormat } from "../utils/fancyTimeFormat";
import { titleCase } from "title-case";

interface Props {
  artist: any;
}

const Artist = ({ artist }: Props) => {
  return (
    <div className="flex h-16 w-full flex-row transition-all ease-in-out justify-between duration-300 items-center gap-3 rounded-md px-3 text-sm text-slate-700 dark:text-white hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-800 dark:active:ring-1 dark:active:ring-slate-700 hover:cursor-pointer">
      <div className="flex flex-row gap-3">
        <div className="relative flex justify-center items-center overflow-hidden rounded-md group transition-all">
          <img
            draggable={false}
            className="w-[2.5rem] h-[2.5rem]"
            src={artist?.thumbnails[1]?.url}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-row gap-3">
            <span className="font-semibold inline-flex gap-1 items-center">
              {artist.artist}
            </span>
          </div>
          <div>
            <span className="font-normal">{titleCase(artist?.resultType)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artist;