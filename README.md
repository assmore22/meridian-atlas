# Meridian Atlas

A navigable research atlas for public evidence, territorial claims and GenLayer source review.

This project uses location or map-oriented records as the product surface, then backs each record with public evidence and GenLayer review.

## Meridian Atlas Brief

Meridian V2 (# v0.2.16), schema-valid strong lifecycle contract with JSON-backed cases/evidence/reviews/challenges/appeals/audits/profiles, GenLayer web render + prompt-comparative reasoning, legacy frontend wrappers and reputation scoring.

The important files are:

- `contracts/meridian_v2.py` - GenLayer contract source
- `deployment.json` - Studionet address, deploy transaction and smoke transaction hashes
- `package.json` - frontend runtime
- `README.md` - this operator and reviewer guide

## Contract Receipt

- Network: studionet (61999)
- Contract: [0xB66A3DB7FfD2CDA03041f23DEb2851c5543B8f87](https://explorer-studio.genlayer.com/contracts/0xB66A3DB7FfD2CDA03041f23DEb2851c5543B8f87)
- Deploy tx: [0x87ead003...3eda62](https://explorer-studio.genlayer.com/tx/0x87ead003f55e71f510696910266321f2c1995246db7a30b6fecba0897d3eda62)
- Deployed at: 2026-06-24T16:00:01.153Z
- Smoke writes recorded: 13

## Spatial Evidence Mechanics

Typical flow: `create_case` -> `open_challenge_window` -> `submit_challenge` -> `review_with_genlayer` -> `resolve_challenge_with_genlayer` -> `submit_appeal` -> `archive_case`

Useful reads: `get_case_count`, `get_case`, `get_case_record`, `get_evidence`, `get_reviews`, `get_challenges`, `get_appeals`, `get_audit_log`

- Primary source: `contracts/meridian_v2.py` (29,253 bytes)
- Public write/action methods: 15
- Read methods: 20
- GenLayer features: live web rendering, LLM adjudication, validator-comparative consensus, indexed storage, append-only collections

## Smoke Trail

- configure_protocol: [0x197148f5...eaa992](https://explorer-studio.genlayer.com/tx/0x197148f552c688d7e04b519f6229ad343fcecf268be42cdaa835af1712eaa992)
- create_case: [0x3f917e0e...e77ab3](https://explorer-studio.genlayer.com/tx/0x3f917e0ebf7fa31c57890459f9793e9d547ef88bea22002c6ceb6744cde77ab3)
- add_evidence_web: [0xf94402ef...4fc72a](https://explorer-studio.genlayer.com/tx/0xf94402ef6220a6e45681dd33a61880079bb2c137001dd6a3db87c4d9ed4fc72a)
- add_evidence_security: [0xc1e99fe2...0bd2d1](https://explorer-studio.genlayer.com/tx/0xc1e99fe2bcac7cfe61cb030c049a04250fb407667615672ce2e7bb2dc80bd2d1)
- add_evidence_whitepaper: [0xdd0f33ac...be488b](https://explorer-studio.genlayer.com/tx/0xdd0f33ace0c6dd0296bea62299abb68093b586f400874f3a2493a6a6bcbe488b)
- review: [0xe4f3cbe2...707d4c](https://explorer-studio.genlayer.com/tx/0xe4f3cbe27f4885af9b1d1a1e5bbcf300784e2be8fd05213a8f93ca5672707d4c)
- challenge_window: [0x5c28eaa4...224aa4](https://explorer-studio.genlayer.com/tx/0x5c28eaa43d7edfd7db21fb46c559eae188715b392e08ef3fc1ed834d96224aa4)
- submit_challenge: [0xc3ce764f...f770d2](https://explorer-studio.genlayer.com/tx/0xc3ce764ff85a997f6c4eeaa7ba48f5a895f68c0fbeab91eb8191a3a298f770d2)

## Run Meridian Atlas Locally

```powershell
cd <this-repository-folder>
npm install
npm run dev
```

Open the dev server URL printed by npm.

## Publish Meridian Atlas

```powershell
cd <private-workspace-root>
npm run publish:project -- -Project 32-meridian-atlas -Repo https://github.com/aspro45/<repo-name>.git
```

## Keys And Boundaries

- This repository should contain no decrypted wallet material.
- The Studionet deployer private key stays in the local encrypted vault.
- Vercel deployment should use the project folder only.

- QA notes: Frontend preview verified through the single Next preview slot. Contract address and smoke txs are registered; private key remains encrypted vault-only.
