import { useState, useRef, useLayoutEffect } from "preact/hooks";

export default function Collapse({ title, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(defaultOpen ? "auto" : 0);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : 0);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div class="my-5 border border-gray-300 rounded-md p-3 mb-4 bg-gray-50">
      <div
        class="cursor-pointer flex items-center justify-between"
        onClick={handleToggle}
      >
        <h3 class="m-0 font-medium">{title}</h3>
        <span
          class={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
      <div
        ref={contentRef}
        class="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ height }}
      >
        <div class="mt-2">{children}</div>
      </div>
    </div>
  );
}
