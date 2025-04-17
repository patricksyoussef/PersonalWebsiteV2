import { useRef, useEffect, useState } from "preact/hooks";
import hillsBackground from "./assets/background_hills.jpg";
import convexBackground from "./assets/background_convex.jpg";
import valleyBackground from "./assets/background_valley.jpg";

function grad_hill(x, y) {
  return [Math.cos(x) * Math.sin(y), Math.sin(x) * Math.cos(y)];
}

function grad_convex(x, y) {
  return [2 * x, 2 * y];
}

function grad_valley(x, y) {
  return [5 * x, y];
}

const input_data = {
  hills: [hillsBackground, [-Math.PI, Math.PI, -Math.PI, Math.PI], grad_hill],
  convex: [convexBackground, [-3, 3, -3, 3], grad_convex],
  valley: [valleyBackground, [-10, 10, -10, 10], grad_valley],
};

export default function GradientDescentPlayground() {
  // States/Refs
  const canvasRef = useRef(null);
  const [caseVal, setCaseVal] = useState("hills");
  const [alpha, setAlpha] = useState(0.1); // State for alpha value
  const [timedOut, setTimedOut] = useState(false); // New state for timeout
  const [currentStep, setCurrentStep] = useState(0);
  const [gradMag, setGradMag] = useState(0.0);
  let isAnimating = false;

  function gradient_descent(grad, start, alpha) {
    let [x, y] = start;
    const path = [];
    let flag = true;
    for (let i = 0; i < 101; i++) {
      const [dx, dy] = grad(x, y);
      const M = Math.sqrt(dx ** 2 + dy ** 2);
      path.push([x, y, M]);
      if (M < 0.0002) {
        flag = false;
        break;
      }
      x -= alpha * dx;
      y -= alpha * dy;
    }
    setTimedOut(flag);
    return path;
  }

  function handleReset() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const [imgSrc] = input_data[caseVal];
    const img = new Image();
    img.src = typeof imgSrc === "string" ? imgSrc : imgSrc.src;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setCurrentStep(0);
      setGradMag(0.0);
    };
    img.onerror = () => {
      console.error("Failed to load image:", img.src);
    };
  }

  useEffect(() => {
    handleReset();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const [, bounds, grad] = input_data[caseVal];
    const [xmin, xmax, ymin, ymax] = bounds;

    function getRealScale([x, y]) {
      // x and y are in the scaled place
      let rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      return [((x - w / 2) / w) * (xmax - xmin), ((h / 2 - y) / h) * (ymax - ymin)];
    }

    function getCanvasScale([xreal, yreal, mag]) {
      const w = xmax - xmin;
      const h = ymax - ymin;
      return [Math.round(((xreal + w / 2) / w) * canvas.width), Math.round(((-yreal + h / 2) / h) * canvas.height), mag];
    }

    function drawCircle([x, y], r, color, lineWidth) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.setLineDash([]);
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function animatePath(cpath) {
      isAnimating = true;

      // Function to reset canvas while keeping the previous elements
      function resetCanvas() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const [imgSrc] = input_data[caseVal];
        const img = new Image();
        img.src = typeof imgSrc === "string" ? imgSrc : imgSrc.src;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }

      function step(index) {
        if (index < cpath.length) {
          resetCanvas(); // Ensure we clear past frames and redraw

          // Draw the path up to the current point
          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.setLineDash([15, 15]);
          ctx.lineDashOffset = 0; // Ensures dash starts predictably
          ctx.moveTo(cpath[0][0], cpath[0][1]);

          for (let j = 0; j <= index; j++) {
            ctx.lineTo(cpath[j][0], cpath[j][1]);
          }
          ctx.stroke();

          // Always draw the starting point
          drawCircle(cpath[0], 12, "lime", 4);

          // Draw the moving circle at the current path index
          drawCircle(cpath[index], 12, "white", 4);

          // Update UI to reflect current step and gradient magnitude
          setCurrentStep(index);
          setGradMag(cpath[index][2]);

          requestAnimationFrame(() => step(index + 1));
        } else {
          // Ensure we leave the path visible after the animation completes
          ctx.beginPath();
          ctx.moveTo(cpath[0][0], cpath[0][1]);
          for (let j = 0; j < cpath.length; j++) {
            ctx.lineTo(cpath[j][0], cpath[j][1]);
          }
          ctx.stroke();

          // Draw the starting and final points
          drawCircle(cpath[0], 12, "lime", 4); // Ensure the starting point remains
          drawCircle(cpath[cpath.length - 1], 12, "white", 4); // End point

          isAnimating = false;
        }
      }

      step(0);
    }

    function handleClick(e) {
      if (isAnimating) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const start = getRealScale([x, y]);
      const path = gradient_descent(grad, start, alpha);
      const cpath = path.map(getCanvasScale);
      animatePath(cpath);
    }

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [caseVal, alpha]);

  return (
    <div className="flex flex-col gap-4 items-center w-full mx-auto py-4">
      <canvas ref={canvasRef} width={2000} height={2000} className="shadow-md rounded-lg border border-gray-300 w-full max-w-full" />
      <div className="flex justify-between w-full">
        <div className="flex flex-wrap justify-center gap-4">
          {["hills", "valley"].map((key) => (
            <button
              key={key}
              onClick={() => setCaseVal(key)}
              className={`px-4 py-2 rounded border font-mono ${
                caseVal === key ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
          <select className="px-4 py-2 rounded border font-mono" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))}>
            {[0.01, 0.1, 0.25, 0.5].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right">
          <div className="font-mono text-gray-700">
            Step: {currentStep} {timedOut && <span className="text-red-500"> (Timed Out)</span>}
          </div>
          <div className="font-mono text-gray-700">Gradient Mag: {gradMag.toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
}
