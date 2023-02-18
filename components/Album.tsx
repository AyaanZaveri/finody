import axios from "axios";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdExplicit } from "react-icons/md";
import { HiHeart, HiPlay } from "react-icons/hi";
import { fancyTimeFormat } from "../utils/fancyTimeFormat";
import { titleCase } from "title-case";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { pipedApiUrl, tildaApiUrl } from "../utils/apiUrl";
import Tilt from "react-parallax-tilt";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import { currentPlaylistState } from "../atoms/playlistAtom";
import { playingTrackState } from "../atoms/playingTrack";

interface Props {
  album: any;
}

const Album = ({ album }: Props) => {
  const [albumData, setAlbumData] = useState<any>();

  const getAlbumData = () => {
    axios
      .get(`${tildaApiUrl}/album/${album?.browseId}`)
      .then((res: any) => {
        setAlbumData(res.data);
      })
      .catch((err: any) => {});
  };

  useEffect(() => {
    getAlbumData();
  }, []);

  const router = useRouter();

  const [user] = useAuthState(auth);

  const usersRef = collection(db, "users");

  // get uid of user from firebase
  const userRef = doc(usersRef, user?.uid);
  const userCollectionRef = collection(userRef, "user");
  const favoritesRef = doc(userCollectionRef, "favorites");
  const favoriteAlbumsRef = collection(favoritesRef, "albums");

  const [favoriteAlbumsSnapshot] = useCollection(favoriteAlbumsRef);

  const checkIfFavoriteExists = (browseId: string) => {
    return favoriteAlbumsSnapshot?.docs.find(
      (doc) => doc.data().browseId === browseId
    );
  };

  const addFavorite = async () => {
    if (!checkIfFavoriteExists(album?.browseId)) {
      await addDoc(favoriteAlbumsRef, {
        browseId: album?.browseId,
      });
    }
  };

  const deleteFavorite = async () => {
    const favoriteDoc = favoriteAlbumsSnapshot?.docs.find(
      (doc) => doc.data().browseId === album?.browseId
    )?.id;
    await deleteDoc(doc(favoriteAlbumsRef, favoriteDoc));
  };

  const handleFavorited = () => {
    if (checkIfFavoriteExists(album?.browseId)) {
      deleteFavorite();
    } else {
      addFavorite();
    }
  };

  const { query } = useRouter();
  const [albumListId, setAlbumListeId] = useState<any>();
  const [isExplicit, setIsExplicit] = useState<boolean>();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [currentPlaylist, setCurrentPlaylist] =
    useRecoilState(currentPlaylistState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  const [curPlay, setCurPlay] = useState<any>();

  const checkIsExplicit = () => {
    albumData?.tracks?.map((track: any) => {
      if (track?.isExplicit) {
        setIsExplicit(true);
      }
    });
  };

  useEffect(() => {
    getAlbumData();
  }, [album?.browseId]);

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

  // console.log(curPlay)

  return (
    <div
      onClick={() =>
        router.push(`/playlist?list=${albumData?.audioPlaylistId}`)
      }
      key={album.videoId}
      className="group-one flex w-48 flex-col items-center justify-between gap-3 rounded-xl bg-white p-4 pb-8 text-sm text-slate-700 ring-1 ring-slate-100 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-100 active:ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-1 dark:ring-slate-800 dark:hover:bg-slate-800 dark:active:ring-1 dark:active:ring-slate-700"
    >
      <button className="flex flex-col gap-4">
        <Tilt
          glareEnable={true}
          glareMaxOpacity={0.8}
          glareColor="#ffffff"
          glarePosition="bottom"
          glareBorderRadius="12px"
        >
          <div className="group relative flex items-center justify-center overflow-hidden rounded-md transition-all">
            <img
              draggable={false}
              className="h-40 w-40 rounded-xl"
              src={album?.thumbnails[album?.thumbnails?.length - 1]?.url}
              alt=""
            />
          </div>
        </Tilt>
        <div className="flex flex-col justify-start">
          <button className="flex flex-row gap-3">
            <span className="inline-flex items-center gap-1 text-start text-base font-semibold decoration-emerald-500 decoration-2 transition-colors duration-300 ease-in-out hover:underline">
              {album.title} {album.isExplicit ? <MdExplicit /> : null}
            </span>
          </button>
          <div className="flex flex-col items-start gap-1.5 overflow-hidden text-ellipsis text-start">
            <span className="text-start font-normal">
              {album?.artists.map((artist: any, index: number) => (
                <span>{(index ? ", " : "") + artist?.name}</span>
              ))}
            </span>
            <div className="inline-flex items-center gap-1">
              <span className="rounded-full bg-slate-700 px-3 py-0.5 text-xs font-normal text-white">
                {titleCase(album?.year)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorited();
                }}
              >
                <HiHeart
                  className={`w-50 h-4 ${
                    checkIfFavoriteExists(album?.browseId as string)
                      ? "text-emerald-500 hover:text-emerald-600 active:text-emerald-700"
                      : "text-slate-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:hover:text-rose-500 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:text-white dark:hover:text-rose-500 dark:active:text-rose-600"
                  } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
                />
              </button>
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaylistSongs();
                  setIsPlaying({
                    isPlaying: true,
                    type: "playlist",
                    id: album?.browseId,
                  });
                }}
              >
                <HiPlay
                  className={`w-50 h-4 ${
                    checkIfFavoriteExists(album?.browseId as string)
                      ? "text-emerald-500 hover:text-emerald-600 active:text-emerald-700"
                      : "text-slate-700 opacity-0 hover:text-rose-500 active:text-rose-600 dark:hover:text-rose-500 dark:active:text-rose-600 group-one-hover:opacity-100 group-one-active:opacity-100 dark:text-white dark:text-white dark:hover:text-rose-500 dark:active:text-rose-600"
                  } mb-0.5 transition duration-300 ease-in-out hover:cursor-pointer`}
                />
              </button> */}
            </div>
            {/* <span className="rounded-full bg-slate-700 px-3 py-0.5 text-xs font-normal text-white">
              {albumData?.tracks?.length} Songs
              {/* {"\n" + albumData?.title}
              {"\n" + curPlay?.length}
            </span> */}
          </div>
        </div>
      </button>
    </div>
  );
};

export default Album;
