// Enhanced interactivity: details toggle, theme, mobile nav, filter
document.addEventListener("DOMContentLoaded", function () {
  // set year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = y;

  // Detail panels
  const detailButtons = document.querySelectorAll(".details-btn");
  detailButtons.forEach((btn) => {
    btn.addEventListener("click", () => togglePanel(btn));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePanel(btn);
      }
    });
  });

  function togglePanel(btn) {
    const id = btn.getAttribute("aria-controls");
    const panel = document.getElementById(id);
    if (!panel) return;
    const expanded = btn.getAttribute("aria-expanded") === "true";
    if (expanded) {
      btn.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    } else {
      // close other panels
      detailButtons.forEach((ob) => {
        ob.setAttribute("aria-expanded", "false");
        const pid = ob.getAttribute("aria-controls");
        const p = document.getElementById(pid);
        if (p) p.hidden = true;
      });
      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      panel.querySelector("a")?.focus();
    }
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Theme toggle (persisted)
  const themeToggle = document.getElementById("themeToggle");
  const rootEl = document.documentElement;
  const saved = localStorage.getItem("site-theme");
  if (saved === "dark") document.body.classList.add("dark");
  updateThemeButton();
  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("site-theme", isDark ? "dark" : "light");
    updateThemeButton();
  });
  function updateThemeButton() {
    if (!themeToggle) return;
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mainNav.classList.toggle("open");
  });

  // Search / Filter functionality (client-side)
  const filterInput = document.getElementById("filter");
  const searchInput = document.getElementById("search");
  const cardsGrid = document.getElementById("cardsGrid");
  const cards = Array.from(document.querySelectorAll(".card"));

  function applyFilter(q) {
    const s = (q || "").trim().toLowerCase();
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const match = s === "" || text.includes(s);
      card.style.display = match ? "" : "none";
    });
  }
  filterInput?.addEventListener("input", (e) => applyFilter(e.target.value));
  searchInput?.addEventListener("input", (e) => applyFilter(e.target.value));

  // small animation on load
  cards.forEach((c, i) => {
    c.style.opacity = 0;
    c.style.transform = "translateY(6px)";
    setTimeout(() => {
      c.style.transition =
        "opacity .4s ease,transform .4s cubic-bezier(.2,.9,.2,1)";
      c.style.opacity = "1";
      c.style.transform = "none";
    }, 80 * i);
  });

  // Add preview buttons next to HTML links
  const allLinks = Array.from(document.querySelectorAll(".card-body a"));
  allLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (
      href.toLowerCase().endsWith(".html") ||
      href.toLowerCase().endsWith(".htm")
    ) {
      const btn = document.createElement("button");
      btn.className = "icon-btn preview-btn";
      btn.type = "button";
      btn.title = "Preview";
      btn.innerText = "👁️";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openPreview(href, a);
      });
      a.parentNode.insertBefore(btn, a.nextSibling);
    }
  });

  // Modal elements
  const modal = document.getElementById("previewModal");
  const previewFrame = document.getElementById("previewFrame");
  const modalClose = document.getElementById("modalClose");
  const openInNew = document.getElementById("openInNew");
  let lastFocused = null;

  function openPreview(href, anchorEl) {
    if (!modal) return;
    lastFocused = anchorEl || document.activeElement;
    previewFrame.src = href;
    openInNew.href = href;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // focus inside modal
    modal.querySelector(".modal-panel")?.focus();
  }

  function closePreview() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    previewFrame.src = "about:blank";
    document.body.style.overflow = "";
    lastFocused?.focus();
  }

  // modal events
  modal?.addEventListener("click", (e) => {
    if (e.target && e.target.matches("[data-dismiss]")) closePreview();
  });
  modalClose?.addEventListener("click", closePreview);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePreview();
  });

  // Add tilt effect for each card
  cards.forEach((card) => {
    card.addEventListener("mousemove", (ev) => {
      const rect = card.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const rx = -dy * 6;
      const ry = dx * 6;
      const tz = 6;
      card.style.transform = `perspective(800px) translateZ(0px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});
