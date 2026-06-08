import { useEffect, useRef, useState } from "react";

/**
 * Interactive3DSpiderRobot
 * A high-fidelity, math-driven 3D component rendered on an HTML5 canvas.
 * Reacts to mouse pointer coordinates by tracking gaze and listing body weight.
 * Double-clicking triggers a mechanical morph sequence from a Multi-legged Spider
 * into a upright bipedal Tactical Battle Robot.
 */
export default function Interactive3DSpiderRobot() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isRobotMode, setIsRobotMode] = useState(false);

  // Keep a ref of isRobotMode to avoid closure stale context inside the animation loop
  const modeRef = useRef(false);
  useEffect(() => {
    modeRef.current = isRobotMode;
  }, [isRobotMode]);

  const handleDoubleClick = () => {
    setIsRobotMode((prev) => !prev);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 320);
    let height = (canvas.height = 320);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        width = canvas.width = w || 320;
        height = canvas.height = h || 320;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 3D Projection & Math Constants
    const fov = 280;
    let cameraYOffset = 0; // Camerawork pans dynamically during transition

    // Smooth state tracking
    let morphProgress = 0; // 0 = Spider, 1 = Bipedal Robot
    let tick = 0;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, inside: false };

    // Set up mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      mouse.targetX = (cx - rect.width / 2) / (rect.width / 2); // -1 to 1
      mouse.targetY = (cy - rect.height / 2) / (rect.height / 2); // -1 to 1
      mouse.inside = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.inside = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth state morphing
      const targetMorph = modeRef.current ? 1 : 0;
      morphProgress += (targetMorph - morphProgress) * 0.08;

      // Dynamic camera adjustment based on state: robot is taller, so camera shifts slightly down
      cameraYOffset += (morphProgress * 25 - cameraYOffset) * 0.08;

      // Mouse interactive easing
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Global camera rotation based on status & mouse interaction
      const rotationY = tick * 0.008 + mouse.x * 0.4;
      const rotationX = -0.2 + mouse.y * 0.3; // standard downward tilt plus mouse vertical look

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      // Utility function to project 3D coordinate {x, y, z} into 2D drawing coords
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Rotate around Y axis
        const x1 = x3d * cosY - z3d * sinY;
        const z1 = x3d * sinY + z3d * cosY;

        // Rotate around X axis
        const y2 = y3d * cosX - z1 * sinX;
        const z2 = y3d * sinX + z1 * cosX;

        // Perspective division
        // Move object back along the Z axis
        const distanceZ = z2 + 270;
        const scale = fov / Math.max(10, distanceZ);

        return {
          x: centerX + x1 * scale,
          y: centerY + (y2 + cameraYOffset) * scale,
          depth: distanceZ,
          scale,
        };
      };

      // --- Draw Ground Grid / Tech Radar ---
      const gridRadius = 110;
      ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
      ctx.lineWidth = 1;
      for (let r = 25; r <= gridRadius; r += 28) {
        ctx.beginPath();
        const pts = 32;
        for (let i = 0; i <= pts; i++) {
          const angle = (i * Math.PI * 2) / pts;
          const gx = r * Math.cos(angle);
          const gz = r * Math.sin(angle);
          const p = project(gx, 45, gz);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Drawing horizontal crosshair ticks
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const pStart = project(15 * Math.cos(angle), 45, 15 * Math.sin(angle));
        const pEnd = project(gridRadius * Math.cos(angle), 45, gridRadius * Math.sin(angle));
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pEnd.x, pEnd.y);
      }
      ctx.stroke();

      // --- Robot Modeling Math ---
      // We declare body parameters that morph between Spider and upright Bipedal Robot
      
      // In spider: body sits low, ground is at Y ~ 45, chest center is at Y ~ 0
      // In robot: body stands upright, height rises, head shifts up, chest center at Y ~ -30
      const bodyCenterY = -5 - morphProgress * 30 + Math.sin(tick * 0.05) * 2; // subtle idle breathing
      const spiderLegSpread = 65; // radius of leg stretch

      // Main Torso Sphere (Holographic Wireframe Sphere)
      const torsoRadius = 24 + morphProgress * 4;
      const ringCount = 5;

      // Draw wireframe torso
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + morphProgress * 0.2})`;
      ctx.lineWidth = 1;
      for (let r = 0; r < ringCount; r++) {
        // Draw horizontal slices
        const latAngle = ((r + 1) * Math.PI) / (ringCount + 1);
        const latRadius = torsoRadius * Math.sin(latAngle);
        const latY = bodyCenterY + torsoRadius * Math.cos(latAngle);

        ctx.beginPath();
        const steps = 18;
        for (let i = 0; i <= steps; i++) {
          const lonAngle = (i * Math.PI * 2) / steps;
          const tx = latRadius * Math.cos(lonAngle);
          const tz = latRadius * Math.sin(lonAngle);
          const p = project(tx, latY, tz);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Draw vertical longitude loops
      for (let r = 0; r < 4; r++) {
        const lonAngle = (r * Math.PI) / 4;
        ctx.beginPath();
        const steps = 24;
        for (let i = 0; i <= steps; i++) {
          const latAngle = (i * Math.PI * 2) / steps;
          const tx = torsoRadius * Math.sin(latAngle) * Math.cos(lonAngle);
          const ty = bodyCenterY + torsoRadius * Math.cos(latAngle);
          const tz = torsoRadius * Math.sin(latAngle) * Math.sin(lonAngle);
          const p = project(tx, ty, tz);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // --- Tactical Eye Optic ---
      // Eye follows the mouse pointer
      const eyeLookX = mouse.x * 12;
      const eyeLookY = bodyCenterY - 10 + mouse.y * 10 - morphProgress * 10;
      const eyeLookZ = 22 + morphProgress * 2; // pushes forward
      const eyeProj = project(eyeLookX, eyeLookY, eyeLookZ);

      // Draw outer scanner circle
      ctx.strokeStyle = "#ef4444"; // tactical crimson
      ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
      ctx.beginPath();
      ctx.arc(eyeProj.x, eyeProj.y, 6 * eyeProj.scale * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // Core bright laser point
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(eyeProj.x, eyeProj.y, 2 * eyeProj.scale * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Eye Scanning lines / crosshair on eye
      ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(eyeProj.x - 12, eyeProj.y);
      ctx.lineTo(eyeProj.x + 12, eyeProj.y);
      ctx.moveTo(eyeProj.x, eyeProj.y - 12);
      ctx.lineTo(eyeProj.x, eyeProj.y + 12);
      ctx.stroke();

      // --- Procedural Appendages (6 Morphing Legs) ---
      // We will model 6 independent structural mechanical limbs.
      // Every limb begins at a shoulder socket on the chest, goes to a knee hinge, and ends on a foot.
      const appendSocketAngles = [
        (Math.PI * 1) / 6,   // Rear Right
        (Math.PI * 5) / 6,   // Rear Left
        (Math.PI * 4) / 3,   // Front Left
        (Math.PI * 5) / 3,   // Front Right
        Math.PI,             // Mid Left
        0,                   // Mid Right
      ];

      appendSocketAngles.forEach((angle, idx) => {
        // Shoulder Socket joint coordinate
        const socketRad = torsoRadius - 2;
        const sx = socketRad * Math.cos(angle);
        const sz = socketRad * Math.sin(angle);
        const sy = bodyCenterY + 4; // placed lower on torso

        // Output morph configurations dynamically indexed
        let targetFootX = 0;
        let targetFootY = 45; // ground level standard is 45
        let targetFootZ = 0;
        let midLimbHeight = -35; // knee bends upwards for spider
        let strokeColor = "rgba(6, 182, 212, 0.7)"; // Cyan
        let appendLabel = "";

        // Spider Leg phase offset for crawling rhythm
        const legOffset = idx * (Math.PI / 3);
        const isSpWalking = mouse.inside && !modeRef.current;
        const scaleStep = isSpWalking ? 9 : 0;
        const walkCycleX = isSpWalking ? Math.cos(tick * 0.2 + legOffset) * scaleStep : 0;
        const walkCycleY = isSpWalking ? Math.abs(Math.sin(tick * 0.2 + legOffset)) * -scaleStep : 0;
        const walkCycleZ = isSpWalking ? Math.sin(tick * 0.2 + legOffset) * scaleStep : 0;

        /**
         * Splitting Morph state rules per limb:
         * Limb 0 & 1 -> Ground Support Legs (humanoid style)
         * Limb 2 & 3 -> Upper Left / Right Mechanical Arms (humanoid fists with laser mounts!)
         * Limb 4 & 5 -> Shoulder Rail-Wings / Flipped Jetthrusters on the back!
         */
        if (idx === 0 || idx === 1) {
          // Bipedal ground Legs
          const sideFactor = idx === 0 ? 1 : -1;
          
          // Spider mode target
          const spX = (spiderLegSpread + 10) * Math.cos(angle) + walkCycleX;
          const spY = 45 + walkCycleY;
          const spZ = (spiderLegSpread + 10) * Math.sin(angle) + walkCycleZ;

          // Robot mode target (straight support legs)
          const rbX = sideFactor * 16 + Math.sin(tick * 0.04 + sideFactor * 0.2) * 1.5;
          const rbY = 42; // stand firmly
          const rbZ = Math.cos(tick * 0.04) * 2;

          targetFootX = spX * (1 - morphProgress) + rbX * morphProgress;
          targetFootY = spY * (1 - morphProgress) + rbY * morphProgress;
          targetFootZ = spZ * (1 - morphProgress) + rbZ * morphProgress;

          // Hinge joint/Knee
          // Spider bends up and tall: midY of joint goes to -35
          // Robot knee bends forward: z shifts slightly forward, Y is halfway between pelvis and ground
          const spKX = (sx + spX) * 0.5 + Math.cos(angle) * 14;
          const spKY = -30;
          const spKZ = (sz + spZ) * 0.5 + Math.sin(angle) * 14;

          const rbKX = (sx + rbX) * 0.5 + sideFactor * 10;
          const rbKY = (sy + rbY) * 0.5 - 2;
          const rbKZ = (sz + rbZ) * 0.5 + 14; // push knees forward

          midLimbHeight = spKY * (1 - morphProgress) + rbKY * morphProgress;
          
          // Interpolated Knee Coordinates
          const kx = spKX * (1 - morphProgress) + rbKX * morphProgress;
          const ky = midLimbHeight;
          const kz = spKZ * (1 - morphProgress) + rbKZ * morphProgress;

          // Drawing Support Legs in deeper, sturdier Violet colors in Robot mode
          strokeColor = `rgba(${6 + 120 * morphProgress}, ${182 - 80 * morphProgress}, ${212 + 30 * morphProgress}, 0.85)`;
          appendLabel = "L-G_SUP";

          // Draw sockets, thighs, knees, ankles, feet
          const sProj = project(sx, sy, sz);
          const kProj = project(kx, ky, kz);
          const fProj = project(targetFootX, targetFootY, targetFootZ);

          // Render Thigh Link
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 3.5 - morphProgress * 1;
          ctx.beginPath();
          ctx.moveTo(sProj.x, sProj.y);
          ctx.lineTo(kProj.x, kProj.y);
          ctx.stroke();

          // Render Shin Link
          ctx.lineWidth = 2.5 - morphProgress * 0.5;
          ctx.beginPath();
          ctx.moveTo(kProj.x, kProj.y);
          ctx.lineTo(fProj.x, fProj.y);
          ctx.stroke();

          // Draw Knee Guard Plates / joints
          ctx.fillStyle = idx === 0 ? "#a78bfa" : "#22d3ee";
          ctx.beginPath();
          ctx.arc(kProj.x, kProj.y, 4.5 * kProj.scale * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Draw wide stabilizer feet in robot mode
          if (morphProgress > 0.4) {
            ctx.fillStyle = "rgba(139, 92, 246, 0.75)";
            ctx.beginPath();
            ctx.ellipse(fProj.x, fProj.y, 10 * fProj.scale * 0.45 * morphProgress, 4.5 * fProj.scale * 0.45 * morphProgress, rotationY * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            // spider feet points
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(fProj.x, fProj.y, 3 * fProj.scale * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (idx === 2 || idx === 3) {
          // Bipedal interactive tactical Arms / upper hooks
          const sideFactor = idx === 2 ? 1 : -1;

          // Spider mode target (Ground layout)
          const spX = (spiderLegSpread + 15) * Math.cos(angle) + walkCycleX;
          const spY = 45 + walkCycleY;
          const spZ = (spiderLegSpread + 15) * Math.sin(angle) + walkCycleZ;

          // Robot mode target (raised mechanical punching fist / weapon emitter!)
          const punchYOffset = Math.sin(tick * 0.06) * 4;
          const rbX = sideFactor * 33 + mouse.x * 15;
          const rbY = bodyCenterY + 15 + punchYOffset + mouse.y * 10;
          const rbZ = 30 + (idx === 2 ? Math.sin(tick * 0.1) * 8 : Math.cos(tick * 0.1) * 8); // alternate arm reach

          targetFootX = spX * (1 - morphProgress) + rbX * morphProgress;
          targetFootY = spY * (1 - morphProgress) + rbY * morphProgress;
          targetFootZ = spZ * (1 - morphProgress) + rbZ * morphProgress;

          // Joints
          const spKX = (sx + spX) * 0.5 + Math.cos(angle) * 14;
          const spKY = -38;
          const spKZ = (sz + spZ) * 0.5 + Math.sin(angle) * 14;

          // Robot elbows bend backwards/outwards
          const rbKX = sx + sideFactor * 15;
          const rbKY = (sy + rbY) * 0.5 - 5;
          const rbKZ = (sz + rbZ) * 0.5 - 10;

          const kx = spKX * (1 - morphProgress) + rbKX * morphProgress;
          const ky = spKY * (1 - morphProgress) + rbKY * morphProgress;
          const kz = spKZ * (1 - morphProgress) + rbKZ * morphProgress;

          strokeColor = `rgba(${6 + 180 * morphProgress}, ${182 - 120 * morphProgress}, ${212 - 100 * morphProgress}, 0.85)`; // transforms cyber-cyan to a fierce pinkish-violet glow
          appendLabel = "W-SYS_RAIL";

          // Projections
          const sProj = project(sx, sy, sz);
          const kProj = project(kx, ky, kz);
          const fProj = project(targetFootX, targetFootY, targetFootZ);

          // Draw Upper Arm / Armature
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 3.2 - morphProgress * 0.5;
          ctx.beginPath();
          ctx.moveTo(sProj.x, sProj.y);
          ctx.lineTo(kProj.x, kProj.y);
          ctx.stroke();

          // Draw Lower Arm
          ctx.beginPath();
          ctx.moveTo(kProj.x, kProj.y);
          ctx.lineTo(fProj.x, fProj.y);
          ctx.stroke();

          // Elbow joint
          ctx.fillStyle = "#ec4899";
          ctx.beginPath();
          ctx.arc(kProj.x, kProj.y, 4 * kProj.scale * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Plasma weapon emitter index tooltip
          if (morphProgress > 0.4) {
            // Draw glowing weapon nozzles
            ctx.fillStyle = "#38bdf8";
            ctx.beginPath();
            ctx.arc(fProj.x, fProj.y, 4 * fProj.scale * 0.45 * morphProgress, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Cyber energy sparks emanating from weapon fists
            if (isHovered && Math.random() > 0.6) {
              ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
              ctx.beginPath();
              ctx.moveTo(fProj.x, fProj.y);
              ctx.lineTo(fProj.x + (Math.random() - 0.5) * 16, fProj.y + (Math.random() - 0.5) * 16);
              ctx.stroke();
            }
          } else {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(fProj.x, fProj.y, 2.8 * fProj.scale * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }

        } else {
          // Limb 4 & 5 -> Shoulder wings/Thrusters folded on upper back
          const sideFactor = idx === 4 ? 1 : -1;

          // Spider mode (radial crawling grid)
          const spX = spiderLegSpread * Math.cos(angle) + walkCycleX;
          const spY = 45 + walkCycleY;
          const spZ = spiderLegSpread * Math.sin(angle) + walkCycleZ;

          // Robot mode (shoulders jets / wings that point dynamically up)
          const wingFlicker = Math.sin(tick * 0.1 + sideFactor) * 3;
          const rbX = sideFactor * 35 + wingFlicker;
          const rbY = bodyCenterY - 35 + wingFlicker * 0.5;
          const rbZ = -15; // behind the back

          targetFootX = spX * (1 - morphProgress) + rbX * morphProgress;
          targetFootY = spY * (1 - morphProgress) + rbY * morphProgress;
          targetFootZ = spZ * (1 - morphProgress) + rbZ * morphProgress;

          // Elbow joint
          const spKX = (sx + spX) * 0.5 + Math.cos(angle) * 12;
          const spKY = -34;
          const spKZ = (sz + spZ) * 0.5 + Math.sin(angle) * 12;

          const rbKX = sx + sideFactor * 10;
          const rbKY = bodyCenterY - 15;
          const rbKZ = sz - 5;

          const kx = spKX * (1 - morphProgress) + rbKX * morphProgress;
          const ky = spKY * (1 - morphProgress) + rbKY * morphProgress;
          const kz = spKZ * (1 - morphProgress) + rbKZ * morphProgress;

          strokeColor = `rgba(139, 92, 246, ${0.65 + morphProgress * 0.35})`; // Glowing purple rails

          const sProj = project(sx, sy, sz);
          const kProj = project(kx, ky, kz);
          const fProj = project(targetFootX, targetFootY, targetFootZ);

          // Arm links
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 3.0 - morphProgress * 0.5;
          ctx.beginPath();
          ctx.moveTo(sProj.x, sProj.y);
          ctx.lineTo(kProj.x, kProj.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(kProj.x, kProj.y);
          ctx.lineTo(fProj.x, fProj.y);
          ctx.stroke();

          // Joint
          ctx.fillStyle = "#a78bfa";
          ctx.beginPath();
          ctx.arc(kProj.x, kProj.y, 3 * kProj.scale * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Jet nozzle flare point
          if (morphProgress > 0.45) {
            ctx.fillStyle = "#a78bfa";
            ctx.beginPath();
            ctx.arc(fProj.x, fProj.y, 4 * fProj.scale * 0.45 * morphProgress, 0, Math.PI * 2);
            ctx.fill();

            // Fire tail from flight engines inside bipedal robot state
            const flameIntensity = (Math.random() * 8 + 6) * morphProgress;
            ctx.fillStyle = "rgba(167, 139, 250, 0.45)";
            ctx.beginPath();
            ctx.arc(fProj.x, fProj.y + flameIntensity * 0.5, flameIntensity * 0.4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(fProj.x, fProj.y, 2.8 * fProj.scale * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // --- Floating interactive telemetries / code snippet overlays ---
      if (mouse.inside) {
        ctx.textAlign = "start";
        ctx.fillStyle = "rgba(6, 182, 212, 0.55)";
        ctx.font = "8px monospace";
        ctx.fillText(`LOOK_X: ${mouse.x.toFixed(2)}`, 16, 26);
        ctx.fillText(`LOOK_Y: ${mouse.y.toFixed(2)}`, 16, 36);
        ctx.fillText(`MORPH_X: ${morphProgress.toFixed(2)}`, 16, 46);
        ctx.fillText(`MODEL: ${modeRef.current ? "MECH_HUMAN_V1" : "SP_AMPLY_V2"}`, 16, 56);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      className="relative w-full h-full flex items-center justify-center cursor-pointer select-none group"
      title="Double-click to transform!"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain transition-transform duration-300"
        style={{
          transform: isHovered ? "scale(1.03)" : "scale(1)",
        }}
      />
      
      {/* HUD overlays */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start bg-slate-950/40 border border-slate-900/40 px-2.5 py-1.5 rounded-xl backdrop-blur-[2px] pointer-events-none">
        <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">
          T-Core Unit State:
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isRobotMode ? "bg-purple-400 animate-pulse" : "bg-cyan-400 animate-ping"}`} />
          <span className={`text-[10px] font-mono font-bold uppercase transition-colors duration-300 ${isRobotMode ? "text-purple-400" : "text-cyan-400"}`}>
            {isRobotMode ? "STANDING MECH-BOT" : "SPIDER DRIFT-BOT"}
          </span>
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] text-slate-400 uppercase tracking-widest text-center whitespace-nowrap bg-black/40 px-4 py-2 rounded-full border border-slate-900/50 pointer-events-none transition-colors duration-300 group-hover:border-cyan-500/30 group-hover:bg-slate-950/70">
        <span className="text-cyan-400 animate-pulse font-bold">DOUBLE-CLICK TO TRANSFORMS MECH</span>
      </div>
    </div>
  );
}
