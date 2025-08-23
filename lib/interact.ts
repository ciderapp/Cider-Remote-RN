import { ItemTypes } from "@/types/search";
import { router } from "expo-router";
import { playItemHref, playLater, playNext } from "./playback-control";

type InteractOptions = {
  item: ItemTypes;
  playItem?: boolean;
};

type PlayActionPromise = {
  actionType: "play" | "play-next" | "play-later" | "cancel";
};

export const playActionPromise = {
  item: null as ItemTypes | null,
  resolve: (r: PlayActionPromise) => Promise.resolve(),
};

const itemHandlers: { [key: string]: (item: ItemTypes) => Promise<void> } = {
  playlists: async (item) => {},
  albums: async (item) => {
    router.push(`/albums/${item.id}`);
  },
  media: async (item) => {
    router.push("/play-action");
    playActionPromise.item = item;
    return new Promise<void>((resolve) => {
      playActionPromise.resolve = async (r) => {
        switch (r.actionType) {
          case "play":
            await playItemHref(item.href);
            break;
          case "play-next":
            await playNext(item);
            break;
          case "play-later":
            await playLater(item);
            break;
        }
        resolve();
      };
    });
  },
};

export async function interact(opts: InteractOptions) {
  const { item } = opts;
  const typeKey = item.type.replace("library-", "");
  const handler = itemHandlers[typeKey.endsWith("s") ? typeKey : `${typeKey}s`];
  if (handler && !opts.playItem) {
    return await handler(item);
  }
  return await itemHandlers["media"](item);
}
