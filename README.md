# Crypto Intelligence System v1.0

An autonomous crypto intelligence system for Claude Code. Paste a single prompt and Opus 4.6 coordinates 6 subagents to scan, verify, and analyze the crypto market — then delivers actionable intelligence with expected value calculations.

## What It Does

Every session, the system:

1. **Reviews yesterday's predictions** — checks prices, marks wins/losses, updates calibration
2. **Deploys 6 intelligence agents in parallel:**
   - **Social Intel Scanner** — scans X via Grok for emerging narratives, trending tokens, KOL signals
   - **On-Chain Verification Engine** — verifies everything through DexScreener, DeFiLlama, block explorers, CoinGecko
   - **Smart Wallet Tracker** — tracks smart money wallets, detects insider activity, flags convergence events
   - **Hyperliquid Monitor** — monitors leaderboard traders' positions via Hypurrscan
   - **Solana Trenches Crawler** — crawls pump.fun graduates and early-stage Solana tokens
   - **EV Calculator** — computes expected value using a three-scenario probability model
3. **Cross-references all signals** — a token mentioned by 3+ independent agents is a confluence signal
4. **Calculates expected value** — bull/base/bear scenarios with calibration-adjusted probabilities
5. **Generates a full intelligence briefing** with buy/sell recommendations, risk warnings, and position sizing
6. **Updates its memory** — every prediction is tracked, every probability is calibrated against outcomes

## The 7-File Memory System

```
memory/
├── daily_intel.json      # Current session's raw intelligence
├── predictions.json      # Active predictions with targets & stop losses
├── track_record.json     # Historical win/loss record
├── smart_wallets.json    # Tracked wallet addresses & insider scores
├── token_watchlist.json  # Tokens being monitored across sessions
├── alpha_signals.json    # Signal type weights & historical hit rates
└── calibration.json      # Probability calibration data & Brier scores
```

The memory persists across sessions. Every day the system:
- Reviews what it found yesterday
- Checks if its predictions played out
- Updates its win rate
- Adjusts its probability estimates
- Gets better at finding alpha the longer you run it

## How To Use

### Step 1: Open Claude Code
Make sure you're using Claude Code with Opus 4.6.

### Step 2: Navigate to this directory
```bash
cd /path/to/this/repo
```

### Step 3: Paste the system prompt
Copy the entire contents of `SYSTEM_PROMPT.md` and paste it into Claude Code. The system will:
1. Load all memory files
2. Review any previous predictions
3. Launch all 6 agents
4. Deliver your intelligence briefing

### Step 4: Wake up to alpha
Run it daily. The calibration system improves with every session.

## Architecture

```
SYSTEM_PROMPT.md          ← Paste this into Claude Code
│
├── agents/
│   ├── orchestrator.md   ← Master coordination logic
│   ├── social_intel.md   ← Agent 1: X/Social scanning
│   ├── onchain_verify.md ← Agent 2: On-chain verification
│   ├── smart_wallets.md  ← Agent 3: Wallet tracking & insider detection
│   ├── hyperliquid.md    ← Agent 4: HL leaderboard monitoring
│   ├── solana_trenches.md← Agent 5: Solana trench crawling
│   └── ev_calculator.md  ← Agent 6: EV & probability model
│
├── memory/               ← 7-file persistent memory (auto-managed)
├── config/settings.json  ← Tunable parameters
└── output/briefings/     ← Daily briefing archive
```

## The EV Model

Every recommendation includes a full expected value calculation:

```
EV = (P_bull × R_bull) + (P_base × R_base) + (P_bear × R_bear)

Example:
  Bull (25%): +300% → 0.25 × 4.0 = 1.00
  Base (45%): +50%  → 0.45 × 1.5 = 0.675
  Bear (30%): -30%  → 0.30 × 0.7 = 0.21
  Net EV: 1.885x (+88.5%)
```

Probabilities are calibrated against the system's own track record using Brier scores. Position sizes are calculated using fractional Kelly criterion.

## Signal Types & Weights

| Signal | Base Weight | Description |
|--------|-----------|-------------|
| Multi-Signal Confluence | 0.90 | Multiple independent signals on same token |
| Smart Wallet Convergence | 0.85 | 3+ tracked wallets buying same token |
| Insider Accumulation | 0.75 | Suspected insider wallets accumulating |
| Hyperliquid Whale Position | 0.60 | Top leaderboard trader opens position |
| On-Chain Anomaly | 0.50 | Unusual on-chain activity detected |
| Social Volume Breakout | 0.40 | Social mentions spike before price move |
| Narrative Catalyst | 0.35 | Emerging narrative with momentum |
| Solana Trench Discovery | 0.30 | Early-stage token with organic traction |

Weights are empirically adjusted as the system accumulates track record data.

## Verification Standards

No signal is actionable until verified by 2+ independent sources. Automatic rejection for:
- Honeypot contracts
- >50% supply in top 10 wallets
- Liquidity <$5K or not locked
- Unverified contracts
- Obvious pump-and-dump patterns

## Configuration

Edit `config/settings.json` to tune:
- Chain filters (Solana, Ethereum, Base, Hyperliquid)
- Market cap range filters
- Risk management parameters (max positions, stop loss defaults, Kelly fraction)
- Data source endpoints
- Briefing format preferences
- Memory management thresholds

## Data Sources

The system queries dozens of sources including:
- **Social:** X/Twitter (via Grok/WebSearch), CT accounts, crypto news
- **On-Chain:** DexScreener, DeFiLlama, Solscan, Etherscan, Basescan, Birdeye
- **Wallets:** Kolscan, Arkham, Lookonchain, DexScreener top traders
- **Trading:** Hypurrscan, Hyperliquid API, funding rates, open interest
- **Aggregators:** CoinGecko, Jupiter, pump.fun

## Disclaimer

This is an experimental intelligence system for research and educational purposes. It does not constitute financial advice. Crypto markets are extremely volatile and most tokens go to zero. Never invest more than you can afford to lose. Always do your own research. Past performance of the system's predictions does not guarantee future results.
