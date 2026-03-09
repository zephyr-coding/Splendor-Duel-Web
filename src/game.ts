import { duelJewelCards, duelRoyalCards, type DuelAbility, type DuelCardData } from "./duelData";

export const gemColors = ["white", "blue", "green", "red", "black"] as const;
export const spendColors = [...gemColors, "pearl"] as const;
export const tokenColors = [...spendColors, "gold"] as const;
export const levels = [1, 2, 3] as const;

export type GemColor = (typeof gemColors)[number];
export type SpendColor = (typeof spendColors)[number];
export type TokenColor = (typeof tokenColors)[number];
export type Level = (typeof levels)[number];
export type BonusColor = GemColor;
export type CardBonus = BonusColor | "linked" | null;
export type Stage =
  | "turn"
  | "discard"
  | "choose_royal"
  | "resolve_take_matching"
  | "resolve_steal"
  | "pass"
  | "game_over";

export type TokenBank = Record<TokenColor, number>;
export type BonusBank = Record<GemColor, number>;

export interface OwnedCard {
  uid: string;
  card: DuelCardData;
  resolvedBonus: BonusColor | null;
}

export interface ReservedCard {
  card: DuelCardData;
  visibility: "public" | "private";
}

export interface PlayerState {
  id: number;
  name: string;
  tokens: TokenBank;
  privileges: number;
  bonuses: BonusBank;
  cards: OwnedCard[];
  reserved: ReservedCard[];
  royals: DuelCardData[];
  score: number;
  crowns: number;
}

export interface TurnState {
  replenished: boolean;
  extraTurn: boolean;
}

export interface WinnerSummary {
  winnerId: number;
  reason: string;
}

export interface SetupConfig {
  players: [string, string];
  firstPlayer: "random" | 0 | 1;
}

interface PendingTakeMatchingEffect {
  kind: "take_matching";
  color: BonusColor;
  sourceLabel: string;
}

interface PendingStealEffect {
  kind: "steal_token";
  sourceLabel: string;
}

interface PendingRoyalEffect {
  kind: "choose_royal";
  threshold: 3 | 6;
  sourceLabel: string;
}

export type PendingEffect =
  | PendingTakeMatchingEffect
  | PendingStealEffect
  | PendingRoyalEffect;

export interface MarketLocation {
  source: "market";
  level: Level;
  slot: number;
}

export interface ReservedLocation {
  source: "reserved";
  cardId: string;
}

export type CardLocation = MarketLocation | ReservedLocation;

export interface GameState {
  config: SetupConfig;
  stage: Stage;
  activePlayer: number;
  firstPlayer: number;
  board: Array<TokenColor | null>;
  bag: TokenColor[];
  privilegePool: number;
  decks: Record<Level, DuelCardData[]>;
  market: Record<Level, Array<DuelCardData | null>>;
  royalMarket: DuelCardData[];
  players: [PlayerState, PlayerState];
  turn: TurnState;
  pendingEffects: PendingEffect[];
  history: string[];
  winnerSummary: WinnerSummary | null;
}

const spiralOrder = [12, 13, 18, 17, 16, 11, 6, 7, 8, 9, 14, 19, 24, 23, 22, 21, 20, 15, 10, 5, 0, 1, 2, 3, 4] as const;

const levelSlotCounts: Record<Level, number> = {
  1: 5,
  2: 4,
  3: 3,
};

export const colorMeta: Record<
  TokenColor,
  { label: string; short: string; css: string; accent: string }
> = {
  white: { label: "白钻", short: "白", css: "token-white", accent: "#f4f0e7" },
  blue: { label: "蓝宝", short: "蓝", css: "token-blue", accent: "#4e87ff" },
  green: { label: "祖母绿", short: "绿", css: "token-green", accent: "#1db987" },
  red: { label: "红宝", short: "红", css: "token-red", accent: "#d74958" },
  black: { label: "黑玛瑙", short: "黑", css: "token-black", accent: "#16181d" },
  pearl: { label: "珍珠", short: "珠", css: "token-pearl", accent: "#ece6ff" },
  gold: { label: "黄金", short: "金", css: "token-gold", accent: "#d8b13f" },
};

