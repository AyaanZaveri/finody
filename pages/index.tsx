import type { NextPage } from "next";
import { useEffect, useState } from "react";
// Jellyfin SDK
import { Jellyfin } from "@jellyfin/sdk";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api";
import { getSessionApi } from "@jellyfin/sdk/lib/utils/api/session-api";
import { getAuthorizationHeader } from "@jellyfin/sdk/lib/utils/authentication";
import Artist from "../components/Jellyfin/Artist";
import Album from "../components/Jellyfin/Album";
import { jellyfinAuth } from "../utils/jellyfinAuth";
import { useJellyfin } from "../hooks/handleJellyfin";

const Home: NextPage = () => {
  const [artists, setArtists] = useState<any>(null);
  const [albums, setAlbums] = useState<any>(null);

  const { api, user } = useJellyfin();

  const getJellyfinData = async () => {
    if (api) {
      const artistsData: any = await getArtistsApi(api).getArtists({
        userId: user?.Id,
      });

      setArtists(artistsData.data.Items);

      const items: any = await getItemsApi(api).getItemsByUserId({
        userId: user?.Id as any,
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

  return (
    <div className="ml-3 pl-[17rem] pr-12">
      <div className="pt-[4.5rem] pb-8">
        <div className="pt-6">
          <h1 className="text-3xl font-semibold text-stone-700 dark:text-white">
            Artists & Albums
          </h1>
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
