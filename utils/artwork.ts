export type FormatArtworkOptions = {
    width: number;
    height: number;
    format: 'webp' | 'jpeg' | 'png';
    kind: string;
}

export function formatArtworkUrl(url: string | undefined, options?: Partial<FormatArtworkOptions>) {
  if (!url) return undefined;
  return url
    .replace("{w}", options?.width?.toString() ?? "60")
    .replace("{h}", options?.height?.toString() ?? "60")
    .replace("{f}", options?.format ?? "webp")
    .replace("{c}", options?.kind ?? "bb");
}