const abilityLabels: Record<Exclude<DuelAbility, null>, string> = {
  extra_turn: "再进行一回合",
  take_matching: "再拿 1 枚同色宝石",
  steal_token: "从对手处拿 1 枚宝石或珍珠",
  gain_privilege: "获得 1 枚特权卷轴",
};

const emptyBonusBank = (): BonusBank => ({
  white: 0,
  blue: 0,
  green: 0,
  red: 0,
  black: 0,
});

export const emptyTokenBank = (): TokenBank => ({
  white: 0,
  blue: 0,
  green: 0,
  red: 0,
  black: 0,
  pearl: 0,
  gold: 0,
});

export const sumTokens = (tokens: TokenBank): number =>
  tokenColors.reduce((total, color) => total + tokens[color], 0);

export const formatCost = (cost: Partial<Record<SpendColor, number>>): string =>
  spendColors
    .filter((color) => (cost[color] ?? 0) > 0)
    .map((color) => `${colorMeta[color].short}${cost[color] ?? 0}`)
    .join(" ");

export const formatPayment = (payment: TokenBank): string => {
  const value = tokenColors
    .filter((color) => payment[color] > 0)
    .map((color) => `${colorMeta[color].short}${payment[color]}`)
    .join(" ");

  return value || "无需支付";
};

export const formatBonuses = (bonuses: BonusBank): string =>
  gemColors
    .filter((color) => bonuses[color] > 0)
    .map((color) => `${colorMeta[color].short}${bonuses[color]}`)
    .join(" ");

export const describeCard = (card: DuelCardData): string => {
  const bonusText =
    card.bonus === "linked"
      ? "联结奖励"
      : card.bonus
        ? `${colorMeta[card.bonus].label}奖励${card.bonusCount > 1 ? ` x${card.bonusCount}` : ""}`
        : "无颜色奖励";
  const crownsText = card.crowns > 0 ? ` · 皇冠${card.crowns}` : "";
  const abilityText = card.ability ? ` · ${abilityLabels[card.ability]}` : "";
  return `${bonusText} · ${card.points}分${crownsText}${abilityText}`;
};

export const boardTokenCounts = (board: Array<TokenColor | null>): TokenBank => {
  const counts = emptyTokenBank();

  board.forEach((token) => {
    if (token) {
      counts[token] += 1;
    }
  });

  return counts;
};

export const bagTokenCounts = (bag: TokenColor[]): TokenBank => {
  const counts = emptyTokenBank();

  bag.forEach((token) => {
    counts[token] += 1;
  });

  return counts;
};

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
  }

  return copy;
};

const createPlayer = (id: number, name: string): PlayerState => ({
  id,
  name,
  tokens: emptyTokenBank(),
  privileges: 0,
  bonuses: emptyBonusBank(),
  cards: [],
  reserved: [],
  royals: [],
  score: 0,
  crowns: 0,
});

const drawVisibleCards = (
  deck: DuelCardData[],
  count: number,
): { visible: Array<DuelCardData | null>; remaining: DuelCardData[] } => ({
  visible: Array.from({ length: count }, (_, index) => deck[index] ?? null),
  remaining: deck.slice(count),
});

const cloneGame = (state: GameState): GameState => structuredClone(state);

const getPlayer = (state: GameState, playerId: number): PlayerState => state.players[playerId];
const getActivePlayer = (state: GameState): PlayerState => state.players[state.activePlayer];
const otherPlayerId = (playerId: number): number => (playerId === 0 ? 1 : 0);

const normalizeOwnedBonus = (
  bonus: CardBonus,
  linkColor: BonusColor | null | undefined,
): BonusColor | null => {
  if (bonus === "linked") {
    return linkColor ?? null;
  }

  return bonus;
};

const pushTokensToBag = (bag: TokenColor[], payment: TokenBank): void => {
  tokenColors.forEach((color) => {
    for (let count = 0; count < payment[color]; count += 1) {
      bag.push(color);
    }
  });
};

