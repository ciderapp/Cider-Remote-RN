// This file contains the TypeScript types for the Apple Music API search response.

/**
 * Represents the root object of the API response.
 */
export interface SearchResponse {
  results: Results;
  meta: Meta;
}

/**
 * Contains the search results, categorized by type.
 */
export interface Results {
  album: AlbumResult;
  artist: ArtistResult;
  music_video: MusicVideoResult;
  playlist: PlaylistResult;
  radio_episode: RadioEpisodeResult;
  song: SongResult;
  station: StationResult;
  top: TopResult;
}

/**
 * Represents a generic resource link with an ID, type, and href.
 */
export interface Resource {
  id: string;
  type: string;
  href: string;
}

/**
 * Represents a collection of search results for a specific type.
 */
export interface Result<T> {
  href: string;
  next?: string;
  data: T[];
  name?: string;
  groupId?: string;
}

// Specific Result Types
export type AlbumResult = Result<Album>;
export type ArtistResult = Result<Artist>;
export type MusicVideoResult = Result<MusicVideo>;
export type PlaylistResult = Result<Playlist>;
export type RadioEpisodeResult = Result<RadioEpisode>;
export type SongResult = Result<Song>;
export type StationResult = Result<Station>;
export type TopResult = Result<Artist | Album | Song>;

/**
 * Represents the common artwork structure.
 */
export interface Artwork {
  bgColor: string;
  hasP3: boolean;
  height: number;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
  url: string;
  width: number;
}

/**
 * Represents the play parameters for a media item.
 */
export interface PlayParams {
  id: string;
  kind: string;
}

/**
 * Represents a relationship to another resource.
 */
export interface Relationship<T> {
  href: string;
  data: T[];
}

/**
 * Represents an Album resource.
 */
export interface Album extends Resource {
  attributes: AlbumAttributes;
  relationships: {
    artists: Relationship<Artist>;
  };
}

/**
 * Attributes for an Album.
 */
export interface AlbumAttributes {
  artistName: string;
  artistUrl: string;
  artwork: Artwork;
  contentRating?: string;
  editorialArtwork: EditorialArtwork;
  editorialVideo?: EditorialVideo;
  name: string;
  playParams: PlayParams;
  releaseDate: string;
  url: string;
}

/**
 * Represents editorial artwork for an album.
 */
export interface EditorialArtwork {
  staticDetailSquare?: PreviewFrame;
  staticDetailTall?: PreviewFrame;
  originalFlowcaseBrick?: PreviewFrame;
  subscriptionHero?: PreviewFrame;
}

/**
 * Represents editorial video content.
 */
export interface EditorialVideo {
  motionDetailSquare: MotionDetail;
  motionDetailTall: MotionDetail;
  motionSquareVideo1x1: MotionDetail;
}

/**
 * Represents a motion detail with a preview frame and video URL.
 */
export interface MotionDetail {
  previewFrame: PreviewFrame;
  video: string;
}

/**
 * Represents a preview frame with artwork details.
 */
export interface PreviewFrame extends Artwork {
  gradient?: {
    color: string;
    y2: number;
  };
  textGradient?: string[];
}

/**
 * Represents an Artist resource.
 */
export interface Artist extends Resource {
  attributes: ArtistAttributes;
}

/**
 * Attributes for an Artist.
 */
export interface ArtistAttributes {
  artwork: Artwork;
  hero?: Hero[];
  name: string;
  url: string;
}

/**
 * Represents a hero image for an artist.
 */
export interface Hero {
  content: {
    artwork: Artwork & {
      recommendedCropCodes?: string[];
    };
  }[];
}

/**
 * Represents a Music Video resource.
 */
export interface MusicVideo extends Resource {
  attributes: MusicVideoAttributes;
  relationships: {
    artists: Relationship<Artist>;
  };
}

/**
 * Attributes for a Music Video.
 */
