import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";

interface Props {
  artist: any;
}

const Artist = ({ artist }: Props) => {
  const [serverUrl, setServerUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setServerUrl(localStorage.getItem("serverUrl") || "");
    }
  }, []);

  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/library/artists/${artist.Id}`);
      }}
      className="group-one flex w-48 flex-col select-none items-center justify-between gap-3 rounded-xl p-4 pb-4 text-sm text-stone-700 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-stone-100 active:bg-stone-100 dark:text-white dark:hover:bg-stone-800/50 dark:active:bg-stone-800/50 dark:bg-stone-800/30 active:scale-95"
    >
      <button className="flex flex-col gap-4 items-center">
        <div className="group relative flex items-center justify-center overflow-hidden rounded-md transition-all">
          <img
            draggable={false}
            className="h-40 w-40 rounded-xl"
            src={
              artist?.ImageTags?.Primary
                ? `${serverUrl}/Items/${artist?.Id}/Images/Primary?maxHeight=400&tag=${artist?.ImageTags?.Primary}&quality=90`
                : "/images/artist.png"
            }
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center">
          <button className="flex flex-row gap-3">
            <span className="inline-flex items-center gap-1 text-center text-base font-bold decoration-emerald-500 decoration-2 hover:underline">
              {artist.Name}
            </span>
          </button>
        </div>
      </button>
    </div>
  );
};

export default Artist;
