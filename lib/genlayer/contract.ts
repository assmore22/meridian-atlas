import { ENV, PREVIEW_MODE } from "@/lib/env";
import { getReadClient, writeContract } from "./client";
import { GeoStatus } from "./types";
import type { AtlasStats, Observation, RawObs, RawStats } from "./types";

const ADDRESS = ENV.contractAddress;
const n = (v: number | bigint) => (typeof v === "bigint" ? Number(v) : v);

function toObs(id: number, r: RawObs): Observation {
  return { id, observer: r.observer, label: r.label, lat: r.lat, lng: r.lng, claim: r.claim, sourceUrl: r.source_url, status: n(r.status) as GeoStatus, rationale: r.rationale };
}

const PREVIEW: Observation[] = [
  { id: 0, observer: "0xPREVIEW", label: "Eiffel Tower", lat: "48.8584", lng: "2.2945", claim: "A wrought-iron lattice tower in Paris.", sourceUrl: "https://preview.local/eiffel", status: GeoStatus.Confirmed, rationale: "The source confirms the tower and its location." },
  { id: 1, observer: "0xPREVIEW", label: "Statue of Liberty", lat: "40.6892", lng: "-74.0445", claim: "A copper statue in New York Harbor.", sourceUrl: "https://preview.local/liberty", status: GeoStatus.Confirmed, rationale: "Confirmed by the source." },
  { id: 2, observer: "0xPREVIEW", label: "Atlantis", lat: "31.0", lng: "-24.0", claim: "A confirmed discovered underwater city.", sourceUrl: "https://preview.local/atlantis", status: GeoStatus.Refuted, rationale: "The source describes a legend, not a real place." },
  { id: 3, observer: "0xPREVIEW", label: "Mount Fuji", lat: "35.3606", lng: "138.7274", claim: "The highest mountain in Japan.", sourceUrl: "https://preview.local/fuji", status: GeoStatus.Pending, rationale: "" },
];

function stats(o: Observation[]): AtlasStats {
  return { total: o.length, confirmed: o.filter(x => x.status === GeoStatus.Confirmed).length, refuted: o.filter(x => x.status === GeoStatus.Refuted).length, pending: o.filter(x => x.status === GeoStatus.Pending).length };
}

export async function fetchObservations(): Promise<Observation[]> {
  if (PREVIEW_MODE) return PREVIEW;
  const client = await getReadClient();
  const count = n((await client.readContract({ address: ADDRESS, functionName: "get_observation_count" })) as number | bigint);
  const out: Observation[] = [];
  for (let i = 0; i < count; i++) {
    const r = (await client.readContract({ address: ADDRESS, functionName: "get_observation", args: [i] })) as RawObs;
    if (n(r.archived) === 0) out.push(toObs(i, r));
  }
  return out;
}
export async function fetchStats(): Promise<AtlasStats> { return stats(await fetchObservations()); }
export async function fetchObservation(id: number): Promise<Observation | null> {
  if (PREVIEW_MODE) return PREVIEW.find(x => x.id === id) ?? null;
  const client = await getReadClient();
  const count = n((await client.readContract({ address: ADDRESS, functionName: "get_observation_count" })) as number | bigint);
  if (id < 0 || id >= count) return null;
  const r = (await client.readContract({ address: ADDRESS, functionName: "get_observation", args: [id] })) as RawObs;
  return toObs(id, r);
}
export async function recordObservation(label: string, lat: string, lng: string, claim: string, sourceUrl: string): Promise<string> {
  return writeContract(ADDRESS, "record_observation", [label, lat, lng, claim, sourceUrl]);
}
export async function confirmObservation(id: number): Promise<string> {
  return writeContract(ADDRESS, "confirm_observation", [id]);
}
