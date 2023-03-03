import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HomeModernIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import {
  IoAlbums,
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
import { bgColourState } from "../atoms/colourState";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useJellyfin } from "../hooks/handleJellyfin";
import { sidebarWidthState } from "../atoms/sidebarAtom";

const Sidebar = () => {
  const router = useRouter();

  const [playingTrack, setPlayingTrack] = useRecoilState(currentTrackState);

  const { theme, setTheme, resolvedTheme } = useTheme();

  const [bgColour, setBgColour] = useRecoilState(bgColourState);

  const [playlists, setPlaylists] = useState<any>([]);

  const { api, user, serverUrl } = useJellyfin();

  const getPlaylistsData = async () => {
    if (api) {
      const items: any = await getItemsApi(api).getItemsByUserId({
        userId: user?.Id as any,
        recursive: true,
        excludeLocationTypes: "Virtual" as any,
        includeItemTypes: "Playlist" as any,
        sortBy: "SortName" as any,
        sortOrder: "Ascending" as any,
        startIndex: 0,
      });

      setPlaylists(items.data.Items);
    } else {
      console.log("no api, haha you suck lol");
    }
  };

  useEffect(() => {
    getPlaylistsData();
  }, [api]);

  console.log(playlists);

  const sidebarRef = useRef<any>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useRecoilState(sidebarWidthState);

  const startResizing = useCallback((mouseDownEvent: any) => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: any) => {
      if (isResizing) {
        setSidebarWidth(
          mouseMoveEvent.clientX -
            sidebarRef.current.getBoundingClientRect().left
        );
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", stopResizing);
      }
    };
  }, [resize, stopResizing]);

  console.log(sidebarWidth);

  const constrainSidebarWidth = (num: number) => {
    if (num < 240) {
      setSidebarWidth(240);
    }

    if (num > 400) {
      setSidebarWidth(400);
    }

    return num;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      constrainSidebarWidth(sidebarWidth);
    }
  }, [sidebarWidth]);

  return (
    <div className={`flex items-center h-full z-20 fixed select-none`}>
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
      <div
        className="border-r border-slate-100 dark:border-slate-800 to-emerald-500/20 h-full flex flex-col justify-start items-start"
        ref={sidebarRef}
        style={{ width: sidebarWidth }}
        onMouseDown={(e) => e.preventDefault()}
      >
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
              <IoAlbums className="w-4 h-4" />
              Albums
            </span>
          </div>
          <div
            onClick={() => router.push("/library/playlists")}
            className="relative mt-8 inline-flex w-full text-slate-700 dark:text-white hover:shadow-xl hover:text-white hover:shadow-emerald-500/30 items-center hover:bg-emerald-500 active:bg-emerald-600 py-1 break-all rounded-md px-4 transition duration-300 ease-in-out hover:cursor-pointer"
          >
            <span className="inline-flex gap-2 items-center transition-none">
              <IoDisc className="w-4 h-4" />
              Playlists
            </span>
          </div>
          {playlists.map((playlist: any) => (
            <div
              onClick={() => router.push(`/library/playlists/${playlist.Id}`)}
              key={playlist.Id}
              className="relative mt-1 hover:underline hover:decoration-2 hover:decoration-emerald-500 inline-flex w-full text-slate-700 dark:text-white hover:text-white items-center py-1 break-all rounded-md px-4 transition duration-300 ease-in-out hover:cursor-pointer"
            >
              <img
                src={`${serverUrl}/Items/${playlist.Id}/Images/Primary?maxHeight=100&maxWidth=100&tag=${playlist.ImageTags.Primary}&quality=90`}
                alt=""
                className="w-6 h-6 rounded mr-3"
              />
              <span className="inline-flex gap-2 items-center transition-none">
                {playlist.Name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`absolute top-0 h-full w-1 cursor-col-resize hover:bg-emerald-500 active:bg-emerald-600`}
        onMouseDown={startResizing}
        style={{ left: sidebarWidth }}
      ></div>
    </div>
  );
};

export default Sidebar;
