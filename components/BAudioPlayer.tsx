import React, { Fragment, createRef, useEffect, useRef, useState } from "react";
import {
  HiFastForward,
  HiPause,
  HiPlay,
  HiRewind,
  HiVolumeOff,
  HiVolumeUp,
} from "react-icons/hi";
import { MdExplicit } from "react-icons/md";
import AudioPlayer from "react-h5-audio-player";
import { useRecoilState } from "recoil";
import {
  FastForward20Filled,
  FastForward24Filled,
  Pause20Filled,
  Pause24Filled,
  Play20Filled,
  Play24Filled,
  Rewind20Filled,
  Rewind24Filled,
} from "@fluentui/react-icons";
import Marquee from "react-fast-marquee";
import { BsSkipEndFill, BsSkipStartFill } from "react-icons/bs";
import Tilt from "react-parallax-tilt";
import {
  playState,
  currentTrackState,
  musicQueueState,
} from "../atoms/playState";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api/playstate-api";
import { useJellyfin } from "../hooks/handleJellyfin";
import { getSongInfo } from "../utils/getSongInfo";
import { QueueListIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";

const BAudioPlayer = () => {
  const player = useRef<any>();
  const [isPlaying, setIsPlaying] = useRecoilState(playState);
  const [playingTrack, setPlayingTrack] = useRecoilState(currentTrackState);
  const [queue, setQueue] = useRecoilState<any>(musicQueueState);
  const [showQueue, setShowQueue] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const { user, api, serverUrl } = useJellyfin();

  const canvas = useRef<any>(null);
  const canvasCtx = useRef<any>(null);

  useEffect(() => {
    if (!api) return;
    if (isPlaying && playingTrack?.url) {
      getPlaystateApi(api).onPlaybackStart({
        userId: user?.Id,
        itemId: [playingTrack?.id] as any,
        canSeek: true,
      });
    } else {
      getPlaystateApi(api).onPlaybackStopped({
        userId: user?.Id,
        itemId: [playingTrack?.id] as any,
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!api && !user) return;
    if (isPlaying && playingTrack?.url) {
      getPlaystateApi(api)
        .onPlaybackProgress({
          userId: user?.Id,
          itemId: [playingTrack?.id] as any,
          positionTicks: currentProgress,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }, [currentProgress]);

  // console.log("playingTracl", playingTrack);

  // console.log(currentProgress);
  // console.log(
  //   "queuheiuwrh",
  //   queue ? queue[playingTrack?.index + 1] : null
  // );

  console.log("queuequeue", playingTrack);

  const handleNext = () => {
    if (!queue) return;
    if (playingTrack.index == queue?.length - 1) return;
    getSongInfo(
      queue[playingTrack?.index + 1],
      api,
      serverUrl as string,
      setIsPlaying,
      setPlayingTrack,
      playingTrack?.index + 1
    );
  };

  const handlePrev = () => {
    if (!queue) return;
    if (playingTrack.index == 0) return;
    getSongInfo(
      queue[playingTrack?.index - 1],
      api,
      serverUrl as string,
      setIsPlaying,
      setPlayingTrack,
      playingTrack?.index - 1
    );
  };

  console.log("curprog", currentProgress);

  const handlePlay = (track: any) => {
    getSongInfo(
      track,
      api,
      serverUrl as string,
      setIsPlaying,
      setPlayingTrack,
      track.index
    );
  };

  const handleRemoveFromQueue = (index: number) => {
    const newQueue = queue.filter((track: any, i: number) => i !== index);
    setQueue(newQueue);
  };

  console.log("qwuiqrwoiqueueueueueue", queue);

  return (
    <div className="z-20 select-none">
      {playingTrack?.url ? (
        <div className="fixed bottom-0 border-t border-slate-100 dark:border-slate-800 flex h-24 w-full items-center justify-center bg-white/75 backdrop-blur-md dark:bg-slate-900/75 z-30">
          <div className="flex w-full flex-row items-center justify-center gap-3 text-sm text-slate-700 dark:text-white">
            <div className="absolute left-0 flex flex-row gap-3 pl-4">
              <div className="group relative flex items-center justify-center overflow-hidden transition-all">
                <Tilt
                  glareEnable={true}
                  glareMaxOpacity={0.8}
                  glareColor="#ffffff"
                  glarePosition="bottom"
                  glareBorderRadius="6px"
                >
                  <img
                    draggable={false}
                    className="w-[3rem] rounded-md"
                    src={
                      playingTrack?.cover
                        ? playingTrack?.cover
                        : playingTrack?.cover
                        ? playingTrack?.cover
                        : ""
                    }
                    alt=""
                  />
                </Tilt>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex flex-row gap-3">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    {playingTrack?.title}
                  </span>
                </div>
                <div>
                  <span className="font-normal w-12">
                    {playingTrack?.artist}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-[55%]">
              <AudioPlayer
                // get the current time of the audio
                onListen={(e) =>
                  setCurrentProgress(
                    (e.target as HTMLAudioElement)?.currentTime
                  )
                }
                listenInterval={1000}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                ref={player}
                autoPlay={true}
                showSkipControls={true}
                src={playingTrack?.url}
                onEnded={handleNext}
                onClickNext={handleNext}
                onClickPrevious={handlePrev}
                className="outline-none"
                customIcons={{
                  forward: <FastForward24Filled />,
                  rewind: <Rewind24Filled />,
                  play: <Play24Filled />,
                  pause: <Pause24Filled />,
                  next: <BsSkipEndFill className="w-7" />,
                  previous: <BsSkipStartFill className="w-7" />,
                  volume: (
                    <img
                      draggable={false}
                      src="/icons/fluent_speaker-2-24-filled.svg"
                    />
                  ),
                  volumeMute: (
                    <img
                      draggable={false}
                      src="/icons/fluent_speaker-mute-24-filled.svg"
                    />
                  ),
                  loop: (
                    <img
                      draggable={false}
                      src="/icons/fluent_arrow-repeat-all-24-filled.svg"
                    />
                  ),
                  loopOff: (
                    <img
                      draggable={false}
                      src="/icons/fluent_arrow-repeat-all-off-24-filled.svg"
                    />
                  ),
                }}
              />
            </div>
            <div className="absolute right-0 flex flex-row gap-3 pr-8">
              <div className="flex flex-row gap-3">
                <div className="flex flex-row gap-3">
                  <button
                    onClick={() => setShowQueue(!showQueue)}
                    className="h-10 w-10 inline-flex items-center justify-center border border-slate-200 hover:border-slate-300 active:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 dark:active:border-slate-600 bg-slate-800 active:bg-slate-600 rounded-full shadow-xl shadow-emerald-500/10 transition duration-300 ease-in-out hover:shadow-emerald-300/20"
                  >
                    <QueueListIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            {showQueue ? (
              <Transition
                show={showQueue}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="transform translate-x-full"
                enterTo="transform translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="transform translate-x-0"
                leaveTo="transform translate-x-full"
              >
                <Dialog
                  as="div"
                  className="z-50 fixed right-8 bottom-20 bg-slate-900/70 shadow-2xl shadow-emerald-500/10 select-none backdrop-blur-md scrollbar h-2/3 overflow-y-auto w-1/3 rounded-lg ring-1 ring-slate-800"
                  onClose={() => setShowQueue(false)}
                >
                  {/* make a widget no overlay */}
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Overlay className="fixed inset-0" />
                  </Transition.Child>
                  <div className="flex flex-col px-4 sm:block sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <div className="inline-block w-full py-8 px-6 overflow-hidden text-left align-middle transition-all transform">
                        <div className="flex flex-row justify-between">
                          <Dialog.Title
                            as="h3"
                            className="text-2xl font-bold leading-6 ml-2 text-gray-900 dark:text-white"
                          >
                            Queue
                          </Dialog.Title>
                          <button
                            onClick={() => setShowQueue(false)}
                            className="h-8 w-8 inline-flex items-center justify-center border border-slate-200 hover:border-slate-300 active:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 dark:active:border-slate-600 bg-slate-800 active:bg-slate-600 rounded-full shadow-xl shadow-emerald-500/10 transition duration-300 ease-in-out hover:shadow-emerald-300/20"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-col gap-1 mt-4">
                          {queue.map((track: any, index: any) => (
                            <div
                              key={index}
                              className={`flex flex-row gap-3 items-center hover:scale-[1.02] active:scale-[0.97] justify-between hover:bg-slate-800/50 active:bg-slate-800/80 px-4 py-3 transition-all duration-300 ease-in-out rounded-lg hover:cursor-pointer ${
                                playingTrack?.id === track?.Id
                                  ? "bg-emerald-800/50"
                                  : null
                              }`}
                              onClick={() =>
                                getSongInfo(
                                  track,
                                  api,
                                  serverUrl as string,
                                  setIsPlaying,
                                  setPlayingTrack,
                                  index
                                )
                              }
                            >
                              <div className="flex flex-row gap-3 items-center">
                                <div className="group relative flex items-center justify-center overflow-hidden transition-all">
                                  <img
                                    src={`${serverUrl}/Items/${track?.Id}/Images/Primary?maxHeight=400&tag=${track?.ImageTags?.Primary}&quality=90`}
                                    alt=""
                                    className="w-12 h-12 rounded-lg"
                                    draggable={false}
                                  />
                                </div>
                                <div className="flex flex-col justify-center">
                                  <div className="flex flex-row gap-3">
                                    <span className="inline-flex items-center gap-1 font-semibold">
                                      {track?.Name}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-normal text-sm w-12">
                                      {track?.AlbumArtist}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row gap-3">
                                <button
                                  onClick={() => handleRemoveFromQueue(index)}
                                  className="h-10 w-10 inline-flex items-center justify-center border border-slate-200 hover:border-slate-300 active:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 dark:active:border-slate-600 bg-slate-800 active:bg-slate-600 rounded-full shadow-xl shadow-emerald-500/10 transition duration-300 ease-in-out hover:shadow-emerald-300/20"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BAudioPlayer;
