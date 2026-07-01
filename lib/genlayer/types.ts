export enum GeoStatus { Pending = 0, Confirmed = 1, Refuted = 2 }
export const STATUS_LABEL: Record<GeoStatus, string> = {
  [GeoStatus.Pending]: "Unconfirmed",
  [GeoStatus.Confirmed]: "Confirmed",
  [GeoStatus.Refuted]: "Refuted",
};
export const STATUS_COLOR: Record<GeoStatus, string> = {
  [GeoStatus.Pending]: "#E0A13B",
  [GeoStatus.Confirmed]: "#2BB673",
  [GeoStatus.Refuted]: "#E0533B",
};
export interface Observation {
  id: number; observer: string; label: string; lat: string; lng: string;
  claim: string; sourceUrl: string; status: GeoStatus; rationale: string;
}
export interface AtlasStats { total: number; confirmed: number; refuted: number; pending: number; }
export interface RawObs {
  observer: string; label: string; lat: string; lng: string; claim: string;
  source_url: string; status: number | bigint; rationale: string; archived: number | bigint;
}
export interface RawStats { total: number | bigint; confirmed: number | bigint; refuted: number | bigint; pending: number | bigint; }
