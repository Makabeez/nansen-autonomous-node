# Nansen Autonomous Alpha Node

## Description
This skill transforms the Nansen CLI into an automated cross-chain signal engine. It natively integrates with OpenClaw agents to scan Ethereum, Arbitrum, and Base for Smart Money inflows, profile top accumulators, and extract portfolio anomalies.

## Requirements
- Nansen CLI (`npm install -g nansen-cli`)
- Valid Nansen Premium API Key

## Autonomous Execution
```bash
node index.js
```

## ClawHub Agent Integration
This script outputs structured Markdown (`agent_alpha_report.md`) designed to be ingested directly into an AI Agent's context window. It acts as a passive cron-job feed, supplying your trading agents with verified onchain intelligence without requiring manual CLI prompts.
