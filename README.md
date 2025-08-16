# ApplySeller Bot (Starter)

A minimal Discord.js v14 (ESM) starter that includes a ready-to-use **/applyseller** command with a modal form. Submissions are posted to a channel you choose.

## Quick Start
1) Install deps
```bash
npm install
```
2) Configure env
- Copy `.env.example` → `.env`
- Fill `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`
- Optional: `SELLER_APPLY_CHANNEL_ID`

3) Run
```bash
npm start
```

## Files
- `src/index.js` — loads commands, registers slash, routes modal submits
- `src/commands/applyseller.js` — the modal + submit handler
- `src/config.js` — env loader + guard
