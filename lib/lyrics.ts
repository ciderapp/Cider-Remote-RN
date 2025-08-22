import { v3 } from "./am-api";

type LyricApiResponse = {
  data?: {
    data: {
      id: string;
      type: "lyrics";
      attributes: {
        ttml: string;
      };
    }[];
  };
  errors?: {
    id: string;
    title: string;
    detail: string;
    status: string;
  }[];
};

export interface LyricLine {
  text: string;
  begin: number;
  end: number;
  songPart?: string;
}

function parseTtmlTime(time: string): number {
  if (!time) return 0;
  const parts = time.split(":").map(parseFloat);
  let seconds = 0;
  if (parts.length === 3) {
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    seconds = parts[0] * 60 + parts[1];
  } else {
    seconds = parts[0];
  }
  return seconds;
}

export async function parseTtml(ttml: string): Promise<LyricLine[]> {
  if (!ttml) {
    return [];
  }
  return [];
}

export async function getLyrics(id: string) {
  const res = await v3<LyricApiResponse>(`/v1/catalog/us/songs/${id}/lyrics`);
  if (res.errors || !res.data || res.data.data.length === 0) {
    console.warn("No lyrics found for song", id, res.errors);
    return null;
  }
  const ttml = res.data.data[0].attributes.ttml;
  return parseTtml(ttml);
}
