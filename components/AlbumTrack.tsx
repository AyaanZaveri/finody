import axios from "axios";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdExplicit } from "react-icons/md";
import { HiHeart } from "react-icons/hi";
import { fancyTimeFormat } from "../utils/fancyTimeFormat";
import { titleCase } from "title-case";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import { pipedApiUrl, tildaApiUrl } from "../utils/apiUrl";
import { playingTrackState } from "../atoms/playingTrack";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

interface Props {
  track: any;
  index: number;
  thumbnails: string;
}

const AlbumTrack = ({ track, index, thumbnails }: Props) => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  const getCurrentSong = (query: string) => {
    if (query.length > 2) {
      axios
        .get(`${pipedApiUrl}/streams/${query}`)
        .then((res: any) => {
          setCurrentTrack({
            url: res?.data?.audioStreams
              .filter((stream: any) => stream?.mimeType == "audio/mp4")
              .sort((a: any, b: any) =>
                a.bitrate < b.bitrate ? 1 : b.bitrate < a.bitrate ? -1 : 0
              )[0]?.url,
            track: {
              ...track,
              thumbnails: thumbnails,
            },
            trackNum: index,
          });
        })
        .catch((err: any) => {});
    } else {
      setCurrentTrack({
        url: "",
        track: "",
      });
    }
  };

  const usersRef = collection(db, "users");

  // get uid of user from firebase
  const userRef = doc(usersRef, user?.uid);
  const userCollectionRef = collection(userRef, "user");
  const favoritesRef = doc(userCollectionRef, "favorites");
  const favoriteTracksRef = collection(favoritesRef, "tracks");

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [favoriteTracksSnapshot] = useCollection(favoriteTracksRef);

  // console.log(favoriteTracksSnapshot)

  const checkIfFavoriteExists = (videoId: string) => {
    return favoriteTracksSnapshot?.docs.find(
      (doc) => doc.data().videoId === videoId
    );
  };

  const addFavorite = async () => {
    if (!checkIfFavoriteExists(track?.videoId)) {
      await addDoc(favoriteTracksRef, {
        videoId: track?.videoId,
      });
    }
  };

  const deleteFavorite = async () => {
    const favoriteDoc = favoriteTracksSnapshot?.docs.find(
      (doc) => doc.data().videoId === track?.videoId
    )?.id;
    await deleteDoc(doc(favoriteTracksRef, favoriteDoc));
  };

  const handleFavorited = () => {
    if (checkIfFavoriteExists(track?.videoId)) {
      deleteFavorite();
    } else {
      addFavorite();
    }
  };
  return (
    <div
      key={track.videoId}
      className="group-one flex h-11 w-full select-none flex-row items-center justify-between gap-3 rounded-md px-3 text-sm text-slate-700 transition-all duration-300 ease-in-out hover:bg-slate-100 hover:shadow-emerald-500/10 dark:text-white dark:hover:bg-slate-800"
    >
      <div className="flex flex-row items-center gap-5">
        <div className="group-two relative flex h-4 w-4 cursor-pointer items-center justify-center overflow-hidden rounded-md transition-all">
          <span
            className={`text-slate-400 ${
              track.title == playingTrack?.track?.title && isPlaying.isPlaying
                ? "opacity-0"
                : "opacity-100"
            } transition-all duration-300 ease-in-out group-hover:text-white group-one-hover:opacity-0 group-one-active:opacity-0`}
          >
            {index + 1}
          </span>
          {track.title == playingTrack?.track?.title && isPlaying.isPlaying ? (
            <PauseIcon
              onClick={() => {
                setIsPlaying({
                  isPlaying: false,
                  type: "track",
                });
              }}
              className="absolute left-0 ml-0.5 h-4 w-4 text-emerald-500 transition-all duration-300 ease-in-out hover:text-emerald-600 active:text-emerald-700"
            />
          ) : (
            <PlayIcon
              onClick={() => {
                getCurrentSong(track.videoId);
                setIsPlaying({
                  isPlaying: true,
                  type: "track",
                });
              }}
              className="absolute left-0 ml-0.5 h-4 w-4 text-slate-600 opacity-0 transition-all duration-300 ease-in-out hover:text-emerald-500 active:text-emerald-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:hover:text-emerald-500 dark:active:text-emerald-600"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex h-full w-full flex-row gap-3">
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                track.title == playingTrack?.track?.title
                  ? "text-emerald-500 transition-all duration-300 ease-in-out group-hover:text-white dark:text-emerald-400"
                  : ""
              }`}
            >
              {track.title} {track.isExplicit ? <MdExplicit /> : null}
              <HiHeart
                onClick={handleFavorited}
                className={`w-50 h-4 ${
                  checkIfFavoriteExists(track?.videoId as string)
                    ? "text-emerald-500 hover:text-emerald-600 active:text-emerald-700"
                    : "text-slate-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:hover:text-rose-500 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white"
                } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
              />
            </span>
          </div>
          <div>
            <span className="font-normal">
              {/* {track?.artists.map((artist: any, index: number) => (
                <span>{(index ? ", " : "") + artist?.name}</span>
              ))} */}
              {/* {track?.album?.name} */}
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

export default AlbumTrack;
