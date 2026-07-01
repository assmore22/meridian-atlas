# Meridian Atlas

A map-first GenLayer registry for source-backed observations.

Meridian Atlas is a Next.js app for location records. It presents observations as a public atlas while the contract handles source verification and validator confirmation.

## Review Links

| Surface | Link |
| --- | --- |
| Live app | https://assmore22-meridian-atlas.vercel.app |
| GitHub | https://github.com/assmore22/meridian-atlas |
| Contract | https://explorer-studio.genlayer.com/contracts/0xB66A3DB7FfD2CDA03041f23DEb2851c5543B8f87 |

## Chain Record

- Network: GenLayer Studionet
- Chain ID: 61999
- Contract: `0xB66A3DB7FfD2CDA03041f23DEb2851c5543B8f87`
- Deploy transaction: [0x87ead003...3eda62](https://explorer-studio.genlayer.com/tx/0x87ead003f55e71f510696910266321f2c1995246db7a30b6fecba0897d3eda62)
- Deployed: `2026-06-24T16:00:01.153Z`
- Source: `contracts/meridian_v2.py` (29,253 bytes)

## Protocol Path

1. Submit an observation.
2. Attach a public source.
3. Read contract state through the app.
4. Confirm pending records with validators.
5. Browse accepted or disputed observations.

The frontend reads observation records, source URLs, status labels and detail pages. Contract state is public; write actions still require a connected wallet on GenLayer Studionet.

## Finalized Smoke

| Action | Transaction |
| --- | --- |
| `configure_protocol` | [0x197148f5...eaa992](https://explorer-studio.genlayer.com/tx/0x197148f552c688d7e04b519f6229ad343fcecf268be42cdaa835af1712eaa992) |
| `create_case` | [0x3f917e0e...e77ab3](https://explorer-studio.genlayer.com/tx/0x3f917e0ebf7fa31c57890459f9793e9d547ef88bea22002c6ceb6744cde77ab3) |
| `add_evidence_web` | [0xf94402ef...4fc72a](https://explorer-studio.genlayer.com/tx/0xf94402ef6220a6e45681dd33a61880079bb2c137001dd6a3db87c4d9ed4fc72a) |
| `add_evidence_security` | [0xc1e99fe2...0bd2d1](https://explorer-studio.genlayer.com/tx/0xc1e99fe2bcac7cfe61cb030c049a04250fb407667615672ce2e7bb2dc80bd2d1) |
| `add_evidence_whitepaper` | [0xdd0f33ac...be488b](https://explorer-studio.genlayer.com/tx/0xdd0f33ace0c6dd0296bea62299abb68093b586f400874f3a2493a6a6bcbe488b) |
| `review` | [0xe4f3cbe2...707d4c](https://explorer-studio.genlayer.com/tx/0xe4f3cbe27f4885af9b1d1a1e5bbcf300784e2be8fd05213a8f93ca5672707d4c) |

## Local Run

```bash
npm install
npm run dev
```

Open the localhost URL printed by Next.js.

## Release Hygiene

The production build runs on Next.js 15.5.19. The local production dependency audit passes with `npm audit --omit=dev` returning zero vulnerabilities after the `ws` and `postcss` overrides.

Keep wallet private keys, vault exports, `.env` files, Vercel project state and dashboard data out of Git. This repository is for public source, UI, tests and deployment receipts only.
