export const ENV = {
  network: process.env.NEXT_PUBLIC_GENLAYER_NETWORK ?? "testnetBradbury",
  rpcUrl: process.env.NEXT_PUBLIC_GENLAYER_RPC_URL ?? "https://rpc-bradbury.genlayer.com",
  chainId: process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID ?? "0x107d",
  contractAddress:
    process.env.NEXT_PUBLIC_MERIDIAN_ADDRESS ?? "0x478B672D126a2405153E48a91bdB83fb6067BD95",
} as const;
export const PREVIEW_MODE = !/^0x[0-9a-fA-F]{40}$/.test(ENV.contractAddress);
