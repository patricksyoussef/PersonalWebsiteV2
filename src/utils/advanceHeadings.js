// src/utils/advanceHeadings.js
import { visit } from "unist-util-visit";

export default function advanceHeadings() {
  return (tree) => {
    visit(tree, "heading", (node) => {
      node.depth = Math.min(node.depth + 1, 6); // Ensure it does not exceed <h6>
    });
  };
}
