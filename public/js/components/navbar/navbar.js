// CSS module scripts (`import ... with { type: "css" }`) aren't supported in
// Safari/WebKit, so build a constructable stylesheet from the fetched CSS instead.
const sheet = new CSSStyleSheet();
sheet.replaceSync(
  await fetch(new URL("./navbar.css", import.meta.url)).then((r) => r.text()),
);

class AppNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <div class="navbar">
      <div class="navbar-left">
        <a href="/" class="navbar-logo">Jerry</a>
      </div>
      <div class="navbar-right">
        <a href="/about" class="navbar-link">About</a>
        <a href="/contact" class="navbar-link">Contact</a>
      </div>
    </div>`;
  }
}

customElements.define("app-navbar", AppNavbar);
