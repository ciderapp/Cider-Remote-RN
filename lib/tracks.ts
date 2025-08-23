import { Song } from "@/types/search";
import { v3Turbo } from "./am-api";

export async function getTracks(href: string): Promise<Song[]> {
  return await v3Turbo<Song[]>(href) || [];
}