const removeTokenFromBoard = (board: Array<TokenColor | null>, index: number): TokenColor | null => {
  const token = board[index] ?? null;
  board[index] = null;
  return token;
};

const refillBoardFromBag = (state: GameState): void => {
  if (state.bag.length === 0) {
    return;
  }

  let randomBag = shuffle(state.bag);
  spiralOrder.forEach((index) => {
    if (state.board[index] !== null || randomBag.length === 0) {
      return;
    }

    state.board[index] = randomBag[0];
    randomBag = randomBag.slice(1);
  });
  state.bag = randomBag;
}

const gainPrivilege = (state: GameState, playerId: number, reason?: string): void => {
  const player = getPlayer(state, playerId);
  const opponent = getPlayer(state, otherPlayerId(playerId));

  if (player.privileges >= 3) {
    return;
  }

  if (state.privilegePool > 0) {
    state.privilegePool -= 1;
    player.privileges += 1;
    if (reason) {
      state.history.push(`${player.name} 因 ${reason} 获得 1 枚特权卷轴。`);
    }
    return;
  }

  if (opponent.privileges > 0) {
    opponent.privileges -= 1;
    player.privileges += 1;
    if (reason) {
      state.history.push(`${player.name} 因 ${reason} 从 ${opponent.name} 处取得 1 枚特权卷轴。`);
    }
  }
};

const getPointsByColor = (player: PlayerState): BonusBank => {
  const points = emptyBonusBank();

  player.cards.forEach((owned) => {
    if (owned.resolvedBonus) {
      points[owned.resolvedBonus] += owned.card.points;
    }
  });

  return points;
};

const getVictoryReason = (player: PlayerState): string | null => {
  if (player.score >= 20) {
    return "达到 20 点声望";
  }

  if (player.crowns >= 10) {
    return "累计 10 顶皇冠";
  }

  const pointsByColor = getPointsByColor(player);
  const color = gemColors.find((entry) => pointsByColor[entry] >= 10);
  if (color) {
    return `${colorMeta[color].label}同色卡达到 10 点声望`;
  }

  return null;
};

const getBoardCoordinates = (index: number): { row: number; col: number } => ({
  row: Math.floor(index / 5),
  col: index % 5,
});

export const getBoardLineValidation = (
  board: Array<TokenColor | null>,
  indices: number[],
): { valid: boolean; message?: string } => {
  const unique = [...new Set(indices)];

  if (unique.length === 0 || unique.length > 3 || unique.length !== indices.length) {
    return { valid: false, message: "必须选择 1 到 3 个不同位置。" };
  }

  const tokens = unique.map((index) => board[index]);
  if (tokens.some((token) => token === null)) {
    return { valid: false, message: "选择的位置必须有宝石。" };
  }

  if (tokens.some((token) => token === "gold")) {
    return { valid: false, message: "直线拿取不能拿黄金。" };
  }

  if (unique.length === 1) {
    return { valid: true };
  }

  const coordinates = unique.map(getBoardCoordinates);
  const sameRow = coordinates.every((coord) => coord.row === coordinates[0].row);
  const sameCol = coordinates.every((coord) => coord.col === coordinates[0].col);
  const sameDiagDown = coordinates.every(
    (coord) => coord.row - coord.col === coordinates[0].row - coordinates[0].col,
  );
  const sameDiagUp = coordinates.every(
    (coord) => coord.row + coord.col === coordinates[0].row + coordinates[0].col,
  );

  if (!sameRow && !sameCol && !sameDiagDown && !sameDiagUp) {
    return { valid: false, message: "必须在同一条横线、竖线或对角线上。" };
  }

  if (sameRow) {
    const cols = coordinates.map((coord) => coord.col).sort((left, right) => left - right);
    const consecutive = cols.every((col, index, array) => index === 0 || col - array[index - 1] === 1);
    return consecutive
      ? { valid: true }
      : { valid: false, message: "横向拿取必须是连续相邻的宝石。" };
  }

  if (sameCol) {
    const rows = coordinates.map((coord) => coord.row).sort((left, right) => left - right);
    const consecutive = rows.every((row, index, array) => index === 0 || row - array[index - 1] === 1);
    return consecutive
      ? { valid: true }
      : { valid: false, message: "纵向拿取必须是连续相邻的宝石。" };
  }

  const rows = coordinates.map((coord) => coord.row).sort((left, right) => left - right);
  const consecutive = rows.every((row, index, array) => index === 0 || row - array[index - 1] === 1);
  return consecutive
    ? { valid: true }
    : { valid: false, message: "对角线拿取必须是连续相邻的宝石。" };
};

