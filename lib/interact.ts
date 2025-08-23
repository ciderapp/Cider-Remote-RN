import { Album, ItemTypes, Playlist } from "@/types/search";
import { router } from "expo-router";
import { playItemHref, playLater, playNext } from "./playback-control";
import { changeToIndex } from "./queue";

type InteractOptions = {
  item: ItemTypes;
  playItem?: boolean;
  playAtIndex?: number;
  container?: Album | Playlist;
};

type PlayActionPromise = {
  actionType: "play" | "play-next" | "play-later" | "cancel";
};

export const playActionPromise = {
  item: null as ItemTypes | null,
  resolve: (r: PlayActionPromise) => Promise.resolve(),
};

const itemHandlers: {
  [key: string]: (item: ItemTypes, opts: InteractOptions) => Promise<void>;
} = {
  playlists: async (item, opts) => {
    router.push(`/playlists/${item.id}`);
  },
  albums: async (item, opts) => {
    router.push(`/albums/${item.id}`);
  },
  media: async (item, opts) => {
    router.push("/play-action");
    playActionPromise.item = item;
    return new Promise<void>((resolve) => {
      playActionPromise.resolve = async (r) => {
        switch (r.actionType) {
          case "play":
            if (opts.container) {
              await playItemHref(opts.container.href);

              // Needed until playItemHref in Cider is updated to include a playAtIndex param
              setTimeout(() => {
                if (opts.playAtIndex !== undefined) {
                  changeToIndex(opts.playAtIndex);
                }
              }, 1000);
              return;
            }
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
    return await handler(item, opts);
  }
  return await itemHandlers["media"](item, opts);
}
