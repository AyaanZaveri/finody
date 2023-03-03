import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";

interface Props {
  album: any;
}

const Album = ({ album }: Props) => {
  const router = useRouter();

  const [serverUrl, setServerUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setServerUrl(localStorage.getItem("serverUrl") || "");
    }
  }, []);

  return (
    <>
      {album?.Id && serverUrl && album?.Name && album?.AlbumArtist ? (
        <div
          onClick={() => {
            router.push(`/library/albums/${album.Id}`);
          }}
          className="group-one flex w-48 flex-col select-none items-center justify-between gap-3 rounded-xl p-4 pb-6 text-sm text-slate-700 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-100 active:bg-slate-100 dark:text-white dark:hover:bg-slate-800/50 dark:active:bg-slate-800/50 dark:bg-slate-800/30 active:scale-95 hover:scale-[1.02]"
        >
          <button className="flex flex-col gap-4 items-start">
            <div className="group relative flex items-center justify-center overflow-hidden rounded-md transition-all">
              <img
                draggable={false}
                className="h-40 w-40 rounded-xl"
                src={
                  album?.ImageTags?.Primary
                    ? `${serverUrl}/Items/${album?.Id}/Images/Primary?maxHeight=400&tag=${album?.ImageTags?.Primary}&quality=90`
                    : "/images/album.png"
                }
                alt=""
              />
            </div>
            <div className="flex flex-col justify-start">
              <button className="flex flex-col text-start items-start">
                <span className="inline-flex items-center gap-1 text-start text-xl font-bold decoration-emerald-500 decoration-2 hover:underline">
                  {album.Name}
                </span>
                <span
                  onClick={() =>
                    router.push(`/library/artists/${album.ArtistItems[0].Id}`)
                  }
                  className="inline-flex items-center gap-1 text-start text-sm font-normal decoration-emerald-500 decoration-2 hover:underline"
                >
                  {album.ArtistItems[0].Name}
                </span>
                {/* show the production year in a chip */}
                <span className="inline-flex mt-1.5 items-center gap-1 text-start text-xs font-normal bg-slate-800 text-white py-0.5 px-2.5 rounded-md shadow-emerald-500/20 shadow-xl w-min ring-1 ring-slate-700">
                  {album.ProductionYear}
                </span>
              </button>
            </div>
          </button>
        </div>
      ) : (
        // make a skeleton
        <div className="group-one flex w-48 flex-col select-none items-center justify-between gap-3 rounded-xl p-4 pb-6 text-sm text-slate-700 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-100 active:bg-slate-100 dark:text-white dark:hover:bg-slate-800/50 dark:active:bg-slate-800/50 dark:bg-slate-800/30 active:scale-95 hover:scale-[1.02]">
          <button className="flex flex-col gap-4 items-start">
            <div className="group relative flex items-center justify-center overflow-hidden rounded-md transition-all">
              <div className="h-40 w-40 rounded-xl bg-slate-800/50 animate-pulse"></div>
            </div>
            <div className="flex flex-col justify-start">
              <button className="flex flex-col text-start items-start">
                <span className="inline-flex items-center gap-1 text-start text-xl font-bold decoration-emerald-500 decoration-2 hover:underline">
                  <div className="w-40 h-4 bg-slate-800/30 animate-pulse"></div>
                </span>
                <span className="inline-flex items-center gap-1 text-start text-sm font-normal decoration-emerald-500 decoration-2 hover:underline">
                  <div className="w-40 h-4 bg-slate-800/30 animate-pulse"></div>
                </span>
                {/* show the production year in a chip */}
                <span className="inline-flex mt-1.5 items-center gap-1 text-start text-xs font-normal text-white py-0.5 px-2.5 rounded-md shadow-emerald-500/20 shadow-xl w-10 h-4 bg-slate-800/30 animate-pulse">
                </span>
              </button>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default Album;
