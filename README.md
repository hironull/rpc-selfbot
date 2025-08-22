# RPC Selfbot

A minimal Discord selfbot with custom RPC (Rich Presence) and 50+ utility commands. Lightweight, configurable and intended for personal/testing use only.

- Small and focused — exposes an easy RPC API and many convenience commands.
- Config-driven — change presence and commands without touching code.
- Modular — add/remove commands quickly.

Important: running a selfbot on Discord is against Discord's Terms of Service. Use this project only for education, testing on isolated accounts, or with prior written permission.

## Features

- Custom Rich Presence (RPC) with configurable state, details, assets and buttons.
- 50+ built-in commands (message utilities, info, small automations).
- Simple config file to set token, RPC payload and command options.
- Minimal dependencies and straightforward setup.

## Requirements

- Node.js 21
- A Discord account (use at your own risk)

## Quickstart

1. Clone the repo
   git clone https://github.com/hironull/rpc-selfbot.git
2. Install
   cd rpc-selfbot
   npm install
3. Configure 
   Edit config.json and set your token and RPC values.
4. Run
   "node ." or "node index.js"

## Configuration (example)

A minimal config.json:

```json
{
  "token": "your token here",
  "prefix": "your prefix here",
  "tatum_api_key": "your tatum api key here",
  "ltc_format": "ltc",
  "address_format": "legacy",
  "state": "your status here",
  "name": "your name here",
  "details": "your details here",
  "payment": {
    "notify": true,
    "webhook": "your payment webhook url here"
  },
  "buttons": [
    {
      "text": "your button text here",
      "url": "https://your-button-url-here"
    },
    {
      "text": "your button text here",
      "url": "https://your-button-url-here"
    }
  ],
  "largeImageUrl": "your large image key here",
  "html": {
    "port": 6969,
    "ip": "your ip here"
  }
}
```

Keep your token secret. Never share it or commit it to a public repository.

## Usage

- Start the bot: "node ." or "node index.js"
- Use commands in Discord with the configured prefix (default: +).
- Example:
  +startrpc
  +help

The project includes a help command that lists all available commands and short descriptions.

## Commands

The repository ships with 50+ commands covering:
- RPC management (set, clear,)
- Message utilities (edit, delete, bulk delete)
- User and server info
- Small automation helpers (reminders, simple schedulers)
- Fun utilities (avatars, emojis, randomizers)

See the in-app `!help` for the full list and usage examples.

## Contributing

Contributions are welcome but note that publishing or encouraging use that violates Discord's Terms of Service is not allowed. If you submit changes, keep them modular and well-documented.

- Fork the repo
- Create a feature branch
- Add tests / documentation
- Open a PR with a clear description

## License

MIT — see the LICENSE file.

## Disclaimer

This project is provided "as is" for educational purposes. The author is not responsible for any misuse. Always follow Discord's Terms of Service and community guidelines.

---

Made by hironull.lol — https://hironull.lol
