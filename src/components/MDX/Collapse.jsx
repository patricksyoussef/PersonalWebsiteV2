import { useState } from "preact/hooks";

export default function Collapse({ title, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div class="border border-gray-300 rounded-md p-3 mb-4 bg-gray-50">
      {/* Header row: title + chevron */}
      <div
        class="cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 class="m-0 font-medium">{title}</h3>
        <span
          class={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          {/* Down arrow icon (SVG) */}
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

      {/* Body: shown only if isOpen */}
      {isOpen && <div class="mt-2">{children}</div>}
    </div>
  );
}
