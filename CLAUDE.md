# CRYPTO INTELLIGENCE SYSTEM v1.0

## Project Overview

Autonomous crypto intelligence system powered by Claude Code. Coordinates 6 specialized agents to scan, verify, and analyze the crypto market in real time, producing actionable intelligence with expected value calculations and self-calibrating probability estimates.

## Quick Start

```
# Full scan cycle (recommended)
"Run a full scan"

# Check previous predictions only
"Check predictions"

# Add a wallet to tracking
"Track wallet [address]"

# Add a token to watchlist
"Watch [TOKEN]"
```

## Architecture

```
SYSTEM_PROMPT.md              ← Master execution prompt
├── agents/
│   ├── orchestrator.md       ← Coordination logic
│   ├── social_intel.md       ← Agent 1: X/Social scanning
│   ├── onchain_verify.md     ← Agent 2: On-chain verification
│   ├── smart_wallets.md      ← Agent 3: Wallet tracking
│   ├── hyperliquid.md        ← Agent 4: HL leaderboard
│   ├── solana_trenches.md    ← Agent 5: Solana trenches
│   └── ev_calculator.md      ← Agent 6: EV model
├── memory/                   ← 7-file persistent memory
├── config/settings.json      ← Tunable parameters
└── output/
    ├── dashboard.html        ← Live intelligence dashboard
    ├── architecture.svg      ← System architecture diagram
    └── briefings/            ← Daily briefing archive (MD + HTML)
```

## Execution Order

1. **Phase 0** — Load memory, review past predictions, update calibration
2. **Phase 1** — Deploy agents 1, 3, 4, 5 in parallel → then agent 2 → then agent 6
3. **Phase 2** — Cross-reference signals, identify confluence
4. **Phase 3** — EV calculation with 3-scenario model (bull/base/bear)
5. **Phase 4** — Generate briefing, update all memory files

## Tool Usage

| Tool | Purpose |
|------|---------|
| WebSearch | X/Twitter scanning, crypto news, narrative detection |
| WebFetch | API calls: DexScreener, DeFiLlama, Hyperliquid, CoinGecko |
| Agent | Launch 6 intelligence subagents (subagent_type: "general-purpose") |
| Read/Write | All memory file operations |

## Memory Files (DO NOT DELETE)

All in `./memory/`:

| File | Purpose |
|------|---------|
| `daily_intel.json` | Current session findings (reset each scan) |
| `predictions.json` | Active predictions with targets and stop losses |
| `track_record.json` | Historical win/loss record for calibration |
| `smart_wallets.json` | Tracked wallets and convergence events |
| `token_watchlist.json` | Monitored tokens with verification status |
| `alpha_signals.json` | Signal weights and historical hit rates |
| `calibration.json` | Probability calibration and Brier scores |

## Signal Verification Matrix

| Source | Must Verify With |
|--------|-----------------|
| Social mention (X) | On-chain data OR smart wallet activity |
| Smart wallet buy | Contract verification OR social catalyst |
| Hyperliquid position | On-chain flow OR social/fundamental catalyst |
| Solana trench find | Liquidity check + holder distribution + contract scan |
| Narrative play | Multiple social sources + on-chain traction |

## Critical Rules

1. Never recommend without verification from 2+ independent sources
2. Never skip EV calculation — every recommendation needs math
3. Always update memory files after scan
4. Predictions must include: entry, targets, stop loss, timeframe, EV score
5. Position sizes halved while UNCALIBRATED (<10 resolved predictions)
6. Min EV threshold: 1.2x — below this goes to watchlist, not recommendations
7. Probabilities must sum to 1.0 across bull/base/bear scenarios
