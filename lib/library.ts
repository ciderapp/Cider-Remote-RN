import { LibraryPlaylist } from "@/types/musickit";
import { atom, getDefaultStore } from "jotai";
import { v3Turbo } from "./am-api";

const store = getDefaultStore();

export const libraryPlaylists = atom<LibraryPlaylist[]>([]);


export async function getLibraryPlaylists() {
  const res = await v3Turbo<LibraryPlaylist[]>("/v1/me/library/playlists");
  if(!res) return; 
  store.set(libraryPlaylists, res);
}