const takeMarketCard = (state: GameState, level: Level, slot: number): DuelCardData | null => {
  const card = state.market[level][slot] ?? null;

  if (!card) {
    return null;
  }

  state.market[level][slot] = state.decks[level][0] ?? null;
  state.decks[level] = state.decks[level].slice(1);
  return card;
};

const hasBoardToken = (board: Array<TokenColor | null>, token: TokenColor): boolean =>
  board.some((entry) => entry === token);

export const canReserveAnyCard = (state: GameState, player: PlayerState): boolean =>
  player.reserved.length < 3 &&
  hasBoardToken(state.board, "gold") &&
  (levels.some((level) => state.market[level].some(Boolean)) ||
    levels.some((level) => state.decks[level].length > 0));

const getAffordablePaymentOptions = (player: PlayerState, card: DuelCardData): TokenBank[] => {
  const remaining = {
    white: Math.max((card.cost.white ?? 0) - player.bonuses.white, 0),
    blue: Math.max((card.cost.blue ?? 0) - player.bonuses.blue, 0),
    green: Math.max((card.cost.green ?? 0) - player.bonuses.green, 0),
    red: Math.max((card.cost.red ?? 0) - player.bonuses.red, 0),
    black: Math.max((card.cost.black ?? 0) - player.bonuses.black, 0),
    pearl: card.cost.pearl ?? 0,
  } satisfies Record<SpendColor, number>;

  const results: TokenBank[] = [];
  const seen = new Set<string>();

  const visit = (index: number, current: Partial<Record<SpendColor, number>>) => {
    if (index === spendColors.length) {
      const remainingTotal = spendColors.reduce(
        (total, color) => total + (remaining[color] - (current[color] ?? 0)),
        0,
      );

      if (remainingTotal > player.tokens.gold) {
        return;
      }

      const payment = emptyTokenBank();
      spendColors.forEach((color) => {
        payment[color] = current[color] ?? 0;
      });
      payment.gold = remainingTotal;

      const signature = tokenColors.map((color) => payment[color]).join("-");
      if (!seen.has(signature)) {
        seen.add(signature);
        results.push(payment);
      }
      return;
    }

    const color = spendColors[index];
    const maxSpend = Math.min(player.tokens[color], remaining[color]);

    for (let spend = 0; spend <= maxSpend; spend += 1) {
      visit(index + 1, { ...current, [color]: spend });
    }
  };

  visit(0, {});

  return results.sort((left, right) => {
    if (left.gold !== right.gold) {
      return left.gold - right.gold;
    }
    return formatPayment(left).localeCompare(formatPayment(right));
  });
};

export const getPaymentOptions = (player: PlayerState, card: DuelCardData): TokenBank[] =>
  getAffordablePaymentOptions(player, card);

export const getLinkColorOptions = (player: PlayerState): BonusColor[] =>
  gemColors.filter((color) => player.cards.some((card) => card.resolvedBonus === color));

export const canPurchaseCard = (player: PlayerState, card: DuelCardData): boolean => {
  if (card.bonus === "linked" && getLinkColorOptions(player).length === 0) {
    return false;
  }

  return getAffordablePaymentOptions(player, card).length > 0;
};

const isPaymentValid = (player: PlayerState, card: DuelCardData, payment: TokenBank): boolean => {
  const signature = tokenColors.map((color) => payment[color]).join("-");
  return getAffordablePaymentOptions(player, card).some(
    (option) => tokenColors.map((color) => option[color]).join("-") === signature,
  );
};

