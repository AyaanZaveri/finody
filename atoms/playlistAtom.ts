import { atom } from "recoil";

export const currentPlaylistState = atom({
  key: "currentPlaylistState",
  default: [] as any,
});
