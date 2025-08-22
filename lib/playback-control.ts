import { NowPlayingInfo, PlaybackInfoResponse, PlaybackStates } from "@/types";
import { CiderFetch } from "@/utils/fetch";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

export const nowPlayingItem = atom<NowPlayingInfo | null>(null);
export const playbackState = atom<PlaybackStates>("stopped");
export const isPlaying = atom((get) => get(playbackState) === "playing");

export async function getNowPlayingItem() {
  const res = await CiderFetch<PlaybackInfoResponse>(
    "/api/v1/playback/now-playing"
  );
  store.set(nowPlayingItem, res.info);
}

export async function seekTo(position: number) {
  console.log('Attempting to seek to position:', position);
  try {
    const response = await CiderFetch(
      "/api/v1/playback/seek",
      { position },
      {
        method: "POST",
      }
    );
    console.log('Seek API response:', response);
    return response;
  } catch (error) {
    console.error('Seek API error:', error);
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
