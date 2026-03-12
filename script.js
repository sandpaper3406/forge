const events = [
  {
    meta: "April 18, 2026",
    title: "Monthly Tech Networking Night",
    description:
      "A public networking event for technology leaders, founders, providers, and business professionals supporting company infrastructure.",
    location: "Tampa, Florida",
  },
  {
    meta: "May 7, 2026",
    title: "Technology Leadership Panel",
    description:
      "A public panel featuring founders, executives, and operators discussing growth, infrastructure, and leadership.",
    location: "St Pete, Florida",
  },
  {
    meta: "June 11, 2026",
    title: "Founder and Operator Roundtable",
    description:
      "A public roundtable focused on relationship-building, business referrals, and practical conversations around Florida tech.",
    location: "Orlando, Florida",
  },
];

const eventsGrid = document.querySelector("#events-grid");
const yearNode = document.querySelector("#year");

if (eventsGrid) {
  events.forEach((event) => {
    const card = document.createElement("article");
    card.className = "card event-card";
    card.innerHTML = `
      <span class="event-meta">Upcoming Event</span>
      <time datetime="${event.meta}">${event.meta}</time>
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p class="event-location">${event.location}</p>
    `;
    eventsGrid.appendChild(card);
  });
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
