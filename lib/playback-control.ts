import { CastStatusResponse, NowPlayingInfo, PlaybackInfoResponse, PlaybackStates } from "@/types";
import { ItemTypes } from "@/types/search";
import { formatArtworkUrl } from "@/utils/artwork";
import { CiderFetch } from "@/utils/fetch";
import TrackPlayer, { Capability, RepeatMode } from "@weights-ai/react-native-track-player";
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
    !enable ? await pauseAudio(): null;
  } catch {}

  await CiderFetch<any>(
    "/api/v1/audiocasts/toggle-cast",
    { enable: enable },
    {
      method: "POST",
    }
  );

  try {
    enable ? await playAudio(): null;
  } catch {}

  store.set(isCasting, enable);
}

export async function UpdateNotification (data : any = null, isCasting: boolean = false) {
  try {
       console.log("Updating notification...", isCasting);
        let nowPlaying = data;
        if (!nowPlaying) {
            const res = await CiderFetch<PlaybackInfoResponse>(
                "/api/v1/playback/now-playing"
            );
            nowPlaying = res?.info;
        }
        // get current now playing info
        let notiNowPlaying = await TrackPlayer.getActiveTrack(); 

        let nowPlayingMetadata = {
            url: isCasting ? (IOState.hostAddress + "/api/v1/audiocasts/audio.mp3") : require("../assets/audio/2-seconds-of-silence.mp3") ,
            title: nowPlaying?.name,
            artist: nowPlaying?.artistName,
            album: nowPlaying?.albumName,
            artwork: nowPlaying?.artwork?.url ? formatArtworkUrl(nowPlaying?.artwork?.url, {width: 512, height: 512}) : undefined,
            duration: nowPlaying?.durationInMillis ? Math.round(nowPlaying?.durationInMillis) / 1000 : undefined, // in seconds
            elapsedTime: nowPlaying?.durationInMillis ? Math.round(nowPlaying?.currentPlaybackTime) : undefined, // in seconds
        };

        if (notiNowPlaying?.title === nowPlayingMetadata?.title &&
            notiNowPlaying?.artist === nowPlayingMetadata?.artist &&
            notiNowPlaying?.album === nowPlayingMetadata?.album) {
            console.log("Now playing metadata is the same, no update needed.");
            return;
        }

        let updateOptions = {
            notificationCapabilities: isCasting ? [
                Capability.Play,
                Capability.Pause,
                Capability.Stop,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
            ] : [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
            ]
        };


        if (!isCasting) {
            // await TrackPlayer.updateOptions(updateOptions);
            await TrackPlayer.setRepeatMode(RepeatMode.Off);
            await TrackPlayer.reset();
            await TrackPlayer.add(nowPlayingMetadata);
            await TrackPlayer.setRepeatMode(RepeatMode.Track);
            await TrackPlayer.play();
        } else {
            // await TrackPlayer.updateOptions(updateOptions);
            await TrackPlayer.updateNowPlayingMetadata(nowPlayingMetadata);
            await TrackPlayer.play();
        }  
    } catch (e) {
        console.error("Error updating notification:", e);
    }
};

export async function playAudio() {
  const res = await CiderFetch<PlaybackInfoResponse>(
    "/api/v1/playback/now-playing"
  );
  const nowPlaying = res?.info;
  var track1 = {
    url: IOState.hostAddress + "/api/v1/audiocasts/audio.mp3", // Load media from the network
    title: nowPlaying?.name ??  'Cider Remote',
    artist: nowPlaying?.artistName,
    album: nowPlaying?.albumName,
    artwork: nowPlaying?.artwork?.url ? formatArtworkUrl(nowPlaying?.artwork?.url, {width: 512, height: 512}) : undefined,
    duration: nowPlaying?.durationInMillis ? Math.round(nowPlaying?.durationInMillis) / 1000 : undefined, // in seconds
    elapsedTime: nowPlaying?.durationInMillis ? Math.round(nowPlaying?.currentPlaybackTime) : undefined, // in seconds
  };
  await TrackPlayer.reset();
  await TrackPlayer.add(track1);
  await TrackPlayer.play();
}

export async function pauseAudio() {
  console.log("Pausing audio playback...");
 const res = await CiderFetch<PlaybackInfoResponse>(
    "/api/v1/playback/now-playing"
  );
  const nowPlaying = res?.info;
  var track1 = {
      url: require("../assets/audio/2-seconds-of-silence.mp3"), // Load media from the network
    title: nowPlaying?.name ??  'Cider Remote',
    artist: nowPlaying?.artistName,
    album: nowPlaying?.albumName,
    artwork: nowPlaying?.artwork?.url ? formatArtworkUrl(nowPlaying?.artwork?.url, {width: 512, height: 512}) : undefined,
    duration: nowPlaying?.durationInMillis ? Math.round(nowPlaying?.durationInMillis) / 1000 : undefined, // in seconds
    elapsedTime: nowPlaying?.durationInMillis ? Math.round(nowPlaying?.currentPlaybackTime) : undefined, // in seconds
  };

  await TrackPlayer.reset();
  await TrackPlayer.add(track1);
  await TrackPlayer.setRepeatMode(RepeatMode.Track);
  await TrackPlayer.play();


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
