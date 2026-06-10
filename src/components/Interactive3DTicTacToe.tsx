import { useEffect, useRef, useState } from "react";

/**
 * Interactive3DTicTacToe
 * Renders a gorgeous 3D wireframe Tic-Tac-Toe arena on an HTML5 canvas.
 * Relies on pure mathematical 3D perspective projection.
 * - Entire game board tilts dynamically following the mouse position.
 * - Detects active cell hovering and clicks by finding the closest 2D-projected node.
 * - Built-in strategic CPU opponent with realistic thinking delays.
 * - Fully transparent back-plane structure fitting the dark tech theme.
 */

type Player = "X" | "O" | null;

interface Cell3D {
  row: number;
  col: number;
  x: number; // 3D coordinates
  y: number;
  z: number;
  projX: number; // Projected 2D coordinates (updated on each render)
  projY: number;
}

export default function Interactive3DTicTacToe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game States
  const [board, setBoard] = useState<Player[]>([
    null, null, null,
    null, null, null,
    null, null, null,
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | "DRAW" | null>(null);
  const [scores, setScores] = useState({ player: 0, cpu: 0, draws: 0 });
  const [isCpuThinking, setIsCpuThinking] = useState(false);
  const [hoveredCellIndex, setHoveredCellIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Keep a ref of board, turn, isCpuThinking, and winner to avoid closure issues in the animation loop
  const boardRef = useRef(board);
  const currentPlayerRef = useRef(currentPlayer);
  const isCpuThinkingRef = useRef(isCpuThinking);
  const winnerRef = useRef(winner);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    currentPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  useEffect(() => {
    isCpuThinkingRef.current = isCpuThinking;
  }, [isCpuThinking]);

  useEffect(() => {
    winnerRef.current = winner;
  }, [winner]);

  // Winning Combinations
  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const checkWinner = (currentBoard: Player[]): "X" | "O" | "DRAW" | null => {
    for (const line of winLines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a] as "X" | "O";
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return "DRAW";
    }
    return null;
  };

  // Reset Game Arena
  const resetGame = () => {
    setBoard([
      null, null, null,
      null, null, null,
      null, null, null,
    ]);
    setCurrentPlayer("X");
    setWinner(null);
    setIsCpuThinking(false);
    setHoveredCellIndex(null);
  };

  // Human Player Move
  const handleCellClick = (index: number) => {
    if (board[index] || winner || isCpuThinking || currentPlayer !== "X") return;

    const nextBoard = [...board];
    nextBoard[index] = "X";
    setBoard(nextBoard);

    const gameOutcome = checkWinner(nextBoard);
    if (gameOutcome) {
      setWinner(gameOutcome);
      updateScores(gameOutcome);
    } else {
      setCurrentPlayer("O");
    }
  };

  const updateScores = (outcome: "X" | "O" | "DRAW") => {
    if (outcome === "X") {
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (outcome === "O") {
      setScores(prev => ({ ...prev, cpu: prev.cpu + 1 }));
    } else {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  // Strategic AI Opponent
  useEffect(() => {
    if (currentPlayer === "O" && !winner && !isCpuThinking) {
      setIsCpuThinking(true);

      const delay = Math.random() * 400 + 450; // Dynamic scanning simulation delay
      const timer = setTimeout(() => {
        const currentBoard = [...boardRef.current];
        
        // Find best move logic
        let chosenMove = -1;

        // Rule 1: Can CPU win in this move?
        for (let i = 0; i < 9; i++) {
          if (currentBoard[i] === null) {
            const testBoard = [...currentBoard];
            testBoard[i] = "O";
            if (checkWinner(testBoard) === "O") {
              chosenMove = i;
              break;
            }
          }
        }

        // Rule 2: Block human winning move?
        if (chosenMove === -1) {
          for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === null) {
              const testBoard = [...currentBoard];
              testBoard[i] = "X";
              if (checkWinner(testBoard) === "X") {
                chosenMove = i;
                break;
              }
            }
          }
        }

        // Rule 3: Take center if available
        if (chosenMove === -1 && currentBoard[4] === null) {
          chosenMove = 4;
        }

        // Rule 4: Pick random empty corner or edge
        if (chosenMove === -1) {
          const emptyIndices: number[] = [];
          currentBoard.forEach((cell, idx) => {
            if (cell === null) emptyIndices.push(idx);
          });
          if (emptyIndices.length > 0) {
            chosenMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          }
        }

        if (chosenMove !== -1) {
          const nextBoard = [...currentBoard];
          nextBoard[chosenMove] = "O";
          setBoard(nextBoard);

          const gameOutcome = checkWinner(nextBoard);
          if (gameOutcome) {
            setWinner(gameOutcome);
            updateScores(gameOutcome);
          } else {
            setCurrentPlayer("X");
          }
        }
        setIsCpuThinking(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner]);

  // Canvas 3D rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = 380);
    let height = (canvas.height = 380);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        width = canvas.width = w || 380;
        height = canvas.height = h || 380;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Geometry parameters template - optimized for mobile tapping size
    const baseCellSize = 65;
    const baseGap = 15;

    // 3D projections variables template
    const baseFov = 325;
    let tick = 0;

    // Mouse/Touch Tracking Ease Setup
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, rawX: -999, rawY: -999, inside: false };

    // Set up 9 visual nodes representing 3x3 cells in 3D (Z-plane centers dynamically calculated in render)
    const listCells3D: Cell3D[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        listCells3D.push({
          row,
          col,
          x: 0,
          y: 0,
          z: 0,
          projX: 0,
          projY: 0,
        });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      mouse.rawX = cx;
      mouse.rawY = cy;
      mouse.targetX = (cx - rect.width / 2) / (rect.width / 2); // -1.0 to 1.0
      mouse.targetY = (cy - rect.height / 2) / (rect.height / 2); // -1.0 to 1.0
      mouse.inside = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const cx = touch.clientX - rect.left;
        const cy = touch.clientY - rect.top;
        mouse.rawX = cx;
        mouse.rawY = cy;
        mouse.targetX = (cx - rect.width / 2) / (rect.width / 2);
        mouse.targetY = (cy - rect.height / 2) / (rect.height / 2);
        mouse.inside = true;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const cx = touch.clientX - rect.left;
        const cy = touch.clientY - rect.top;
        mouse.rawX = cx;
        mouse.rawY = cy;
        mouse.targetX = (cx - rect.width / 2) / (rect.width / 2);
        mouse.targetY = (cy - rect.height / 2) / (rect.height / 2);
        mouse.inside = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.rawX = -999;
      mouse.rawY = -999;
      mouse.inside = false;
      setHoveredCellIndex(null);
    };

    const handleCanvasClick = (e: MouseEvent) => {
      if (winnerRef.current || isCpuThinkingRef.current || currentPlayerRef.current !== "X") return;

      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      // Find nearest projected cell within interactive range based on current responsive scale
      let closestIdx = -1;
      const baseScale = Math.min(rect.width, rect.height) / 380;
      const currentCellSize = baseCellSize * Math.max(0.72, Math.min(1.15, baseScale));
      let minDistance = currentCellSize * 0.85; // tap safety range matching current visual size

      listCells3D.forEach((cell, idx) => {
        const dx = cx - cell.projX;
        const dy = cy - cell.projY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      if (closestIdx !== -1 && boardRef.current[closestIdx] === null) {
        handleCellClick(closestIdx);
      }
    };

    const handleCanvasTouchEnd = (e: TouchEvent) => {
      if (winnerRef.current || isCpuThinkingRef.current || currentPlayerRef.current !== "X") return;
      if (e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const cx = touch.clientX - rect.left;
      const cy = touch.clientY - rect.top;

      let closestIdx = -1;
      const baseScale = Math.min(rect.width, rect.height) / 380;
      const currentCellSize = baseCellSize * Math.max(0.72, Math.min(1.15, baseScale));
      let minDistance = currentCellSize * 1.1; // slightly more generous for finger taps

      listCells3D.forEach((cell, idx) => {
        const dx = cx - cell.projX;
        const dy = cy - cell.projY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      if (closestIdx !== -1 && boardRef.current[closestIdx] === null) {
        handleCellClick(closestIdx);
      }
      handleMouseLeave();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleCanvasClick);
    
    // Wire up touch events with passive handles
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleCanvasTouchEnd, { passive: true });

    // Dynamic rendering loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      const halfW = width / 2;
      const halfH = height / 2;

      // Base scaling parameter matching current resolution
      const baseScale = Math.min(width, height) / 380;
      const cellSize = baseCellSize * Math.max(0.72, Math.min(1.15, baseScale));
      const gap = baseGap * Math.max(0.72, Math.min(1.15, baseScale));
      const gridSpan = cellSize * 1.5 + gap;

      // Dynamically sync positions according to scaling factor
      listCells3D.forEach((cell) => {
        cell.x = (cell.col - 1) * (cellSize + gap);
        cell.z = (cell.row - 1) * (cellSize + gap);
      });

      // Smooth coordinate look values
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Pristine flat/orthographic straight-on projection mapping
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Flat mapping to eliminate extreme 3D camera tilts
        return {
          x: halfW + x3d,
          y: halfH + z3d,
          scale: 1,
        };
      };

      // --- 1. Calculate and Update Cell Centers ---
      listCells3D.forEach((cell, idx) => {
        const p = project(cell.x, cell.y, cell.z);
        cell.projX = p.x;
        cell.projY = p.y;
      });

      // --- 2. Track Hover Closest Cell ---
      if (mouse.inside && !winnerRef.current && !isCpuThinkingRef.current && currentPlayerRef.current === "X") {
        let bestIdx = -1;
        let bestDist = cellSize * 0.82; // hover tracking limit matches relative target spacing
        listCells3D.forEach((cell, idx) => {
          const dx = mouse.rawX - cell.projX;
          const dy = mouse.rawY - cell.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < bestDist && boardRef.current[idx] === null) {
            bestDist = dist;
            bestIdx = idx;
          }
        });
        setHoveredCellIndex(bestIdx !== -1 ? bestIdx : null);
      }

      // --- 3. Draw sleek horizontal/vertical grid division lines ---
      ctx.strokeStyle = "rgba(6, 182, 212, 0.28)";
      ctx.lineWidth = 2.5;

      const halfGrid = (cellSize * 3 + gap * 2) / 2;

      // Draw horizontal divisions
      for (const offset of [-cellSize / 2 - gap / 2, cellSize / 2 + gap / 2]) {
        // Horizontal lines crossing
        ctx.beginPath();
        const s1 = project(-halfGrid, 0, offset);
        const s2 = project(halfGrid, 0, offset);
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();

        // Vertical lines crossing
        ctx.beginPath();
        const t1 = project(offset, 0, -halfGrid);
        const t2 = project(offset, 0, halfGrid);
        ctx.moveTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.stroke();
      }

      // --- 4. Draw Individual Cells (Boundaries & Hover Reticles) ---
      listCells3D.forEach((cell, idx) => {
        const cellState = boardRef.current[idx];
        const isCellHovered = idx === hoveredCellIndex;

        // Draw Cell boundaries
        const side = cellSize / 2;
        const pTL = project(cell.x - side, 0, cell.z - side);
        const pTR = project(cell.x + side, 0, cell.z - side);
        const pBR = project(cell.x + side, 0, cell.z + side);
        const pBL = project(cell.x - side, 0, cell.z + side);

        // Grid Cell Base Box Outline
        if (isCellHovered) {
          ctx.strokeStyle = "rgba(6, 182, 212, 0.85)";
          ctx.fillStyle = "rgba(6, 182, 212, 0.08)";
          ctx.beginPath();
          ctx.moveTo(pTL.x, pTL.y);
          ctx.lineTo(pTR.x, pTR.y);
          ctx.lineTo(pBR.x, pBR.y);
          ctx.lineTo(pBL.x, pBL.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Laser Target Corner Reticles
          ctx.strokeStyle = "#40e0d0";
          ctx.lineWidth = 2.5;

          const markerSz = 6;
          // Top Left Reticle
          ctx.beginPath();
          ctx.moveTo(pTL.x + markerSz, pTL.y);
          ctx.lineTo(pTL.x, pTL.y);
          ctx.lineTo(pTL.x, pTL.y + markerSz);
          ctx.stroke();

          // Top Right Reticle
          ctx.beginPath();
          ctx.moveTo(pTR.x - markerSz, pTR.y);
          ctx.lineTo(pTR.x, pTR.y);
          ctx.lineTo(pTR.x, pTR.y + markerSz);
          ctx.stroke();

          // Bottom Right Reticle
          ctx.beginPath();
          ctx.moveTo(pBR.x - markerSz, pBR.y);
          ctx.lineTo(pBR.x, pBR.y);
          ctx.lineTo(pBR.x, pBR.y - markerSz);
          ctx.stroke();
        } else {
          ctx.strokeStyle = "rgba(30, 41, 59, 0.65)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(pTL.x, pTL.y);
          ctx.lineTo(pTR.x, pTR.y);
          ctx.lineTo(pBR.x, pBR.y);
          ctx.lineTo(pBL.x, pBL.y);
          ctx.closePath();
          ctx.stroke();
        }

        // --- 5. Draw Highly Animating & Luminous Glow Pieces (X and O) ---
        if (cellState === "X") {
          // X rotates dynamically in 3D locally around its center with intense cyber cyan glow
          const rotateSpeedY = tick * 0.045 + idx * 0.4;
          const rotateSpeedX = tick * 0.02 + idx * 0.2;
          const bobbingY = Math.sin(tick * 0.055 + idx * 0.7) * 4;

          const cosY = Math.cos(rotateSpeedY);
          const sinY = Math.sin(rotateSpeedY);
          const cosX = Math.cos(rotateSpeedX);
          const sinX = Math.sin(rotateSpeedX);

          const len = cellSize * 0.28;

          // Helper to rotate local node coords around the cell origin
          const rotateLocal = (lx: number, ly: number, lz: number) => {
            const rx1 = lx * cosY - lz * sinY;
            const rz1 = lx * sinY + lz * cosY;
            const ry2 = ly * cosX - rz1 * sinX;
            const rz2 = ly * sinX + rz1 * cosX;
            // Map rotated local Y as depth scaling or combined offset
            return {
              x: halfW + cell.x + rx1,
              y: halfH + cell.z + rz2 + ry2 + bobbingY,
            };
          };

          const rx1_t = rotateLocal(-len, 0, -len);
          const rx1_b = rotateLocal(len, 0, len);
          const rx2_t = rotateLocal(-len, 0, len);
          const rx2_b = rotateLocal(len, 0, -len);

          ctx.strokeStyle = "#22d3ee"; // Cyber cyan glow
          ctx.lineWidth = 4;
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#06b6d4";

          ctx.beginPath();
          ctx.moveTo(rx1_t.x, rx1_t.y);
          ctx.lineTo(rx1_b.x, rx1_b.y);
          ctx.moveTo(rx2_t.x, rx2_t.y);
          ctx.lineTo(rx2_b.x, rx2_b.y);
          ctx.stroke();

          // Highlight core wire
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();

        } else if (cellState === "O") {
          // O (donut ring) rotates diagonally across axes with neon violet/pink glow
          const rotateSpeedY = tick * 0.038 + idx * 0.3;
          const rotateSpeedX = tick * 0.015 + idx * 0.15;
          const bobbingY = Math.sin(tick * 0.06 + idx * 0.6) * 4;

          const cosY = Math.cos(rotateSpeedY);
          const sinY = Math.sin(rotateSpeedY);
          const cosX = Math.cos(rotateSpeedX);
          const sinX = Math.sin(rotateSpeedX);

          const radius = cellSize * 0.24;
          const tubeSteps = 24;

          const rotateLocal = (lx: number, ly: number, lz: number) => {
            const rx1 = lx * cosY - lz * sinY;
            const rz1 = lx * sinY + lz * cosY;
            const ry2 = ly * cosX - rz1 * sinX;
            const rz2 = ly * sinX + rz1 * cosX;
            return {
              x: halfW + cell.x + rx1,
              y: halfH + cell.z + rz2 + ry2 + bobbingY,
            };
          };

          ctx.strokeStyle = "#c084fc"; // Cyber violet glow
          ctx.lineWidth = 3.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#a855f7";

          ctx.beginPath();
          for (let i = 0; i <= tubeSteps; i++) {
            const angle = (i * Math.PI * 2) / tubeSteps;
            const lx = radius * Math.cos(angle);
            const ly = 0;
            const lz = radius * Math.sin(angle);

            const ptObj = rotateLocal(lx, ly, lz);
            if (i === 0) ctx.moveTo(ptObj.x, ptObj.y);
            else ctx.lineTo(ptObj.x, ptObj.y);
          }
          ctx.stroke();

          // Highlight core
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // --- 6. Highlight the winning line if exists ---
      if (winnerRef.current && winnerRef.current !== "DRAW") {
        const runningLine = winLines.find(line => {
          const [a, b, c] = line;
          return boardRef.current[a] && boardRef.current[a] === boardRef.current[b] && boardRef.current[a] === boardRef.current[c];
        });

        if (runningLine) {
          const [startIdx, , endIdx] = runningLine;
          const startCell = listCells3D[startIdx];
          const endCell = listCells3D[endIdx];

          const startProj = project(startCell.x, 0, startCell.z);
          const endProj = project(endCell.x, 0, endCell.z);

          // Draw laser line
          ctx.strokeStyle = winnerRef.current === "X" ? "#22d3ee" : "#d8b4fe";
          ctx.lineWidth = 4.5 + Math.sin(tick * 0.15) * 1.5;
          ctx.beginPath();
          ctx.moveTo(startProj.x, startProj.y);
          ctx.lineTo(endProj.x, endProj.y);
          ctx.stroke();

          // Glowing laser halo
          ctx.shadowBlur = 15;
          ctx.shadowColor = winnerRef.current === "X" ? "#06b6d4" : "#a855f7";
          ctx.strokeStyle = winnerRef.current === "X" ? "rgba(6, 182, 212, 0.6)" : "rgba(168, 85, 247, 0.6)";
          ctx.lineWidth = 8.5;
          ctx.beginPath();
          ctx.moveTo(startProj.x, startProj.y);
          ctx.lineTo(endProj.x, endProj.y);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleCanvasTouchEnd);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [board, currentPlayer, winner, hoveredCellIndex]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
    >
      {/* 3D Game Score HUD Bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 border border-slate-900/60 bg-slate-950/40 rounded-xl backdrop-blur-[4px] z-20">
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-slate-500 font-bold uppercase">SCORE:</span>
          <span className="text-cyan-400 font-extrabold">{scores.player} W</span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-400 font-extrabold">{scores.cpu} CPU</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{scores.draws} D</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded border border-slate-900 bg-slate-950/80">
          <div className={`w-1.5 h-1.5 rounded-full ${isCpuThinking ? "bg-purple-500 animate-pulse" : currentPlayer === "X" ? "bg-cyan-400 animate-pulse" : "bg-purple-400 animate-pulse"}`} />
          <span className={isCpuThinking ? "text-purple-400" : currentPlayer === "X" ? "text-cyan-400" : "text-purple-400"}>
            {winner ? "GAME OVER" : isCpuThinking ? "CPU Scan..." : "YOUR TURN"}
          </span>
        </div>
      </div>

      {/* Main 3D Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full transition-transform duration-300"
        style={{
          transform: isHovered ? "scale(1.02)" : "scale(1)",
        }}
      />

      {/* Game Over Modal / Result Overlay and Reset button */}
      {winner && (
        <div className="absolute inset-0 bg-slate-950/75 border border-slate-900 rounded-3xl flex flex-col items-center justify-center p-6 backdrop-blur-md z-30 animate-fade-in">
          <span className="text-[10px] font-mono font-bold tracking-widest text-violet-500 uppercase">
            Match Report:
          </span>
          <h4 className="text-2xl font-sans font-extrabold text-white mt-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
            {winner === "X" && (
              <>
                <span className="text-cyan-400">Victor Secured!</span>
                <span className="text-sm">🏆</span>
              </>
            )}
            {winner === "O" && (
              <>
                <span className="text-purple-400">AI Prevails</span>
                <span className="text-sm">🧠</span>
              </>
            )}
            {winner === "DRAW" && (
              <>
                <span className="text-slate-400">Draw State</span>
                <span className="text-sm">🤝</span>
              </>
            )}
          </h4>

          <button
            onClick={resetGame}
            className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 text-slate-300 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 cursor-pointer relative group shadow-lg"
          >
            <span>Scan Rematch</span>
            <svg
              className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-185 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H12m0 0v5"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Manual Rematch Button in non-modal floating style */}
      {!winner && (board.some(c => c !== null) || scores.player > 0 || scores.cpu > 0) && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={resetGame}
            className="px-4 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-black/60 hover:bg-black/80 border border-slate-900 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer shadow flex items-center gap-1.5"
          >
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
}