const anyMandatoryActionAvailable = (state: GameState): boolean => {
  const player = getActivePlayer(state);
  const canTakeLine = state.board.some((token) => token !== null && token !== "gold");
  const canReserve = canReserveAnyCard(state, player);
  const canBuyMarket = levels.some((level) =>
    state.market[level].some((card) => card && canPurchaseCard(player, card)),
  );
  const canBuyReserved = player.reserved.some((entry) => canPurchaseCard(player, entry.card));

  return canTakeLine || canReserve || canBuyMarket || canBuyReserved;
};

export const mustReplenishBeforeMandatory = (state: GameState): boolean =>
  state.stage === "turn" && !anyMandatoryActionAvailable(state) && state.bag.length > 0;

const advanceResolution = (state: GameState): GameState => {
  const player = getActivePlayer(state);

  while (state.pendingEffects.length > 0) {
    const nextEffect = state.pendingEffects[0];

    if (nextEffect.kind === "take_matching") {
      if (hasBoardToken(state.board, nextEffect.color)) {
        state.stage = "resolve_take_matching";
        return state;
      }

      state.pendingEffects.shift();
      continue;
    }

    if (nextEffect.kind === "steal_token") {
      const opponent = getPlayer(state, otherPlayerId(player.id));
      const canSteal = spendColors.some((color) => opponent.tokens[color] > 0);
      if (canSteal) {
        state.stage = "resolve_steal";
        return state;
      }

      state.pendingEffects.shift();
      continue;
    }

    if (nextEffect.kind === "choose_royal") {
      if (state.royalMarket.length > 0) {
        state.stage = "choose_royal";
        return state;
      }

      state.pendingEffects.shift();
    }
  }

  if (sumTokens(player.tokens) > 10) {
    state.stage = "discard";
    return state;
  }

  const winReason = getVictoryReason(player);
  if (winReason) {
    state.stage = "game_over";
    state.winnerSummary = {
      winnerId: player.id,
      reason: winReason,
    };
    state.history.push(`${player.name} 达成胜利条件：${winReason}。`);
    return state;
  }

  if (state.turn.extraTurn) {
    state.turn = { replenished: false, extraTurn: false };
    state.stage = "turn";
    state.history.push(`${player.name} 触发额外回合，继续行动。`);
    return state;
  }

  state.activePlayer = otherPlayerId(player.id);
  state.turn = { replenished: false, extraTurn: false };
  state.stage = "pass";
  return state;
};

const pushAbilityEffect = (
  state: GameState,
  ability: DuelAbility,
  playerId: number,
  resolvedBonus: BonusColor | null,
  sourceLabel: string,
): void => {
  if (!ability) {
    return;
  }

  if (ability === "extra_turn") {
    state.turn.extraTurn = true;
    state.history.push(`${getPlayer(state, playerId).name} 触发了 ${sourceLabel} 的额外回合能力。`);
    return;
  }

  if (ability === "gain_privilege") {
    gainPrivilege(state, playerId, `${sourceLabel} 的能力`);
    return;
  }

  if (ability === "take_matching" && resolvedBonus) {
    state.pendingEffects.push({
      kind: "take_matching",
      color: resolvedBonus,
      sourceLabel,
    });
    return;
  }

  if (ability === "steal_token") {
    state.pendingEffects.push({
      kind: "steal_token",
      sourceLabel,
    });
  }
};

