import {
    APIPlaybackEvent,
    PlaybackStateDidChange,
    PlaybackTimeDidChange
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, getDefaultStore } from "jotai";
import { io, Socket } from "socket.io-client";
import { getNowPlayingItem, playbackState } from "./playback-control";
import { fetchQueue } from "./queue";

export class IOState {
  static instance: Socket;

  static hostAddress = "http://localhost:10767";

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
  }

  static async saveApiToken() {
    await AsyncStorage.setItem(
      "apiToken",
      IOState.store.get(IOState.apiToken)!
    );
  }

  static disconnect() {
    IOState.instance.disconnect();
  }

  static connect() {
    IOState.saveApiToken();

    IOState.store.get(IOState.connected);
    IOState.instance = io("http://localhost:10767");
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

    getNowPlayingItem();
    fetchQueue();
  }

  static handlePlaybackEvent(msg: APIPlaybackEvent<any>) {
    const { type } = msg;
    switch (type) {
      case "playbackStatus.playbackTimeDidChange": {
        const data = msg.data as PlaybackTimeDidChange;
        IOState.store.set(IOState.progress, data.currentPlaybackTime);
        IOState.store.set(IOState.duration, data.currentPlaybackDuration);
        IOState.store.set(
          playbackState,
          data.isPlaying ? "playing" : "paused"
        );
        break;
      }
      case "playbackStatus.nowPlayingItemDidChange":
        getNowPlayingItem();
        console.log(msg)
        fetchQueue();
        break;
      case "playbackStatus.playbackStateDidChange": {
        const data = msg.data as PlaybackStateDidChange;
        IOState.store.set(playbackState, data.state);
        break;
      }
      default:
        console.warn("Unhandled playback event type:", type, msg.data);
        break;
    }
  }
}
