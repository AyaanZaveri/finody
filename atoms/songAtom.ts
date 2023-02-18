import { atom } from "recoil";

export const currentTrackState = atom({
  key: "currentTrackState",
  default: {} as any,
});

export const isPlayingState = atom<any>({
  key: "isPlayingState",
  default: {
    isPlaying: false,
    type: "",
  } as any,
});