export interface MusicVideoAttributes {
  artistName: string;
  artwork: Artwork;
  durationInMillis: number;
  genreNames: string[];
  has4K: boolean;
  hasHDR: boolean;
  isrc: string;
  name: string;
  playParams: PlayParams;
  previews: Preview[];
  releaseDate: string;
  url: string;
  videoTraits: string[];
  albumName?: string;
  artistUrl?: string;
  discNumber?: number;
  trackNumber?: number;
}

/**
 * Represents a preview for a music video.
 */
export interface Preview {
  artwork: Artwork;
  hlsUrl: string;
  url: string;
}

/**
 * Represents a Playlist resource.
 */
export interface Playlist extends Resource {
  attributes: PlaylistAttributes;
}

/**
 * Attributes for a Playlist.
 */
export interface PlaylistAttributes {
  artwork: Artwork;
  curatorName: string;
  description?: {
    short: string;
    standard: string;
  };
  editorialNotes?: {
    name: string;
    short: string;
    standard: string;
  };
  editorialPlaylistKind?: string;
  hasCollaboration: boolean;
  isChart: boolean;
  lastModifiedDate: string;
  name: string;
  playParams: PlayParams & {
    versionHash: string;
  };
  playlistType: "editorial" | "user-shared";
  url: string;
}

/**
 * Represents a Radio Episode resource (typed as Station in the JSON).
 */
export interface RadioEpisode extends Resource {
  attributes: RadioEpisodeAttributes;
}

/**
 * Attributes for a Radio Episode.
 */
export interface RadioEpisodeAttributes {
  airTime: {
    end: string;
    start: string;
  };
  artwork: Artwork;
  durationInMillis: number;
  editorialNotes: {
    name: string;
    short: string;
    standard: string;
    tagline?: string;
  };
  episodeNumber?: string;
  isLive: boolean;
  kind: string;
  mediaKind: string;
  name: string;
  playParams: {
    format: string;
    hasDrm: boolean;
    id: string;
    kind: string;
    mediaType: number;
    stationHash: string;
    streamingKind: number;
  };
  radioUrl: string;
  requiresSubscription: boolean;
  streamingRadioSubType: string;
  supportedDrms: string[];
  url: string;
}

/**
 * Represents a Song resource.
 */
export interface Song extends Resource {
  attributes: SongAttributes;
  relationships: {
    albums: Relationship<Album>;
    artists: Relationship<Artist>;
  };
}

/**
 * Attributes for a Song.
 */
export interface SongAttributes {
  albumName: string;
  artistName: string;
  artwork: Artwork;
  audioLocale: string;
  audioTraits: string[];
  composerName?: string;
  contentRating?: string;
  discNumber: number;
  durationInMillis: number;
  genreNames: string[];
  hasLyrics: boolean;
  hasTimeSyncedLyrics: boolean;
  isAppleDigitalMaster: boolean;
  isMasteredForItunes: boolean;
  isVocalAttenuationAllowed: boolean;
  isrc: string;
  name: string;
  playParams: PlayParams;
  previews: { url: string }[];
  releaseDate: string;
  trackNumber: number;
  url: string;
  artistUrl?: string;
}

/**
 * Represents a Station resource.
 */
export interface Station extends Resource {
  attributes: StationAttributes;
}

/**
 * Attributes for a Station.
 */
export interface StationAttributes {
  artwork: Artwork;
  isLive: boolean;
  kind: string;
  mediaKind: string;
  name: string;
  playParams: {
    format: string;
    hasDrm: boolean;
    id: string;
    kind: string;
    mediaType: number;
    stationHash: string;
  };
  radioUrl: string;
  requiresSubscription: boolean;
  url: string;
}

/**
 * Represents the metadata of the API response.
 */
export interface Meta {
  results: {
    order: string[];
    rawOrder: string[];
  };
  metrics: {
    dataSetId: string;
  };
}

export type ItemTypes = Album & Song & Playlist & Station & MusicVideo & RadioEpisode & Artist;