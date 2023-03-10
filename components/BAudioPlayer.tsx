import React, { createRef, useEffect, useRef, useState } from "react";
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
import { QueueListIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Dialog } from "@headlessui/react";

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

  // useEffect(() => {
  //   if (!playingTrack) return;
  //   if (!player.current) return;

  //   const audioCtx = new AudioContext();
  //   const analyser = audioCtx.createAnalyser();
  //   const source = audioCtx.createMediaElementSource(
  //     player.current.audio.current
  //   );
  //   source.connect(analyser);
  //   analyser.connect(audioCtx.destination);
  //   analyser.fftSize = 256;

  //   const bufferLength = analyser.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);

  //   const canvasCtx = canvas.current.getContext("2d");

  //   const WIDTH = canvas.current.width;
  //   const HEIGHT = canvas.current.height;

  //   const barWidth = (WIDTH / bufferLength) * 2.5;
  //   let barHeight;
  //   let x = 0;

  //   function renderFrame() {
  //     requestAnimationFrame(renderFrame);

  //     x = 0;

  //     analyser.getByteFrequencyData(dataArray);

  //     canvasCtx!.fillStyle = "rgba(0, 0, 0, 0)";
  //     canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

  //     for (let i = 0; i < bufferLength; i++) {
  //       barHeight = dataArray[i];

  //       const r = barHeight + 25 * (i / bufferLength);
  //       const g = 250 * (i / bufferLength);
  //       const b = 50;

  //       canvasCtx!.fillStyle = `rgb(${r}, ${g}, ${b})`;
  //       canvasCtx!.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

  //       x += barWidth + 1;
  //     }
  //   }

  //   renderFrame();
  // }, [playingTrack]);

  // create a music visualizer that has bars that go up and down based on the music

  

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
              // make a small widget using Dialog that shows the queue on the right side above the queue button
              <Dialog
                open={showQueue}
                onClose={() => setShowQueue(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="z-50 fixed right-8 bottom-20 bg-slate-900/50 select-none backdrop-blur-md scrollbar h-[22rem] overflow-y-auto w-72 rounded-lg ring-1 ring-slate-800"
              >
                <div className="py-6 px-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                      <span className="font-semibold inline-flex items-center text-2xl ml-3">
                        Queue
                        <QueueListIcon className="w-5 h-5 inline-block ml-2" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {queue.map((track: any, index: number) => (
                        <div
                          key={index}
                          className={`flex flex-row gap-3 items-center justify-between hover:bg-slate-800/80 hover:scale-[1.02] transition duration-200 ease-in-out p-3 rounded-lg cursor-pointer ${
                            track?.Id === playingTrack?.id
                              ? "bg-emerald-800/80 hover:bg-emerald-800"
                              : ""
                          }`}
                          onClick={() => {
                            handlePlay({
                              ...track,
                              index: index,
                            });
                            setShowQueue(false);
                          }}
                        >
                          <div className="flex flex-row gap-2.5 items-center">
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
                                  className="w-10 rounded-md"
                                  src={`${serverUrl}/Items/${track?.Id}/Images/Primary?maxHeight=400&tag=${track?.ImageTags?.Primary}&quality=90`}
                                  alt=""
                                />
                              </Tilt>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-bold text-sm overflow-hidden break-all">
                                {track?.Name}
                              </span>
                              <span className="font-normal text-xs">
                                {track?.AlbumArtist}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog>
            ) : null}
          </div>
        </div>
      ) : null}
      {/* <canvas
        id="visualizer"
        className="fixed bottom-28 left-64 w-full h-1/3 z-50"
        ref={canvas}
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas> */}
    </div>
  );
};

export default BAudioPlayer;
