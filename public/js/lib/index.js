export function define(name, options, component) {
  class Component extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = component(options.props)();
    }
  }

  customElements.define(name, Component);

  return Component;
}

// maybe somethign like this that returns a lambda?
// we can do some processing in here.
export function html(string, ...values) {
  return String.raw(string, ...values);
}

// export default define(
//   "x-navbar",
//   {
//     props: { url: "https://google.com" },
//   },
//   (props) => {
//     return () => html`
//       <nav>
//         <ul>
//           <li><a href="${props.url}">Google idk</a></li>
//         </ul>
//       </nav>
//     `;
//   },
// );

// how do we update state? hooks? events?
// what about re-renders? data binding?
// what about { extends: "p" }
// what about a root shadow dom when declaring an app for isolation?
// similar to astro islands?
// how do we create an instance of a custom component with data binding? without just having like a property on teh component with a json blob... that wouldd be gross...
// or we could have each thing be like that. for each element.
