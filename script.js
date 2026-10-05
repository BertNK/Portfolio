class SplitRow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; height: 100%; }
        .row { display: flex; width: 100%; height: 100%; gap: 10px; }
        slot { display: contents; }
        ::slotted(.panel) { flex: 1 1 0; transition: flex-grow .48s cubic-bezier(.2,.75,.2,1); }
        :host([active="left"]) ::slotted(.panel-left),
        :host([active="right"]) ::slotted(.panel-right) { flex-grow: 3; }
        @media (max-width: 760px) {
          :host { height: auto; min-height: 0; }
          .row { display: grid; grid-template-columns: 1fr; grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 9px; }
          ::slotted(.panel) { min-height: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          ::slotted(.panel) { transition-duration: .01ms; }
        }
      </style>
      <div class="row"><slot name="left"></slot><slot name="right"></slot></div>
    `;
    this.pinnedSide = "";
    this.hoverSide = "";
    this.focusSide = "";
  }

  connectedCallback() {
    this.panels = [...this.querySelectorAll('[slot="left"], [slot="right"]')];
    for (const panel of this.panels) {
      const side = panel.slot;
      panel.addEventListener("pointerenter", () => {
        if (matchMedia("(hover: hover)").matches) {
          this.hoverSide = side;
          this.syncActive();
        }
      });
      panel.addEventListener("click", (event) => {
        if (event.target.closest("a, button") || matchMedia("(max-width: 760px)").matches) return;
        const collapsing = this.pinnedSide === side;
        this.pinnedSide = collapsing ? "" : side;
        if (collapsing) {
          this.hoverSide = "";
          this.focusSide = "";
        }
        this.syncActive();
      });
      panel.addEventListener("keydown", (event) => {
        if (event.target !== panel || (event.key !== "Enter" && event.key !== " ") || matchMedia("(max-width: 760px)").matches) return;
        event.preventDefault();
        const collapsing = this.pinnedSide === side;
        this.pinnedSide = collapsing ? "" : side;
        if (collapsing) this.focusSide = "";
        this.syncActive();
      });
      panel.addEventListener("focusin", () => {
        if (matchMedia("(max-width: 760px)").matches) return;
        this.focusSide = side;
        this.syncActive();
      });
      panel.addEventListener("focusout", (event) => {
        if (panel.contains(event.relatedTarget)) return;
        this.focusSide = "";
        this.syncActive();
      });
      panel.addEventListener("pointerleave", () => {
        this.hoverSide = "";
        this.syncActive();
      });
    }
  }

  syncActive() {
    const side = this.hoverSide || this.focusSide || this.pinnedSide;
    if (side) this.setAttribute("active", side);
    else this.removeAttribute("active");
    for (const panel of this.panels || []) {
      panel.setAttribute("aria-expanded", panel.slot === side ? "true" : "false");
    }
  }
}

customElements.define("split-row", SplitRow);

const translations = {
  en: {
    "header.home": "Bert Nikkelen, home", "header.note": "ICT student / Software developer", "header.talk": "Let’s talk",
    "row.one": "Introduction and work", "row.two": "Skills and interests", "row.three": "Contact and previous design",
    "intro.aria": "Introduction. Expand panel.", "intro.label": "01 / INTRODUCTION", "intro.eyebrow": "Software development student at ROC Technovium in Nijmegen", "intro.title": "Hi, I’m", "intro.name": "Bert.", "intro.description": "I build thoughtful software and enjoy finding out how things work—from clean interfaces to the systems behind them.", "intro.link": "Find me on LinkedIn",
    "work.aria": "Selected work. Expand panel.", "work.label": "02 / WHAT I MAKE", "work.eyebrow": "From idea to working product", "work.title1": "Make it", "work.title2": "useful.", "work.description": "Full-stack projects, web experiences, and experiments that turn a good question into something people can use.", "work.link": "Explore my GitHub",
    "skills.aria": "Skills and tools. Expand panel.", "skills.label": "03 / MY LANGUAGES, TOOLS & PLATFORMS", "skills.eyebrow": "What I work with", "skills.title1": "Build.", "skills.title2": "Learn.", "skills.description": "I work across front end and back end, learning new tools by building real projects.", "skills.list": "Languages and tools",
    "outside.aria": "Beyond the screen. Expand panel.", "outside.label": "04 / OFF-SCREEN", "outside.eyebrow": "Always exploring", "outside.title1": "More than", "outside.title2": "just code.", "outside.description": "Curiosity takes me into technology, hardware, creative projects, and lighting control with ChamSys MagicQ.", "outside.link": "A current interest",
    "contact.aria": "Contact Bert. Expand panel.", "contact.label": "05 / SAY HELLO", "contact.eyebrow": "Have a project or a question?", "contact.title1": "Let’s make", "contact.title2": "something.", "contact.description": "I’m always happy to talk about software, ideas, and what we could build together.", "contact.link": "bertnikkelen1@gmail.com",
    "archive.aria": "Previous website design. Expand panel.", "archive.label": "06 / THE ARCHIVE", "archive.eyebrow": "Go back in time", "archive.title1": "The old", "archive.title2": "portfolio.", "archive.description": "Want to see the previous version of this site? It’s still here, preserved as it was.", "archive.link": "Visit the old design",
    "footer.hint": "Choose a panel to explore", "footer.location": "THE NETHERLANDS", "theme.light": "Switch to light mode", "theme.dark": "Switch to dark mode", "lang.switch": "Switch language to Dutch", "page.title": "Bert Nikkelen — Software Developer",
    "outbound.title": "Leaving this website", "outbound.close": "Close this message", "outbound.newTab": "Open in a new tab", "outbound.currentTab": "Continue in this tab", "outbound.github": "You’re about to open GitHub.", "outbound.linkedin": "You’re about to open LinkedIn.", "outbound.chamsys": "You’re about to open the ChamSys website.", "outbound.email": "You’re about to open your email app to write to bertnikkelen1@gmail.com.",
    "mail.title": "Write a message", "mail.close": "Close the message form", "mail.to": "To:", "mail.copy": "Copy", "mail.copied": "Copied", "mail.name": "Your name", "mail.email": "Your email", "mail.message": "Message", "mail.send": "Continue to email", "mail.hint": "Your email app will open next."
  },
  nl: {
    "header.home": "Bert Nikkelen, startpagina", "header.note": "ICT-student / Softwareontwikkelaar", "header.talk": "Neem contact op",
    "row.one": "Introductie en werk", "row.two": "Vaardigheden en interesses", "row.three": "Contact en vorige vormgeving",
    "intro.aria": "Introductie. Paneel uitklappen.", "intro.label": "01 / INTRODUCTIE", "intro.eyebrow": "Student softwareontwikkeling aan ROC Technovium in Nijmegen", "intro.title": "Hoi, ik ben", "intro.name": "Bert.", "intro.description": "Ik bouw doordachte software en ontdek graag hoe dingen werken—van overzichtelijke interfaces tot de systemen erachter.", "intro.link": "Bekijk mijn LinkedIn",
    "work.aria": "Geselecteerd werk. Paneel uitklappen.", "work.label": "02 / WAT IK MAAK", "work.eyebrow": "Van idee naar werkend product", "work.title1": "Maak het", "work.title2": "bruikbaar.", "work.description": "Full-stackprojecten, webervaringen en experimenten die een goede vraag omzetten in iets waar mensen echt iets aan hebben.", "work.link": "Bekijk mijn GitHub",
    "skills.aria": "Vaardigheden en tools. Paneel uitklappen.", "skills.label": "03 / MIJN TALEN, TOOLS EN PLATFORMEN", "skills.eyebrow": "Waar ik mee werk", "skills.title1": "Bouwen.", "skills.title2": "Leren.", "skills.description": "Ik werk aan front-end en back-end en leer nieuwe tools kennen door echte projecten te bouwen.", "skills.list": "Programmeertalen en tools",
    "outside.aria": "Buiten het scherm. Paneel uitklappen.", "outside.label": "04 / BUITEN HET SCHERM", "outside.eyebrow": "Altijd nieuwsgierig", "outside.title1": "Meer dan", "outside.title2": "alleen code.", "outside.description": "Mijn nieuwsgierigheid brengt me bij technologie, hardware, creatieve projecten en lichtbesturing met ChamSys MagicQ.", "outside.link": "Een interesse van nu",
    "contact.aria": "Contact met Bert opnemen. Paneel uitklappen.", "contact.label": "05 / ZEG HALLO", "contact.eyebrow": "Een project of een vraag?", "contact.title1": "Laten we", "contact.title2": "iets maken.", "contact.description": "Ik praat graag over software, ideeën en wat we samen zouden kunnen bouwen.", "contact.link": "bertnikkelen1@gmail.com",
    "archive.aria": "Vorige websitevormgeving. Paneel uitklappen.", "archive.label": "06 / HET ARCHIEF", "archive.eyebrow": "Ga terug de tijd in", "archive.title1": "De oude", "archive.title2": "portfolio.", "archive.description": "Benieuwd naar de vorige versie van deze site? Die staat er nog, bewaard zoals hij was.", "archive.link": "Bekijk het oude ontwerp",
    "footer.hint": "Kies een paneel om te bekijken", "footer.location": "NEDERLAND", "theme.light": "Schakel over naar licht thema", "theme.dark": "Schakel over naar donker thema", "lang.switch": "Schakel over naar Engels", "page.title": "Bert Nikkelen — Softwareontwikkelaar",
    "outbound.title": "Je verlaat deze website", "outbound.close": "Melding sluiten", "outbound.newTab": "Openen in een nieuw tabblad", "outbound.currentTab": "Doorgaan in dit tabblad", "outbound.github": "Je staat op het punt GitHub te openen.", "outbound.linkedin": "Je staat op het punt LinkedIn te openen.", "outbound.chamsys": "Je staat op het punt de website van ChamSys te openen.", "outbound.email": "Je staat op het punt je e-mailapp te openen om een bericht te schrijven aan bertnikkelen1@gmail.com.",
    "mail.title": "Nieuw bericht", "mail.close": "Het berichtformulier sluiten", "mail.to": "Aan:", "mail.copy": "Kopiëren", "mail.copied": "Gekopieerd", "mail.name": "Je naam", "mail.email": "Je e-mailadres", "mail.message": "Bericht", "mail.send": "Verder naar e-mail", "mail.hint": "Hierna opent je e-mailapp."
  }
};

const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const langButton = document.querySelector("#lang-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeKey = "bert-portfolio-theme";
const languageKey = "bert-portfolio-lang";
let currentTheme = root.dataset.theme === "dark" ? "dark" : "light";
let currentLanguage;
try { currentLanguage = localStorage.getItem(languageKey); } catch (error) {}
if (currentLanguage !== "en" && currentLanguage !== "nl") {
  currentLanguage = (navigator.language || "en").toLowerCase().startsWith("nl") ? "nl" : "en";
}

function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch (error) {}
}

function applyTheme(theme) {
  currentTheme = theme;
  root.dataset.theme = theme;
  themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  themeButton.setAttribute("aria-label", translations[currentLanguage][theme === "dark" ? "theme.light" : "theme.dark"]);
  themeMeta.setAttribute("content", theme === "dark" ? "#151c1b" : "#f2f0e9");
}

function applyLanguage(language) {
  currentLanguage = language;
  root.lang = language;
  const dictionary = translations[language];
  for (const element of document.querySelectorAll("[data-i18n]")) {
    const value = dictionary[element.dataset.i18n];
    if (value) element.textContent = value;
  }
  for (const element of document.querySelectorAll("[data-i18n-aria]")) {
    const value = dictionary[element.dataset.i18nAria];
    if (value) element.setAttribute("aria-label", value);
  }
  langButton.querySelector(".lang-label").textContent = language.toUpperCase();
  langButton.setAttribute("aria-label", dictionary["lang.switch"]);
  document.title = dictionary["page.title"];
  applyTheme(currentTheme);
}

themeButton.addEventListener("click", () => {
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  savePreference(themeKey, nextTheme);
});
langButton.addEventListener("click", () => {
  const nextLanguage = currentLanguage === "nl" ? "en" : "nl";
  applyLanguage(nextLanguage);
  savePreference(languageKey, nextLanguage);
});

const outboundDialog = document.querySelector("#outbound-dialog");
const outboundMessage = document.querySelector("#outbound-message");
const outboundClose = document.querySelector("#outbound-close");
const outboundNewTab = document.querySelector("#outbound-new-tab");
const outboundCurrentTab = document.querySelector("#outbound-current-tab");
const mailBackdrop = document.querySelector("#mail-backdrop");
const mailForm = document.querySelector("#mail-form");
const mailClose = document.querySelector("#mail-close");
const mailCopy = document.querySelector("#mail-copy");
const mailAddress = "bertnikkelen1@gmail.com";
let pendingUrl = "";
let outboundInvoker = null;
let mailInvoker = null;

function openMailDialog(link) {
  mailInvoker = link;
  mailBackdrop.hidden = false;
  document.body.classList.add("dialog-open");
  mailForm.elements.name.focus();
}

function closeMailDialog(restoreFocus = true) {
  mailBackdrop.hidden = true;
  document.body.classList.remove("dialog-open");
  mailForm.reset();
  if (restoreFocus && mailInvoker) mailInvoker.focus();
}

function closeOutboundDialog() {
  outboundDialog.hidden = true;
  document.body.classList.remove("dialog-open");
  pendingUrl = "";
  if (outboundInvoker) outboundInvoker.focus();
}

function openOutboundDialog(url, destination, invoker) {
  pendingUrl = url;
  outboundInvoker = invoker;
  outboundMessage.textContent = translations[currentLanguage][`outbound.${destination}`];
  outboundDialog.hidden = false;
  document.body.classList.add("dialog-open");
  outboundClose.focus();
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link) return;
  let destination;
  try { destination = new URL(link.href, window.location.href); } catch (error) { return; }
  const isEmail = destination.protocol === "mailto:";
  const isExternalWeb = (destination.protocol === "http:" || destination.protocol === "https:") && destination.origin !== window.location.origin;
  if (!isEmail && !isExternalWeb) return;
  event.preventDefault();
  if (isEmail) {
    openMailDialog(link);
    return;
  }
  let service = "github";
  if (destination.hostname.toLowerCase().includes("linkedin.com")) service = "linkedin";
  else if (destination.hostname.toLowerCase().includes("chamsyslighting.com")) service = "chamsys";
  openOutboundDialog(link.href, service, link);
});

mailClose.addEventListener("click", () => closeMailDialog());
mailBackdrop.addEventListener("click", (event) => {
  if (event.target === mailBackdrop) closeMailDialog();
});
mailCopy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(mailAddress);
    mailCopy.textContent = translations[currentLanguage]["mail.copied"];
  } catch (error) {
    const temporary = document.createElement("textarea");
    temporary.value = mailAddress;
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.append(temporary);
    temporary.select();
    document.execCommand("copy");
    temporary.remove();
    mailCopy.textContent = translations[currentLanguage]["mail.copied"];
  }
  window.setTimeout(() => { mailCopy.textContent = translations[currentLanguage]["mail.copy"]; }, 1500);
});
mailForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(mailForm);
  const name = String(data.get("name") || "");
  const from = String(data.get("email") || "");
  const message = String(data.get("message") || "");
  const subject = currentLanguage === "nl" ? `Portfoliobericht van ${name}` : `Portfolio contact from ${name}`;
  const body = `${message}\n\n- ${name} (${from})`;
  const url = `mailto:${mailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const invoker = mailInvoker;
  closeMailDialog(false);
  openOutboundDialog(url, "email", invoker);
});

outboundClose.addEventListener("click", closeOutboundDialog);
outboundDialog.addEventListener("click", (event) => {
  if (event.target === outboundDialog) closeOutboundDialog();
});
document.addEventListener("keydown", (event) => {
  const isOutboundOpen = !outboundDialog.hidden;
  const isMailOpen = !mailBackdrop.hidden;
  if (!isOutboundOpen && !isMailOpen) return;
  if (event.key === "Escape") {
    if (isOutboundOpen) closeOutboundDialog();
    else closeMailDialog();
    return;
  }
  if (event.key !== "Tab") return;
  const controls = isOutboundOpen
    ? [outboundClose, outboundNewTab, outboundCurrentTab]
    : [...mailBackdrop.querySelectorAll("button:not([disabled]), input:not([disabled]), textarea:not([disabled])")];
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

outboundNewTab.addEventListener("click", () => {
  if (!pendingUrl) return;
  window.open(pendingUrl, "_blank", "noopener,noreferrer");
  closeOutboundDialog();
});
outboundCurrentTab.addEventListener("click", () => {
  if (pendingUrl) window.location.assign(pendingUrl);
});

applyLanguage(currentLanguage);
document.querySelector("#year").textContent = new Date().getFullYear();
