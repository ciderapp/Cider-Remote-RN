import type NativeMusicControl from "react-native-music-control";
import { Command } from "react-native-music-control/lib/types";

/**
 * react-native-music-control only ships Android/iOS builds, so importing it on
 * web breaks the bundle. Media notifications don't exist on web; no-op instead.
 */
const noop = () => {};

const MusicControl: typeof NativeMusicControl = {
  STATE_PLAYING: "STATE_PLAYING",
  STATE_PAUSED: "STATE_PAUSED",
  STATE_ERROR: "STATE_ERROR",
  STATE_STOPPED: "STATE_STOPPED",
  STATE_BUFFERING: "STATE_BUFFERING",
  RATING_HEART: 0,
  RATING_THUMBS_UP_DOWN: 0,
  RATING_3_STARS: 0,
  RATING_4_STARS: 0,
  RATING_5_STARS: 0,
  RATING_PERCENTAGE: 0,
  enableBackgroundMode: noop,
  setNowPlaying: noop,
  setPlayback: noop,
  updatePlayback: noop,
  resetNowPlaying: noop,
  enableControl: noop,
  handleCommand: noop,
  setNotificationId: noop,
  on: noop,
  off: noop,
  stopControl: noop,
  handleAudioInterruptions: noop,
  setAudioSessionActivity: async () => false,
  setAudioSessionOptions: async () => false,
  observeOutputVolume: noop,
  getOutputVolume: async () => 0,
};

export { Command };
export default MusicControl;
