# celestialnode-mcp

MCP server for real-time space data from [Celestial Node](https://celestialnode.com).

Gives AI assistants access to 18 read-only tools covering ISS/Tiangong tracking, crew in space, rocket launches, space news, Mars missions, a 1M+ star catalog, near-Earth asteroids, satellites, and more.

## Quick Start

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

### Claude Code

```bash
claude mcp add celestial-node -- npx -y celestialnode-mcp
```

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

All 18 tools are **read-only** GET requests. No authentication required, no write operations, no user data access.

## License

MIT