export const createNewGame = (config: SetupConfig): GameState => {
  const firstPlayer =
    config.firstPlayer === "random" ? Math.floor(Math.random() * 2) : config.firstPlayer;
  const players: [PlayerState, PlayerState] = [
    createPlayer(0, config.players[0].trim() || "玩家一"),
    createPlayer(1, config.players[1].trim() || "玩家二"),
  ];

  const shuffledCards = shuffle(duelJewelCards);
  const decksByLevel = {
    1: shuffledCards.filter((card) => card.level === 1),
    2: shuffledCards.filter((card) => card.level === 2),
    3: shuffledCards.filter((card) => card.level === 3),
  } as Record<Level, DuelCardData[]>;

  const level1 = drawVisibleCards(decksByLevel[1], levelSlotCounts[1]);
  const level2 = drawVisibleCards(decksByLevel[2], levelSlotCounts[2]);
  const level3 = drawVisibleCards(decksByLevel[3], levelSlotCounts[3]);
  const royalMarket = shuffle(duelRoyalCards);
  const boardPool = shuffle([
    "white",
    "white",
    "white",
    "white",
    "blue",
    "blue",
    "blue",
    "blue",
    "green",
    "green",
    "green",
    "green",
    "red",
    "red",
    "red",
    "red",
    "black",
    "black",
    "black",
    "black",
    "pearl",
    "pearl",
    "gold",
    "gold",
    "gold",
  ] as TokenColor[]);
  const game: GameState = {
    config,
    stage: "turn",
    activePlayer: firstPlayer,
    firstPlayer,
    board: boardPool,
    bag: [],
    privilegePool: 3,
    decks: {
      1: level1.remaining,
      2: level2.remaining,
      3: level3.remaining,
    },
    market: {
      1: level1.visible,
      2: level2.visible,
      3: level3.visible,
    },
    royalMarket,
    players,
    turn: {
      replenished: false,
      extraTurn: false,
    },
    pendingEffects: [],
    history: [`新对局开始，先手是 ${players[firstPlayer].name}。`],
    winnerSummary: null,
  };

  gainPrivilege(game, otherPlayerId(firstPlayer), "后手补偿");
  return game;
};

export const acknowledgePass = (state: GameState): GameState => {
  if (state.stage !== "pass") {
    return state;
  }

  const next = cloneGame(state);
  next.stage = "turn";
  return next;
};

export const usePrivilegeTakeToken = (state: GameState, boardIndex: number): GameState => {
  if (state.stage !== "turn") {
    return state;
  }

  const next = cloneGame(state);
  const player = getActivePlayer(next);
  const token = next.board[boardIndex];

  if (next.turn.replenished || player.privileges <= 0 || token === null || token === "gold") {
    return state;
  }

  player.privileges -= 1;
  player.tokens[token] += 1;
  next.board[boardIndex] = null;
  next.history.push(`${player.name} 消耗 1 枚特权卷轴，拿走了 1 枚 ${colorMeta[token].label}。`);
  return next;
};

export const replenishBoard = (state: GameState): GameState => {
  if (state.stage !== "turn") {
    return state;
  }

  const next = cloneGame(state);

  if (next.turn.replenished || next.bag.length === 0) {
    return state;
  }

  refillBoardFromBag(next);
  next.turn.replenished = true;
  gainPrivilege(next, otherPlayerId(next.activePlayer), "对手补板");
  next.history.push(`${getActivePlayer(next).name} 选择补板，按螺旋顺序补回了棋盘空位。`);
  return next;
};

export const takeLineTokens = (state: GameState, indices: number[]): GameState => {
  if (state.stage !== "turn" || mustReplenishBeforeMandatory(state)) {
    return state;
  }

  const validation = getBoardLineValidation(state.board, indices);
  if (!validation.valid) {
    return state;
  }

  const next = cloneGame(state);
  const player = getActivePlayer(next);
  const pickedTokens = indices
    .map((index) => removeTokenFromBoard(next.board, index))
    .filter((token): token is Exclude<TokenColor, "gold"> => token !== null && token !== "gold");

  pickedTokens.forEach((token) => {
    player.tokens[token] += 1;
  });

  const sameColor = pickedTokens.length === 3 && pickedTokens.every((token) => token === pickedTokens[0]);
  const pearlCount = pickedTokens.filter((token) => token === "pearl").length;

  if (sameColor || pearlCount >= 2) {
    gainPrivilege(next, otherPlayerId(player.id), "对手拿取直线宝石触发补偿");
  }

  next.history.push(
    `${player.name} 在棋盘上拿走了 ${pickedTokens.map((token) => colorMeta[token].label).join("、")}。`,
  );
  return advanceResolution(next);
};

