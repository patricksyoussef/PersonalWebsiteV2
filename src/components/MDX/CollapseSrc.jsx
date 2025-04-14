import { useState, useRef, useLayoutEffect } from "preact/hooks";

export default function CollapseSrc({ title, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = isOpen ? `${contentRef.current.scrollHeight}px` : "0px";
    }
  }, [isOpen]);

  return (
    <div class="my-5 border border-edge rounded-content p-3 mb-4 bg-darken shadow-md">
      {/* Clickable Header */}
      <button class="cursor-pointer flex items-center justify-between w-full text-left" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
        <h4 class="!m-0 font-medium">{title}</h4>
        <span class={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        class="overflow-hidden transition-all duration-500 ease-in-out col"
        style={{ height: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px" }}
        aria-hidden={!isOpen}
      >
        <div class="prose prose-post md:text-[20px] collapse-content !max-w-none">{children}</div>
      </div>
    </div>
  );
}
