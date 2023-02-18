import type { NextPage } from "next";
import { useEffect, useState } from "react";
// Jellyfin SDK
import { Jellyfin } from "@jellyfin/sdk";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api";
import { getSessionApi } from "@jellyfin/sdk/lib/utils/api/session-api";
import { getAuthorizationHeader } from "@jellyfin/sdk/lib/utils/authentication";
import Album from "../../components/Jellyfin/Album";
import { jellyfinAuth } from "../../utils/jellyfinAuth";
import { useJellyfin } from "../../hooks/handleJellyfin";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";

const LibraryAlbums: NextPage = () => {
  const [artists, setArtists] = useState<any>(null);
  const [albums, setAlbums] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<"Ascending" | "Descending">(
    "Ascending"
  );

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
        sortOrder: sortOrder as any,
        recursive: true,
        excludeLocationTypes: "Virtual" as any,
        includeItemTypes: "MusicAlbum" as any,
      });

      setAlbums(items.data.Items);
    } else {
      // console.log("no api, haha you suck lol");
    }
  };

  useEffect(() => {
    getJellyfinData();
  }, [user, sortOrder]);

  return (
    <div className="ml-3 pl-64 pr-12">
      <div className="pt-[4.5rem] pb-8">
        <div className="pt-6">
          <div className="flex justify-between flex-row">
            <h1 className="text-3xl font-semibold text-slate-700 dark:text-white">
              Albums
            </h1>
            <div>
              <button
                onClick={() => {
                  if (sortOrder === "Ascending") {
                    setSortOrder("Descending");
                  } else {
                    setSortOrder("Ascending");
                  }
                }}
                className="inline-flex text-sm h-8 items-center justify-center border border-slate-200 hover:border-slate-300 active:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 bg-slate-100 active:bg-slate-300 gap-2 overflow-hidden rounded-full px-3 text-slate-800 shadow-xl shadow-emerald-500/5 transition duration-300 ease-in-out hover:shadow-emerald-500/10 dark:text-white dark:active:border-slate-600"
              >
                {sortOrder === "Ascending" ? (
                  <>
                    <span>Ascending</span>
                    <HiSortAscending />
                  </>
                ) : (
                  <>
                    <span>Descending</span>
                    <HiSortDescending />
                  </>
                )}
              </button>
            </div>
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

export default LibraryAlbums;
