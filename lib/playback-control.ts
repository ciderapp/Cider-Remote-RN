import { audioPlayer } from "@/app/_layout";
import { CastStatusResponse, NowPlayingInfo, PlaybackInfoResponse, PlaybackStates } from "@/types";
import { ItemTypes } from "@/types/search";
import { CiderFetch } from "@/utils/fetch";
import { atom, getDefaultStore } from "jotai";
import { IOState } from "./io";

const store = getDefaultStore();

export const nowPlayingItem = atom<NowPlayingInfo | null>(null);
export const playbackState = atom<PlaybackStates>("stopped");
export const isPlaying = atom((get) => get(playbackState) === "playing");
export const volume = atom(1);
export const shuffleMode = atom(0);
export const repeatMode = atom(0);
export const isShuffleOn = atom((get) => get(shuffleMode) === 1);
export const isCasting = atom(false);

export async function getVolume() {
  const res = await CiderFetch<{ volume: number }>("/api/v1/playback/volume");
  if(!res) return;
  store.set(volume, res.volume);
}

export async function getNowPlayingItem() {
  const res = await CiderFetch<PlaybackInfoResponse>(
    "/api/v1/playback/now-playing"
  );
  if(!res) return;
  if(!res.info) {
    console.warn('/api/v1/playback/now-playing did not return info')
    return;
  }
  store.set(nowPlayingItem, res.info);
  store.set(repeatMode, res.info.repeatMode);
  store.set(shuffleMode, res.info.shuffleMode);
}

export async function getCastStatus() {
  const res = await CiderFetch<CastStatusResponse>(
    "/api/v1/audiocasts/status"
  );
  if(!res) return;
  console.log("Cast status:", res.isCasting);
  store.set(isCasting, res.isCasting);
}

export async function toggleCast(enable: boolean) {
  console.log("Toggling cast to:", enable);
  try {
    !enable ? pauseAudio(): null;
  } catch {}

  await CiderFetch<any>(
    "/api/v1/audiocasts/toggle-cast",
    { enable: enable },
    {
      method: "POST",
    }
  );

  try {
    enable ? playAudio(): null;
  } catch {}

  store.set(isCasting, enable);
}

export function playAudio() {
  audioPlayer.replace(IOState.hostAddress + "/api/v1/audiocasts/audio.mp3");
  audioPlayer.volume = 1;
  audioPlayer.play();
}

export function pauseAudio() {
  audioPlayer.volume = 0;
  audioPlayer.pause();
  audioPlayer.remove();
}

export async function playLater(item: ItemTypes) {
  const res = await CiderFetch<PlaybackInfoResponse>(
    "/api/v1/playback/play-later",
    {
      id: item.id,
      type: item.type,
    },
    {
      method: "POST",
    }
  );
}

export async function playNext(item: ItemTypes) {
  const res = await CiderFetch<PlaybackInfoResponse>(
    "/api/v1/playback/play-next",
    {
      id: item.id,
      type: item.type,
    },
    {
      method: "POST",
    }
  );
}

export async function playItemHref(href: string) {
  const res = await CiderFetch<PlaybackInfoResponse>(
    "/api/v1/playback/play-item-href",
    {
      href,
    },
    {
      method: "POST",
    }
  );
}

export async function seekTo(position: number) {
  console.log("Attempting to seek to position:", position);
  try {
    const response = await CiderFetch(
      "/api/v1/playback/seek",
      { position },
      {
        method: "POST",
      }
    );
    console.log("Seek API response:", response);
    return response;
  } catch (error) {
    console.error("Seek API error:", error);
    throw error;
  }
}

export async function playPause() {
  await CiderFetch(
    "/api/v1/playback/playpause",
    {},
    {
      method: "POST",
    }
  );
}

export async function nextTrack() {
  await CiderFetch(
    "/api/v1/playback/next",
    {},
    {
      method: "POST",
    }
  );
}

export async function previousTrack() {
  await CiderFetch(
    "/api/v1/playback/previous",
    {},
    {
      method: "POST",
    }
  );
}

export async function setVolume(volume: number) {
  await CiderFetch(
    "/api/v1/playback/volume",
    { volume },
    {
      method: "POST",
    }
  );
}

export async function toggleRepeat() {
  await CiderFetch(
    "/api/v1/playback/toggle-repeat",
    {},
    {
      method: "POST",
    }
  );
}

export async function toggleShuffle() {
  await CiderFetch(
    "/api/v1/playback/toggle-shuffle",
    {},
    {
      method: "POST",
    }
  );
}

export async function toggleAutoplay() {
  await CiderFetch(
    "/api/v1/playback/toggle-autoplay",
    {},
    {
      method: "POST",
    }
  );
}
