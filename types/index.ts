import { MediaItemArtwork } from "./musickit";

export type APIPlaybackEvent<T> = {
  data: T;
  type: APIPlaybackType;
};

export type APIPlaybackType =
  | "playbackStatus.playbackTimeDidChange"
  | "playbackStatus.nowPlayingItemDidChange"
  | "playbackStatus.playbackStateDidChange"
  | "playerStatus.shuffleModeDidChange"
  | "playerStatus.repeatModeDidChange"
  | "playerStatus.volumeDidChange";

export type PlaybackTimeDidChange = {
  currentPlaybackDuration: number;
  currentPlaybackTime: number;
  currentPlaybackTimeRemaining: number;
  isPlaying: boolean;
};

export type PlaybackStates = "playing" | "paused" | "stopped";

export type PlaybackStateDidChange = {
    state: PlaybackStates;
    attributes: NowPlayingAttributes;
}

export type NowPlayingItemDidChange = NowPlayingAttributes;

export type NowPlayingAttributes = {
  albumName: string;
  artistName: string;
  artwork: MediaItemArtwork;
  audioLocale: string;
  audioTraits: string[];
  composerName: string;
  contentRating: string;
  discNumber: number;
  durationInMillis: number;
  genreNames: string[];
  hasLyrics: boolean;
  hasTimeSyncedLyrics: boolean;
  isAppleDigitalMaster: boolean;
  isMasteredForItunes: boolean;
  isVocalAttenuationAllowed: boolean;
  isrc: string;
  name: string;
  playParams: {
    catalogId: string;
    id: string;
    kind: string;
  };
  previews: {
    url: string;
  }[];
  releaseDate: string;
  trackNumber: number;
  url: string;
};

export type NowPlayingInfo = NowPlayingAttributes & {
  currentPlaybackTime: number;
  remainingTime: number;
  inFavorites: boolean;
  inLibrary: boolean;
  shuffleMode: number;
  repeatMode: number;
};

export type PlaybackInfoResponse = {
  status: "ok";
  info: NowPlayingInfo;
};
