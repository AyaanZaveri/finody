import React, { useEffect, useState } from "react";
import { titleCase } from "title-case";
import Track from "./Track";
import Video from "./Video";
import Tilt from "react-parallax-tilt";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { HiHeart } from "react-icons/hi";
import { PlayIcon } from "@heroicons/react/24/solid";
import { pipedApiUrl, tildaApiUrl } from "../utils/apiUrl";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/songAtom";
import { useRouter } from "next/router";
import Album from "./TopResults/Album";
import Artist from "./TopResults/Artist";

const TopResult = ({ result }: { result: any }) => {
  const [user] = useAuthState(auth);

  const usersRef = collection(db, "users");

  // get uid of user from firebase
  const userRef = doc(usersRef, user?.uid);
  const userCollectionRef = collection(userRef, "user");
  const favoritesRef = doc(userCollectionRef, "favorites");
  const favoriteTracksRef = collection(favoritesRef, "tracks");

  const [favoriteTracksSnapshot] = useCollection(favoriteTracksRef);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);

  // console.log(favoriteTracksSnapshot)

  const checkIfFavoriteExists = (videoId: string) => {
    return favoriteTracksSnapshot?.docs.find(
      (doc) => doc.data().videoId === videoId
    );
  };

  const addFavorite = async () => {
    if (!checkIfFavoriteExists(result?.videoId)) {
      await addDoc(favoriteTracksRef, {
        videoId: result?.videoId,
      });
    }
  };

  const deleteFavorite = async () => {
    const favoriteDoc = favoriteTracksSnapshot?.docs.find(
      (doc) => doc.data().videoId === result?.videoId
    )?.id;
    await deleteDoc(doc(favoriteTracksRef, favoriteDoc));
  };

  const handleFavorited = () => {
    if (checkIfFavoriteExists(result?.videoId)) {
      deleteFavorite();
    } else {
      addFavorite();
    }
  };

  // console.log(result)3

  return (
    <div className="mr-8">
      {result?.resultType == "album" ? (
        <Album album={result} />
      ) : result?.resultType == "song" ? (
        <Track track={result} />
      ) : result?.resultType == "video" ? (
        <div className="group-one relative flex h-[13rem] w-full cursor-pointer flex-col justify-center rounded-xl bg-slate-100 transition duration-300 ease-in-out hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-900 dark:text-white dark:ring-1 dark:ring-slate-800 dark:hover:ring-slate-700">
          <div className="relative flex flex-col gap-5 px-6">
            <div className="flex items-center justify-start rounded-md">
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.8}
                glareColor="#ffffff"
                glarePosition="bottom"
                glareBorderRadius="8px"
                className="rounded-lg bg-emerald-300 py-2"
              >
                <img
                  draggable={false}
                  className="z-10 w-[5.25rem]"
                  src={result?.thumbnails[0]?.url}
                  alt=""
                />
              </Tilt>
            </div>
            <div className="re flex flex-col justify-center gap-1.5">
              <div className="flex flex-row">
                <span className="inline-flex items-center gap-1 text-3xl font-semibold text-slate-700 dark:text-white">
                  {result.title}
                </span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="rounded-full bg-slate-700 px-3 py-0.5 text-xs font-normal text-white">
                  {titleCase(result?.resultType)}
                </span>
                <HiHeart
                  onClick={handleFavorited}
                  className={`h-4 w-4 ${
                    checkIfFavoriteExists(result?.videoId as string)
                      ? "text-emerald-500 hover:text-emerald-600 active:text-emerald-700"
                      : "text-slate-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:hover:text-rose-500 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:text-white dark:hover:text-rose-500 dark:active:text-rose-600"
                  } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
                />
              </div>
            </div>
          </div>
          <button
            // onClick={() => getCurrentSong(result.videoId, result.type)}
            className="absolute right-0 bottom-0 m-4 rounded-full bg-emerald-500 p-3 text-white opacity-0 transition duration-300 ease-in-out hover:bg-emerald-600 active:bg-emerald-700 group-one-hover:opacity-100 group-one-active:opacity-100"
          >
            <PlayIcon className="ml-0.5 h-6 w-6" />
          </button>
        </div>
      ) : result?.resultType == "artist" ? (
        <Artist artist={result} />
      ) : null}
    </div>
  );
};

export default TopResult;
