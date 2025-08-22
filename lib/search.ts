import { SearchResponse } from "@/types/search";
import { v3 } from "./am-api";

const itemTypes = {
  catalog: [
    "activities",
    "albums",
    "apple-curators",
    "artists",
    "curators",
    "editorial-items",
    "music-movies",
    "music-videos",
    "playlists",
    "songs",
    "stations",
    "tv-episodes",
    "uploaded-videos",
    "record-labels",
  ],
  library: [
    "library-songs",
    "library-albums",
    "library-artists",
    "library-playlists",
  ],
  social: ["playlists", "social-profiles"],
};

export async function searchCatalog(query: string) {
  const res = await v3<{
    data: SearchResponse
  }>("/v1/catalog/us/search", {
    term: query,
    "relate[editorial-items]": "contents",
    "include[editorial-items]": "contents",
    "include[albums]": "artists",
    "include[artists]": "artists",
    "include[songs]": "artists,albums",
    "include[music-videos]": "artists",
    extend: "artistUrl",
    "fields[artists]": "url,name,artwork,hero",
    "fields[albums]":
      "artistName,artistUrl,artwork,contentRating,editorialArtwork,editorialVideo,name,playParams,releaseDate,url",
    with: "serverBubbles,lyricHighlights",
    "art[url]": "c,f",
    "omit[resource]": "autos",
    types: itemTypes["catalog"].join(","),
    platform: "web",
    limit: 25,
  });
  return res?.data;
}
