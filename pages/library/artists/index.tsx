import type { NextPage } from "next";
import { useEffect, useState } from "react";
// Jellyfin SDK
import { getArtistsApi } from "@jellyfin/sdk/lib/utils/api/artists-api";
import Artist from "../../../components/Jellyfin/Artist";
import { useJellyfin } from "../../../hooks/handleJellyfin";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { Menu } from "@headlessui/react";
import ThemeChanger from "../../../components/ThemeChanger";
import { useTheme } from "next-themes";

const LibraryArtistsIndex: NextPage = () => {
  const [artists, setArtists] = useState<any>(null);
  const [albums, setAlbums] = useState<any>(null);

  const [sortBy, setSortBy] = useState<
    "Album" | "Runtime" | "Random" | "RecentlyAdded" | "SortName"
  >("SortName");
  const [sortOrder, setSortOrder] = useState<"Ascending" | "Descending">(
    "Ascending"
  );

  const { api, user } = useJellyfin();

  const getJellyfinData = async () => {
    if (api) {
      const artistsData: any = await getArtistsApi(api).getAlbumArtists({
        userId: user?.Id,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
      });

      setArtists(artistsData.data.Items);
    } else {
      // console.log("no api, haha you suck lol");
    }
  };

  useEffect(() => {
    getJellyfinData();
  }, [user, sortBy, sortOrder]);

  const { theme } = useTheme();

  console.log("theme", theme)

  return (
    <div className="ml-3 pl-[17rem] pr-12">
      <div className="pt-[4.5rem] pb-8">
        <div
          style={{
            background: `linear-gradient(180deg, rgb(16, 185, 129) 0%, rgba(0, 0, 0, 0) 75%)`,
          }}
          className="absolute top-[4.5rem] left-60 w-full h-full -z-10 opacity-25 dark:opacity-75"
        ></div>
        <div className="pt-6">
          <ThemeChanger />
          <div className="flex justify-between flex-row">
            <h1 className="text-3xl font-semibold text-stone-900">
              Artists
            </h1>
            <div className="gap-2 flex flex-row">
              {/* create a custom dropdown menu to change the sortBy using menu from headlessui */}
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    className="inline-flex text-sm h-8 items-center justify-center border border-stone-200 hover:border-stone-300 active:border-stone-300 bg-stone-100 active:bg-stone-300 gap-2 overflow-hidden rounded-full px-3 text-stone-800 shadow-xl shadow-emerald-500/5 transition duration-300 ease-in-out hover:shadow-emerald-500/10
                dark:bg-stone-800 dark:text-white dark:border-stone-700 dark:hover:border-stone-600 dark:active:border-stone-600 dark:active:bg-stone-700
                "
                  >
                    <span>
                      {sortBy == "SortName"
                        ? "Name"
                        : sortBy == "RecentlyAdded"
                        ? "Recently Added"
                        : sortBy}
                    </span>
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute z-20 right-0 w-56 mt-2 origin-top-right divide-y bg-stone-100 ring-1 ring-stone-200 divide-gray-100 rounded-md shadow-lg outline-none dark:bg-stone-800 dark:text-white dark:ring-stone-700 focus:outline-none">
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
                              : "text-stone-800 dark:text-white"
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
                            setSortBy("Runtime");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-stone-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Duration
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
                              : "text-stone-800 dark:text-white"
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
                            setSortBy("RecentlyAdded");
                          }}
                          className={`${
                            active
                              ? "bg-emerald-500 text-white active:bg-emerald-600 transition-colors duration-100"
                              : "text-stone-800 dark:text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors duration-100`}
                        >
                          Recently Added
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
                              : "text-stone-800 dark:text-white"
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
                className="inline-flex text-sm h-8 items-center justify-center border border-stone-200 hover:border-stone-300 active:border-stone-300 bg-stone-100 active:bg-stone-300 gap-2 overflow-hidden rounded-full px-3 text-stone-800 shadow-xl shadow-emerald-500/5 transition duration-300 ease-in-out hover:shadow-emerald-500/10
                dark:bg-stone-800 dark:text-white dark:border-stone-700 dark:hover:border-stone-600 dark:active:border-stone-600 dark:active:bg-stone-700
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
          <div className="flex flex-row flex-wrap gap-x-8 gap-y-4 pt-4">
            {artists?.map((artist: any) => (
              <Artist artist={artist} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryArtistsIndex;
