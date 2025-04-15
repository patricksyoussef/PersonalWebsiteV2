import BlockQuote from "./Blockquote.astro";
import ImageWrapper from "./ImageWrapper.astro";
import PostVideo from "./PostVideo.astro";
import Collapse from "./Collapse.astro";
import CodeBlock from "./CodeBlock/CodeBlock.astro";

const InlineCode = (props) => {
  return (
    <code className="bg-slate-100 font-normal border border-slate-400 text-slate-800 py-[0.025rem] px-[0.18rem] rounded-md font-mono text-[0.9em]">
      {props.children}
    </code>
  );
};

export const components = {
  blockquote: BlockQuote,
  img: ImageWrapper,
  code: InlineCode,
  Collapse,
  PostVideo,
  CodeBlock,
};
