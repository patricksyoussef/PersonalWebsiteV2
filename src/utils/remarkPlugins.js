import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}

export function remarkCodeBlocks() {
  return (tree) => {
    visit(tree, "code", (node) => {
      // node.value = the raw code
      // node.lang = the language (e.g., 'python')
      // node.meta = the metadata string after the language (e.g. 'filename=app.py highlight=2-3')

      const lang = node.lang || "text";
      const meta = node.meta || "";
      const code = node.value;

      // Replace the original 'code' node with an MDX element:
      // <CodeBlock code="..." lang="..." meta="..." />
      node.type = "mdxJsxFlowElement";
      node.name = "CodeBlock";

      // Add attributes so <CodeBlock> can receive them as props
      node.attributes = [
        { type: "mdxJsxAttribute", name: "code", value: code },
        { type: "mdxJsxAttribute", name: "lang", value: lang },
        { type: "mdxJsxAttribute", name: "meta", value: meta },
      ];

      // Remove any child nodes since we're now using an MDX element
      node.children = [];
    });
  };
}
