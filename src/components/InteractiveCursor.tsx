import { useEffect, useState, useRef } from "react";

/**
 * An interactive, smooth custom cursor element with inertia/magnetic tracking.
 * It tracks when the mouse is hovering over clickable elements to scale up
 * and apply custom blending backdrops.
 */
export default function InteractiveCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [inputHovered, setInputHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use refs for animation frames to handle lagless interpolation
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const mouseCoords = useRef({ x: 0, y: 0 });
  const currentCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide cursor on desktop devices
    const checkViewportAndInit = () => {
      // Don't show custom cursor on touch devices to avoid lagging/sticky fingers
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
        setIsVisible(false);
        return;
      }
      setIsVisible(true);
    };

    checkViewportAndInit();

    const onMouseMove = (e: MouseEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Setup interactive hovered state listeners
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, [onClick], .glass-panel'
      );
      
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          if (el.tagName.toLowerCase() === "input" || el.tagName.toLowerCase() === "textarea") {
            setInputHovered(true);
          } else {
            setLinkHovered(true);
          }
        });
        el.addEventListener("mouseleave", () => {
          setInputHovered(false);
          setLinkHovered(false);
        });
      });
    };

    // Periodically search for newly mounted elements to attach cursor callbacks
    const intervalId = setInterval(addHoverListeners, 1200);

    // Animation Loop
    let animationFrameId: number;
    const updateCursor = () => {
      // Dynamic inertia trailing interpolation formula
      const delay = 0.12; // Lower is slower/smoother
      currentCoords.current.x += (mouseCoords.current.x - currentCoords.current.x) * delay;
      currentCoords.current.y += (mouseCoords.current.y - currentCoords.current.y) * delay;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentCoords.current.x - 14}px, ${currentCoords.current.y - 14}px, 0)`;
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseCoords.current.x - 3}px, ${mouseCoords.current.y - 3}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    animationFrameId = requestAnimationFrame(updateCursor);

    // Dynamic global styling injector to hide standard cursor on desktop
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `@media (min-width: 768px) {
      body, a, button, input, select, textarea, [role="button"], .glass-panel {
        cursor: none !important;
      }
    }`;
    document.head.appendChild(styleEl);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      clearInterval(intervalId);
      cancelAnimationFrame(animationFrameId);
      styleEl.remove();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div id="interactive-custom-cursor-container" className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
      {/* Lagless Inner Core indicator dot */}
      <div
        ref={cursorRef}
        className={`fixed w-1.5 h-1.5 rounded-full bg-cyan-400 pointer-events-none transition-transform duration-75 mix-blend-screen scale-100 ${
          clicked ? "scale-75 bg-fuchsia-400" : ""
        }`}
      />

      {/* Lagging Trailing Ring */}
      <div
        ref={ringRef}
         className={`fixed w-7 h-7 rounded-full border border-violet-400 pointer-events-none transition-all duration-150 ease-out flex items-center justify-center ${
           clicked ? "scale-75 border-cyan-400 bg-cyan-400/10" : ""
         } ${
           linkHovered 
             ? "scale-150 border-cyan-400 bg-cyan-500/10 backdrop-blur-[2px]" 
             : inputHovered 
             ? "scale-[1.3] border-pink-400 bg-pink-500/5 h-10 w-2 rounded-lg" 
             : ""
         }`}
      >
        {/* Pulsing indicator core when hovering clickable cells */}
        {linkHovered && (
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute" />
        )}
      </div>
    </div>
  );
}
