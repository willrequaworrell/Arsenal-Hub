import { Fixture } from "../api-football/schemas/fixtures";


export const getFixtures = async (): Promise<Fixture[]> => {
  const absoluteUrl = new URL('/api/fixtures', process.env.NEXT_PUBLIC_BASE_URL).toString();
  
  const res = await fetch(absoluteUrl, {
    next: { revalidate: 300, tags: ['fixtures']},
  });
  if (!res.ok) throw new Error("failed to fetch fixtures");
  const json = await res.json() as { ok: boolean; data?: Fixture[] }
  if (!json.ok || !json.data) throw new Error("fixtures schema invalid")
  return json.data
}