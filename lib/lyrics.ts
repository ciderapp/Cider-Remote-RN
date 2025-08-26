import { v3 } from "@/utils/fetch";

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

// Lightweight TTML parser for React Native
export async function parseTtml(ttml: string): Promise<LyricLine[]> {
  if (!ttml) {
    return [];
  }

  const decodedTtml = ttml.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

  // Extract songPart from div tag
  const divRegex = /<div[^>]*itunes:songPart="([^"]*)"[^>]*>([\s\S]*?)<\/div>/g;
  const pRegex = /<p([^>]*)>([\s\S]*?)<\/p>/g;
  const beginRegex = /begin="([^"]*)"/;
  const endRegex = /end="([^"]*)"/;

  const lines: LyricLine[] = [];
  let divMatch: RegExpExecArray | null;

  while ((divMatch = divRegex.exec(decodedTtml)) !== null) {
    const songPart = divMatch[1];
    const divContent = divMatch[2];

    let pMatch: RegExpExecArray | null;
    while ((pMatch = pRegex.exec(divContent)) !== null) {
      const pAttrs = pMatch[1];
      const text = pMatch[2].trim();

      const beginMatch = beginRegex.exec(pAttrs);
      const endMatch = endRegex.exec(pAttrs);

      if (beginMatch && endMatch && text) {
        lines.push({
          text,
          begin: parseTtmlTime(beginMatch[1]),
          end: parseTtmlTime(endMatch[1]),
          songPart,
        });
      }
    }
  }

  return lines;
}

export async function getLyrics(id: string) {
  const res = await v3<LyricApiResponse>(`/v1/catalog/$STOREFRONT/songs/${id}/lyrics`);
  if (res.errors || !res.data || res.data.data.length === 0) {
    console.warn("No lyrics found for song", id, res.errors);
    return null;
  }
  const ttml = res.data.data[0].attributes.ttml;
  return parseTtml(ttml);
}