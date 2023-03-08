import { useRecoilState } from "recoil";
import {
  currentTrackState,
  musicQueueState,
  playState,
} from "../atoms/playState";
import { useEffect, useState } from "react";
import { useJellyfin } from "../hooks/handleJellyfin";

export const getSongInfo = async (
  track: any,
  api: any,
  serverUrl: string,
  setIsPlaying: any,
  setPlayingTrack: any,
  index: number
) => {
  setIsPlaying(true);

  setPlayingTrack({
    id: track.Id,
    title: track.Name,
    artist: track.AlbumArtist,
    album: track.Album,
    duration: track.RunTimeTicks,
    cover: `${serverUrl}/Items/${track.Id}/Images/Primary?maxHeight=400&tag=${track.ImageTags?.Primary}&quality=90`,
    url: `
    ${serverUrl}/Audio/${track.Id}/stream.flac?Static=true&mediaSourceId=${track.Id}&deviceId=9aa38b20-8e58-48eb-bb32-b47e8704a6c5&api_key=91ebc1b9b4a54fbcbc41529ea4a6c4eb&Tag=e739c95d40de0dbce384fae600f72320&recursive=true
    `,
    index: index,
  });

  // console.log("got em");
};
