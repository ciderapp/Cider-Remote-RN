import { Song } from "@/types/search";
import { v3Turbo } from "@/utils/fetch";

export async function getTracks(href: string): Promise<Song[]> {
  return await v3Turbo<Song[]>(href) || [];
}
