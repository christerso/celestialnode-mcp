[![npm version](https://img.shields.io/npm/v/celestialnode-mcp.svg)](https://www.npmjs.com/package/celestialnode-mcp) [![MCP Registry](https://img.shields.io/badge/MCP-Registry-blue)](https://registry.modelcontextprotocol.io/servers/io.github.christerso/celestial-node) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Celestial Node MCP

An MCP server for real-time space data from [Celestial Node](https://celestialnode.com).

Gives AI assistants access to 18 read-only tools covering ISS/Tiangong tracking, crew in space, rocket launches, space news, Mars missions, a 1M+ star catalog, near-Earth asteroids, satellites, and more.

## About Celestial Node

[Celestial Node](https://celestialnode.com) is a comprehensive space data platform that aggregates real-time information from space agencies worldwide. It offers:

- **Space Station Tracking** - Real-time positions of the ISS and Tiangong space station
- **Crew Information** - Current astronauts, cosmonauts, and taikonauts in orbit
- **Rocket Launches** - Upcoming launches from providers worldwide
- **Space News** - Curated news from NASA, ESA, CNSA, JAXA, Roscosmos, and ISRO
- **Mars Missions** - All 18 Mars missions with instruments and discoveries
- **Mars Weather** - Surface conditions including temperature, pressure, and wind
- **Star Catalog** - 1M+ stars from the ESA Gaia mission
- **Near-Earth Objects** - Asteroid tracking and close approaches
- **Satellites** - Search and track satellites with re-entry predictions
- **Space Encyclopedia** - Comprehensive database of spacecraft, missions, and engines

## Quick Start

### Without API Key

Anonymous usage is limited to 25 requests per hour.

**Claude Desktop**

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

**Claude Code**

```bash
claude mcp add celestial-node -- npx -y celestialnode-mcp
```

### With API Key

Register at [celestialnode.com/register](https://celestialnode.com/register) for higher rate limits.

**Claude Desktop**

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

**Claude Code**

```bash
claude mcp add celestial-node --env CELESTIAL_NODE_API_KEY=your-api-key-here -- npx -y celestialnode-mcp
```

## Rate Limits

| Tier | Limit | Authentication |
|------|-------|----------------|
| Anonymous | 25 requests/hour | None |
| Registered (free) | 100 requests/day | API key |
| Paid | 500 requests/day | API key |

Register for a free API key at [celestialnode.com/register](https://celestialnode.com/register).

## Tools

| Tool | Description |
|------|-------------|
| `get_iss_position` | Real-time ISS position (lat, lon, altitude, velocity) |
| `get_tiangong_position` | Real-time Tiangong station position |
| `get_crew_in_space` | Astronauts/cosmonauts/taikonauts currently in orbit |
| `get_upcoming_launches` | Upcoming rocket launches worldwide |
| `get_space_news` | Curated space news from NASA, ESA, CNSA, JAXA, Roscosmos, ISRO |
| `get_mars_missions` | All 18 Mars missions with instruments and discoveries |
| `get_mars_rovers` | Mars rovers with instruments, discoveries, and status |
| `get_mars_weather` | Mars surface weather (temperature, pressure, wind) |
| `search_stars` | Search 1M+ stars from ESA Gaia catalog |
| `get_star_details` | Full astronomical data for a star by Gaia source ID |
| `get_constellations` | All 88 IAU constellations |
| `get_near_earth_objects` | Upcoming asteroid close approaches |
| `get_hazardous_asteroids` | Potentially hazardous asteroids with orbital data |
| `get_space_agencies` | Space agencies worldwide |
| `search_encyclopedia` | Search space encyclopedia (spacecraft, missions, engines) |
| `get_satellite_categories` | Satellite categories with counts |
| `search_satellites` | Search tracked satellites by name |
| `get_upcoming_reentries` | Predicted satellite/rocket stage re-entries |

## Data Sources

All data is served from [celestialnode.com](https://celestialnode.com) which aggregates from NASA, ESA, CNSA, JAXA, Roscosmos, ISRO, SpaceX, and other global space agencies. Data is updated in real-time by background workers.

## Security

All 18 tools are **read-only** GET requests. No write operations, no user data access.

## License

MIT
