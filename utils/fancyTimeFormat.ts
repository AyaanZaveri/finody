export const fancyTimeFormat = (duration: number) => {
  // convert ticks to "x minutes, y seconds"
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration - minutes * 60);
  return `${minutes} minutes, ${seconds} seconds`;
};
