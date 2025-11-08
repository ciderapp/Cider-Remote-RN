import { QueueItem } from "@/types/musickit";
import { CiderFetch } from "@/utils/fetch";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();
export const queueItems = atom<QueueItem[]>([]);
export const queuePosition = atom(0);

export const modifiedQueueItems = atom<QueueItem[]>([]);

export async function fetchModifiedQueue() {
  await fetchQueue();
  const nowPlayingRes = await CiderFetch<{ info: { playParams: { id: string } } }>("/api/v1/playback/now-playing");
  if (!nowPlayingRes?.info?.playParams.id) return;
  const nowPlayingId = nowPlayingRes?.info?.playParams.id;

  const queueRes = await CiderFetch<QueueItem[]>("/api/v1/playback/queue");
  if (!queueRes) return;

  const nowPlayingIndex = queueRes.findIndex((item) => {
    const id = item._container?.id || item.id || item._songId;
    return id === nowPlayingId;
  });
  const modifiedQueue = (nowPlayingIndex >= 0 ? queueRes.slice(nowPlayingIndex) : queueRes)
    .map((item, i) => {
      const itemId = item._container?.id || item.id || item._songId;
      const originalIndex = queueRes.findIndex((q) => (q._container?.id || q.id || q._songId) === itemId);
      if (originalIndex === -1) {
        queueRes.forEach(q => console.log('  queueRes id:', q._container?.id || q.id || q._songId));
      }
      return { ...item, originalIndex };
    });
  store.set(modifiedQueueItems, modifiedQueue);
}

export async function fetchQueue() {
  const res = await CiderFetch<QueueItem[]>("/api/v1/playback/queue");
  if (!res) return;
  store.set(queueItems, res);
}

export async function clearQueue() {
  const res = await CiderFetch("/api/v1/playback/queue/clear", {
    method: "POST",
  });
  if (!res) return;
  await fetchQueue();
  await fetchModifiedQueue();
}

export async function changeToIndex(index: number) {
  const res = await CiderFetch("/api/v1/playback/queue/change-to-index", { index }, {
    method: "POST",
  });
  if (!res) return;
  await fetchQueue();
  await fetchModifiedQueue();
}

export async function removeByIndex(index: number) {
  const res = await CiderFetch(
    "/api/v1/playback/queue/remove-by-index",
    {
      index,
    },
    {
      method: "POST",
    }
  );
  if (!res) return;
  await fetchQueue();
  await fetchModifiedQueue();
}

export async function moveToPosition(
  startIndex: number,
  destinationIndex: number
) {
  const res = await CiderFetch(
    "/api/v1/playback/queue/move-to-position",
    { startIndex, destinationIndex },
    {
      method: "POST",
    }
  );
  if (!res) return;
  await fetchQueue();
  await fetchModifiedQueue();
}
