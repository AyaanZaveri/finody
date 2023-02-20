import { atom } from "recoil";

export const playState = atom({
  key: 'playState',
  default: false,
});

export const currentTrackState = atom({
  key: 'currentTrackState',
  default: {
    id: '',
    title: '',
    artist: '',
    album: '',
    duration: 0,
    cover: '',
    url: '',
    parentIndexNumber: 0,
  },
});

export const queueState = atom({
  key: 'queueState',
  default: [],
});