export const reserveVisibleCard = (
  state: GameState,
  boardIndex: number,
  level: Level,
  slot: number,
): GameState => {
  if (state.stage !== "turn" || mustReplenishBeforeMandatory(state)) {
    return state;
  }

  const next = cloneGame(state);
  const player = getActivePlayer(next);
  const token = next.board[boardIndex];

  if (!canReserveAnyCard(next, player) || token !== "gold") {
    return state;
  }

  const card = takeMarketCard(next, level, slot);
  if (!card) {
    return state;
  }

  next.board[boardIndex] = null;
  player.tokens.gold += 1;
  player.reserved.push({ card, visibility: "public" });
  next.history.push(`${player.name} 拿走 1 枚黄金，并预留了公开牌 ${card.name}。`);
  return advanceResolution(next);
};

export const reserveTopDeckCard = (
  state: GameState,
  boardIndex: number,
  level: Level,
): GameState => {
  if (state.stage !== "turn" || mustReplenishBeforeMandatory(state)) {
    return state;
  }

  const next = cloneGame(state);
  const player = getActivePlayer(next);
  const token = next.board[boardIndex];

  if (!canReserveAnyCard(next, player) || token !== "gold" || next.decks[level].length === 0) {
    return state;
  }

  const [card, ...rest] = next.decks[level];
  next.decks[level] = rest;
  next.board[boardIndex] = null;
  player.tokens.gold += 1;
  player.reserved.push({ card, visibility: "private" });
  next.history.push(`${player.name} 拿走 1 枚黄金，并盲预留了 ${level} 级牌堆顶牌。`);
  return advanceResolution(next);
};

export const buyCard = (
  state: GameState,
  location: CardLocation,
  payment: TokenBank,
  linkColor: BonusColor | null = null,
): GameState => {
  if (state.stage !== "turn" || mustReplenishBeforeMandatory(state)) {
    return state;
  }

  const next = cloneGame(state);
  const player = getActivePlayer(next);
  let card: DuelCardData | null = null;

  if (location.source === "market") {
    card = next.market[location.level][location.slot] ?? null;
  } else {
    card = player.reserved.find((entry) => entry.card.id === location.cardId)?.card ?? null;
  }

  if (!card || !canPurchaseCard(player, card) || !isPaymentValid(player, card, payment)) {
    return state;
  }

  if (card.bonus === "linked" && !getLinkColorOptions(player).includes(linkColor as BonusColor)) {
    return state;
  }

  tokenColors.forEach((color) => {
    if (payment[color] > player.tokens[color]) {
      throw new Error("支付方案超出玩家持有筹码。");
    }
  });

  if (location.source === "market") {
    takeMarketCard(next, location.level, location.slot);
  } else {
    const reserveIndex = player.reserved.findIndex((entry) => entry.card.id === location.cardId);
    if (reserveIndex === -1) {
      return state;
    }
    player.reserved.splice(reserveIndex, 1);
  }

  tokenColors.forEach((color) => {
    player.tokens[color] -= payment[color];
  });
  pushTokensToBag(next.bag, payment);

  const previousCrowns = player.crowns;
  const resolvedBonus = normalizeOwnedBonus(card.bonus as CardBonus, linkColor);
  const ownedCard: OwnedCard = {
    uid: `${card.id}-${player.cards.length + 1}-${player.royals.length}`,
    card,
    resolvedBonus,
  };

  player.cards.push(ownedCard);
  if (resolvedBonus) {
    player.bonuses[resolvedBonus] += card.bonusCount;
  }
  player.score += card.points;
  player.crowns += card.crowns;

  const sourceText =
    location.source === "market"
      ? `${location.level} 级公开牌`
      : "自己的预留牌";
  const linkText =
    card.bonus === "linked" && resolvedBonus
      ? `，并将它联结为 ${colorMeta[resolvedBonus].label} 奖励`
      : "";

  next.history.push(
    `${player.name} 购买了来自${sourceText}的 ${card.name}，支付 ${formatPayment(payment)}${linkText}。`,
  );

  pushAbilityEffect(next, card.ability, player.id, resolvedBonus, card.name);

  if (previousCrowns < 3 && player.crowns >= 3) {
    next.pendingEffects.push({
      kind: "choose_royal",
      threshold: 3,
      sourceLabel: "第 3 顶皇冠",
    });
  }

  if (previousCrowns < 6 && player.crowns >= 6) {
    next.pendingEffects.push({
      kind: "choose_royal",
      threshold: 6,
      sourceLabel: "第 6 顶皇冠",
    });
  }

  return advanceResolution(next);
};

