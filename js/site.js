/* ============================================================
   FRUITA — chrome compartilhado (nav + footer), menu mobile,
   reveal on scroll, ano do rodapé. Injetado em todas as páginas.
   ============================================================ */
(function () {
  const PAGE = document.body.dataset.page || "";
  const BASE = document.body.dataset.base || ""; // "" na raiz

  const NAV_LINKS = [
    { href: "lite.html", label: "Lite", key: "lite" },
    { href: "comercial.html", label: "Comercial", key: "comercial" },
    { href: "release-notes.html", label: "Release Notes", key: "release-notes" },
    { href: "contato.html", label: "Contato", key: "contato" },
  ];

  const FOOTER = [
    {
      title: "Produtos",
      links: [
        { href: "lite.html", label: "Fruita Lite" },
        { href: "comercial.html", label: "Fruita Comercial" },
        { href: "https://app.fruita.com", label: "Abrir o app ↗", ext: true },
      ],
    },
    {
      title: "Acompanhe",
      links: [
        { href: "release-notes.html", label: "Release Notes" },
        { href: "comunicados.html", label: "Comunicados" },
        { href: "status.html", label: "Status" },
      ],
    },
    {
      title: "Suporte",
      links: [
        { href: "docs.html", label: "Central de ajuda" },
        { href: "contato.html", label: "Contato" },
        { href: "login.html", label: "Entrar" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "#", label: "Privacidade" },
        { href: "#", label: "Termos de uso" },
        { href: "#", label: "Cookies" },
      ],
    },
  ];

  const p = (h) => BASE + h;
  const isExt = (h) => /^https?:|^mailto:|^#/.test(h);
  const href = (h) => (isExt(h) ? h : p(h));

  /* ---------- NAV ---------- */
  function buildNav() {
    const host = document.querySelector('[data-slot="nav"]');
    if (!host) return;
    const links = NAV_LINKS.map(
      (l) =>
        `<a class="nav__link" href="${p(l.href)}"${
          PAGE === l.key ? ' aria-current="page"' : ""
        }>${l.label}</a>`
    ).join("");

    host.className = "nav";
    host.innerHTML = `
      <div class="nav__inner">
        <a class="nav__logo" href="${p("index.html")}" aria-label="Fruita — início">
          <img src="${p("assets/logo-h.svg")}" alt="Fruita" />
        </a>
        <button class="nav__burger" aria-label="Abrir menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="nav__menu" aria-label="Navegação principal">
          <div class="nav__links">${links}</div>
          <a class="btn btn--ghost" href="${p("login.html")}">Entrar</a>
        </nav>
        <div class="nav__right">
          <a class="btn btn--ghost" href="${p("login.html")}"${
      PAGE === "login" ? ' aria-current="page"' : ""
    }>Entrar</a>
        </div>
      </div>`;

    const burger = host.querySelector(".nav__burger");
    burger.addEventListener("click", () => {
      const open = host.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    host.querySelectorAll(".nav__menu a").forEach((a) =>
      a.addEventListener("click", () => {
        host.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- FOOTER ---------- */
  function buildFooter() {
    const host = document.querySelector('[data-slot="footer"]');
    if (!host) return;
    const cols = FOOTER.map(
      (c) => `
      <div class="footer__col">
        <h5>${c.title}</h5>
        ${c.links
          .map(
            (l) =>
              `<a href="${href(l.href)}"${
                l.ext ? ' target="_blank" rel="noopener"' : ""
              }>${l.label}</a>`
          )
          .join("")}
      </div>`
    ).join("");

    host.className = "footer";
    host.innerHTML = `
      <span class="footer__seed seedwm" style="color:var(--bg)" aria-hidden="true"></span>
      <div class="wrap">
        <div class="footer__grid">
          <div class="footer__brand">
            <a href="${p("index.html")}" aria-label="Fruita"><img src="${p(
      "assets/logo-h-light.svg"
    )}" alt="Fruita" /></a>
            <p>Infraestrutura para o hortifrúti brasileiro — da feira ao CEASA. Ferramentas simples, feitas para quem trabalha com fruta, verdura e legume todo dia.</p>
          </div>
          ${cols}
        </div>
        <div class="footer__bottom">
          <span>© <span data-year></span> Fruita · CNPJ 00.000.000/0001-00 · São Paulo, SP</span>
          <span class="mono">feito no Brasil</span>
        </div>
      </div>`;
    const y = host.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((e) => io.observe(e));
  }

  function init() {
    buildNav();
    buildFooter();
    reveal();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
