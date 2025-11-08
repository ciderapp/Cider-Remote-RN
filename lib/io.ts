import {
  APIPlaybackEvent,
  PlaybackStateDidChange,
  PlaybackTimeDidChange,
} from "@/types";
import { CiderFetch, getStorefront } from "@/utils/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, getDefaultStore } from "jotai";
import { io, Socket } from "socket.io-client";
import {
  getNowPlayingItem,
  playbackState,
  repeatMode,
  shuffleMode,
  volume,
} from "./playback-control";
import { fetchModifiedQueue, fetchQueue } from "./queue";

export class IOState {
  static instance: Socket;

  static hostAddressAtom = atom<string>("http://127.0.0.1:10767");

  static get hostAddress() {
    return IOState.store.get(IOState.hostAddressAtom);
  }

  static set hostAddress(value: string) {
    IOState.store.set(IOState.hostAddressAtom, value);
  }

  static store = getDefaultStore();

  static apiToken = atom<string | null>();

  static connected = atom(false);
  static progress = atom<number>(0);
  static duration = atom<number>(0);
  static currentProgress = atom((get) => {
    const progress = get(IOState.progress);
    const duration = get(IOState.duration);
    return (progress / duration) * 100;
  });

  static async load() {
    const apiToken = await AsyncStorage.getItem("apiToken");
    if (apiToken) {
      IOState.store.set(IOState.apiToken, apiToken);
    }
    const hostAddress = await AsyncStorage.getItem("hostAddress");
    if (hostAddress) {
      IOState.hostAddress = hostAddress;
    }
  }

  static async saveApiToken() {
    await AsyncStorage.setItem(
      "apiToken",
      IOState.store.get(IOState.apiToken)!
    );
    await AsyncStorage.setItem("hostAddress", IOState.hostAddress);
  }

  static disconnect() {
    IOState.instance.disconnect();
  }

  static async connect() {
    IOState.saveApiToken();

    const connectionTest = await IOState.testConnection();
    if(!connectionTest) {
      console.error("Failed to connect to server");
      return;
    }

    IOState.store.get(IOState.connected);
    IOState.instance = io(IOState.hostAddress);
    IOState.instance.on("connect", () => {
      console.log("Connected to server");
      IOState.store.set(IOState.connected, true);
      console.log(IOState.store.get(IOState.connected));
    });

    IOState.instance.on("disconnect", () => {
      console.log("Disconnected from server");
      IOState.store.set(IOState.connected, false);
    });

    IOState.instance.on("API:Playback", (msg: APIPlaybackEvent<any>) => {
      IOState.handlePlaybackEvent(msg);
    });

    await getStorefront();
    getNowPlayingItem();
    fetchModifiedQueue()
    fetchQueue();
  }

  static async testConnection() {
    const res = await CiderFetch<{
      status: string;
    }>('/api/v1/playback/active');

    if(!res) return false;

    if(res.status === "ok") {
      return true;
    }
    return false;
  }

  static handlePlaybackEvent(msg: APIPlaybackEvent<any>) {
    const { type } = msg;
    switch (type) {
      case "playbackStatus.playbackTimeDidChange": {
        const data = msg.data as PlaybackTimeDidChange;
        IOState.store.set(IOState.progress, data.currentPlaybackTime);
        IOState.store.set(IOState.duration, data.currentPlaybackDuration);
        IOState.store.set(playbackState, data.isPlaying ? "playing" : "paused");
        break;
      }
      case "playbackStatus.nowPlayingItemDidChange":
        getNowPlayingItem();
        console.log(msg);
        fetchModifiedQueue()
        fetchQueue();
        break;
      case "playbackStatus.playbackStateDidChange": {
        const data = msg.data as PlaybackStateDidChange;
        IOState.store.set(playbackState, data.state);
        break;
      }
      case "playerStatus.repeatModeDidChange": {
        const data = msg.data as number;
        IOState.store.set(repeatMode, data);
        break;
      }
      case "playerStatus.shuffleModeDidChange": {
        const data = msg.data as number;
        IOState.store.set(shuffleMode, data);
        break;
      }
      case "playerStatus.volumeDidChange": {
        const data = msg.data as number;
        IOState.store.set(volume, parseFloat(data.toFixed(2)));
        break;
      }
      default:
        console.warn("Unhandled playback event type:", type, msg.data);
        break;
    }
  }
}
