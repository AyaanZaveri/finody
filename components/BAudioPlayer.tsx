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
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
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
import { currentPlaylistState } from "../atoms/playlistAtom";
import { BsSkipEndFill, BsSkipStartFill } from "react-icons/bs";
import { playingTrackState } from "../atoms/playingTrack";
import Tilt from "react-parallax-tilt";

const BAudioPlayer = () => {
  const player = useRef<any>();

  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [currentPlaylist, setCurrentPlaylist] =
    useRecoilState(currentPlaylistState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  // console.log(isPlaying);

  const [currentTrackIndex, setCurrentTrackIndex] = useState<any>(0);

  useEffect(() => {
    setPlayingTrack(currentTrack);
    currentTrack?.trackNum
      ? setCurrentTrackIndex(currentTrack?.trackNum)
      : null;
  }, [currentTrack]);

  useEffect(() => {
    currentPlaylist?.length >= 1
      ? setPlayingTrack(currentPlaylist[currentTrackIndex])
      : null;
  }, [currentTrackIndex]);

  const handlePlayButton = () => {
    setPlayingTrack(currentPlaylist[0]);
    setCurrentTrackIndex(0);
  };

  useEffect(() => {
    isPlaying.isPlaying && isPlaying.type == "playlist"
      ? handlePlayButton()
      : null;
  }, [isPlaying.id]);

  useEffect(() => {
    setPlayingTrack(playingTrack);
  }, [playingTrack]);

  // console.log(isPlaying);

  const handleClickNext = () => {
    if (playingTrack?.trackNum >= 0) {
      setCurrentTrackIndex((currentTrackIndex: any) =>
        currentTrackIndex < currentPlaylist?.length - 1
          ? currentTrackIndex + 1
          : 0
      );
    }
  };

  const handleClickPrevious = () => {
    if (playingTrack?.trackNum >= 0) {
      setCurrentTrackIndex((currentTrackIndex: any) =>
        currentTrackIndex > 0 ? currentTrackIndex - 1 : 0
      );
    }
  };

  const handleEnd = () => {
    if (playingTrack?.trackNum >= 0) {
      setCurrentTrackIndex((currentTrackIndex: any) =>
        currentTrackIndex < currentPlaylist?.length - 1
          ? currentTrackIndex + 1
          : 0
      );
    }
  };

  const pauseAudio = () => {
    player?.current?.audio.current.pause();
    setIsPlaying({
      ...isPlaying,
      isPlaying: false,
    });
  };

  const playAudio = () => {
    player?.current?.audio.current.play();
    setIsPlaying({
      ...isPlaying,
      isPlaying: true,
    });
  };

  useEffect(() => {
    if (isPlaying.isPlaying == true) {
      playAudio();
    } else {
      pauseAudio();
    }
  }, [isPlaying.isPlaying]);

  // console.log(isPlaying);

  return (
    <div className="z-20 select-none">
      {playingTrack?.url?.length > 0 ? (
        <div className="fixed bottom-0 flex h-20 w-full items-center justify-center bg-white/75 backdrop-blur-md dark:bg-slate-900/75">
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
                      playingTrack?.track?.thumbnails
                        ? playingTrack?.track?.thumbnails[0]?.url
                        : playingTrack?.thumbnails
                        ? playingTrack?.thumbnails[0]?.url
                        : ""
                    }
                    alt=""
                  />
                </Tilt>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex flex-row gap-3">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    {playingTrack?.track?.title}{" "}
                    {playingTrack?.track?.isExplicit ? <MdExplicit /> : null}
                  </span>
                </div>
                <div>
                  <span className="font-normal">
                    {playingTrack?.track?.artists?.map(
                      (artist: any, index: number) => (
                        <span>{(index ? ", " : "") + artist?.name}</span>
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-2/5">
              <AudioPlayer
                onPause={() =>
                  setIsPlaying({
                    ...isPlaying,
                    isPlaying: false,
                  })
                }
                onPlay={() =>
                  setIsPlaying({
                    ...isPlaying,
                    isPlaying: true,
                  })
                }
                ref={player}
                autoPlay={true}
                showSkipControls={true}
                src={playingTrack?.url}
                onEnded={handleEnd}
                onClickNext={handleClickNext}
                onClickPrevious={handleClickPrevious}
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
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BAudioPlayer;