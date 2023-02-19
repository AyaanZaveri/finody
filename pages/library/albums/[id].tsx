import { PlayIcon, PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdExplicit } from "react-icons/md";
import { useRecoilState } from "recoil";
import { titleCase } from "title-case";
import Tilt from "react-parallax-tilt";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getAudioApi } from "@jellyfin/sdk/lib/utils/api/audio-api";
import { getUniversalAudioApi } from "@jellyfin/sdk/lib/utils/api/universal-audio-api";
import { useJellyfin } from "../../../hooks/handleJellyfin";
import { fancyTimeFormat } from "../../../utils/fancyTimeFormat";
import { HiClock } from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";
import { currentTrackState, playState } from "../../../atoms/playState";
import { getConfigurationApi } from "@jellyfin/sdk/lib/utils/api/configuration-api";
import { PlayCommand } from "@jellyfin/sdk/lib/generated-client/models";

const LibraryAlbum: NextPage = () => {
  const { query } = useRouter();
  const [tracksData, setTracksData] = useState<any>();
  const [albumInfo, setAlbumInfo] = useState<any>();
  const [isExplicit, setIsExplicit] = useState<boolean>();
  const [showMore, setShowMore] = useState<boolean>(false);

  const [songLoading, setSongLoading] = useState({
    id: "",
    loading: false,
  });

  const [isPlaying, setIsPlaying] = useRecoilState(playState);
  const [playingTrack, setPlayingTrack] = useRecoilState(currentTrackState);

  const { api, user, data } = useJellyfin();
  console.log("data", data);

  const getConfig = async () => {
    if (!api) return;
    const config = getConfigurationApi(api).getConfiguration({
      userId: user?.Id,
    });

    console.log("config", await config);
  };

  getConfig();

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

  const getAlbumInfo = async () => {
    if (!api) return;
    const info = getItemsApi(api).getItemsByUserId({
      userId: user?.Id,
      ids: query?.id as any,
      fields: ["Genres", "DateCreated", "ChildCount"] as any,
    });

    setAlbumInfo((await info)?.data?.Items![0]);
  };

  useEffect(() => {
    getItems();
    getAlbumInfo();
  }, [api]);

  const getSongFile = async (track: any) => {
    if (!api) return;

    setIsPlaying(true);

    setSongLoading({
      id: track.Id,
      loading: true,
    });

    setPlayingTrack({
      id: track.Id,
      title: track.Name,
      artist: track.AlbumArtist,
      album: track.Album,
      duration: track.RunTimeTicks,
      cover: `${serverUrl}/Items/${track.Id}/Images/Primary?maxHeight=400&tag=${track.ImageTags?.Primary}&quality=90`,
      url: `
      ${serverUrl}/Audio/${track.Id}/stream.flac?Static=true&mediaSourceId=${track.Id}&deviceId=9aa38b20-8e58-48eb-bb32-b47e8704a6c5&api_key=91ebc1b9b4a54fbcbc41529ea4a6c4eb&Tag=e739c95d40de0dbce384fae600f72320&recursive=true
      `,
    });

    setSongLoading({
      id: track.Id,
      loading: false,
    });

    console.log("got em");
  };



  return (
    <div className={`ml-3 pl-64 pr-12`}>
      <div className="pt-[4.5rem] pb-24">
        <div className="pt-8 full">
          <div className="flex w-full flex-row items-start gap-12">
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.8}
              glareColor="#ffffff"
              glarePosition="bottom"
              glareBorderRadius="12px"
            >
              {albumInfo ? (
                <div className="h-[16.5rem] w-[16.5rem]">
                  <img
                    draggable={false}
                    className="select-none rounded-xl shadow-2xl shadow-emerald-500/20"
                    src={`${serverUrl}/Items/${albumInfo?.Id}/Images/Primary?maxHeight=400&tag=${albumInfo?.ImageTags?.Primary}&quality=90`}
                    alt=""
                  />
                </div>
              ) : null}
            </Tilt>
            <div className="flex select-none flex-col gap-3 pt-5 text-slate-700 dark:text-white">
              <span className="text-5xl font-bold break-words">
                {albumInfo ? albumInfo?.Name : null}
              </span>
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <span className="text-xl text-emerald-500 dark:text-emerald-400">
                    {albumInfo?.AlbumArtist}
                  </span>
                  {albumInfo?.ProductionYear ? (
                    <div className="inline-flex items-center gap-1 text-start text-sm font-normal bg-slate-700 text-white py-0.5 px-2.5 rounded-full w-min">
                      <span>{albumInfo?.ProductionYear}</span>
                    </div>
                  ) : null}
                </div>
                <div className="inline-flex items-center gap-2 text-lg font-medium mt-2">
                  {albumInfo ? (
                    <div className="flex flex-col">
                      <span className="text-emerald-500 dark:text-emerald-400">
                        {albumInfo?.ChildCount} Tracks
                      </span>
                      <span className="text-slate-600 dark:text-white">
                        {albumInfo?.RunTimeTicks
                          ? // convert runtimeticks to "x minutes, y seconds"
                            fancyTimeFormat(albumInfo?.RunTimeTicks / 10000000)
                          : null}
                      </span>
                    </div>
                  ) : null}
                </div>
                {albumInfo?.tracks ? (
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

          {/* display the tracks from albumData in a table */}
          {albumInfo ? (
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
                          className="text-slate-700 select-none dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200 ease-in-out rounded-xl active:bg-slate-200 dark:active:bg-slate-700 hover:cursor-pointer"
                          onClick={() => {
                            getSongFile(track);
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

export default LibraryAlbum;
