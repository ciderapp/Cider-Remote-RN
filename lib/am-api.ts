import { CiderFetch } from "@/utils/fetch";

export function v3<T>(
  href: string,
  params?: Record<string, string | number | boolean>
) {
  const searchParams = params
    ? new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    : undefined;

  return CiderFetch<T>("/api/v1/amapi/run-v3", {path: href + (searchParams ? `?${searchParams.toString()}` : "")}, {
    method: "POST",

  });
}

export function v3Turbo<T>(
  href: string,
  params?: Record<string, string | number | boolean>
) {
  const searchParams = params
    ? new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    : undefined;

  return CiderFetch<T>("/api/v1/amapi/run-v3turbo", {path: href + (searchParams ? `?${searchParams.toString()}` : "")}, {
    method: "POST",
  });
}
