import { QueueItem } from "@/types/musickit";
import { CiderFetch } from "@/utils/fetch";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();
export const queueItems = atom<QueueItem[]>([]);
export const queuePosition = atom(0);

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
}

export async function changeToIndex(index: number) {
  const res = await CiderFetch("/api/v1/playback/queue/change-to-index", { index }, {
    method: "POST",
  });
  if (!res) return;
  await fetchQueue();
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
}
