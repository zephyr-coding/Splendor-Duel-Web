# Splendor Duel Web / 璀璨宝石：对决 网页版

A local two-player web adaptation of **Splendor Duel** built with `Vite + React + TypeScript`.

一个基于 `Vite + React + TypeScript` 开发的 **《璀璨宝石：对决》本地双人网页版**。

## Overview / 项目简介

This project recreates the core flow of **Splendor Duel** for hotseat local play on the same device.
It is designed for two people playing face to face without networking, accounts, or AI.

本项目将 **《璀璨宝石：对决》** 的核心流程搬到网页中，适合同一台设备上的本地轮流对战。
不包含联网、账号系统或 AI 对战。

## Scope / 当前范围

- `5x5` central gem board
- Privilege scrolls
- Refill from bag with spiral placement
- Reserve visible cards and blind reserve from deck top
- Gold token reserve flow
- Purchase flow with flexible gold substitution
- Linked bonus cards
- Royal cards and crown thresholds
- Instant win conditions
- Hotseat pass overlay for hidden information

- `5x5` 中央宝石棋盘
- 特权卷轴
- 从袋中按螺旋顺序补板
- 公开预留与牌堆顶盲预留
- 黄金预留流程
- 支持黄金自由替代的购买结算
- 联结奖励卡
- 皇家卡与皇冠阈值
- 即时胜利条件
- 本地交接遮罩，用于保护隐藏信息

## Important Note / 重要说明

This project targets **Splendor Duel**, not the classic base-game two-player setup of Splendor.

本项目对应的是 **《璀璨宝石：对决》**，不是经典《璀璨宝石》基础版的双人配置玩法。

## Tech Stack / 技术栈

- Vite
- React 19
- TypeScript
- Plain CSS

## Project Structure / 目录结构

```text
.
├── docs/
│   ├── PRD.md
│   └── 玩法说明书.md
├── scripts/
│   └── generate-duel-data.mjs
├── src/
│   ├── App.tsx
│   ├── duelData.ts
│   ├── game.ts
│   ├── main.tsx
│   └── styles.css
├── index.html
└── package.json
```

## Getting Started / 本地运行

### Requirements / 环境要求

- Node.js `18+`
- npm

### Install / 安装依赖

```bash
npm install
```

### Start Development Server / 启动开发环境

```bash
npm run dev
```

Open the local URL shown by Vite in your browser.

在浏览器中打开 Vite 输出的本地地址即可试玩。

### Build / 生产构建

```bash
npm run build
```

### Preview Build / 预览构建结果

```bash
npm run preview
```

## Documentation / 项目文档

- Product requirements: [docs/PRD.md](docs/PRD.md)
- Rules manual: [docs/玩法说明书.md](docs/%E7%8E%A9%E6%B3%95%E8%AF%B4%E6%98%8E%E4%B9%A6.md)

- 产品文档：[docs/PRD.md](docs/PRD.md)
- 玩法说明书：[docs/玩法说明书.md](docs/%E7%8E%A9%E6%B3%95%E8%AF%B4%E6%98%8E%E4%B9%A6.md)

## Current Limitations / 当前限制

- No online multiplayer
- No AI opponent
- No account or save system
- Mobile support is basic; desktop is the primary target
- Card data should still be cross-checked against the final official physical card list before treating this as a strict archival reproduction

- 不支持联网对战
- 不支持 AI 对手
- 不包含账号或存档系统
- 移动端仅做基础可玩，桌面端是主要目标
- 如果要作为严格复刻版本，仍建议继续逐张核对卡牌数据与实体官方卡面

## Gameplay Notes / 玩法说明

This implementation focuses on rules fidelity plus usability:

- only legal actions should be executable
- hidden reserved cards are protected during handoff
- payment options are shown explicitly in the buy dialog
- win conditions are checked automatically

本实现强调“规则正确性 + 网页可玩性”：

- 非法动作不应被执行
- 盲预留信息在交接时会被遮挡
- 购买弹窗会明确列出支付方案
- 胜利条件会自动判定

## Future Work / 后续方向

- More complete UI polish
- Better onboarding for new players
- Stronger regression tests for rule edge cases
- Optional deployment workflow

- 继续打磨界面表现
- 增强新手引导
- 补充更多规则边界测试
- 追加部署流程

## License / 许可

No license file is included yet.

当前仓库尚未附带许可证文件。
