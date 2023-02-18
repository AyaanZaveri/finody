import type { NextPage } from "next";
import { useEffect, useState } from "react";
// Jellyfin SDK
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api";
import Artist from "../../components/Jellyfin/Artist";
import { useJellyfin } from "../../hooks/handleJellyfin";

const LibraryArtists: NextPage = () => {
  const [artists, setArtists] = useState<any>(null);
  const [albums, setAlbums] = useState<any>(null);

  const { api, user } = useJellyfin();

  const getJellyfinData = async () => {
    if (api) {
      const artistsData: any = await getArtistsApi(api).getArtists({
        userId: user?.Id,
      });

      setArtists(artistsData.data.Items);
    } else {
      // console.log("no api, haha you suck lol");
    }
  };

  useEffect(() => {
    getJellyfinData();
  }, [user]);

  return (
    <div className="ml-3 pl-64 pr-12">
      <div className="pt-[4.5rem] pb-8">
        <div className="pt-6">
          <h1 className="text-3xl font-semibold text-slate-700 dark:text-white">
            Artists
          </h1>
          <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 pt-4">
            {artists?.map((artist: any) => (
              <Artist artist={artist} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryArtists;
