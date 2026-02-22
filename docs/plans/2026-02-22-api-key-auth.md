# API Key Authentication Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add optional API key authentication to the MCP server with backend-enforced rate limiting.

**Architecture:** MCP server reads optional `CELESTIAL_NODE_API_KEY` env var and sends it as a Bearer token. All rate limiting is handled by the backend - MCP server just passes through errors with helpful messages.

**Tech Stack:** Node.js, MCP SDK, native fetch API

---

### Task 1: Simplify index.js - Remove Client-Side Rate Limiting

**Files:**
- Modify: `index.js:1-204`

**Step 1: Remove rate limiting variables and constants**

Delete these lines from index.js:
```javascript
const FREE_REQUEST_LIMIT = 100;

// Rate limiting state
let requestCount = 0;
const apiKey = process.env.CELESTIAL_NODE_API_KEY || null;

const RATE_LIMIT_MESSAGE = `
================================================================================
                     FREE TIER LIMIT REACHED (${FREE_REQUEST_LIMIT} requests)
================================================================================

You've used all ${FREE_REQUEST_LIMIT} free requests for this session.

To continue using Celestial Node MCP without limits:

  1. Register for free at: https://celestialnode.com/register
  2. Get your API key from your dashboard
  3. Add it to your MCP config:

     {
       "mcpServers": {
         "celestial-node": {
           "command": "npx",
           "args": ["-y", "celestialnode-mcp"],
           "env": {
             "CELESTIAL_NODE_API_KEY": "your-api-key-here"
           }
         }
       }
     }

Registered users get:
  - Unlimited API requests
  - Higher rate limits
  - Priority support
  - Early access to new features

================================================================================
`.trim();
```

**Step 2: Simplify fetchAPI function**

Replace the fetchAPI function with:
```javascript
const API_BASE = "https://celestialnode.com/api/v1";
const apiKey = process.env.CELESTIAL_NODE_API_KEY || null;

async function fetchAPI(path) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { headers });

  if (res.status === 401) {
    throw new Error("Invalid API key. Get yours at https://celestialnode.com/register");
  }

  if (res.status === 429) {
    throw new Error(`Rate limit exceeded. Register for higher limits: https://celestialnode.com/register`);
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}
```

**Step 3: Verify the file still works**

Run: `node index.js --help 2>&1 | head -5 || echo "Server starts"`
Expected: No errors (server will wait for stdin)

**Step 4: Commit**

```bash
git add index.js
git commit -m "refactor: simplify auth, delegate rate limiting to backend"
```

---

### Task 2: Update server.json with Environment Variable

**Files:**
- Modify: `server.json`

**Step 1: Add environmentVariables to packages[0]**

Add the `environmentVariables` field to the package object in server.json:

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.christerso/celestial-node",
  "description": "Real-time space data — ISS tracking, rocket launches, space news, Mars weather, and more",
  "repository": {
    "url": "https://github.com/christerso/celestialnode-mcp",
    "source": "github"
  },
  "version": "1.1.0",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "celestialnode-mcp",
      "version": "1.1.0",
      "transport": {
        "type": "stdio"
      },
      "environmentVariables": [
        {
          "name": "CELESTIAL_NODE_API_KEY",
          "description": "Optional API key for higher rate limits (100/day vs 25/hr). Get yours at https://celestialnode.com/register",
          "isRequired": false
        }
      ]
    }
  ]
}
```

**Step 2: Validate server.json**

Run: `mcp-publisher validate`
Expected: "✅ server.json is valid"

**Step 3: Commit**

```bash
git add server.json
git commit -m "feat: add CELESTIAL_NODE_API_KEY environment variable to server.json"
```

---

### Task 3: Update README with Rate Limit Documentation

**Files:**
- Modify: `README.md`

**Step 1: Update Quick Start section with API key config**

Replace the Quick Start section with:

```markdown
## Quick Start

### Without API Key (Free Tier)

Anonymous users get 25 requests/hour.

### Claude Desktop

Add to `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "celestial-node": {
      "command": "npx",
      "args": ["-y", "celestialnode-mcp"]
    }
  }
}
```

### With API Key (Higher Limits)

Register at [celestialnode.com/register](https://celestialnode.com/register) for 100 requests/day (free) or 500/day (paid).

```json
{
  "mcpServers": {
    "celestial-node": {
      "command": "npx",
      "args": ["-y", "celestialnode-mcp"],
      "env": {
        "CELESTIAL_NODE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Claude Code

```bash
# Without API key
claude mcp add celestial-node -- npx -y celestialnode-mcp

# With API key
claude mcp add celestial-node -- npx -y celestialnode-mcp --env CELESTIAL_NODE_API_KEY=your-key
```
```

**Step 2: Update Security section to Rate Limits section**

Replace the Security section with:

```markdown
## Rate Limits

| Tier | Limit | Authentication |
|------|-------|----------------|
| Anonymous | 25 requests/hour | None |
| Registered (free) | 100 requests/day | API key |
| Paid | 500 requests/day | API key |

Register at [celestialnode.com/register](https://celestialnode.com/register) to get your API key.
```

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add rate limits and API key documentation"
```

---

### Task 4: Update Package Version and Publish

**Files:**
- Modify: `package.json`

**Step 1: Bump version to 1.1.0**

Update the version in package.json from `"1.0.0"` to `"1.1.0"`.

**Step 2: Commit version bump**

```bash
git add package.json
git commit -m "chore: bump version to 1.1.0"
```

**Step 3: Publish to npm**

Run: `npm publish`
Expected: Successfully publishes celestialnode-mcp@1.1.0

**Step 4: Update MCP Registry**

Run: `mcp-publisher publish`
Expected: Successfully publishes io.github.christerso/celestial-node version 1.1.0

**Step 5: Push all changes**

```bash
git push origin main
```

---

## Summary

| Task | Description | Commits |
|------|-------------|---------|
| 1 | Simplify index.js, remove client rate limiting | 1 |
| 2 | Update server.json with env var | 1 |
| 3 | Update README with rate limits | 1 |
| 4 | Bump version, publish, push | 1 |

**Total: 4 commits**
