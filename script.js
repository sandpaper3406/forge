const fallbackEvents = [
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
const railDots = Array.from(document.querySelectorAll(".rail-dot"));
const snapSections = Array.from(document.querySelectorAll(".snap-section"));
const heroCopy = document.querySelector(".hero-copy");
const heroPanel = document.querySelector(".hero-panel");
const modalTriggers = Array.from(document.querySelectorAll("[data-open-modal]"));
const modalClosers = Array.from(document.querySelectorAll("[data-close-modal]"));
const joinModal = document.getElementById("join-modal");
const joinForm = document.getElementById("join-form");
const navMenuToggle = document.querySelector(".nav-menu-toggle");
const navGroup = document.querySelector(".nav-group");

const renderEvents = (events) => {
  if (!eventsGrid) {
    return;
  }

  eventsGrid.innerHTML = "";

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
};

const loadEvents = async () => {
  if (!eventsGrid) {
    return;
  }

  try {
    const response = await fetch("events.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load events.json: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.events) || data.events.length === 0) {
      throw new Error("No events returned from events.json");
    }

    renderEvents(data.events);
  } catch (error) {
    console.warn("Using fallback events.", error);
    renderEvents(fallbackEvents);
  }
};

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (railDots.length > 0) {
  railDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetId = dot.dataset.target;
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

if (snapSections.length > 0 && railDots.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      railDots.forEach((dot) => {
        const isActive = dot.dataset.target === visible.target.id;
        dot.classList.toggle("active", isActive);
      });
    },
    { threshold: [0.3, 0.55, 0.75] }
  );

  snapSections.forEach((section) => observer.observe(section));
}

const applyParallax = () => {
  const offset = window.scrollY * 0.08;

  if (heroCopy) {
    heroCopy.style.transform = `translateY(${offset * -0.35}px)`;
  }

  if (heroPanel) {
    heroPanel.style.transform = `translateY(${offset * 0.25}px)`;
  }
};

window.addEventListener("scroll", applyParallax, { passive: true });
applyParallax();
loadEvents();

const openModal = (modal) => {
  if (!modal) {
    return;
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = (modal) => {
  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const targetId = trigger.dataset.openModal;
    const targetModal = document.getElementById(targetId);

    if (joinForm && targetModal === joinModal) {
      const chapter = trigger.dataset.chapter || "";
      const chapterField = joinForm.elements.namedItem("chapter");
      const interestField = joinForm.elements.namedItem("interest");
      const notesField = joinForm.elements.namedItem("notes");
      const modalTitle = document.getElementById("join-modal-title");

      if (chapterField instanceof HTMLInputElement) {
        chapterField.value = chapter;
      }

      if (interestField instanceof HTMLSelectElement && chapter) {
        interestField.value = "Chapter Launch Updates";
      }

      if (notesField instanceof HTMLTextAreaElement && chapter) {
        notesField.placeholder = `Tell us what you'd like to know about ${chapter}.`;
      }

      if (modalTitle) {
        modalTitle.textContent = chapter
          ? `Get updates about ${chapter}.`
          : "Get more information about Forge membership.";
      }
    }

    openModal(targetModal);
  });
});

modalClosers.forEach((closer) => {
  closer.addEventListener("click", () => {
    closeModal(closer.closest(".modal"));
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(joinModal);
  }
});

if (joinForm) {
  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(joinForm);
    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const company = formData.get("company")?.toString().trim() || "";
    const role = formData.get("role")?.toString().trim() || "";
    const interest = formData.get("interest")?.toString().trim() || "";
    const chapter = formData.get("chapter")?.toString().trim() || "";
    const notes = formData.get("notes")?.toString().trim() || "";

    const subject = encodeURIComponent(`Forge Info Request: ${name || "New inquiry"}`);
    const body = encodeURIComponent(
      [
        "Hello Forge Team,",
        "",
        "I'd like more information about Forge.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "N/A"}`,
        `Role: ${role || "N/A"}`,
        `Interest: ${interest || "N/A"}`,
        `Chapter: ${chapter || "N/A"}`,
        "",
        "Notes:",
        notes || "N/A",
      ].join("\n")
    );

    window.location.href = `mailto:hello@forgeflorida.com?subject=${subject}&body=${body}`;
    closeModal(joinModal);
    joinForm.reset();
  });
}

if (navMenuToggle && navGroup) {
  navMenuToggle.addEventListener("click", () => {
    const isOpen = navGroup.classList.toggle("is-open");
    navMenuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!navGroup.contains(event.target)) {
      navGroup.classList.remove("is-open");
      navMenuToggle.setAttribute("aria-expanded", "false");
    }
  });
}
