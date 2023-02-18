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
import { currentTrackState } from "../atoms/songAtom";
import { PlayIcon } from "@heroicons/react/24/solid";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

interface Props {
  video: any;
}

const Video = ({ video }: Props) => {
  const [user] = useAuthState(auth);

  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);

  const getCurrentSong = (query: string, type: string) => {
    if (query.length > 2) {
      axios
        .get(`${pipedApiUrl}/streams/${query}`)
        .then((res: any) => {
          setCurrentTrack({
            url: res?.data?.audioStreams.sort((a: any, b: any) =>
              a.bitrate < b.bitrate ? 1 : b.bitrate < a.bitrate ? -1 : 0
            )[0]?.url,
            track: video,
            type: type,
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

  const [favoriteTracksSnapshot] = useCollection(favoriteTracksRef);

  // console.log(favoriteTracksSnapshot)

  const checkIfFavoriteExists = (videoId: string) => {
    return favoriteTracksSnapshot?.docs.find(
      (doc) => doc.data().videoId === videoId
    );
  };

  const addFavorite = async () => {
    if (!checkIfFavoriteExists(video?.videoId)) {
      await addDoc(favoriteTracksRef, {
        videoId: video?.videoId,
      });
    }
  };

  const deleteFavorite = async () => {
    const favoriteDoc = favoriteTracksSnapshot?.docs.find(
      (doc) => doc.data().videoId === video?.videoId
    )?.id;
    await deleteDoc(doc(favoriteTracksRef, favoriteDoc));
  };

  const handleFavorited = () => {
    if (checkIfFavoriteExists(video?.videoId)) {
      deleteFavorite();
    } else {
      addFavorite();
    }
  };

  return (
    <div
      key={video.videoId}
      className="group-one flex h-16 w-full flex-row items-center justify-between gap-3 rounded-md px-3 text-sm text-slate-700 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-100 active:bg-slate-200 dark:text-white dark:hover:bg-slate-800 dark:active:bg-slate-800 dark:active:ring-1 dark:active:ring-slate-700"
      id={video.videoId}
    >
      <div className="flex flex-row gap-3">
        <div
          onClick={() => getCurrentSong(video.videoId, "video")}
          className="group-two relative flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-emerald-200 transition-all dark:bg-emerald-700"
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
                onClick={handleFavorited}
                className={`w-50 h-4 ${
                  checkIfFavoriteExists(video?.videoId as string)
                    ? "text-emerald-500 hover:text-emerald-600 active:text-emerald-700"
                    : "text-slate-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:hover:text-rose-500 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:text-white dark:hover:text-rose-500 dark:active:text-rose-600"
                } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
