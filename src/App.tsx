import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DuelCardData } from "./duelData";
import {
  acknowledgePass,
  bagTokenCounts,
  boardTokenCounts,
  buyCard,
  canReserveAnyCard,
  canPurchaseCard,
  chooseRoyalCard,
  colorMeta,
  createNewGame,
  describeCard,
  discardToken,
  emptyTokenBank,
  formatBonuses,
  formatCost,
  formatPayment,
  gemColors,
  getBoardLineValidation,
  getLinkColorOptions,
  getPaymentOptions,
  getVisibleReservedCards,
  levels,
  mustReplenishBeforeMandatory,
  replenishBoard,
  reserveTopDeckCard,
  reserveVisibleCard,
  resolveStealToken,
  resolveTakeMatching,
  restartGame,
  sumTokens,
  takeLineTokens,
  tokenColors,
  usePrivilegeTakeToken,
  type BonusColor,
  type CardLocation,
  type GameState,
  type PlayerState,
  type SetupConfig,
  type TokenColor,
} from "./game";

type ActionMode = "line" | "privilege" | "reserve" | null;

type BuyIntent = {
  card: DuelCardData;
  location: CardLocation;
};

const defaultSetup = {
  playerOne: "玩家一",
  playerTwo: "玩家二",
  firstPlayer: "random" as SetupConfig["firstPlayer"],
};

const stageCopy: Record<GameState["stage"], string> = {
  turn: "先进行可选动作，再完成 1 个主动作。",
  discard: "你超过 10 枚宝石，必须先弃到上限。",
  choose_royal: "你达成皇冠阈值，请选择 1 张皇家卡。",
  resolve_take_matching: "请选择 1 枚与能力颜色相同的宝石。",
  resolve_steal: "请选择要从对手处拿走的宝石或珍珠。",
  pass: "请把设备交给下一位玩家。",
  game_over: "对局结束，可以直接再来一局。",
};

