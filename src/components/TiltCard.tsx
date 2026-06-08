import React, { useRef, useState, MouseEvent } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  key?: string | number;
}

/**
 * An interactive container component that applies a 3D parallax tilt effect
 * based on the user's cursor position on both desktop/mobile hover.
 */
export default function TiltCard({ children, className = "", id, ...props }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to the element (center = 0, ranging from -0.5 to 0.5)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Convert to percentage ratios (-1 to 1)
    const xRatio = mouseX / (width / 2);
    const yRatio = mouseY / (height / 2);

    // Limit skewing rotation
    setCoords({ x: xRatio, y: yRatio });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCoords({ x: 0, y: 0 });
  };

  // Maximum rotation angle in degrees
  const maxRotation = 10;
  
  // Rotate around Y axis when mouse moves along X, and vice-versa
  const rotateX = -coords.y * maxRotation;
  const rotateY = coords.x * maxRotation;

  const cardStyle: React.CSSProperties = {
    transform: isHovering
      ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: isHovering ? "transform 0.1s ease-out, box-shadow 0.15s ease-out" : "transform 0.5s ease-out, box-shadow 0.5s ease-out",
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      {...props}
    >
      {/* 3D glare overlay shine effect */}
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-tr from-transparent via-white/5 to-white/10"
          style={{
            transform: `translate(${coords.x * 20}px, ${coords.y * 20}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
      {children}
    </div>
  );
}
