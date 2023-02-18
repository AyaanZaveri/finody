import { PlayIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdExplicit } from "react-icons/md";
import { useRecoilState } from "recoil";
import { titleCase } from "title-case";
import { currentPlaylistState } from "../atoms/playlistAtom";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import AlbumTrack from "../components/AlbumTrack";
import Navbar from "../components/Navbar";
import { pipedApiUrl, tildaApiUrl } from "../utils/apiUrl";
import { fancyTimeFormat } from "../utils/fancyTimeFormat";
import { axiosReq } from "../utils/axiosReq";
import { playingTrackState } from "../atoms/playingTrack";
import Tilt from "react-parallax-tilt";
import { getPlaylistSongs } from "../utils/getPlaylistSongs";

const Playlist: NextPage = () => {
  const { query } = useRouter();
  const listId = query.list;
  const [albumBrowseId, setAlbumBrowseId] = useState<number>();
  const [albumData, setAlbumData] = useState<any>();
  const [isExplicit, setIsExplicit] = useState<boolean>();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [currentPlaylist, setCurrentPlaylist] =
    useRecoilState(currentPlaylistState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  const [curPlay, setCurPlay] = useState<any>();

  const getAlbumBrowseId = () => {
    axios
      .get(`${tildaApiUrl}/albumBrowse/${listId}`)
      .then((res: any) => {
        setAlbumBrowseId(res.data);
      })
      .catch((err: any) => {});
  };

  const getAlbumData = () => {
    axios
      .get(`${tildaApiUrl}/album/${albumBrowseId}`)
      .then((res: any) => {
        setAlbumData(res.data);
      })
      .catch((err: any) => {});
  };

  const checkIsExplicit = () => {
    albumData?.tracks?.map((track: any) => {
      if (track?.isExplicit) {
        setIsExplicit(true);
      }
    });
  };

  useEffect(() => {
    getAlbumBrowseId();
  }, [listId]);

  useEffect(() => {
    getAlbumData();
  }, [albumBrowseId]);

  useEffect(() => {
    if (albumData) {
      checkIsExplicit();
    }
  }, [albumData]);

  const getAudioFromSong = async (videoId: string) => {
    const response = await axios.get(`${pipedApiUrl}/streams/${videoId}`);
    const data = response.data;
    return data?.audioStreams
      .filter((stream: any) => stream?.mimeType == "audio/mp4")
      .sort((a: any, b: any) =>
        a.bitrate < b.bitrate ? 1 : b.bitrate < a.bitrate ? -1 : 0
      )[0]?.url;
  };

  const getPlaylistSongs = async () => {
    setCurPlay([]);
    if (albumData?.tracks?.length >= 1) {
      await albumData?.tracks?.map(async (track: any, idx: number) => {
        const songUrl = await getAudioFromSong(track?.videoId);
        await setCurPlay((oldPlaylist: any) => [
          ...oldPlaylist,
          {
            ...track,
            track: {
              title: track?.title,
              thumbnails: albumData?.thumbnails,
              isExplicit: track?.isExplicit,
              artists: track?.artists,
            },
            trackNum: idx,
            url: songUrl,
          },
        ]);
      });
    }
  };

  const setPlaylistSongs = () => {
    try {
      setCurrentPlaylist(
        curPlay?.sort((a: any, b: any) =>
          a.trackNum > b.trackNum ? 1 : b.trackNum > a.trackNum ? -1 : 0
        )
      );
    } catch (error) {}
  };

  useEffect(() => {
    getPlaylistSongs();
  }, [albumData]);

  useEffect(() => {
    if (curPlay && curPlay != "undefined") {
      try {
        setCurrentPlaylist(
          curPlay?.sort((a: any, b: any) =>
            a.trackNum > b.trackNum ? 1 : b.trackNum > a.trackNum ? -1 : 0
          )
        );
      } catch (error) {}
    }
  }, [curPlay]);

  // console.log(currentPlaylist);

  return (
    <div
      className={`ml-3 pl-64 pr-12 ${
        playingTrack?.url?.length > 3 ? "pb-16" : ""
      }`}
    >
      <div className="pt-[4.5rem] pb-8">
        <div className="pt-8">
          <div className="flex w-full flex-row items-start gap-12">
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.8}
              glareColor="#ffffff"
              glarePosition="bottom"
              glareBorderRadius="12px"
            >
              {albumData?.thumbnails ? (
                <div className="h-[16.5rem] w-[16.5rem]">
                  <img
                    draggable={false}
                    className="select-none rounded-xl shadow-2xl shadow-emerald-500/20"
                    src={
                      albumData?.thumbnails[albumData?.thumbnails.length - 1]
                        ?.url
                    }
                    alt=""
                  />
                </div>
              ) : null}
            </Tilt>
            <div className="flex select-none flex-col gap-4 pt-3 text-slate-700 dark:text-white">
              <span className="text-4xl font-semibold">{albumData?.title}</span>
              <div className="flex flex-col">
                <div className="inline-flex items-center gap-2">
                  {isExplicit ? <MdExplicit /> : null}
                  {albumData ? (
                    <span>
                      {albumData?.type.trim()} ·{" "}
                      {albumData?.artists.map((artist: any, index: number) => (
                        <span>{(index ? ", " : "") + artist?.name}</span>
                      ))}{" "}
                      · {albumData?.year}
                    </span>
                  ) : null}
                </div>
                <div className="inline-flex items-center gap-2">
                  {albumData ? (
                    <span className="text-emerald-400">
                      {albumData?.trackCount} Tracks ·{" "}
                      {albumData?.duration
                        ? titleCase(albumData?.duration)
                        : null}
                    </span>
                  ) : null}
                </div>
                {showMore && albumData ? (
                  <div>
                    {albumData?.description ? (
                      <div>
                        <div
                          className="mt-3 text-slate-700 dark:text-white"
                          dangerouslySetInnerHTML={{
                            __html: albumData?.description?.replaceAll(
                              /\n/g,
                              "<br />"
                            ),
                          }}
                        />
                        <button
                          onClick={() => setShowMore(false)}
                          className="text-sm text-emerald-400 transition-colors duration-300 hover:text-emerald-500"
                        >
                          Show Less
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    {albumData?.description ? (
                      <div>
                        <div
                          className="mt-3 text-slate-700 line-clamp-2 dark:text-white"
                          dangerouslySetInnerHTML={{
                            __html: albumData?.description?.replaceAll(
                              /\n/g,
                              "<br />"
                            ),
                          }}
                        />
                        <button
                          onClick={() => setShowMore(true)}
                          className="text-sm text-emerald-400 transition-colors duration-300 ease-in-out hover:text-emerald-500"
                        >
                          Show More
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
                {albumData?.tracks ? (
                  <div className="mt-3 w-min">
                    <button
                      onClick={() => {
                        setPlaylistSongs();
                        setIsPlaying({
                          isPlaying: true,
                          type: "playlist",
                          id: albumBrowseId,
                        });
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
          <div className="mt-6 flex flex-col gap-1">
            {albumData?.tracks.map((track: any, index: number) => (
              <AlbumTrack
                thumbnails={albumData?.thumbnails}
                track={track}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;