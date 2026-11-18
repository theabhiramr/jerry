export class Page extends HTMLElement {
  constructor() {
    super();
    this.abortController = null;
    this.error = null;
    this.loading = false;
    this.params = {};
  }

  async connectedCallback() {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    this.loading = true;
    this.error = null;
    this.data = null;
    this.render();

    try {
      this.data = await this.load(signal);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      } else {
        this.error = error;
      }
    } finally {
      this.loading = false;
    }
    if (this.signal.aborted) {
      return;
    }

    this.render(this.data, this.error, this.loading);
  }

  disconnectedCallback() {
    this.abortController?.abort();
  }

  render() {
    if (this.loading) {
      this.renderLoading();
    } else if (this.error) {
      this.renderError(this.error);
    } else {
      this.renderContent(this.data);
    }
  }
  // abstract methods
}
