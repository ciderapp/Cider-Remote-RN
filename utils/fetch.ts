import { IOState } from "@/lib/io";


export async function CiderFetch<T>(
  href: string,
  body?: any,
  options: RequestInit = {}
) {
  console.log(IOState.hostAddress + href)
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
    throw new Error("Network response was not ok");
  }

  return response.json() as Promise<T>;
}
