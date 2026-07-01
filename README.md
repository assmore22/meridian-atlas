# Meridian Atlas

A map-first GenLayer registry for source-backed observations.

Meridian Atlas is a Next.js app for location records. It presents observations as a public atlas while the contract handles source verification and validator confirmation.

## Review Links

| Surface | Link |
| --- | --- |
| Live app | https://assmore22-meridian-atlas.vercel.app |
| GitHub | https://github.com/assmore22/meridian-atlas |
| Contract | https://explorer-bradbury.genlayer.com/address/0x478B672D126a2405153E48a91bdB83fb6067BD95 |

## Chain Record

- Network: GenLayer Bradbury
- Chain ID: 4221
- Contract: `0x478B672D126a2405153E48a91bdB83fb6067BD95`
- Deploy transaction: [0x2fcea204...a7d438](https://explorer-bradbury.genlayer.com/tx/0x2fcea2042ba09d682a9675f7839131036e28b3808c8f4780c2ae27fd63a7d438)
- Deployed: `2026-07-01T15:48:23.503Z`
- Source: `contracts/meridian_v2.py` (29,253 bytes)

## Protocol Path

1. Submit an observation.
2. Attach a public source.
3. Read contract state through the app.
4. Confirm pending records with validators.
5. Browse accepted or disputed observations.

The frontend reads observation records, source URLs, status labels and detail pages. Contract state is public; write actions still require a connected wallet on GenLayer Bradbury.

## Bradbury Smoke

| Action | Transaction |
| --- | --- |
| `record_observation` | [0xe0028460...9a0e9b](https://explorer-bradbury.genlayer.com/tx/0xe00284606800a6fabf75f16d100d9582f6f983a2b4bcfa65b50c8f80b79a0e9b) |

Read verification passed on Bradbury after deploy. The public app points at this contract address and reads accepted state.

## Local Run

```bash
npm install
npm run dev
```

Open the localhost URL printed by Next.js.

## Release Hygiene

The production build runs on Next.js 15.5.19. The local production dependency audit passes with `npm audit --omit=dev` returning zero vulnerabilities after the `ws` and `postcss` overrides.

Keep wallet private keys, vault exports, `.env` files, Vercel project state and dashboard data out of Git. This repository is for public source, UI, tests and deployment receipts only.
