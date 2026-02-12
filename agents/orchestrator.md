# ORCHESTRATOR: Master Coordination Logic

## Overview
This file contains the detailed orchestration logic for the crypto intelligence system. The main SYSTEM_PROMPT.md provides the high-level boot sequence; this file provides the detailed execution logic for each phase.

---

## PHASE 0: MEMORY LOAD & PREDICTION REVIEW

### Step 0.1: Load All Memory
```
Read these files and store their contents:
1. ./memory/daily_intel.json     → clear for fresh session
2. ./memory/predictions.json     → check for matured predictions
3. ./memory/track_record.json    → current win/loss stats
4. ./memory/smart_wallets.json   → wallet list for Agent 3
5. ./memory/token_watchlist.json → tokens for Agents 2 & 5
6. ./memory/alpha_signals.json   → signal weights and history
7. ./memory/calibration.json     → probability adjustments
8. ./config/settings.json        → system configuration
```

### Step 0.2: Prediction Review
For each prediction in `predictions.json` → `active_predictions`:
```
IF current_date > prediction.created_date + prediction.timeframe:
    1. Fetch current price via:
       - DexScreener: WebFetch https://api.dexscreener.com/tokens/v1/[chain]/[contract]
       - Fallback: WebSearch "[token] price [chain]"

    2. Calculate outcome:
       IF current_price >= target_1_price:
           outcome = "WIN"
           pnl_pct = ((current_price - entry_price) / entry_price) * 100
           # Note: use highest target reached for pnl calculation
       ELIF current_price <= stop_loss_price:
           outcome = "LOSS"
           pnl_pct = ((stop_loss_price - entry_price) / entry_price) * 100
       ELSE:
           outcome = "BREAKEVEN" (or "OPEN" if timeframe not expired)
           pnl_pct = ((current_price - entry_price) / entry_price) * 100

    3. Move to track_record.json:
       - Add full prediction with outcome to completed_predictions[]
       - Update summary counters (wins, losses, win_rate, etc.)
       - Update by_confidence_tier and by_chain stats
       - Add to daily_pnl_log

    4. Update calibration.json:
       - For each target probability in the prediction:
         - Find the matching calibration bucket
         - Increment predictions count
         - If target was hit, increment hits count
         - Recalculate actual_rate
       - Calculate Brier score: mean of (forecast - outcome)^2
```

### Step 0.3: Calibration Check
```
IF track_record.summary.total_predictions >= 10 AND
   calibration.metadata.sessions_since_recalibration >= 5:

    FOR each signal_type in calibration.adjustment_factors:
        actual_hit_rate = track_record.by_signal_type[signal_type].win_rate
        predicted_hit_rate = average predicted probability for that signal type

        IF |actual_hit_rate - predicted_hit_rate| > 0.15:
            new_adjustment = actual_hit_rate / predicted_hit_rate
            # Smooth the adjustment (don't overcorrect)
            calibration.adjustment_factors[signal_type] =
                0.7 * old_adjustment + 0.3 * new_adjustment

            Log to recalibration_log:
            {
                "date": today,
                "signal_type": signal_type,
                "old_factor": old_adjustment,
                "new_factor": new_adjustment,
                "reason": "actual_rate={actual}, predicted={predicted}, drift={delta}"
            }

    Reset sessions_since_recalibration = 0
ELSE:
    calibration.metadata.sessions_since_recalibration += 1
```

### Step 0.4: Report to User
Present a summary BEFORE launching agents:
```
PREDICTION REVIEW SUMMARY:
- Predictions reviewed: [n]
- Resolved: [n wins] / [n losses] / [n breakeven]
- Updated win rate: [X%]
- Notable: [highlight best/worst outcomes]
- Calibration: [adjusted/stable] | Brier score: [X]
- Now launching intelligence scan...
```

---

## PHASE 1: AGENT DEPLOYMENT

### Dispatch Instructions
Launch agents using the Task tool. For each agent:

1. Read the agent definition file (e.g., `./agents/social_intel.md`)
2. Construct the agent prompt by combining:
   - The full agent definition
   - Relevant memory context
   - Current session parameters
3. Launch via Task tool with `subagent_type: "general-purpose"`

### Agent Context Requirements

| Agent | Memory Files Needed | Additional Context |
|-------|--------------------|--------------------|
| 1: Social Intel | token_watchlist.json, alpha_signals.json | Current narratives, KOL list |
| 2: On-Chain Verify | token_watchlist.json | Tokens to verify (from watchlist + new from Agent 1) |
| 3: Smart Wallets | smart_wallets.json, token_watchlist.json | Tracked wallets, known addresses |
| 4: Hyperliquid | smart_wallets.json (HL traders) | Previously tracked HL positions |
| 5: Solana Trenches | token_watchlist.json, alpha_signals.json | Current trench meta, filters |
| 6: EV Calculator | calibration.json, track_record.json, alpha_signals.json | ALL outputs from agents 1-5 |

