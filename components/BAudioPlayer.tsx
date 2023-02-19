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
import { playState, currentTrackState } from "../atoms/playState";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api/playstate-api";
import { useJellyfin } from "../hooks/handleJellyfin";

const BAudioPlayer = () => {
  const player = useRef<any>();
  const [isPlaying, setIsPlaying] = useRecoilState(playState);
  const [playingTrack, setPlayingTrack] = useRecoilState(currentTrackState);
  const [currentProgress, setCurrentProgress] = useState(0);

  const { user, api } = useJellyfin();

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
    if (!api) return;
    if (isPlaying && playingTrack?.url) {
      getPlaystateApi(api).onPlaybackProgress({
        userId: user?.Id,
        itemId: [playingTrack?.id] as any,
        positionTicks: currentProgress * 10000,
      });
    }
  }, [currentProgress]);

  console.log(playingTrack);

  return (
    <div className="z-20 select-none">
      {playingTrack?.url ? (
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
                  <span className="font-normal">{playingTrack?.artist}</span>
                </div>
              </div>
            </div>
            <div className="w-2/5">
              <AudioPlayer
                onListen={(e: any) => setCurrentProgress(e?.timeStamp)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                ref={player}
                autoPlay={true}
                showSkipControls={true}
                src={playingTrack?.url}
                // onEnded={handleEnd}
                // onClickNext={handleClickNext}
                // onClickPrevious={handleClickPrevious}
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
