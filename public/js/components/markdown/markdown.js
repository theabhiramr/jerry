import { define, html } from "../../lib/index.js";
import { Marked } from "marked";
import dedent from "dedent";

const marked = new Marked();

function md(string, ...values) {
  return marked.parse(dedent(string, ...values));
}

export default define(
  "x-markdown",
  {
    props: { md: "" },
  },
  (props) => {
    return () => md`
      # Hello World from Markdown!

      ## This is an H2

      What on earth is going on???
    `;
  },
);
