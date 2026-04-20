# CRYPTO INTELLIGENCE SYSTEM

## Project Overview
Autonomous crypto intelligence system. Run `/scan` or paste SYSTEM_PROMPT.md to execute a full intelligence cycle.

## How To Run
1. Open this repo in Claude Code
2. Type: "Run a full scan" or paste SYSTEM_PROMPT.md
3. The system auto-loads memory, deploys 6 agents, and delivers a briefing

## Architecture
- `SYSTEM_PROMPT.md` — Master execution prompt
- `agents/` — 6 specialized agent definitions
- `memory/` — 7-file persistent memory (auto-managed, never manually edit)
- `config/settings.json` — Tunable parameters
- `output/briefings/` — Daily briefing archive

## Key Commands
- Full scan: Paste SYSTEM_PROMPT.md or say "run full scan"
- Quick check: "Check predictions" — reviews only previous predictions
- Add wallet: "Track wallet [address]" — adds to smart_wallets.json
- Add token: "Watch [TOKEN]" — adds to watchlist

## Tool Usage
- Use WebSearch for X/Twitter scanning and news
- Use WebFetch for API calls (DexScreener, DeFiLlama, Hyperliquid, CoinGecko)
- Use Agent tool (subagent_type: "general-purpose") to launch the 6 intelligence agents
- Use Read/Write for all memory file operations
- Always run agents 1,3,4,5 in parallel, then agent 2, then agent 6

## Memory Files (DO NOT DELETE)
All in `./memory/`:
- daily_intel.json, predictions.json, track_record.json
- smart_wallets.json, token_watchlist.json, alpha_signals.json, calibration.json

## Critical Rules
- Never recommend without verification from 2+ sources
- Never skip EV calculation
- Always update memory files after scan
- Predictions must have entry, targets, stop loss, timeframe, and EV score
