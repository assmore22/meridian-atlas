"use client";
import Link from "next/link";
import { use, useState } from "react";
import { PREVIEW_MODE } from "@/lib/env";
import { GeoStatus, STATUS_COLOR, STATUS_LABEL } from "@/lib/genlayer/types";
import { formatContractError } from "@/lib/genlayer/errors";
import { useConfirm, useObservation } from "@/hooks/useAtlas";

export default function RecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const id = Number(rawId);
  const { data: o, isLoading, isError, refetch } = useObservation(id);
  const confirm = useConfirm();
  const [live, setLive] = useState("");
  const onConfirm = async () => {
    if (PREVIEW_MODE) { setLive("Preview mode: confirmation disabled."); return; }
    setLive("Validators reading the source…");
    try { await confirm.mutateAsync(id); setLive("Settled."); refetch(); } catch (e) { setLive(formatContractError(e)); }
  };
  return (
    <div className="mx-auto max-w-reading px-4 py-8 sm:px-5 md:px-8">
      <Link href="/" className="mono text-sm text-slate hover:text-meridian">← Atlas</Link>
      {isLoading && <p className="mt-6 text-slate">Reading observation #{id}…</p>}
      {isError && <p className="mt-6 text-refute" role="alert">Could not read it. <button className="underline" onClick={() => refetch()}>Retry</button></p>}
      {!isLoading && !o && <p className="mt-6 text-slate">No observation #{id}.</p>}
      {o && (
        <article className="mt-4">
          <span className="label" style={{ color: STATUS_COLOR[o.status] }}>{STATUS_LABEL[o.status]}</span>
          <h1 className="mt-1 font-head text-fluid-section font-bold">{o.label}</h1>
          <p className="mono mt-1 text-sm text-slate">{o.lat}, {o.lng}</p>
          <p className="mt-4 text-lg">{o.claim}</p>
          {o.rationale && <p className="mt-4 border-l-2 pl-4 italic text-slate" style={{ borderColor: STATUS_COLOR[o.status] }}>{o.rationale}</p>}
          <dl className="hair border-x-0 border-b-0 mt-6 grid grid-cols-[7rem_1fr] gap-y-2 pt-4 text-sm">
            <dt className="label">Source</dt><dd className="break-all"><a className="text-meridian underline" href={o.sourceUrl} target="_blank" rel="noopener noreferrer">{o.sourceUrl}</a></dd>
            <dt className="label">Observer</dt><dd className="mono break-all">{o.observer}</dd>
          </dl>
          {o.status === GeoStatus.Pending && !PREVIEW_MODE && (
            <div className="mt-6"><button onClick={onConfirm} disabled={confirm.isPending} className="min-h-[48px] bg-meridian px-5 text-sm font-semibold text-white disabled:opacity-50">{confirm.isPending ? "Validators reading…" : "Confirm with validators"}</button>
            <p aria-live="polite" className="mt-2 min-h-[1.1rem] text-sm text-slate">{live}</p></div>
          )}
        </article>
      )}
    </div>
  );
}
