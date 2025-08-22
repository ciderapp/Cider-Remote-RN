import { QueueItem } from "@/types/musickit";
import { CiderFetch } from "@/utils/fetch";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();
export const queueItems = atom<QueueItem[]>([]);
export const queuePosition = atom(0);

export async function fetchQueue() {
  const res = await CiderFetch<QueueItem[]>("/api/v1/playback/queue");
  store.set(queueItems, res);
}