export default function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [setup, setSetup] = useState(defaultSetup);
  const [showRules, setShowRules] = useState(false);
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [selectedBoard, setSelectedBoard] = useState<number[]>([]);
  const [selectedGoldIndex, setSelectedGoldIndex] = useState<number | null>(null);
  const [buyIntent, setBuyIntent] = useState<BuyIntent | null>(null);

  const applyGameUpdate = (updater: (state: GameState) => GameState) => {
    setGame((previous) => (previous ? updater(previous) : previous));
  };

  useEffect(() => {
    setActionMode(null);
    setSelectedBoard([]);
    setSelectedGoldIndex(null);
    setBuyIntent(null);
  }, [game]);

  if (!game) {
    return (
      <div className="shell intro-shell">
        <section className="intro-grid">
          <div className="intro-copy">
            <p className="eyebrow">Splendor Duel</p>
            <h1>璀璨宝石：对决</h1>
            <p className="intro-lead">
              双人专属版本的本地网页实现。中心 5x5 宝石棋盘、特权卷轴、皇冠阈值和皇家卡都已切到对决版规则。
            </p>
            <ul className="intro-bullets">
              <li>沿横线、竖线、对角线拿连续宝石，而不是从公共池拿筹码。</li>
              <li>支持黄金预留、补板、联结奖励、皇家卡和 3 条即时胜利条件。</li>
              <li>本地轮流交接，盲预留信息只在当前玩家视角可见。</li>
            </ul>
          </div>

          <form
            className="setup-card"
            onSubmit={(event) => {
              event.preventDefault();
              setGame(
                createNewGame({
                  players: [setup.playerOne, setup.playerTwo],
                  firstPlayer: setup.firstPlayer,
                }),
              );
            }}
          >
            <div className="setup-head">
              <p className="section-kicker">开局设置</p>
              <h2>建立一场对决</h2>
            </div>

            <label className="field">
              <span>玩家一</span>
              <input
                value={setup.playerOne}
                maxLength={16}
                onChange={(event) =>
                  setSetup((previous) => ({ ...previous, playerOne: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>玩家二</span>
              <input
                value={setup.playerTwo}
                maxLength={16}
                onChange={(event) =>
                  setSetup((previous) => ({ ...previous, playerTwo: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>先手</span>
              <select
                value={String(setup.firstPlayer)}
                onChange={(event) => {
                  const value = event.target.value;
                  setSetup((previous) => ({
                    ...previous,
                    firstPlayer: value === "random" ? "random" : value === "0" ? 0 : 1,
                  }));
                }}
              >
                <option value="random">随机先手</option>
                <option value="0">玩家一先手</option>
                <option value="1">玩家二先手</option>
              </select>
            </label>

            <button className="button button-primary" type="submit">
              开始对局
            </button>
          </form>
        </section>
      </div>
    );
  }

  const activePlayer = game.players[game.activePlayer];
  const opponent = game.players[game.activePlayer === 0 ? 1 : 0];
  const mustReplenish = mustReplenishBeforeMandatory(game);
  const lineValidation = getBoardLineValidation(game.board, selectedBoard);
  const boardCounts = boardTokenCounts(game.board);
  const bagCounts = bagTokenCounts(game.bag);
  const matchingEffect =
    game.stage === "resolve_take_matching" && game.pendingEffects[0]?.kind === "take_matching"
      ? game.pendingEffects[0]
      : null;
  const canUsePrivilege =
    game.stage === "turn" && !game.turn.replenished && activePlayer.privileges > 0;
  const canReserve = game.stage === "turn" && !mustReplenish && canReserveAnyCard(game, activePlayer);

  const onBoardCellClick = (index: number) => {
    const token = game.board[index];

    if (game.stage === "turn") {
      if (actionMode === "line") {
        if (token === null || token === "gold") {
          return;
        }

        if (selectedBoard.includes(index)) {
          setSelectedBoard((previous) => previous.filter((entry) => entry !== index));
          return;
        }

        if (selectedBoard.length >= 3) {
          return;
        }

        setSelectedBoard((previous) => [...previous, index]);
        return;
      }

      if (actionMode === "privilege") {
        if (token === null || token === "gold") {
          return;
        }
        applyGameUpdate((state) => usePrivilegeTakeToken(state, index));
        return;
      }

      if (actionMode === "reserve") {
        if (token !== "gold") {
          return;
        }
        setSelectedGoldIndex((previous) => (previous === index ? null : index));
      }
    }

    if (matchingEffect && token === matchingEffect.color) {
      applyGameUpdate((state) => resolveTakeMatching(state, index));
    }
  };

  return (
    <div className="shell board-shell">
      <div className="board-frame duel-frame">
        <header className="topbar duel-topbar">
          <div>
            <p className="eyebrow">Duel Board</p>
            <h1 className="board-title">璀璨宝石：对决</h1>
            <p className="phase-copy">{stageCopy[game.stage]}</p>
          </div>

          <div className="topbar-actions">
            <div className="status-chip">
              <span>当前玩家</span>
              <strong>{activePlayer.name}</strong>
            </div>
            <button className="button button-ghost" onClick={() => setShowRules((value) => !value)}>
              {showRules ? "收起速记" : "查看速记"}
            </button>
            <button className="button button-ghost" onClick={() => setGame(restartGame(game))}>
              重开一局
            </button>
            <button className="button button-ghost" onClick={() => setGame(null)}>
              返回开局
            </button>
          </div>
        </header>

        <div className="duel-grid">
          <aside className="panel side-panel">
            <div className="panel-head">
              <div>
                <p className="section-kicker">回合控制</p>
                <h2>{activePlayer.name}</h2>
              </div>
            </div>

            {game.stage === "turn" && (
              <>
                <div className="action-block">
                  <h3>可选动作</h3>
                  <div className="stack-actions">
                    <button
                      className={`button button-secondary ${actionMode === "privilege" ? "is-active" : ""}`}
                      disabled={!canUsePrivilege}
                      onClick={() => setActionMode((current) => (current === "privilege" ? null : "privilege"))}
                    >
                      使用特权 {activePlayer.privileges > 0 ? `(${activePlayer.privileges})` : ""}
                    </button>
                    <button
                      className="button button-secondary"
                      disabled={game.turn.replenished || game.bag.length === 0}
                      onClick={() => {
                        setActionMode(null);
                        applyGameUpdate(replenishBoard);
                      }}
                    >
                      补板 {game.bag.length > 0 ? `(${game.bag.length} 袋中宝石)` : ""}
                    </button>
                  </div>
                  <p>
                    若本回合既要用特权又要补板，必须先用特权再补板。补板后，对手会获得 1 枚特权卷轴。
                  </p>
                </div>

                <div className="action-block">
                  <h3>主动作</h3>
                  <div className="stack-actions">
                    <button
                      className={`button button-primary ${actionMode === "line" ? "is-active" : ""}`}
                      disabled={mustReplenish}
                      onClick={() => setActionMode((current) => (current === "line" ? null : "line"))}
                    >
                      直线拿宝石
                    </button>
                    <button
                      className={`button button-primary ${actionMode === "reserve" ? "is-active" : ""}`}
                      disabled={!canReserve || mustReplenish}
                      onClick={() => setActionMode((current) => (current === "reserve" ? null : "reserve"))}
                    >
                      预留模式
                    </button>
                  </div>
                  {mustReplenish ? (
                    <p>你当前无法执行任何主动作，必须先补板。</p>
                  ) : (
                    <p>你也可以直接点击牌面上的“购买”，不必先切模式。</p>
                  )}
                </div>

                {actionMode === "line" && (
                  <div className="action-block accent-block">
                    <h3>直线拿宝石</h3>
                    <p>在棋盘上点选 1 到 3 个连续宝石。必须同一横线、竖线或对角线，且不能拿黄金。</p>
                    <p>已选：{selectedBoard.length > 0 ? selectedBoard.map((index) => index + 1).join(" / ") : "无"}</p>
                    {!lineValidation.valid && selectedBoard.length > 0 && <p>{lineValidation.message}</p>}
                    <div className="action-row">
                      <button
                        className="button button-primary"
                        disabled={!lineValidation.valid || mustReplenish}
                        onClick={() => applyGameUpdate((state) => takeLineTokens(state, selectedBoard))}
                      >
                        确认拿取
                      </button>
                      <button
                        className="button button-ghost"
                        disabled={selectedBoard.length === 0}
                        onClick={() => setSelectedBoard([])}
                      >
                        清空
                      </button>
                    </div>
                  </div>
                )}

                {actionMode === "reserve" && (
                  <div className="action-block accent-block">
                    <h3>预留模式</h3>
                    <p>先在棋盘上点选 1 枚黄金，再点击公开牌上的“预留”或牌堆按钮。</p>
                    <p>
                      已选黄金：
                      {selectedGoldIndex === null ? " 未选择" : ` 棋盘位置 ${selectedGoldIndex + 1}`}
                    </p>
                  </div>
                )}

                {actionMode === "privilege" && (
                  <div className="action-block accent-block">
                    <h3>使用特权</h3>
                    <p>点击棋盘上一枚任意非黄金宝石，消耗 1 枚特权卷轴直接拿走。</p>
                  </div>
                )}
              </>
            )}

            {game.stage === "discard" && (
              <div className="action-block alert">
                <h3>弃置到 10 枚</h3>
                <p>你当前共有 {sumTokens(activePlayer.tokens)} 枚宝石，必须先弃到 10 枚。</p>
                <div className="stack-actions">
                  {tokenColors.map((color) => (
                    <button
                      key={color}
                      className="button button-token"
                      disabled={activePlayer.tokens[color] === 0}
                      onClick={() => applyGameUpdate((state) => discardToken(state, color))}
                    >
                      弃 1 枚 {colorMeta[color].label} ({activePlayer.tokens[color]})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {game.stage === "resolve_steal" && (
              <div className="action-block alert">
                <h3>偷取能力</h3>
                <p>从 {opponent.name} 那里选择 1 枚宝石或珍珠。黄金不能被偷。</p>
                <div className="stack-actions">
                  {(["white", "blue", "green", "red", "black", "pearl"] as const).map((color) => (
                    <button
                      key={color}
                      className="button button-token"
                      disabled={opponent.tokens[color] === 0}
                      onClick={() => applyGameUpdate((state) => resolveStealToken(state, color))}
                    >
                      拿 1 枚 {colorMeta[color].label} ({opponent.tokens[color]})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showRules && (
              <div className="rules-note">
                <h3>对决速记</h3>
                <ul>
                  <li>主动作只有 3 种：拿直线宝石、拿 1 金并预留、购买 1 张牌。</li>
                  <li>拿 3 同色或拿到 2 颗珍珠时，对手拿 1 枚特权卷轴。</li>
                  <li>胜利条件是：20 分、10 顶皇冠，或同色卡上累计 10 分。</li>
                  <li>补板从袋中随机抽宝石，按中心向外的螺旋顺序补回棋盘。</li>
                  <li>联结牌在网页里直接选择要联结的颜色组，等价于实体叠放。</li>
                </ul>
              </div>
            )}

            <section className="panel inset-panel">
              <div className="panel-head">
                <div>
                  <p className="section-kicker">局势记录</p>
                  <h2>历史</h2>
                </div>
              </div>
              <ol className="history-list">
                {game.history
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <li key={`${entry}-${index}`}>{entry}</li>
                  ))}
              </ol>
            </section>
          </aside>

          <main className="arena">
            <PlayerPanel
              player={game.players[0]}
              viewerId={game.stage === "game_over" ? 0 : game.activePlayer}
              isCurrent={game.activePlayer === 0}
              onBuyReserved={(cardId, card) => setBuyIntent({ location: { source: "reserved", cardId }, card })}
            />

            <section className="royal-strip">
              <div className="strip-head">
                <div>
                  <p className="section-kicker">皇家卡</p>
                  <h2>皇冠阈值奖励</h2>
                </div>
                <p>达到第 3 顶和第 6 顶皇冠时，立即选择 1 张。</p>
              </div>
              <div className="royal-row">
                {game.royalMarket.map((card) => (
                  <CardFace key={card.id} card={card} royal />
                ))}
              </div>
            </section>

            <section className="board-stage">
              <div className="board-wrap">
                <div className="board-header">
                  <div>
                    <p className="section-kicker">中央棋盘</p>
                    <h2>宝石矩阵</h2>
                  </div>
                  <div className="board-summary">
                    <span>棋盘：{renderCounts(boardCounts)}</span>
                    <span>袋中：{renderCounts(bagCounts)}</span>
                    <span>公共特权：{game.privilegePool}</span>
                  </div>
                </div>

                <div className="board-grid-cells">
                  {game.board.map((token, index) => {
                    const isSelected = selectedBoard.includes(index) || selectedGoldIndex === index;
                    const isClickable =
                      game.stage === "resolve_take_matching"
                        ? token === matchingEffect?.color
                        : game.stage === "turn" && actionMode === "line"
                          ? token !== null && token !== "gold"
                          : game.stage === "turn" && actionMode === "privilege"
                            ? canUsePrivilege && token !== null && token !== "gold"
                            : game.stage === "turn" && actionMode === "reserve"
                              ? canReserve && token === "gold"
                              : false;
                    const matchHighlight =
                      matchingEffect && token === matchingEffect.color ? "match-highlight" : "";

                    return (
                      <button
                        key={index}
                        className={`board-cell ${token ? colorMeta[token].css : "token-empty"} ${isSelected ? "selected" : ""} ${matchHighlight}`}
                        onClick={() => onBoardCellClick(index)}
                        disabled={!isClickable}
                      >
                        <span className="cell-index">{index + 1}</span>
                        {token ? (
                          <>
                            <span className="cell-dot" />
                            <strong>{colorMeta[token].label}</strong>
                          </>
                        ) : (
                          <span className="cell-empty-label">空位</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <section className="market-pyramid">
                {levels
                  .slice()
                  .reverse()
                  .map((level) => (
                    <div className={`market-level level-${level}`} key={level}>
                      <div className="strip-head compact-head">
                        <div>
                          <p className="section-kicker">等级 {level}</p>
                          <h2>{level === 1 ? "基础宝石" : level === 2 ? "精工工坊" : "皇家典藏"}</h2>
                        </div>
                        <button
                          className="button button-secondary"
                          disabled={!canReserve || selectedGoldIndex === null || game.decks[level].length === 0 || mustReplenish}
                          onClick={() =>
                            applyGameUpdate((state) => reserveTopDeckCard(state, selectedGoldIndex!, level))
                          }
                        >
                          盲预留牌堆顶
                        </button>
                      </div>

                      <div className="market-row">
                        {game.market[level].map((card, slot) =>
                          card ? (
                            <CardFace
                              key={`${level}-${slot}-${card.id}`}
                              card={card}
                              accent={canPurchaseCard(activePlayer, card) && !mustReplenish ? "buyable" : null}
                              footer={
                                game.stage === "turn" ? (
                                  <div className="card-actions">
                                    <button
                                      className="button button-card"
                                      disabled={!canPurchaseCard(activePlayer, card) || mustReplenish}
                                      onClick={() => setBuyIntent({ location: { source: "market", level, slot }, card })}
                                    >
                                      购买
                                    </button>
                                    <button
                                      className="button button-card subtle"
                                      disabled={!canReserve || selectedGoldIndex === null || mustReplenish}
                                      onClick={() =>
                                        applyGameUpdate((state) =>
                                          reserveVisibleCard(state, selectedGoldIndex!, level, slot),
                                        )
                                      }
                                    >
                                      预留
                                    </button>
                                  </div>
                                ) : null
                              }
                            />
                          ) : (
                            <div key={`${level}-${slot}-empty`} className="card-face card-empty">
                              牌堆已空
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
              </section>
            </section>

            <PlayerPanel
              player={game.players[1]}
              viewerId={game.stage === "game_over" ? 1 : game.activePlayer}
              isCurrent={game.activePlayer === 1}
              onBuyReserved={(cardId, card) => setBuyIntent({ location: { source: "reserved", cardId }, card })}
            />
          </main>
        </div>
      </div>

      {game.stage === "pass" && (
        <div className="overlay">
          <div className="overlay-card">
            <p className="section-kicker">本地交接</p>
            <h2>请把设备交给 {activePlayer.name}</h2>
            <p>这一层会遮住盲预留内容。确认交接后，再开始下一回合。</p>
            <button className="button button-primary" onClick={() => applyGameUpdate(acknowledgePass)}>
              已交接，开始回合
            </button>
          </div>
        </div>
      )}

      {game.stage === "choose_royal" && (
        <div className="overlay">
          <div className="overlay-card wide">
            <p className="section-kicker">皇家卡</p>
            <h2>选择 1 张皇家卡</h2>
            <div className="royal-row">
              {game.royalMarket.map((card) => (
                <button
                  key={card.id}
                  className="royal-choice"
                  onClick={() => applyGameUpdate((state) => chooseRoyalCard(state, card.id))}
                >
                  <CardFace card={card} royal />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {game.stage === "game_over" && game.winnerSummary && (
        <div className="overlay">
          <div className="overlay-card wide">
            <p className="section-kicker">结算</p>
            <h2>{game.players[game.winnerSummary.winnerId].name} 获胜</h2>
            <p>{game.winnerSummary.reason}</p>
            <div className="result-grid">
              {game.players.map((player) => (
                <div key={player.id} className="result-row">
                  <strong>{player.name}</strong>
                  <span>{player.score} 分</span>
                  <span>{player.crowns} 顶皇冠</span>
                  <span>{player.privileges} 枚特权</span>
                </div>
              ))}
            </div>
            <div className="action-row">
              <button className="button button-primary" onClick={() => setGame(restartGame(game))}>
                再来一局
              </button>
              <button className="button button-ghost" onClick={() => setGame(null)}>
                返回开局
              </button>
            </div>
          </div>
        </div>
      )}

      {buyIntent && (
        <BuyDialog
          intent={buyIntent}
          player={activePlayer}
          onClose={() => setBuyIntent(null)}
          onConfirm={(payment, linkColor) => {
            applyGameUpdate((state) => buyCard(state, buyIntent.location, payment, linkColor));
            setBuyIntent(null);
          }}
        />
      )}
    </div>
  );
}

function PlayerPanel({
  player,
  viewerId,
  isCurrent,
  onBuyReserved,
}: {
  player: PlayerState;
  viewerId: number;
  isCurrent: boolean;
  onBuyReserved: (cardId: string, card: DuelCardData) => void;
}) {
  const visibleReserved = getVisibleReservedCards(viewerId, player.id, player.reserved);
  const colorPoints = useMemo(() => {
    const points = { white: 0, blue: 0, green: 0, red: 0, black: 0 };
    player.cards.forEach((owned) => {
      if (owned.resolvedBonus) {
        points[owned.resolvedBonus] += owned.card.points;
      }
    });
    return points;
  }, [player.cards]);

  return (
    <section className={`player-panel duel-player ${isCurrent ? "current" : ""}`}>
      <div className="player-head">
        <div>
          <p className="section-kicker">玩家 {player.id + 1}</p>
          <h2>{player.name}</h2>
        </div>
        <div className="player-score">
          <strong>{player.score}</strong>
          <span>声望</span>
        </div>
      </div>

      <div className="player-stats">
        <StatBlock label="皇冠" value={String(player.crowns)} />
        <StatBlock label="特权" value={String(player.privileges)} />
        <StatBlock label="预留" value={`${player.reserved.length} / 3`} />
        <StatBlock label="手中宝石" value={String(sumTokens(player.tokens))} />
      </div>

      <div className="resource-grid">
        <InfoRow label="宝石奖励" value={formatBonuses(player.bonuses) || "暂无"} />
        <InfoRow
          label="同色分"
          value={gemColors.map((color) => `${colorMeta[color].short}${colorPoints[color]}`).join(" ")}
        />

        <div className="resource-row">
          <h3>当前宝石</h3>
          <div className="mini-token-row">
            {tokenColors.map((color) => (
              <MiniCounter key={color} color={color} value={player.tokens[color]} title={colorMeta[color].label} />
            ))}
          </div>
        </div>

        <div className="resource-row">
          <h3>预留牌</h3>
          <div className="reserved-row">
            {visibleReserved.length > 0 ? (
              visibleReserved.map((entry) => {
                const actual = player.reserved.find((card) => card.card.id === entry.card.id);
                const hidden = entry.visibility === "private" && viewerId !== player.id;
                return (
                  <CardFace
                    key={entry.card.id}
                    card={entry.card}
                    compact
                    hidden={hidden}
                    accent={actual && canPurchaseCard(player, actual.card) && viewerId === player.id ? "buyable" : null}
                    footer={
                      actual && canPurchaseCard(player, actual.card) && viewerId === player.id ? (
                        <div className="card-actions">
                          <button
                            className="button button-card"
                            onClick={() => onBuyReserved(actual.card.id, actual.card)}
                          >
                            购买
                          </button>
                        </div>
                      ) : null
                    }
                  />
                );
              })
            ) : (
              <div className="reserved-placeholder">暂无预留牌</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BuyDialog({
  intent,
  player,
  onClose,
  onConfirm,
}: {
  intent: BuyIntent;
  player: PlayerState;
  onClose: () => void;
  onConfirm: (payment: ReturnType<typeof emptyTokenBank>, linkColor: BonusColor | null) => void;
}) {
  const paymentOptions = getPaymentOptions(player, intent.card);
  const linkOptions = intent.card.bonus === "linked" ? getLinkColorOptions(player) : [];
  const [selectedLinkColor, setSelectedLinkColor] = useState<BonusColor | null>(linkOptions[0] ?? null);

  useEffect(() => {
    setSelectedLinkColor(linkOptions[0] ?? null);
  }, [intent.card.id]);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="panel-head">
          <div>
            <p className="section-kicker">确认购买</p>
            <h2>{intent.card.name}</h2>
          </div>
        </div>
        <p className="modal-copy">{describeCard(intent.card)}</p>
        <p className="modal-copy">成本：{formatCost(intent.card.cost)}</p>

        {intent.card.bonus === "linked" && (
          <div className="selection-cluster">
            <h3>选择联结颜色组</h3>
            <div className="action-row">
              {linkOptions.map((color) => (
                <button
                  key={color}
                  className={`button button-token ${selectedLinkColor === color ? "active" : ""}`}
                  onClick={() => setSelectedLinkColor(color)}
                >
                  {colorMeta[color].label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="payment-list">
          {paymentOptions.map((payment) => (
            <button
              key={formatPayment(payment)}
              className="payment-option"
              disabled={intent.card.bonus === "linked" && !selectedLinkColor}
              onClick={() => onConfirm(payment, selectedLinkColor)}
            >
              <strong>{formatPayment(payment)}</strong>
              <span>使用这一组支付方案</span>
            </button>
          ))}
        </div>

        <div className="action-row">
          <button className="button button-ghost" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

function CardFace({
  card,
  compact = false,
  hidden = false,
  royal = false,
  accent = null,
  footer,
}: {
  card: DuelCardData;
  compact?: boolean;
  hidden?: boolean;
  royal?: boolean;
  accent?: "buyable" | null;
  footer?: ReactNode;
}) {
  if (hidden) {
    return (
      <div className={`card-face duel-card card-back ${compact ? "compact" : ""}`}>
        <span>盲预留</span>
        <strong>{card.level} 级</strong>
      </div>
    );
  }

  const bonusLabel =
    card.bonus === "linked"
      ? "联结奖励"
      : card.bonus
        ? `${colorMeta[card.bonus].label}${card.bonusCount > 1 ? ` x${card.bonusCount}` : ""}`
        : "无颜色";

  return (
    <article
      className={`card-face duel-card ${compact ? "compact" : ""} ${accent === "buyable" ? "is-buyable" : ""} ${royal ? "royal-card" : `level-${card.level}`}`}
    >
      <div className="card-topline">
        <span>{royal ? "Royal" : `L${card.level}`}</span>
        <span>{card.points} 分</span>
      </div>

      <div className="card-title-block">
        <p>{card.name}</p>
        <div className="meta-row">
          <span className={`bonus-chip ${card.bonus && card.bonus !== "linked" ? colorMeta[card.bonus].css : ""}`}>
            {bonusLabel}
          </span>
          {card.crowns > 0 && <span className="meta-chip">皇冠 {card.crowns}</span>}
        </div>
      </div>

      <div className="card-costs">
        {(["white", "blue", "green", "red", "black", "pearl"] as const)
          .filter((color) => (card.cost[color] ?? 0) > 0)
          .map((color) => (
            <span className={`cost-pill ${colorMeta[color].css}`} key={`${card.id}-${color}`}>
              {colorMeta[color].short}
              {card.cost[color]}
            </span>
          ))}
      </div>

      {card.ability && <p className="ability-line">{describeAbility(card.ability)}</p>}
      {footer}
    </article>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-block">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniCounter({
  color,
  value,
  title,
}: {
  color: TokenColor;
  value: number;
  title: string;
}) {
  return (
    <div className={`mini-counter ${colorMeta[color].css}`} title={title}>
      <span>{colorMeta[color].short}</span>
      <strong>{value}</strong>
    </div>
  );
}

function renderCounts(counts: ReturnType<typeof emptyTokenBank>) {
  return tokenColors
    .filter((color) => counts[color] > 0)
    .map((color) => `${colorMeta[color].short}${counts[color]}`)
    .join(" ");
}

function describeAbility(ability: NonNullable<DuelCardData["ability"]>) {
  const labels: Record<NonNullable<DuelCardData["ability"]>, string> = {
    extra_turn: "能力：再进行一回合",
    take_matching: "能力：再拿 1 枚同色宝石",
    steal_token: "能力：从对手处拿 1 枚宝石或珍珠",
    gain_privilege: "能力：获得 1 枚特权卷轴",
  };

  return labels[ability];
}
