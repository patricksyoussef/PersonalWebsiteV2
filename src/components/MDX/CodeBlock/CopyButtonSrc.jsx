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
    <button onClick={handleCopy} class={`transition-colors p-1 ${copied ? "text-green-400" : "text-white-300"}`} aria-label="Copy code">
      {children}
    </button>
  );
}
