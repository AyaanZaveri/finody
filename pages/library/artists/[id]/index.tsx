import { PlayIcon, PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MdExplicit } from "react-icons/md";
import { useRecoilState } from "recoil";
import { titleCase } from "title-case";
import Tilt from "react-parallax-tilt";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getAudioApi } from "@jellyfin/sdk/lib/utils/api/audio-api";
import { getUniversalAudioApi } from "@jellyfin/sdk/lib/utils/api/universal-audio-api";
import { useJellyfin } from "../../../../hooks/handleJellyfin";
import { fancyTimeFormat } from "../../../../utils/fancyTimeFormat";
import { HiClock } from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";
import {
  currentTrackState,
  playState,
} from "../../../../atoms/playState";
import { getConfigurationApi } from "@jellyfin/sdk/lib/utils/api/configuration-api";
import { PlayCommand } from "@jellyfin/sdk/lib/generated-client/models";
import { useFastAverageColor } from "../../../../hooks/useFastAverageColor";
import { getSongInfo } from "../../../../utils/getSongInfo";
import { bgColourState } from "../../../../atoms/colourState";
import { FastAverageColor } from "fast-average-color";

const LibraryArtist: NextPage = () => {
  const { query } = useRouter();
  const [tracksData, setTracksData] = useState<any>();
  const [artistInfo, setArtistInfo] = useState<any>();
  const [isExplicit, setIsExplicit] = useState<boolean>();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [srcLoaded, setSrcLoaded] = useState<boolean>(true);

  const [showCollapsedArtistInfo, setShowCollapsedArtistInfo] =
    useState<boolean>(false);

  const [songLoading, setSongLoading] = useState({
    id: "",
    loading: false,
  });

  const [isPlaying, setIsPlaying] = useRecoilState(playState);
  const [playingTrack, setPlayingTrack] = useRecoilState(currentTrackState);

  const [bgColor, setBgColor] = useRecoilState(bgColourState);

  const { api, user, data } = useJellyfin();
  // console.log("data", data);

  const [serverUrl, setServerUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setServerUrl(localStorage.getItem("serverUrl") || "");
    }
  }, []);

  const getItems = async () => {
    if (!api) return;
    const items = getItemsApi(api).getItems({
      userId: user?.Id,
      fields: ["Genres", "DateCreated", "MediaSources", "ParentId"] as any,
      parentId: query?.id as string,
      sortBy: "SortName" as any,
    });

    setTracksData((await items)?.data?.Items);
  };

  const getArtistInfo = async () => {
    if (!api) return;
    const info = getItemsApi(api).getItemsByUserId({
      userId: user?.Id,
      ids: query?.id as any,
      fields: ["Genres", "Overview"] as any,
    });

    setArtistInfo((await info)?.data?.Items![0]);
  };

  useEffect(() => {
    getItems();
    getArtistInfo();
  }, [api]);

  const imgUrl = `
  ${serverUrl}/Items/${artistInfo?.Id}/Images/Primary?maxHeight=400&tag=${artistInfo?.ImageTags?.Primary}&quality=90`;
  // console.log("imgUrl", imgUrl);

  useEffect(() => {
    if (!imgUrl) return;

    if (imgUrl) {
      setSrcLoaded(true);
    }
  }, [imgUrl]);

  const fac = new FastAverageColor();

  const getAverageColor = (url: string) => {
    const response = axios
      .get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((res) => {
        // console.log(res);
        fac
          .getColorAsync(res.request?.responseURL, {
            algorithm: "dominant",
            ignoredColor: [
              [255, 255, 255, 255, 55], // White
              [0, 0, 0, 255, 20], // Black
              [0, 0, 0, 0, 20], // Transparent
            ],
            mode: "speed",
          })
          .then((color) => {
            setBgColor(color.rgb);
          });
      });
    // setBgColor(color.rgb);
  };

  const router = useRouter();

  // console.log("artistInfo", artistInfo);

  return (
    <div className={`ml-3 pl-[17rem] pr-12`}>
      <div className="pt-[4.5rem] pb-24">
        <div
          style={{
            background: `linear-gradient(180deg, ${bgColor} 0%, rgba(0, 0, 0, 0) 100%)`,
          }}
          className="absolute top-[4.5rem] left-60 w-full h-full -z-10 opacity-25 dark:opacity-75"
        ></div>
        <div className="pt-16 w-full">
          <div className="flex w-full flex-row items-start gap-12">
            <div className="transition-all duration-1000 ease-in-out hover:scale-105">
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.8}
                glareColor="#ffffff"
                glarePosition="bottom"
                glareBorderRadius="12px"
              >
                {artistInfo ? (
                  <div className="h-[16.5rem] w-[16.5rem]">
                    <img
                      draggable={false}
                      className="select-none rounded-xl shadow-2xl shadow-emerald-500/30 ring-2 ring-slate-400/30 hover:ring-slate-400 transition-all duration-1000 ease-in-out hover:shadow-emerald-500/60"
                      src={`${serverUrl}/Items/${artistInfo?.Id}/Images/Primary?maxHeight=400&tag=${artistInfo?.ImageTags?.Primary}&quality=90`}
                      alt=""
                      // @ts-ignore
                      onLoad={(e) => getAverageColor(e.target.src)}
                    />
                  </div>
                ) : null}
              </Tilt>
            </div>
            <div className="flex select-none flex-col gap-3 pt-5 text-slate-700 dark:text-white">
              <span className="text-5xl font-bold break-words">
                {artistInfo ? artistInfo?.Name : null}
              </span>
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2"
                  onClick={(() => router.push(`/artist/${artistInfo?.AlbumArtistId}`))}
                >
                  <span className="text-xl text-emerald-500 dark:text-emerald-400 transition-colors duration-500 ease-in-out cursor-pointer hover:underline hover:decoration-emerald-500 active:text-emerald-600">
                    {artistInfo?.AlbumArtist}
                  </span>
                  {artistInfo?.ProductionYear ? (
                    <div className="inline-flex items-center gap-1 text-start text-sm font-normal bg-slate-800 text-white py-0.5 px-2.5 rounded-md shadow-lg w-min ring-1 ring-slate-700">
                      <span>{artistInfo?.ProductionYear}</span>
                    </div>
                  ) : null}
                </div>
                <div className="inline-flex items-center gap-2 text-lg font-medium mt-2">
                  {artistInfo ? (
                    <div className="flex flex-col">
                      <span className="text-emerald-500 dark:text-emerald-400">
                        {artistInfo?.ChildCount} Tracks
                      </span>
                      <span className="text-slate-600 dark:text-white">
                        {artistInfo?.RunTimeTicks
                          ? // convert runtimeticks to "x minutes, y seconds"
                            fancyTimeFormat(artistInfo?.RunTimeTicks / 10000000)
                          : null}
                      </span>
                    </div>
                  ) : null}
                </div>
                {artistInfo?.tracks ? (
                  <div className="mt-3 w-min">
                    <button
                      onClick={() => {
                        // setPlaylistSongs();
                        // setIsPlaying({
                        //   isPlaying: true,
                        //   type: "playlist",
                        //   id: albumBrowseId,
                        // });
                      }}
                      className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-1.5 text-sm text-white shadow-lg shadow-emerald-500/20 transition duration-300 ease-in-out hover:shadow-xl hover:shadow-emerald-500/30 active:bg-emerald-600"
                    >
                      <PlayIcon className="h-4 w-4" />
                      Play
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* displaying the tracks from albumData in a table */}
          {artistInfo ? (
            <div>
              <div className="mt-8 select-none">
                <div className="flex flex-row items-center justify-start gap-3">
                  <span className="text-2xl font-semibold text-slate-700 dark:text-white">
                    Tracks
                  </span>
                  <div className="flex flex-row items-center gap-2">
                    <button
                      onClick={() => {
                        // setPlaylistSongs();
                        // setIsPlaying({
                        //   isPlaying: true,
                        //   type: "playlist",
                        //   id: albumBrowseId,
                        // });
                      }}
                    >
                      <PlayIcon className="h-5 w-5 text-emerald-500" />
                    </button>
                    <button
                      onClick={() => {
                        // setPlaylistSongs();
                        // setIsPlaying({
                        //   isPlaying: true,
                        //   type: "playlist",
                        //   id: albumBrowseId,
                        // });
                      }}
                    ></button>
                  </div>
                </div>
                {/* map out the tracks from albumData */}
                <div className="mt-4 select-none">
                  <table cellPadding={14}>
                    <thead>
                      {/* add track number, title, duration, bit rate, plays  */}
                      <tr className="text-slate-700 dark:text-white">
                        <th className="text-center w-[5%]">Track</th>
                        <th className="text-left w-1/2">Title</th>
                        <th className="w-3/12">
                          <span className="flex flex-row items-center justify-center">
                            <HiClock className="w-5 h-5" />
                          </span>
                        </th>
                        <th className="text-left w-3/12">Bit Rate</th>
                        <th className="text-center w-3/12">Plays</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tracksData?.map((track: any, index: number) => (
                        <tr
                          key={index}
                          className="text-slate-700 select-none dark:text-white hover:bg-slate-100/50 dark:hover:bg-emerald-800/20 transition duration-500 ease-in-out active:bg-slate-200/50 dark:active:bg-emerald-800/40 hover:cursor-pointer backdrop-blur-md"
                          onClick={() => {
                            getSongInfo(
                              track,
                              api,
                              serverUrl,
                              setIsPlaying,
                              setPlayingTrack,
                              index
                            );
                          }}
                        >
                          <td className="text-center">{index + 1}</td>
                          <td className="text-left flex flex-row gap-4 items-center">
                            <img
                              src={`${serverUrl}/Items/${track?.Id}/Images/Primary?maxHeight=400&tag=${track?.ImageTags?.Primary}&quality=90`}
                              alt=""
                              className="h-10 w-10 rounded-md"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {track?.Name}
                              </span>
                              <span className="text-slate-600 dark:text-white">
                                {track?.AlbumArtist}
                              </span>
                            </div>
                            {songLoading.id == track?.Id &&
                            songLoading.loading ? (
                              <CgSpinner className="animate-spin h-5 w-5 text-emerald-500" />
                            ) : null}
                          </td>
                          <td className="text-center">
                            {track?.RunTimeTicks
                              ? new Date(track?.RunTimeTicks / 10000)
                                  .toISOString()
                                  .substr(15, 4)
                              : null}
                          </td>
                          <td className="text-left">
                            {track?.MediaSources
                              ? // convert bitrate to "x kbps"
                                `${(
                                  track?.MediaSources[0]?.Bitrate / 1000
                                ).toFixed(0)} kbps`
                              : null}
                          </td>
                          <td className="text-center">
                            {track?.UserData?.PlayCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LibraryArtist;
