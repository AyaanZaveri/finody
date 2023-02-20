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
import { Menu } from "@headlessui/react";

const LibraryAlbums: NextPage = () => {
  const [artists, setArtists] = useState<any>(null);
  const [albums, setAlbums] = useState<any>(null);
  const [sortBy, setSortBy] = useState<
    | "Album"
    | "AlbumArtist"
    | "CommunityRating"
    | "CriticRating"
    | "ProductionYear"
    | "DatePlayed"
    | "PlayCount"
    | "SortName"
    | "Random"
  >("SortName");
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
        sortBy: sortBy as any,
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
  }, [user, sortOrder, sortBy]);

  return (
    <div className="ml-3 pl-[17rem] pr-12">
      <div className="pt-[4.5rem] pb-8">
        <div className="pt-6">
          <div className="flex justify-between flex-row">
            <h1 className="text-3xl font-semibold text-slate-700 dark:text-white">
              Albums
            </h1>
            <div className="gap-2 flex flex-row">
              {/* create a custom dropdown menu to change the sortBy using menu from headlessui */}
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    className="inline-flex text-sm h-8 items-center justify-center border border-slate-200 hover:border-slate-300 active:border-slate-300 bg-slate-100 active:bg-slate-300 gap-2 overflow-hidden rounded-full px-3 text-slate-800 shadow-xl shadow-emerald-500/5 transition duration-300 ease-in-out hover:shadow-emerald-500/10
                dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:border-slate-600 dark:active:border-slate-600 dark:active:bg-slate-700
                "
                  >
                    <span>
                      {sortBy == "SortName"
                        ? "Name"
                        : sortBy == "AlbumArtist"
                        ? "Album Artist"
                        : sortBy == "CommunityRating"
                        ? "Community Rating"
                        : sortBy == "CriticRating"
                        ? "Critic Rating"
                        : sortBy == "ProductionYear"
                        ? "Release Date"
                        : sortBy == "DatePlayed"
                        ? "Date Played"
                        : sortBy == "PlayCount"
                        ? "Play Count"
                        : sortBy}
                    </span>
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute z-20 right-0 w-56 mt-2 origin-top-right divide-y bg-slate-100 ring-1 ring-slate-200 divide-gray-100 rounded-md shadow-lg outline-none dark:bg-slate-800 dark:text-white dark:ring-slate-700 focus:outline-none">
                  <div className="p-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("Album");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Album
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("AlbumArtist");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Album Artist
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("CommunityRating");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Community Rating
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("CriticRating");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Critic Rating
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("ProductionYear");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Release Date
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("DatePlayed");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Date Played
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("PlayCount");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Play Count
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("SortName");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Name
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setSortBy("Random");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-slate-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Random
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>

              <button
                onClick={() => {
                  if (sortOrder === "Ascending") {
                    setSortOrder("Descending");
                  } else {
                    setSortOrder("Ascending");
                  }
                }}
                className="inline-flex text-sm h-8 items-center justify-center border border-slate-200 hover:border-slate-300 active:border-slate-300 bg-slate-100 active:bg-slate-300 gap-2 overflow-hidden rounded-full px-3 text-slate-800 shadow-xl shadow-emerald-500/5 transition duration-300 ease-in-out hover:shadow-emerald-500/10
                dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:border-slate-600 dark:active:border-slate-600 dark:active:bg-slate-700
                "
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