### Parallel vs Sequential
```
PARALLEL (launch simultaneously):
  - Agent 1: Social Intel
  - Agent 3: Smart Wallets
  - Agent 4: Hyperliquid
  - Agent 5: Solana Trenches

THEN (after parallel agents complete):
  - Agent 2: On-Chain Verify (needs token list from Agents 1, 3, 5)

THEN (after Agent 2 completes):
  - Agent 6: EV Calculator (needs ALL agent outputs + verification data)
```

---

## PHASE 2: SIGNAL AGGREGATION

### Cross-Reference Matrix
After agents 1-5 complete, build a signal matrix:

```
For each unique token mentioned by any agent:
    token_signals = {
        "token": ticker,
        "chain": chain,
        "contract": address,
        "mentioned_by": [list of agents],
        "signal_types": [list of signal types from each agent],
        "verification_score": from Agent 2,
        "smart_wallet_interest": from Agent 3,
        "social_volume": from Agent 1,
        "trench_organic_score": from Agent 5 (if applicable),
        "hl_trader_interest": from Agent 4 (if applicable),
        "confluence_count": number of independent agents flagging this token,
        "conflicting_signals": any negative signals from any agent
    }

Sort by confluence_count DESC, then by verification_score DESC
```

### Confluence Classification
```
STRONG CONFLUENCE (pass to EV Calculator as high priority):
  - 3+ agents independently flag the same token
  - Verification score >= 7
  - No REJECT signals from Agent 2

MODERATE CONFLUENCE (pass to EV Calculator as medium priority):
  - 2 agents flag the same token
  - Verification score >= 5
  - No critical red flags

WEAK / SINGLE SOURCE (pass to EV Calculator as low priority or WATCH only):
  - Only 1 agent flagged
  - May have interesting signal but needs more confirmation
  - Add to watchlist for next session monitoring

CONFLICT (flag for user attention):
  - Strong positive signals from some agents
  - But red flags or REJECT from Agent 2
  - Do NOT recommend, but inform user of the conflict
```

---

## PHASE 3: BRIEFING GENERATION

### Briefing Construction Steps
1. Take EV Calculator output (Agent 6)
2. Sort recommendations by EV score (highest first)
3. Cap at max_recommendations from settings (default 10)
4. For each recommendation, format according to BRIEFING FORMAT in SYSTEM_PROMPT.md
5. Add prediction review section from Phase 0
6. Add smart wallet convergence section from Agent 3
7. Add market context from Agent 2 and Agent 4
8. Calculate portfolio risk dashboard
9. Update watchlist based on all agent findings

### Portfolio Risk Dashboard Calculation
```
portfolio_heat =
  IF active_predictions <= 5: "low"
  IF active_predictions <= 10: "medium"
  IF active_predictions > 10: "high"

  ADJUST UP if:
    - Multiple positions in same narrative/sector
    - Average leverage > 3x
    - Recent loss streak > 3

  ADJUST DOWN if:
    - Positions well-diversified across chains/narratives
    - Conservative position sizes
    - Recent win streak with good calibration
```

---

## PHASE 4: MEMORY UPDATE

### Files to Update After Every Session

1. **daily_intel.json:** Write full session intelligence (overwrite previous)
2. **predictions.json:** Add new predictions, remove resolved ones
3. **track_record.json:** Add resolved predictions, update stats
4. **smart_wallets.json:** Add new wallets, update activity, convergence events
5. **token_watchlist.json:** Add new tokens, update statuses, graduate/kill tokens
6. **alpha_signals.json:** Add new signals, expire old ones, update weights
7. **calibration.json:** Update buckets, Brier scores, adjustment factors

### Memory Update Rules
- ALWAYS use Read tool to get current file contents before writing
- ALWAYS merge new data with existing (never overwrite entire history)
- ALWAYS timestamp every new entry
- ALWAYS validate JSON structure before writing
- Archive resolved/expired items rather than deleting them

---

## ERROR HANDLING

```
IF an agent fails to return results:
  - Log the failure in daily_intel.json metadata
  - Continue with remaining agents
  - Note in briefing which agents failed
  - Do NOT make recommendations based on incomplete data if verification agent (Agent 2) failed

IF an API is unreachable:
  - Try WebSearch as fallback for the same data
  - Note "data may be stale" in relevant sections
  - Reduce confidence tier by one level for affected recommendations

IF memory files are corrupted or empty:
  - Initialize with default schema (from this session's templates)
  - Note "fresh start - no historical calibration available"
  - Use UNCALIBRATED mode for all probability estimates
```
