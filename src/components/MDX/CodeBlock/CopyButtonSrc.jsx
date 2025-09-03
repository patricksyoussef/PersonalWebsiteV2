import { useState } from "preact/hooks";

export default function CopyButton({ code, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      class={`transition-all duration-200 transform ${copied ? "text-[#1e66f5] scale-110" : "text-gray-600 hover:text-gray-800"}`}
      aria-label="Copy code"
    >
      {children}
    </button>
  );
}
