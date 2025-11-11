import { NowPlayingInfo, PlaybackInfoResponse, PlaybackStates } from "@/types";
import { ItemTypes } from "@/types/search";
import { formatArtworkUrl } from "@/utils/artwork";
import { CiderFetch } from "@/utils/fetch";
import { atom, getDefaultStore } from "jotai";
import MusicControl from "react-native-music-control";
import { IOState } from "./io";

const store = getDefaultStore();

export const nowPlayingItem = atom<NowPlayingInfo | null>(null);
export const playbackState = atom<PlaybackStates>("stopped");
export const lastElapsedTime = atom<number>(-2);
export const isPlaying = atom((get) => get(playbackState) === "playing");
export const volume = atom(1);
export const shuffleMode = atom(0);
export const repeatMode = atom(0);
export const isShuffleOn = atom((get) => get(shuffleMode) === 1);
export const currentNotificationItem = atom<any | null>(null);

export async function getVolume() {
  const res = await CiderFetch<{ volume: number }>("/api/v1/playback/volume");
  if(!res) return;
  /// Check if res.volume is valid, sometimes Cider sent nowPlayingItem as volume, causing crashes
  if (typeof res.volume !== 'number' || res.volume < 0 || res.volume > 1) {
    console.warn('/api/v1/playback/volume returned invalid volume:', res.volume);
    return;
  }
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

export function resetElapsedTime() {
  try {
    store.set(lastElapsedTime, -2);
  } catch (e) {
    console.error("Error resetting elapsed time:", e);
  }
}


export async function UpdateNotificationMinimal(elapsedTime?: number, playState?: PlaybackStates) {
  try {
        let lastTime = store.get(lastElapsedTime);
        let targetElapsedTime = elapsedTime ? elapsedTime : (IOState.store.get(IOState.progress) || lastTime || 0);
        // console.log("Updating notification elapsed time to:", targetElapsedTime);
        // Update only if the target elapsed time > 1.5 seconds different from last elapsed time
        
        if (Math.abs(targetElapsedTime - lastTime) < 1.5) {
            return;
        }
        store.set(lastElapsedTime, targetElapsedTime);
        MusicControl.updatePlayback({
          state: playState ? (playState === "playing" ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED) : (store.get(isPlaying) ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED),
          elapsedTime: targetElapsedTime ,
        });
    } catch (e) {
        console.error("Error updating notification elapsed time:", e);
    }
}


export async function UpdateNotification (data : any = null) {
  try {
        let nowPlaying = data;
        if (!nowPlaying) {
            const res = await CiderFetch<PlaybackInfoResponse>(
                "/api/v1/playback/now-playing"
            );
            nowPlaying = res?.info;
        }
        // get current now playing info
        let notiNowPlaying = store.get(currentNotificationItem);
        
        let nowPlayingMetadata = {
            title: nowPlaying?.name,
            artist: nowPlaying?.artistName,
            album: nowPlaying?.albumName,
            artwork: nowPlaying?.artwork?.url ? formatArtworkUrl(nowPlaying?.artwork?.url, {width: 512, height: 512}) : undefined,
            duration: nowPlaying?.durationInMillis ? Math.round(nowPlaying?.durationInMillis) / 1000 : undefined, // in seconds
            elapsedTime: nowPlaying?.currentPlaybackTime ? Math.round(nowPlaying?.currentPlaybackTime) : IOState.store.get(IOState.progress), // in seconds
            isPlaying: store.get(isPlaying),
        };

        console.log("New notification item:", nowPlayingMetadata);

        if (notiNowPlaying?.title === nowPlayingMetadata?.title &&
            notiNowPlaying?.artist === nowPlayingMetadata?.artist &&
            notiNowPlaying?.album === nowPlayingMetadata?.album &&
            notiNowPlaying?.isPlaying === nowPlayingMetadata?.isPlaying
          ) {
            console.log("Now playing metadata is the same, no update needed.");
            return;
        }
        store.set(currentNotificationItem, nowPlayingMetadata);
        MusicControl.setNowPlaying({
          title: nowPlayingMetadata.title,
          artwork: nowPlayingMetadata.artwork,
          artist: nowPlayingMetadata.artist,
          duration: nowPlayingMetadata.duration,
          elapsedTime: nowPlayingMetadata.elapsedTime || 0,
          state: nowPlayingMetadata.isPlaying ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED,
        });
        MusicControl.updatePlayback({
          state: nowPlayingMetadata.isPlaying ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED,
          elapsedTime: nowPlayingMetadata.elapsedTime || 0,
        });
    } catch (e) {
        console.error("Error updating notification:", e);
    }
};

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
    resetElapsedTime();
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