export const resolveTakeMatching = (state: GameState, boardIndex: number): GameState => {
  if (state.stage !== "resolve_take_matching") {
    return state;
  }

  const effect = state.pendingEffects[0];
  if (!effect || effect.kind !== "take_matching") {
    return state;
  }

  const next = cloneGame(state);
  const token = next.board[boardIndex];

  if (token !== effect.color) {
    return state;
  }

  next.board[boardIndex] = null;
  getActivePlayer(next).tokens[token] += 1;
  next.pendingEffects.shift();
  next.history.push(`${getActivePlayer(next).name} 因 ${effect.sourceLabel} 的能力，再拿了 1 枚 ${colorMeta[token].label}。`);
  return advanceResolution(next);
};

export const resolveStealToken = (state: GameState, color: SpendColor): GameState => {
  if (state.stage !== "resolve_steal") {
    return state;
  }

  const effect = state.pendingEffects[0];
  if (!effect || effect.kind !== "steal_token") {
    return state;
  }

  const next = cloneGame(state);
  const player = getActivePlayer(next);
  const opponent = getPlayer(next, otherPlayerId(player.id));

  if (opponent.tokens[color] <= 0) {
    return state;
  }

  opponent.tokens[color] -= 1;
  player.tokens[color] += 1;
  next.pendingEffects.shift();
  next.history.push(`${player.name} 因 ${effect.sourceLabel} 的能力，从 ${opponent.name} 处拿走了 1 枚 ${colorMeta[color].label}。`);
  return advanceResolution(next);
};

export const chooseRoyalCard = (state: GameState, royalId: string): GameState => {
  if (state.stage !== "choose_royal") {
    return state;
  }

  const effect = state.pendingEffects[0];
  if (!effect || effect.kind !== "choose_royal") {
    return state;
  }

  const next = cloneGame(state);
  const player = getActivePlayer(next);
  const royalIndex = next.royalMarket.findIndex((card) => card.id === royalId);

  if (royalIndex === -1) {
    return state;
  }

  const [royal] = next.royalMarket.splice(royalIndex, 1);
  player.royals.push(royal);
  player.score += royal.points;
  next.pendingEffects.shift();
  next.history.push(`${player.name} 因 ${effect.sourceLabel} 取得皇家卡 ${royal.name}，获得 ${royal.points} 分。`);
  pushAbilityEffect(next, royal.ability, player.id, null, royal.name);
  return advanceResolution(next);
};

export const discardToken = (state: GameState, color: TokenColor): GameState => {
  if (state.stage !== "discard") {
    return state;
  }

  const next = cloneGame(state);
  const player = getActivePlayer(next);

  if (player.tokens[color] <= 0) {
    return state;
  }

  player.tokens[color] -= 1;
  next.bag.push(color);
  next.history.push(`${player.name} 弃掉了 1 枚 ${colorMeta[color].label}。`);

  if (sumTokens(player.tokens) <= 10) {
    return advanceResolution(next);
  }

  return next;
};

export const restartGame = (state: GameState): GameState => createNewGame(state.config);

export const getVisibleReservedCards = (
  viewerId: number,
  ownerId: number,
  reserved: ReservedCard[],
): ReservedCard[] =>
  reserved.map((entry) => {
    if (entry.visibility === "public" || viewerId === ownerId) {
      return entry;
    }

    return {
      ...entry,
      card: {
        ...entry.card,
        name: "盲预留",
        cost: {},
        points: 0,
        crowns: 0,
        bonus: null,
        bonusCount: 0,
        ability: null,
      },
    };
  });
