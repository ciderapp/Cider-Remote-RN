import { ItemTypes } from "@/types/search";
import { router } from "expo-router";
import { playItemHref, playLater, playNext } from "./playback-control";

type InteractOptions = {
  item: ItemTypes;
};

type PlayActionPromise = {
  actionType: "play" | "play-next" | "play-later" | "cancel";
};

export const playActionPromise = {
  item: null as ItemTypes | null,
  resolve: (r: PlayActionPromise) => Promise.resolve(),
};

const itemHandlers: { [key: string]: (item: ItemTypes) => Promise<void> } = {
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
  const handler = itemHandlers[item.type];
  if (handler) {
    return await handler(item);
  }
  return await itemHandlers["media"](item);
}
