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
    <div
      onClick={() => {
        router.push(`/library/albums/${album.Id}`);
      }}
      className="group-one flex w-48 flex-col select-none items-center justify-between gap-3 rounded-xl p-4 pb-6 text-sm text-zinc-700 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-zinc-100 active:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800/50 dark:active:bg-zinc-800/50 dark:bg-zinc-800/30 active:scale-95"
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
            <span className="inline-flex items-center gap-1 text-start text-xl font-semibold decoration-amber-500 decoration-2 hover:underline">
              {album.Name}
            </span>
            <span
              onClick={() =>
                router.push(`/library/artists/${album.ArtistItems[0].Id}`)
              }
              className="inline-flex items-center gap-1 text-start text-sm font-normal decoration-amber-500 decoration-2 hover:underline"
            >
              {album.ArtistItems[0].Name}
            </span>
            {/* show the production year in a chip */}
            <span className="inline-flex mt-1.5 items-center gap-1 text-start text-xs font-normal bg-zinc-800 text-white py-0.5 px-2.5 rounded-md shadow-amber-500/20 shadow-xl w-min ring-1 ring-zinc-700">
              {album.ProductionYear}
            </span>
          </button>
        </div>
      </button>
    </div>
  );
};

export default Album;
