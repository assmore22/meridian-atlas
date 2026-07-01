// Browser-only GenLayer client wrapper. The SDK is imported lazily so it never
// enters the server render module graph (it targets the browser/wallet).
import { ENV } from "@/lib/env";
import { WalletMissingError } from "./errors";

type EthProvider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  __glPatched?: boolean;
};

declare global {
  interface Window {
    ethereum?: EthProvider;
  }
}

async function sdk() {
  const mod: any = await import("genlayer-js");
  const chains: any = await import("genlayer-js/chains");
  return { createClient: mod.createClient, createAccount: mod.createAccount, studionet: chains.studionet };
}

let readClient: any = null;

export async function getReadClient(): Promise<any> {
  const { createClient, createAccount, studionet } = await sdk();
  if (!readClient) {
    readClient = createClient({ chain: studionet, account: createAccount() });
  }
  return readClient;
}

async function ensureStudionet(provider: EthProvider) {
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ENV.chainId }] });
  } catch (err) {
    const e = err as { code?: number; message?: string };
    if (e.code === 4902 || /Unrecognized chain/i.test(e.message ?? "")) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: ENV.chainId,
          chainName: "GenLayer Studionet",
          nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
          rpcUrls: [ENV.rpcUrl],
        }],
      });
    } else {
      throw err;
    }
  }
}

// studionet is a zero-fee chain; force legacy gasPrice=0 so the wallet oracle
// cannot wrongly reject for "insufficient funds for fees".
function patchProvider(provider: EthProvider): EthProvider {
  if (provider.__glPatched) return provider;
  const orig = provider.request.bind(provider);
  provider.request = async (req) => {
    const r = req as { method: string; params?: unknown[] };
    if (r.method === "eth_sendTransaction" && Array.isArray(r.params) && r.params[0]) {
      const tx = { ...(r.params[0] as Record<string, unknown>) };
      tx.type = "0x0";
      tx.gasPrice = "0x0";
      delete tx.maxFeePerGas;
      delete tx.maxPriorityFeePerGas;
      if (!tx.gas) tx.gas = "0x100000";
      return orig({ method: "eth_sendTransaction", params: [tx] });
    }
    return orig(req);
  };
  provider.__glPatched = true;
  return provider;
}

export async function activeAccount(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;
  try {
    const accs = (await window.ethereum.request({ method: "eth_accounts" })) as string[];
    return accs?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function connectWallet(): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) throw new WalletMissingError();
  const accs = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
  await ensureStudionet(window.ethereum);
  if (!accs?.[0]) throw new Error("No account authorised.");
  return accs[0];
}

export async function writeContract(
  address: string,
  functionName: string,
  args: unknown[] = [],
): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) throw new WalletMissingError();
  await ensureStudionet(window.ethereum);
  let signer = await activeAccount();
  if (!signer) signer = await connectWallet();
  const { createClient, studionet } = await sdk();
  const provider = patchProvider(window.ethereum);
  const client: any = createClient({ chain: studionet, account: signer, provider });
  const hash = (await client.writeContract({ address, functionName, args, value: 0n })) as string;
  await client.waitForTransactionReceipt({ hash, status: "ACCEPTED", retries: 200 });
  return hash;
}
