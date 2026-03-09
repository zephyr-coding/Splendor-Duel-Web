import { writeFile } from "node:fs/promises";
import https from "node:https";

const CHUNK_URL = "https://splendortactics.com/_next/static/chunks/d3440763dc2817b5.js";
const OUTPUT_FILE = new URL("../src/duelData.ts", import.meta.url);

const abilityMap = {
  null: null,
  "Take another turn": "extra_turn",
  "Take a gem of the same color": "take_matching",
  "Steal a gem from opponent": "steal_token",
  "Gain a privilege": "gain_privilege",
};

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(`Request failed with status ${response.statusCode}`));
          return;
        }

        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

function extractCards(chunkText) {
  const match = chunkText.match(/JSON\.parse\('(\[.*?\])'\)/s);

  if (!match) {
    throw new Error("Could not extract card JSON from remote chunk.");
  }

  const json = match[1]
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"');

  return JSON.parse(json);
}

function normalizeCard(card) {
  const bonus = card.bonus === "associate" ? "linked" : card.bonus;
  const ability = abilityMap[String(card.ability)];

  if (ability === undefined) {
    throw new Error(`Unknown ability: ${card.ability}`);
  }

  return {
    id: card.id,
    name: card.name,
    level: card.level,
    type: card.type,
    cost: card.cost,
    points: card.points,
    crowns: card.crowns,
    bonus,
    bonusCount: card.bonusCount,
    ability,
  };
}

function toTsLiteral(value) {
  return JSON.stringify(value, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"([a-z_]+)"/g, "'$1'");
}

const remoteChunk = await fetchText(CHUNK_URL);
const cards = extractCards(remoteChunk).map(normalizeCard);
const jewelCards = cards.filter((card) => card.type === "jewel");
const royalCards = cards.filter((card) => card.type === "royal");

const fileContents = `export type DuelAbility =
  | 'extra_turn'
  | 'take_matching'
  | 'steal_token'
  | 'gain_privilege'
  | null;

export type DuelBonus = 'white' | 'blue' | 'green' | 'red' | 'black' | 'linked' | null;
export type DuelCostColor = 'white' | 'blue' | 'green' | 'red' | 'black' | 'pearl';

export interface DuelCardData {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  type: 'jewel' | 'royal';
  cost: Partial<Record<DuelCostColor, number>>;
  points: number;
  crowns: number;
  bonus: DuelBonus;
  bonusCount: number;
  ability: DuelAbility;
}

export const duelJewelCards: DuelCardData[] = ${toTsLiteral(jewelCards)};

export const duelRoyalCards: DuelCardData[] = ${toTsLiteral(royalCards)};
`;

await writeFile(OUTPUT_FILE, fileContents, "utf8");
console.log(`Generated ${jewelCards.length} jewel cards and ${royalCards.length} royal cards.`);
