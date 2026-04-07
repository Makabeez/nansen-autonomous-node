const { execSync } = require('child_process');
const fs = require('fs');

// ANSI Color Codes for a beautiful terminal output
const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    magenta: "\x1b[35m",
    red: "\x1b[31m",
    bold: "\x1b[1m"
};

/**
 * Executes a Nansen CLI command and parses the JSON output.
 * @param {string} cmd - The Nansen CLI command to run.
 * @returns {object|array|null} - The parsed JSON data or null if it fails.
 */
function runNansenCommand(cmd) {
    try {
        const output = execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
        return JSON.parse(output);
    } catch (error) {
        let stdoutMsg = error.stdout ? error.stdout.toString() : "";
        
        if (stdoutMsg.includes("CREDITS_EXHAUSTED") || stdoutMsg.includes("Insufficient credits")) {
            console.error(`\n${colors.red}${colors.bold}[!] CRITICAL ERROR: API Credits Exhausted.${colors.reset}`);
            process.exit(1); 
        }

        console.error(`\n${colors.red}[!] Command execution failed: ${cmd}${colors.reset}`);
        return null;
    }
}

/**
 * Safely extracts the array of items from API response formats.
 */
function extractArray(response) {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.data && response.data.data && Array.isArray(response.data.data)) return response.data.data;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.results && Array.isArray(response.results)) return response.results;
    if (response.result && Array.isArray(response.result)) return response.result;
    return [];
}

async function main() {
    console.log(`${colors.magenta}${colors.bold}🚀 Starting Nansen Autonomous Agent Node (ClawHub Edition)...${colors.reset}`);
    console.log(`${colors.magenta}Initializing cross-chain Smart Money sweeps...\n${colors.reset}`);
    
    let report = "# 🤖 Nansen Agent Alert System\n\n";
    let apiCalls = 0;

    const chains = ['ethereum', 'arbitrum', 'base'];

    for (const chain of chains) {
        console.log(`\n${colors.cyan}${colors.bold}🌍 -> Sweeping Chain: ${chain.toUpperCase()}${colors.reset}`);
        
        const netflowCmd = `nansen research smart-money netflow --chain ${chain} --limit 2`;
        const netflowsRaw = runNansenCommand(netflowCmd);
        apiCalls++;

        const trendingTokens = extractArray(netflowsRaw).slice(0, 2);

        if (trendingTokens.length === 0) {
            console.log(`   ${colors.red}[!] No significant netflow data returned for ${chain} right now.${colors.reset}`);
            continue;
        }

        for (const token of trendingTokens) {
            const symbol = token.token_symbol || token.symbol || 'Unknown';
            const address = token.token_address || token.address;
            const flowUsd = token.net_flow_usd || token.flow_usd || 0;

            if (!address) continue; 

            console.log(`   ${colors.yellow}🪙 Flagged Token: ${symbol} (${address})${colors.reset}`);
            report += `## 🪙 [${chain.toUpperCase()}] Token: ${symbol}\n`;
            report += `- **Smart Money Flow:** $${Number(flowUsd).toLocaleString()}\n\n`;

            console.log(`      -> Fetching Smart Money accumulator...`);
            const holdersCmd = `nansen research tgm holders --token-address ${address} --chain ${chain} --smart-money --limit 1`;
            const holdersRaw = runNansenCommand(holdersCmd);
            apiCalls++;

            const holders = extractArray(holdersRaw);

            if (holders.length > 0) {
                const topHolderAddress = holders[0].address || holders[0].wallet_address || holders[0].owner;
                
                if (topHolderAddress) {
                    report += `### 🐋 Top Accumulator: \`${topHolderAddress}\`\n`;

                    console.log(`      ${colors.green}-> Auditing wallet holdings...${colors.reset}`);
                    const portfolioCmd = `nansen research port holdings --address ${topHolderAddress} --chain ${chain} --limit 5`;
                    const portfolioRaw = runNansenCommand(portfolioCmd);
                    apiCalls++;

                    const portfolio = extractArray(portfolioRaw);
                    report += `**Cross-Referenced 'Shadow Bags':**\n`;
                    
                    if (portfolio.length > 0) {
                        let foundShadowBags = false;
                        portfolio.forEach(asset => {
                            const assetSymbol = asset.token_symbol || asset.symbol || '';
                            const isStableOrNative = ['USDT', 'USDC', 'DAI', 'ETH', 'WETH'].includes(assetSymbol.toUpperCase());
                            
                            if (assetSymbol.toUpperCase() !== symbol.toUpperCase() && !isStableOrNative && assetSymbol !== '') {
                                const rawValue = asset.value_usd || asset.balance_usd || 0;
                                const value = rawValue ? `$${Number(rawValue).toLocaleString()}` : 'Unknown Value';
                                report += `- **${assetSymbol}**: ${value}\n`;
                                foundShadowBags = true;
                            }
                        });

                        if (!foundShadowBags) {
                            report += `- *Wallet consists mostly of target token, native gas, or Stables.*\n`;
                        }
                    } else {
                        report += `- *Portfolio data obscured or currently empty on this chain.*\n`;
                    }
                }
            } else {
                console.log(`      ${colors.red}[-] No specific isolated Smart Money holder found. Skipping audit.${colors.reset}`);
                report += `- *No specific isolated Smart Money holder data found.*\n`;
            }
        }
    }

    report += `\n---\n*Automated Agent Payload generated via Nansen CLI.*\n*Total API Calls Executed: ${apiCalls}*\n`;
    
    // BONUS INCORPORATION: Direct hand-off to the 'nansen-trading' skill
    console.log(`\n${colors.magenta}📦 Formatting ClawHub 'nansen-trading' Action Plan...${colors.reset}`);
    
    report += `\n## ⚡ ClawHub Agent Action Plan (nansen-trading Integration)\n`;
    report += `> **System Prompt to OpenClaw Agent:** Load the official \`nansen-trading\` skill from ClawHub. Ensure \`NANSEN_WALLET_PASSWORD\` is sourced securely. For the trending tokens flagged on the **Base** network above, execute the following workflow:\n`;
    report += `> 1. Use the CLI to request a swap quote to buy $50 USDC worth of the flagged Base token.\n`;
    report += `> 2. Present the swap quote ID and estimated slippage.\n`;
    report += `> 3. Await my final confirmation to execute the DEX swap onchain.\n`;

    fs.writeFileSync('agent_alpha_report.md', report);
    
    console.log(`\n${colors.green}${colors.bold}✅ Execution complete!${colors.reset}`);
    console.log(`📊 Total API calls executed: ${apiCalls}`);
    console.log(`📄 Saved analysis to 'agent_alpha_report.md'`);
    console.log(`✨ BONUS: 'nansen-trading' OpenClaw Agent Action Plan incorporated!`);
}

main();
