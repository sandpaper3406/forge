# Eventbrite Integration

This site reads homepage events from [events.json](/Users/jmarkley/Codex/Forge Website/events.json).

To sync upcoming public events from Eventbrite:

```bash
EVENTBRITE_TOKEN=your_private_token \
EVENTBRITE_ORGANIZATION_ID=your_org_id \
node sync-eventbrite-events.mjs
```

What this does:

- pulls events from your Eventbrite organization
- limits results to `live` and `current_future`
- sorts by upcoming start date
- writes the normalized output into `events.json`

Recommended usage:

- run the sync script during deploy, or on a small schedule
- do not expose the Eventbrite token in client-side code
- commit `events.json` only if you want a static fallback checked into the repo

Environment variables:

- `EVENTBRITE_TOKEN`
- `EVENTBRITE_ORGANIZATION_ID`
- `EVENTBRITE_PAGE_SIZE` optional, defaults to `6`
