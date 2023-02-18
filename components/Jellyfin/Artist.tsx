import Tilt from "react-parallax-tilt";

interface Props {
  artist: any;
}

const Artist = ({ artist }: Props) => {
  console.log(artist);

  return (
    <div className="group-one flex w-48 flex-col select-none items-center justify-between gap-3 rounded-xl bg-white p-4 pb-4 text-sm text-slate-700 active:ring-1 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-100 active:ring-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 dark:active:ring-1 dark:active:ring-slate-700">
      <button className="flex flex-col gap-4 items-center">
        <Tilt
          glareEnable={true}
          glareMaxOpacity={0.8}
          glareColor="#ffffff"
          glarePosition="bottom"
          glareBorderRadius="12px"
        >
          <div className="group relative flex items-center justify-center overflow-hidden rounded-md transition-all">
            <img
              draggable={false}
              className="h-40 w-40 rounded-xl"
              src={
                artist?.ImageTags?.Primary
                  ? `https://revised-tribunal-telephony-arise.trycloudflare.com/Items/${artist?.Id}/Images/Primary?maxHeight=400&tag=${artist?.ImageTags?.Primary}&quality=90`
                  : "/images/artist.png"
              }
              alt=""
            />
          </div>
        </Tilt>
        <div className="flex flex-col justify-center">
          <button className="flex flex-row gap-3">
            <span className="inline-flex items-center gap-1 text-center text-base font-semibold decoration-emerald-500 decoration-2 hover:underline">
              {artist.Name}
            </span>
          </button>
        </div>
      </button>
    </div>
  );
};

export default Artist;
