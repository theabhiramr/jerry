class Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render(props = { label: "", icon: "" }) {
    this.shadowRoot.innerHTML = `
      <button class="btn">
        ${props.icon ? `<span class="icon">${props.icon}</span>` : ""}
        <span class="label">${props.label || ""}</span>
      </button>
    `;
  }
}

customElements.define("x-button", Button);
