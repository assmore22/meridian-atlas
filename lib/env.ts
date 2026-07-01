export const ENV = {
  network: process.env.NEXT_PUBLIC_GENLAYER_NETWORK ?? "studionet",
  rpcUrl: process.env.NEXT_PUBLIC_GENLAYER_RPC_URL ?? "https://studio.genlayer.com/api",
  chainId: process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID ?? "0xf22f",
  contractAddress:
    process.env.NEXT_PUBLIC_MERIDIAN_ADDRESS ?? "0xB66A3DB7FfD2CDA03041f23DEb2851c5543B8f87",
} as const;
export const PREVIEW_MODE = !/^0x[0-9a-fA-F]{40}$/.test(ENV.contractAddress);
