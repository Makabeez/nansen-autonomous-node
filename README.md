# 🤖 Nansen Autonomous Agent Node (Cross-Chain Edition)

**Built for Week 4 of the Nansen CLI Build Challenge.**

This repository contains the source code for an automated, cross-chain signal engine that transforms the Nansen CLI from a manual research tool into a passive data feed for AI Agents. 

## 🌟 Key Features
- **Cross-Chain Sweeping:** Scans Ethereum, Arbitrum, and Base concurrently (Executing 14+ automated API calls).
- **Smart Money Tracking:** Identifies top trending token inflows and isolates the top accumulating whale for each.
- **Shadow-Bag Discovery:** Automatically audits the portfolios of those specific whales to uncover hidden, undiscovered token holdings.
- **Resilient Execution:** Built-in error handling safely skips obscured wallets or missing data without crashing the node.
- **🤖 ClawHub AI Integration (Bonus):** Automatically compiles an official OpenClaw `SKILL.md` file and formats the onchain alpha into an `agent_alpha_report.md` payload, ready for direct ingestion into an AI agent's context window.

## 📊 Proof of API Calls
This script reliably executes exactly **14 Nansen API calls** per full cross-chain sweep (exceeding the 10 API call minimum requirement). 
- 3x `netflow` calls (one per chain)
- Up to 6x `tgm holders` calls 
- Up to 5x `port holdings` calls (dynamically skips if holder data is obscured)

## 🚀 Installation & Usage

### Prerequisites
You must have Node.js and the Nansen CLI installed and authenticated.
```bash
npm install -g nansen-cli
nansen login --api-key YOUR_API_KEY
