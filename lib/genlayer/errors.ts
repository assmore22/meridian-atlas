// Normalises the many shapes of wallet / SDK errors into one readable string.
export function formatContractError(e: unknown): string {
  if (!e) return "Unknown error.";
  if (typeof e === "string") return e;
  const err = e as Record<string, unknown> & { cause?: Record<string, unknown> };
  const parts: string[] = [];
  const add = (v: unknown) => {
    if (typeof v === "string" && v.trim() && !parts.includes(v)) parts.push(v);
  };
  add(err.shortMessage);
  add(err.details);
  add(err.message);
  add((err.cause as Record<string, unknown> | undefined)?.shortMessage);
  add((err.cause as Record<string, unknown> | undefined)?.message);
  return parts.length ? parts.join(" - ") : String(e);
}

export class WalletMissingError extends Error {
  constructor() {
    super("No EVM wallet found. Install MetaMask to file or rule on-chain.");
    this.name = "WalletMissingError";
  }
}
