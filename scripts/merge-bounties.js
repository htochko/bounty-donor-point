import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_REPO = process.env.GITHUB_REPOSITORY || "htochko/30-day-map-challenge";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional, raises rate limits

async function fetchWithAuth(url) {
  const headers = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  return response.json();
}

async function discoverAndMergeBounties() {
  console.log("Discovering participant forks and repositories...");
  const mergedData = [];

  try {
    // 1. Fetch repository forks to discover community acceptors automatically
    const forksUrl = `https://api.github.com/repos/${GITHUB_REPO}/forks?per_page=100`;
    const forks = await fetchWithAuth(forksUrl);

    // Include the main repository itself in the search pool
    const candidateRepos = [
      { owner: GITHUB_REPO.split('/')[0], repo: GITHUB_REPO.split('/')[1], branch: 'main' },
      ...forks.map(fork => ({ owner: fork.owner.login, repo: fork.name, branch: fork.default_branch || 'main' }))
    ];

    console.log(`Scanning ${candidateRepos.length} candidate repositories for bounty.json...`);

    // 2. Pull bounty.json from each candidate concurrently
    for (const candidate of candidateRepos) {
      const rawUrl = `https://raw.githubusercontent.com/${candidate.owner}/${candidate.repo}/${candidate.branch}/bounty.json`;
      
      try {
        const res = await fetch(rawUrl);
        if (res.ok) {
          const bounty = await res.json();
          if (bounty && bounty.bounty_participation_acceptor) {
            mergedData.push({
              ...bounty,
              source_repo: `https://github.com/${candidate.owner}/${candidate.repo}`,
              synced_at: new Date().toISOString()
            });
            console.log(`Successfully indexed participant: @${bounty.handle} from ${candidate.owner}`);
          }
        }
      } catch (innerErr) {
        // Skip repos without bounty.json silently
      }
    }

    // Sort sequentially by day for the advent timeline
    mergedData.sort((a, b) => a.day - b.day);

    // Save final artifact for frontend consumption
    const outputPath = path.resolve('public/merged-bounties.json');
    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
    console.log(`Merge complete! Total active participants compiled: ${mergedData.length}`);

  } catch (err) {
    console.error("Critical error during automated bounty discovery:", err.message);
    process.exit(1);
  }
}

discoverAndMergeBounties();