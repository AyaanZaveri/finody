import Tilt from "react-parallax-tilt";

interface Props {
  album: any;
}

const Album = ({ album }: Props) => {
  return (
    <div className="group-one flex w-48 flex-col select-none items-center justify-between gap-3 rounded-xl bg-white p-4 pb-8 text-sm text-slate-700 active:ring-1 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-100 active:ring-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 dark:active:ring-1 dark:active:ring-slate-700">
      <button className="flex flex-col gap-4 items-start">
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
                album?.ImageTags?.Primary
                  ? `https://revised-tribunal-telephony-arise.trycloudflare.com/Items/${album?.Id}/Images/Primary?maxHeight=400&tag=${album?.ImageTags?.Primary}&quality=90`
                  : "/images/album.png"
              }
              alt=""
            />
          </div>
        </Tilt>
        <div className="flex flex-col justify-start">
          <button className="flex flex-col text-start items-start">
            <span className="inline-flex items-center gap-1 text-start text-xl font-semibold decoration-emerald-500 decoration-2 hover:underline">
              {album.Name}
            </span>
            <span className="inline-flex items-center gap-1 text-start text-sm font-normal decoration-emerald-500 decoration-2 hover:underline">
              {album.ArtistItems[0].Name}
            </span>
            {/* show the production year in a chip */}
            <span className="inline-flex mt-1 items-center gap-1 text-start text-xs font-normal bg-slate-700 text-white py-0.5 px-2.5 rounded-full">
              {album.ProductionYear}
            </span>
          </button>
        </div>
      </button>
    </div>
  );
};

export default Album;
