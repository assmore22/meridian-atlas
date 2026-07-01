"use client";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmObservation, fetchObservation, fetchObservations, fetchStats, recordObservation } from "@/lib/genlayer/contract";
import { activeAccount, connectWallet } from "@/lib/genlayer/client";
import { PREVIEW_MODE } from "@/lib/env";

export const useObservations = () => useQuery({ queryKey: ["obs"], queryFn: fetchObservations, staleTime: 15000 });
export const useStats = () => useQuery({ queryKey: ["stats"], queryFn: fetchStats, staleTime: 15000 });
export const useObservation = (id: number) => useQuery({ queryKey: ["obs", id], queryFn: () => fetchObservation(id), enabled: Number.isFinite(id) });

export function useRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { label: string; lat: string; lng: string; claim: string; sourceUrl: string }) => recordObservation(v.label, v.lat, v.lng, v.claim, v.sourceUrl),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["obs"] }); qc.invalidateQueries({ queryKey: ["stats"] }); },
  });
}
export function useConfirm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => confirmObservation(id),
    onSuccess: (_h, id) => { qc.invalidateQueries({ queryKey: ["obs", id] }); qc.invalidateQueries({ queryKey: ["obs"] }); qc.invalidateQueries({ queryKey: ["stats"] }); },
  });
}
export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  useEffect(() => { if (PREVIEW_MODE) return; activeAccount().then(setAccount).catch(() => setAccount(null)); window.ethereum?.on?.("accountsChanged", () => activeAccount().then(setAccount)); }, []);
  const connect = useCallback(async () => { setConnecting(true); try { setAccount(await connectWallet()); } finally { setConnecting(false); } }, []);
  return { account, connect, connecting };
}
