import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Track from "../components/Track";
// import AudioPlayer from "../components/AudioPlayer";
import Artist from "../components/Artist";
import ReactAudioPlayer from "react-audio-player";
import "plyr-react/plyr.css";
import AudioPlayer from "react-h5-audio-player";
import {
  HiFastForward,
  HiPause,
  HiPlay,
  HiRewind,
  HiVolumeOff,
  HiVolumeUp,
} from "react-icons/hi";
import { MdExplicit } from "react-icons/md";
import { tildaApiUrl } from "../utils/apiUrl";
import Album from "../components/Album";
import Video from "../components/Video";
import Marquee from "react-fast-marquee";
import TopResult from "../components/TopResult";
import { useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/songAtom";
import { currentPlaylistState } from "../atoms/playlistAtom";
import { playingTrackState } from "../atoms/playingTrack";

const Search = () => {
  const { query } = useRouter();

  const [searchResults, setSearchResults] = useState<any>([]);
  const [topResults, setTopResults] = useState<any>([]);
  const [songs, setSongs] = useState<any>([]);
  const [albums, setAlbums] = useState<any>([]);
  const [videos, setVideos] = useState<any>([]);
  const [artists, setArtists] = useState<any>([]);
  const [communityPlaylists, setCommunityPlaylists] = useState<any>([]);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  const getSearchResults = () => {
    setSearchResults([]);
    setTopResults([]);
    setSongs([]);
    setArtists([]);
    setVideos([]);
    setAlbums([]);
    setCommunityPlaylists([]);

    if (query.q) {
      axios
        .get(`${tildaApiUrl}/search/all/${query.q}`)
        .then((res: any) => {
          setSearchResults(res.data);
        })
        .catch((err: any) => {});
    }
  };

  useEffect(() => {
    getSearchResults();
  }, [query.q]);

  useEffect(() => {
    if (searchResults) {
      searchResults?.map((result: any) => {
        if (result?.category == "Top result") {
          setTopResults((oldTopResults: any) => [
            ...oldTopResults,
            {
              ...result,
              type: result?.resultType,
            },
          ]);
        }
        if (result?.category == "Songs") {
          setSongs((oldSongs: any) => [
            ...oldSongs,
            {
              ...result,
              type: "track",
            },
          ]);
        }
        if (result?.category == "Albums") {
          setAlbums((oldAlbums: any) => [
            ...oldAlbums,
            {
              ...result,
              type: "album",
            },
          ]);
        }
        if (result?.category == "Videos") {
          setVideos((oldVideos: any) => [
            ...oldVideos,
            {
              ...result,
              type: "video",
            },
          ]);
        }
        if (result?.category == "Artists") {
          setArtists((oldArists: any) => [
            ...oldArists,
            {
              ...result,
              type: "artist",
            },
          ]);
        }
        if (result?.category == "Community playlists") {
          setCommunityPlaylists((oldCommunityPlaylists: any) => [
            ...oldCommunityPlaylists,
            {
              ...result,
              type: "communityPlaylist",
            },
          ]);
        }
      });
    }
  }, [searchResults]);

  return (
    <div>
      <div className="select-none pt-[4.5rem] pb-8">
        <div className="ml-3 flex justify-center pl-64 pt-2">
          <div
            className={`flex w-full flex-col gap-4 ${
              playingTrack?.url?.length > 3 ? "pb-16" : ""
            }`}
          >
            <div className="flex flex-row items-start pr-6">
              {topResults.length > 0 ? (
                <div className="flex w-3/4 flex-col justify-center gap-3">
                  <span className="w-full items-start justify-start text-2xl font-semibold text-slate-700 dark:text-white">
                    Top Result
                  </span>
                  {topResults?.map((result: any, index: number) => (
                    <TopResult result={result} key={index} />
                  ))}
                </div>
              ) : null}
              {songs.length > 0 ? (
                <div className="flex w-full flex-col justify-center gap-3">
                  <span className="w-min items-start justify-start text-2xl font-semibold text-slate-700 dark:text-white">
                    Tracks
                  </span>
                  <div className="flex flex-col gap-2">
                    {songs?.map((track: any, index: number) => (
                      <Track track={track} key={index} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {albums.length > 0 ? (
              <div className="flex flex-col justify-center gap-3">
                <span className="w-min items-start justify-start text-2xl font-semibold text-slate-700 dark:text-white">
                  Albums
                </span>
                <div className="flex flex-row flex-wrap gap-6">
                  {albums?.map((album: any, index: number) => (
                    <Album album={album} key={index} />
                  ))}
                </div>
              </div>
            ) : null}
            {videos.length > 0 ? (
              <div className="flex w-3/4 flex-col justify-center gap-3">
                <span className="w-min items-start justify-start text-2xl font-semibold text-slate-700 dark:text-white">
                  Videos
                </span>
                <div className="flex flex-col gap-2">
                  {videos?.map((video: any, index: number) => (
                    <Video video={video} key={index} />
                  ))}
                </div>
              </div>
            ) : null}
            {artists.length > 0 ? (
              <div className="flex w-3/4 flex-col justify-center gap-3">
                <span className="w-min items-start justify-start text-2xl font-semibold text-slate-700 dark:text-white">
                  Artists
                </span>
                <div className="flex flex-col gap-2">
                  {artists?.map((artist: any, index: number) => (
                    <Artist artist={artist} key={index} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
