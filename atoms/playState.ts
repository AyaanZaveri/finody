import { atom } from "recoil";

export const playState = atom({
  key: 'play',
  default: false,
});

export const currentTrackState = atom({
  key: 'currentTrack',
  default: {
    id: '',
    title: '',
    artist: '',
    album: '',
    duration: 0,
    cover: '',
    url: '',
    index: 0,
  },
});

export const musicQueueState = atom({
  key: 'musicQueue',
  default: [],
});