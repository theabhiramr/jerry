class AppNavbar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
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
