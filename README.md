# Tikk documentation

The source for [docs.tikk.chat](https://tikk.chat), built with [Mintlify](https://mintlify.com).

Two tabs:

- **Documentation** — product docs for hosts. Getting started, core concepts, guides, plans and billing.
- **API Reference** — the read-only REST API at `https://app.tikk.chat/api/v1`.

Navigation and theming live in `docs.json`. Writing conventions and content boundaries are in [AGENTS.md](AGENTS.md) — read it before adding pages.

## Local preview

Install the CLI once:

```bash
npm i -g mint
```

Then, from the repo root (where `docs.json` is):

```bash
mint dev
```

The preview runs at `http://localhost:3000`.

Check links before pushing:

```bash
mint broken-links
```

## Publishing

Changes on the default branch deploy to production automatically through the Mintlify GitHub app.

## Keeping it true

Most content here describes behaviour implemented in the `tikk` app repo. When you document a feature, verify it against the code rather than the marketing copy — the two have drifted before.

## Troubleshooting

- Dev server misbehaving? Run `mint update` for the latest CLI.
- Page 404s locally? Make sure you're running in the folder containing `docs.json` and that the page is listed in its navigation group.
