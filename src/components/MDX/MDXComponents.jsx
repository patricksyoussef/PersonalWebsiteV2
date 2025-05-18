import BlockQuote from "./Blockquote.astro";
import ImageWrapper from "./ImageWrapper.astro";
import PostVideo from "./PostVideo.astro";
import Collapse from "./Collapse.astro";
import CodeBlock from "./CodeBlock/CodeBlock.astro";

const InlineCode = (props) => {
  return (
    <code className="bg-slate-100 font-normal border border-slate-400 text-slate-800 py-[0.1rem] px-[0.25rem] rounded-md font-mono text-[0.8em]">
      {props.children}
    </code>
  );
};

const LinkWrapper = (props) => {
  const isExternal = props.href?.startsWith("http");
  return (
    <a target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} {...props}>
      {props.children}
    </a>
  );
};

const H2WithHR = (props) => (
  <div>
    <hr class="m-0 mt-[20px]" />
    <h2 {...props}>{props.children}</h2>
  </div>
);

export const components = {
  blockquote: BlockQuote,
  img: ImageWrapper,
  code: InlineCode,
  a: LinkWrapper,
  Collapse,
  PostVideo,
  CodeBlock,
  h2: H2WithHR,
};
