# Documentation project instructions

## About this project

- This is the documentation site for [Tikk](https://tikk.chat), built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- The product source lives in the `tikk` repo alongside this one. **Verify claims against it** — most past doc bugs came from describing features that don't exist
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings via MCP
- Use the Mintlify docs MCP server, `https://www.mintlify.com/docs/mcp`, to query information about using Mintlify via MCP

## Terminology

Use the words the app uses. The database and the UI disagree in places; the UI wins.

| Use              | Not                               |
| ---------------- | --------------------------------- |
| Service          | Event type                        |
| Booking          | Request, meeting request          |
| Booking page     | Public profile, profile page      |
| Inbox            | Dashboard (for the bookings list) |
| Host / you       | User                              |
| Booker, attendee | Requester, sender                 |
| Personal invite  | Private link, invite-only service |

Nav paths, when you cite them, must match the real sidebar: **Inbox · Calendar · Booking Page · Services · Earnings**, with **Settings** and **Billing** in the account menu.

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths and code references
- Prices in euros, e.g. €12/mo

## Content boundaries

**The two tabs have different readers and API vocabulary does not belong in both.**

- **Documentation tab** — for hosts: coaches, tutors, consultants. Describe behaviour in product language. No `<ResponseField>` blocks, no JSON response bodies, no field-name tables. Where a concept has an API counterpart, link to the API Reference page instead of restating its schema.
- **API Reference tab** — for developers. Field-level truth lives here and only here.

Don't document:

- Admin or Filament screens or anything behind `can:admin`
- `dev/*` routes (local-only mock payment flows)
- Internal fee mechanics: the per-transaction service fee and the percentage taken from Free-tier payouts. "A platform fee applies on Free, 0% on Pro" is the level of detail we publish
- Features that exist in the database but aren't exposed in the UI (per-duration prices, for instance, are computed and displayed, not editable)
