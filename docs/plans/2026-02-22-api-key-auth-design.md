# API Key Authentication Design

## Overview

Add optional API key authentication to the Celestial Node MCP server. Rate limiting is enforced by the backend (celestialnode.com API), not the MCP client.

## Rate Limits (Backend Enforced)

| Tier | Limit | Authentication |
|------|-------|----------------|
| Anonymous | 25 requests/hour | None |
| Registered (free) | 100 requests/day | API key |
| Paid | 500 requests/day | API key |

## MCP Server Changes

### 1. Remove In-Memory Rate Limiting

Delete the client-side rate limiting code added earlier. The backend handles all rate limiting.

### 2. Optional API Key Support

- Read `CELESTIAL_NODE_API_KEY` from environment variables
- If present, send `Authorization: Bearer <key>` header with all requests
- If absent, make unauthenticated requests (anonymous tier)

### 3. Error Handling

- 429 responses from backend should display a helpful message:
  - Current rate limit status
  - Link to register: https://celestialnode.com/register
  - Instructions for adding API key to MCP config

### 4. server.json Update

Add environment variable declaration:
```json
"environmentVariables": [{
  "name": "CELESTIAL_NODE_API_KEY",
  "description": "Optional API key for higher rate limits. Get yours at celestialnode.com/register",
  "isRequired": false
}]
```

### 5. README Update

Add section documenting:
- Rate limits by tier
- How to register for an API key
- How to configure the API key in MCP settings

## Files to Modify

1. `index.js` - Remove rate limiting, add API key header, improve error messages
2. `server.json` - Add environment variable declaration
3. `README.md` - Document rate limits and API key usage

## No Backend Changes Required

This design assumes the celestialnode.com backend already:
- Tracks requests by IP (anonymous) and API key (registered)
- Returns 429 with appropriate message when rate limited
- Validates API keys and returns 401 for invalid keys
