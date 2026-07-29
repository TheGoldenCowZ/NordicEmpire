/**
 * Nordic Empire nation site: navigation + copy-to-clipboard.
 */
(function () {
  const panels = Array.from(document.querySelectorAll(".panel"));
  const navLinks = Array.from(document.querySelectorAll("[data-tab]"));
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const yearEl = document.getElementById("year");
  const timesIndex = document.getElementById("times-index");
  const timesStories = Array.from(document.querySelectorAll(".times-story"));
  const townsIndex = document.getElementById("towns-index");
  const townDetails = Array.from(document.querySelectorAll("[data-town]"));

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function parseHash() {
    const raw = (location.hash || "#home").replace(/^#/, "");
    const parts = raw.split("/").filter(Boolean);
    const tab = parts[0] || "home";
    const story = tab === "times" ? parts[1] || null : null;
    const town = tab === "towns" ? parts[1] || null : null;
    return { tab: document.getElementById(tab) ? tab : "home", story, town };
  }

  function showTimesStory(storyId) {
    if (!timesIndex) return;
    const showIndex = !storyId;
    timesIndex.hidden = !showIndex;
    timesStories.forEach((el) => {
      el.hidden = el.getAttribute("data-story") !== storyId;
    });
  }

  function showTown(townSlug) {
    if (!townsIndex) return;
    const matchingTown = townDetails.find((item) => item.getAttribute("data-town") === townSlug);
    townsIndex.hidden = Boolean(matchingTown);
    townDetails.forEach((item) => {
      item.hidden = item !== matchingTown;
    });
  }

  function showTab(tab, story, town) {
    panels.forEach((panel) => {
      const active = panel.id === tab;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("data-tab") === tab;
      link.classList.toggle("active", isActive);
    });

    if (tab === "times") showTimesStory(story || null);
    else showTimesStory(null);
    if (tab === "towns") showTown(town || null);
    else showTown(null);

    if (mainNav) mainNav.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");

    window.scrollTo(0, 0);
  }

  function applyRoute() {
    const { tab, story, town } = parseHash();
    showTab(tab, story, town);
  }

  function go(route) {
    const next = "#" + route.replace(/^#/, "");
    if (location.hash === next) applyRoute();
    else location.hash = route.replace(/^#/, "");
  }

  document.querySelectorAll("[data-tab]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const tab = link.getAttribute("data-tab");
      if (!tab) return;
      event.preventDefault();
      go(tab);
    });
  });

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const route = link.getAttribute("data-route");
      if (!route) return;
      event.preventDefault();
      go(route);
    });
  });

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      if (!text) return;
      const label = btn.textContent;
      try {
        await copyText(text);
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        window.setTimeout(() => {
          btn.textContent = label;
          btn.classList.remove("is-copied");
        }, 1600);
      } catch (_) {
        btn.textContent = "Failed";
        window.setTimeout(() => {
          btn.textContent = label;
        }, 1600);
      }
    });
  });

  window.addEventListener("hashchange", applyRoute);
  applyRoute();
})();
