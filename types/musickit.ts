// Suggestion for types/index.ts

export type MediaItem = {
  id: string;
  type: string;
  attributes: {
    albumName: string;
    artistName: string;
    artwork: {
      width: number;
      height: number;
      url: string;
    };
    audioLocale: string;
    audioTraits: string[];
    composerName: string;
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
    playParams: {
      id: string;
      kind: string;
    };
    previews: {
      url: string;
    }[];
    releaseDate: string;
    trackNumber: number;
    url: string;
    currentPlaybackTime: number;
    remainingTime: number;
  };
  relationships: {
    albums: {
      href: string;
      data: {
        id: string;
        type: string;
        href: string;
      }[];
    };
    artists: {
      href: string;
      data: {
        id: string;
        type: string;
        href: string;
      }[];
    };
  };
};

export type QueueItem = {
  _eventRegistry: {
    mediaItemStateDidChange: any[];
    mediaItemStateWillChange: any[];
  };
  assetURL: string;
  hlsMetadata: Record<string, any>;
  playbackType: number;
  _container: {
    id: string;
    name: string;
  };
  _context: Record<string, any>;
  _state: {
    current: number;
  };
  _songId: string;
  assets: {
    flavor: string;
    URL: string;
    downloadKey: string;
    artworkURL: string;
    "file-size": number;
    md5: string;
    chunks: {
      chunkSize: number;
      hashes: any[];
    };
    metadata: {
      composerId: string;
      genreId: number;
      copyright: string;
      year: number;
      "sort-artist": string;
      isMasteredForItunes: boolean;
      vendorId: number;
      artistId: string;
      duration: number;
      discNumber: number;
      itemName: string;
      trackCount: number;
      xid: string;
      bitRate: number;
      fileExtension: string;
      "sort-album": string;
      genre: string;
      rank: number;
      "sort-name": string;
      playlistId: string;
      "sort-composer": string;
      trackNumber: number;
      releaseDate: string;
      kind: string;
      playlistArtistName: string;
      gapless: boolean;
      composerName: string;
      discCount: number;
      sampleRate: number;
      playlistName: string;
      explicit: number;
      itemId: string;
      s: number;
      compilation: boolean;
      artistName: string;
    };
    previewURL?: string;
  }[];
  keyURLs: {
    "hls-key-cert-url": string;
    "hls-key-server-url": string;
    "widevine-cert-url": string;
  };
} & MediaItem;

export type LibraryPlaylist = {
  id: string;
  type: "library-playlists";
  href: string;
  attributes: {
    artwork: {
      hasP3: boolean;
      height: number | null;
      url: string;
      width: number | null;
    };
    canDelete: boolean;
    canEdit: boolean;
    dateAdded: string;
    description: {
      standard: string;
    };
    hasCatalog: boolean;
    hasCollaboration: boolean;
    isPublic: boolean;
    lastModifiedDate: string;
    name: string;
    playParams: {
      globalId: string;
      id: string;
      isLibrary: boolean;
      kind: string;
    };
  };
};