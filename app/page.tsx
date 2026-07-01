"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ENV, PREVIEW_MODE } from "@/lib/env";
import { GeoStatus, STATUS_COLOR, STATUS_LABEL } from "@/lib/genlayer/types";
import { formatContractError } from "@/lib/genlayer/errors";
import { useConfirm, useObservations, useRecord, useStats, useWallet } from "@/hooks/useAtlas";

const Globe = dynamic(() => import("@/components/Globe").then((m) => m.Globe), { ssr: false, loading: () => <div className="h-[460px] hair grid place-items-center bg-paper"><span className="label">Loading globe…</span></div> });

function isNum(s: string) { return s.trim() !== "" && !Number.isNaN(Number(s)); }

export default function AtlasPage() {
  const obs = useObservations();
  const stats = useStats();
  const { account, connect } = useWallet();
  const record = useRecord();
  const confirm = useConfirm();
  const [sel, setSel] = useState<number | null>(null);
  const [live, setLive] = useState("");
  const [f, setF] = useState({ label: "", lat: "", lng: "", claim: "", sourceUrl: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const data = obs.data ?? [];
  const current = data.find((o) => o.id === sel) ?? null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.label.trim()) e.label = "Required.";
    if (!f.claim.trim()) e.claim = "Required.";
    if (!isNum(f.lat)) e.lat = "Number.";
    if (!isNum(f.lng)) e.lng = "Number.";
    if (!/^https?:\/\//.test(f.sourceUrl)) e.sourceUrl = "http(s) URL.";
    setErrs(e); return Object.keys(e).length === 0;
  };
  const onRecord = async () => {
    if (!validate()) return;
    if (PREVIEW_MODE) { setLive("Preview mode: recording disabled."); return; }
    setLive("Submitting to the wallet…");
    try { await record.mutateAsync({ ...f }); setLive("Observation recorded on-chain."); setF({ label: "", lat: "", lng: "", claim: "", sourceUrl: "" }); }
    catch (e) { setLive(formatContractError(e)); }
  };
  const onConfirm = async (id: number) => {
    if (PREVIEW_MODE) { setLive("Preview mode: confirmation disabled."); return; }
    setLive("Validators reading the source…");
    try { await confirm.mutateAsync(id); setLive("Settled on-chain."); }
    catch (e) { setLive(formatContractError(e)); }
  };

  return (
    <div className="mx-auto max-w-wide px-4 pb-20 sm:px-5 md:px-8">
      <section className="grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <div>
          <span className="label">GL-006 · Field atlas</span>
          <h1 className="mt-2 font-head text-fluid-page font-bold">Observations, fixed to the map and the source.</h1>
          <p className="mt-3 max-w-reading text-ink/80">Record a located claim with a citation. A GenLayer validator set reads the source and confirms or refutes it for that exact place. {PREVIEW_MODE ? "Preview mode - illustrative." : "Live on " + ENV.network + "."}</p>
          <div className="mt-4"><Globe observations={data} onSelect={setSel} /></div>
          <p className="label mt-2">{data.length} observations · {stats.data?.confirmed ?? 0} confirmed · {stats.data?.refuted ?? 0} refuted · {stats.data?.pending ?? 0} unconfirmed</p>
        </div>

        <aside className="flex flex-col gap-5">
          {current ? (
            <div className="hair bg-paper p-4">
              <span className="label" style={{ color: STATUS_COLOR[current.status] }}>{STATUS_LABEL[current.status]}</span>
              <h2 className="mt-1 font-head text-fluid-panel font-bold">{current.label}</h2>
              <p className="mono mt-1 text-xs text-slate">{current.lat}, {current.lng}</p>
              <p className="mt-2 text-sm">{current.claim}</p>
              {current.rationale && <p className="mt-2 border-l-2 pl-3 text-sm italic text-slate" style={{ borderColor: STATUS_COLOR[current.status] }}>{current.rationale}</p>}
              <p className="mono mt-2 break-all text-xs"><a className="text-meridian underline" href={current.sourceUrl} target="_blank" rel="noopener noreferrer">source ↗</a></p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/records/${current.id}`} className="hair px-3 py-2 text-sm hover:border-meridian">Open record</Link>
                {current.status === GeoStatus.Pending && !PREVIEW_MODE && (
                  <button onClick={() => onConfirm(current.id)} disabled={confirm.isPending} className="bg-meridian px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{confirm.isPending ? "Confirming…" : "Confirm with validators"}</button>
                )}
              </div>
            </div>
          ) : (
            <div className="hair bg-paper p-4"><p className="text-sm text-slate">Select a point on the globe, or record a new observation below.</p></div>
          )}

          <div className="hair bg-paper p-4">
            <h2 className="font-head text-fluid-panel font-bold">Record an observation</h2>
            {PREVIEW_MODE && <p className="label mt-1 !text-refute">preview - disabled</p>}
            <div className="mt-3 flex flex-col gap-3">
              <Field k="label" label="Place" v={f.label} set={set} err={errs.label} ph="Eiffel Tower" />
              <div className="grid grid-cols-2 gap-3">
                <Field k="lat" label="Latitude" v={f.lat} set={set} err={errs.lat} ph="48.8584" />
                <Field k="lng" label="Longitude" v={f.lng} set={set} err={errs.lng} ph="2.2945" />
              </div>
              <Field k="claim" label="Claim" v={f.claim} set={set} err={errs.claim} ph="A wrought-iron tower in Paris." />
              <Field k="sourceUrl" label="Source URL" v={f.sourceUrl} set={set} err={errs.sourceUrl} ph="https://…" />
              <p aria-live="polite" className="min-h-[1.1rem] text-sm text-slate">{live}</p>
              {!account && !PREVIEW_MODE && <button onClick={() => connect()} className="hair min-h-[44px] px-3 text-sm hover:border-meridian">Connect wallet</button>}
              <button onClick={onRecord} disabled={record.isPending} className="min-h-[44px] bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-50">{record.isPending ? "Recording…" : "Record observation"}</button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Field({ k, label, v, set, err, ph }: { k: string; label: string; v: string; set: (k: string, v: string) => void; err?: string; ph?: string }) {
  return (
    <label className="block">
      <span className="label block">{label}</span>
      <input value={v} onChange={(e) => set(k, e.target.value)} aria-invalid={!!err} placeholder={ph} className="mt-1 h-11 w-full hair bg-vellum px-3 text-base" />
      {err && <span className="text-xs text-refute" role="alert">{err}</span>}
    </label>
  );
}
