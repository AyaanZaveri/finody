import type { NextPage } from "next";
import ReactAudioPlayer from "react-audio-player";
import {
  HiFastForward,
  HiPause,
  HiPlay,
  HiRewind,
  HiVolumeOff,
  HiVolumeUp,
} from "react-icons/hi";
import Navbar from "../components/Navbar";
import AudioPlayer from "react-h5-audio-player";
import { MdExplicit } from "react-icons/md";
import { useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/songAtom";
import { useEffect, useState } from "react";
// Jellyfin SDK
import { Jellyfin } from "@jellyfin/sdk";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api";
import { ItemFields } from "@jellyfin/sdk/lib/generated-client/models/item-fields.js";
import Artist from "../components/Jellyfin/Artist";
import Album from "../components/Jellyfin/Album";

const Home: NextPage = () => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [api, setApi] = useState<any>();
  const [user, setUser] = useState<any>(null);

  const [artists, setArtists] = useState<any>(null);
  const [albums, setAlbums] = useState<any>(null);

  const handleJellyfin = async () => {
    if (!serverUrl && !userName && !password) return;
    const jellyfin = new Jellyfin({
      clientInfo: {
        name: "My Client Application",
        version: "1.0.0",
      },
      deviceInfo: {
        name: "Device Name",
        id: "unique-device-id",
      },
    });
    const capi = jellyfin.createApi(serverUrl);
    const auth = await capi.authenticateUserByName(userName, password);
    setUser(auth.data.User);

    setApi(capi);
  };

  useEffect(() => {
    handleJellyfin();
  }, [serverUrl]);

  const getJellyfinData = async () => {
    if (api) {
      const artistsData: any = await getArtistsApi(api).getArtists({
        userId: user?.Id,
      });

      setArtists(artistsData.data.Items);

      const items: any = await getItemsApi(api).getItemsByUserId({
        userId: user.Id,
        sortBy: "SortName" as any,
        sortOrder: "Ascending" as any,
        recursive: true,
        excludeLocationTypes: "Virtual" as any,
        includeItemTypes: "MusicAlbum" as any,
      });

      setAlbums(items.data.Items);
    } else {
      console.log("no api, haha you suck lol");
    }
  };

  useEffect(() => {
    getJellyfinData();
  }, [user]);

  console.log(serverUrl);

  return (
    <div className="ml-3 pl-64 pr-12">
      <div className="pt-[4.5rem] pb-8">
        <div className="pt-6">
          <div className="pb-8">
            <form className="flex flex-col gap-y-3 text-sm bg-slate-100 dark:bg-slate-800 w-min p-5 rounded-xl">
              <label htmlFor="serverUrl">Server URL</label>
              <input
                type="text"
                name="serverUrl"
                id="serverUrl"
                value={serverUrl}
                className="w-64 text-slate-500 text-sm rounded-lg border-none outline-none shadow-sm ring-1 ring-gray-300 focus:bg-gray-100 focus:ring-gray-500 dark:text-white dark:ring-gray-700 dark:bg-gray-800 dark:focus:ring-gray-500 dark:focus:bg-gray-700 transiton duration-200"
                onChange={(e) => setServerUrl(e.target.value)}
              />
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                name="userName"
                id="userName"
                value={userName}
                className="w-64 text-slate-500 text-sm rounded-lg border-none outline-none shadow-sm ring-1 ring-gray-300 focus:bg-gray-100 focus:ring-gray-500 dark:text-white dark:ring-gray-700 dark:bg-gray-800 dark:focus:ring-gray-500 dark:focus:bg-gray-700 transiton duration-200"
                onChange={(e) => setUserName(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                className="w-64 text-slate-500 text-sm rounded-lg border-none outline-none shadow-sm ring-1 ring-gray-300 focus:bg-gray-100 focus:ring-gray-500 dark:text-white dark:ring-gray-700 dark:bg-gray-800 dark:focus:ring-gray-500 dark:focus:bg-gray-700 transiton duration-200"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => handleJellyfin()}
                className="bg-emerald-500 text-white rounded-md py-2 w-64 hover:bg-emerald-600 active:bg-emerald-700 transition duration-200"
              >
                Login
              </button>
            </form>
          </div>
          <h1 className="text-3xl font-semibold">Artists & Albums</h1>
          <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 pt-4">
            {artists?.map((artist: any) => (
              <Artist artist={artist} />
            ))}
          </div>
          <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 pt-4">
            {albums?.map((album: any) => (
              <Album album={album} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
