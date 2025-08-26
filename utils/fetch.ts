import { IOState } from "@/lib/io";

export let MusicStoreFront = "us";

export async function CiderFetch<T>(
  href: string,
  body?: any,
  options: RequestInit = {}
) {
  const response = await fetch(IOState.hostAddress + href, {
    // @ts-expect-error
    headers: {
      "Content-Type": "application/json",
      apptoken: IOState.store.get(IOState.apiToken),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!response.ok) {
    console.warn("Fetch error:", response.status, await response.text());
    return;
  }

  try {
    const toJson = await response.json() as Promise<T>;
    return toJson;
  }catch(e) {
    console.error('CiderFetch Error', href, body, e)
    return undefined;
  }
}

export async function getStorefront() {
  console.log("Getting storefront");
  const res = await v3<{
    data: {
      meta: {
        subscription: {
          storefront: string;
        };
      };
    };
  }>("/v1/me/account", {
    meta: "subscription",
  });

  if (!res) {
    console.warn("Failed to get storefront");
    return;
  }

  console.log("Storefront:", res.data.meta.subscription.storefront);
  MusicStoreFront = res.data.meta.subscription.storefront;
}
export function v3<T>(
  href: string,
  params?: Record<string, string | number | boolean>
) {
  const searchParams = params
    ? new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    : undefined;

  return CiderFetch<T>(
    "/api/v1/amapi/run-v3",
    {
      path:
        href.replace("$STOREFRONT", MusicStoreFront) +
        (searchParams ? `?${searchParams.toString()}` : ""),
    },
    {
      method: "POST",
    }
  );
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

  return CiderFetch<T>(
    "/api/v1/amapi/run-v3turbo",
    {
      path:
        href.replace("$STOREFRONT", MusicStoreFront) +
        (searchParams ? `?${searchParams.toString()}` : ""),
    },
    {
      method: "POST",
    }
  );
}
