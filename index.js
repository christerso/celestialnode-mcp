#!/usr/bin/env node
/**
 * Celestial Node MCP Server
 *
 * A Model Context Protocol server that gives AI assistants access to
 * real-time space data from celestialnode.com.
 *
 * 18 read-only tools covering ISS/Tiangong tracking, crew in space,
 * rocket launches, space news, Mars missions, star catalog (1M+ stars),
 * near-Earth objects, satellites, and more.
 *
 * Usage:
 *   npx celestialnode-mcp
 *
 * Claude Desktop config (~/.config/claude/claude_desktop_config.json):
 *   {
 *     "mcpServers": {
 *       "celestial-node": {
 *         "command": "npx",
 *         "args": ["-y", "celestialnode-mcp"],
 *         "env": {
 *           "CELESTIAL_NODE_API_KEY": "your-api-key-here"
 *         }
 *       }
 *     }
 *   }
 *
 * Get your free API key at: https://celestialnode.com/register
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

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
    throw new Error("Rate limit exceeded. Register for higher limits: https://celestialnode.com/register");
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

const server = new Server(
  { name: "celestial-node", version: "1.1.0" },
  { capabilities: { tools: {} } }
);

// ─── Tool Definitions ───

const tools = [
  {
    name: "get_iss_position",
    description: "Get the real-time position of the International Space Station (ISS) including latitude, longitude, altitude in km, and velocity in km/h.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/iss/position"),
  },
  {
    name: "get_tiangong_position",
    description: "Get the real-time position of China's Tiangong space station including latitude, longitude, altitude, and velocity.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/stations/tiangong/position"),
  },
  {
    name: "get_crew_in_space",
    description: "List all astronauts, cosmonauts, and taikonauts currently in orbit. Returns names, nationalities, agencies, stations, and arrival dates.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/crew"),
  },
  {
    name: "get_upcoming_launches",
    description: "Get upcoming rocket launches worldwide. Returns launch provider, vehicle, payload, launch site, date/time, and mission description.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/launches/upcoming"),
  },
  {
    name: "get_space_news",
    description: "Get the latest curated space news articles from global sources including NASA, ESA, CNSA, JAXA, Roscosmos, ISRO, and independent journalists.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/news"),
  },
  {
    name: "get_mars_missions",
    description: "Get detailed information about all 18 Mars missions including full instrument suites, key scientific discoveries, mission objectives, technical specs (mass, cost, power source), and current operational status.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/mars/missions"),
  },
  {
    name: "get_mars_rovers",
    description: "Get detailed data on Mars rovers (Perseverance, Curiosity, Zhurong, Opportunity, Spirit, Sojourner) including instruments, discoveries, distance traveled, and status.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/mars/rovers"),
  },
  {
    name: "get_mars_weather",
    description: "Get the latest Mars surface weather data including temperature range (min/max in Celsius), atmospheric pressure (Pa), wind speed (m/s), wind direction, and Martian season.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/mars/weather"),
  },
  {
    name: "search_stars",
    description: "Search the star catalog (1M+ stars from ESA Gaia) by name or designation. Returns position (RA/Dec), magnitude, spectral type, distance, temperature, luminosity, and more.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Star name or designation to search for (e.g. 'Sirius', 'Betelgeuse', 'Alpha Centauri')" },
      },
      required: ["query"],
    },
    handler: (args) => fetchAPI(`/stars/search?q=${encodeURIComponent(args.query)}`),
  },
  {
    name: "get_star_details",
    description: "Get full astronomical data for a specific star by its Gaia source ID. Includes position, magnitudes, color index, spectral type, temperature, luminosity, radius, mass, proper motion, radial velocity, variability, binary status, and exoplanet count.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Gaia source ID of the star" },
      },
      required: ["id"],
    },
    handler: (args) => fetchAPI(`/stars/${args.id}`),
  },
  {
    name: "get_constellations",
    description: "List all 88 IAU constellations with their names, abbreviations, and descriptions.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/stars/constellations"),
  },
  {
    name: "get_near_earth_objects",
    description: "Get upcoming close approaches of near-Earth objects (asteroids). Returns approach date, miss distance (km and AU), relative velocity, diameter estimates, and hazard assessment.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/neo/close-approaches"),
  },
  {
    name: "get_hazardous_asteroids",
    description: "Get the list of potentially hazardous asteroids (PHAs) with diameter, absolute magnitude, orbital elements (semi-major axis, eccentricity, inclination), orbital period, and orbit classification.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/neo/hazardous"),
  },
  {
    name: "get_space_agencies",
    description: "Get a list of all space agencies worldwide including name, country, type (government/commercial/intergovernmental), founding year, description, and website.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/agencies"),
  },
  {
    name: "search_encyclopedia",
    description: "Search the space encyclopedia for information about spacecraft, missions, rocket engines, instruments, and space concepts.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (e.g. 'Hubble', 'Saturn V', 'black hole')" },
      },
      required: ["query"],
    },
    handler: (args) => fetchAPI(`/encyclopedia?q=${encodeURIComponent(args.query)}`),
  },
  {
    name: "get_satellite_categories",
    description: "Get satellite categories (communications, Earth observation, weather, navigation, scientific, etc.) with the number of tracked satellites in each.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/satellites/categories"),
  },
  {
    name: "search_satellites",
    description: "Search tracked satellites by name. Returns satellite name, NORAD ID, category, operator, launch date, and TLE orbital data.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Satellite name to search for (e.g. 'Hubble', 'Starlink', 'GOES')" },
      },
      required: ["query"],
    },
    handler: (args) => fetchAPI(`/satellites/search?q=${encodeURIComponent(args.query)}`),
  },
  {
    name: "get_upcoming_reentries",
    description: "Get predicted satellite and rocket stage re-entries into Earth's atmosphere with estimated re-entry windows.",
    inputSchema: { type: "object", properties: {} },
    handler: () => fetchAPI("/reentries/upcoming"),
  },
];

// ─── Register Handlers ───

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const tool = tools.find((t) => t.name === name);
  if (!tool) {
    return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
  try {
    const result = await tool.handler(args || {});
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { content: [{ type: "text", text: error.message }], isError: true };
  }
});

// ─── Start ───

const transport = new StdioServerTransport();
await server.connect(transport);
