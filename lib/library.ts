import { LibraryPlaylist } from "@/types/musickit";
import { v3Turbo } from "@/utils/fetch";
import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

export const libraryPlaylists = atom<LibraryPlaylist[]>([]);
export const libraryPlaylistsLoading = atom<boolean>(false);

export async function getLibraryPlaylists() {
  store.set(libraryPlaylistsLoading, true);
  const res = await v3Turbo<LibraryPlaylist[]>("/v1/me/library/playlists");
  if(!res) return; 
  store.set(libraryPlaylists, res);
  store.set(libraryPlaylistsLoading, false);
}