import { atom } from "jotai";
import { nowPlayingItem } from "./playback-control";
import { queueItems } from "./queue";

export const getQueueHistory = atom((get) => {
  const queue = get(queueItems);
  const nowPlaying = get(nowPlayingItem);

  if (!queue || !nowPlaying) return [];

  const nowPlayingId = nowPlaying.playParams?.id;
  if (!nowPlayingId) return [];

  const nowPlayingIndex = queue.findIndex(item =>
    item.id === nowPlayingId ||
    item.attributes?.playParams?.id === nowPlayingId ||
    item._container?.id === nowPlayingId
  );

  if (nowPlayingIndex === -1) return [];
  return queue.slice(0, nowPlayingIndex);
});
