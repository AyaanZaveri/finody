import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {} as any,
});
