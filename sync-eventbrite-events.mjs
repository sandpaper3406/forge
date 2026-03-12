import { writeFile } from "node:fs/promises";

const token = process.env.EVENTBRITE_TOKEN;
const organizationId = process.env.EVENTBRITE_ORGANIZATION_ID;
const pageSize = Number.parseInt(process.env.EVENTBRITE_PAGE_SIZE ?? "6", 10);

if (!token || !organizationId) {
  console.error("Missing EVENTBRITE_TOKEN or EVENTBRITE_ORGANIZATION_ID.");
  process.exit(1);
}

const endpoint = new URL(
  `https://www.eventbriteapi.com/v3/organizations/${organizationId}/events/`
);

endpoint.searchParams.set("status", "live");
endpoint.searchParams.set("time_filter", "current_future");
endpoint.searchParams.set("order_by", "start_asc");
endpoint.searchParams.set("page_size", String(pageSize));
endpoint.searchParams.set("expand", "venue");

const response = await fetch(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

if (!response.ok) {
  const errorBody = await response.text();
  throw new Error(`Eventbrite request failed: ${response.status} ${errorBody}`);
}

const payload = await response.json();

const events = (payload.events ?? []).map((event) => {
  const start = event.start?.local ?? event.start?.utc ?? "";
  const startDate = start ? new Date(start) : null;

  return {
    meta: startDate
      ? startDate.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Date TBA",
    title: event.name?.text ?? "Untitled Event",
    description:
      event.summary ||
      event.description?.text?.slice(0, 180) ||
      "Details coming soon.",
    location:
      event.online_event === true
        ? "Online"
        : [event.venue?.address?.city, event.venue?.address?.region]
            .filter(Boolean)
            .join(", ") || "Location TBA",
    url: event.url || "#events",
  };
});

const output = {
  source: "eventbrite",
  syncedAt: new Date().toISOString(),
  events,
};

await writeFile(new URL("./events.json", import.meta.url), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${events.length} events to events.json`);
