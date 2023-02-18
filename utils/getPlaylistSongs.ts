export const getPlaylistSongs = async (
  playSong: boolean,
  setCurPlay: any,
  data: any,
  getAudioFromSong: any
) => {
  setCurPlay([]);
  if (data?.tracks?.length >= 1) {
    await data?.tracks?.map(async (track: any, idx: number) => {
      const songUrl = await getAudioFromSong(track?.videoId);
      // await setCurPlay((oldCurPlay: any) => [...oldCurPlay, idx]);
      await setCurPlay((oldPlaylist: any) => [
        ...oldPlaylist,
        {
          ...track,
          track: {
            title: track?.title,
            thumbnails: data?.thumbnails,
            isExplicit: track?.isExplicit,
            artists: track?.artists,
          },
          trackNum: idx,
          url: songUrl,
        },
      ]);
    });
  }
};
