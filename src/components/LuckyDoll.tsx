import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PIXEL_SCALE = 4;
const DROP_ZONE_WIDTH = 140;

const PALETTE: Record<string, string> = {
  "0": "#FFFFFF", // White
  "1": "#111111", // Black
  "2": "#FFD700", // Gold
  "3": "#FF69B4", // Pink
  "4": "#FFB6C1", // Light Pink
  "5": "#AAAAAA", // Light Gray
  "6": "#555555", // Dark Gray
  "7": "#87CEEB", // Sky Blue
  "8": "#e74c3c", // Red
};

const PANDA = [
  ".11........11.",
  "1111......1111",
  "1111.0000.1111",
  ".11.000000.11.",
  "...01100110...",
  "...01100110...",
  "...00011000...",
  "....000000....",
  "..1110000111..",
  ".111100001111.",
  ".111100001111.",
  "..11.1111.11..",
  ".....1111.....",
  ".....1111.....",
  "....11..11....",
  "..............",
];

const UNICORN = [
  ".......2........",
  "......22........",
  "......2.........",
  "....0000........",
  "...000000.33....",
  "..00700003333...",
  "..00000000.33...",
  "...0000000......",
  "....000000......",
  "...00000000.....",
  "..0000000000....",
  "..0000..0000....",
  "..0000..0000....",
  "..4444..4444....",
  "................",
  "................",
];

const STAR = [
  ".......2........",
  "......222.......",
  ".....22222......",
  "....2222222.....",
  "2222222222222222",
  ".22222222222222.",
  "..222122221222..",
  "...2222222222...",
  "....22211222....",
  "...2222..2222...",
  "..222......222..",
  ".22..........22.",
  "2..............2",
  "................",
  "................",
  "................",
];

const BOMB = [
  "........8.......",
  ".......828......",
  "........8.......",
  ".......5........",
  ".....111111.....",
  "...1111111111...",
  "..111111111111..",
  "..110011111111..",
  "..110111111111..",
  "..111111111111..",
  "..111111111111..",
  "...1111111111...",
  ".....111111.....",
  "................",
  "................",
  "................",
];

const CLAW_OPEN = [
  "......66......",
  "......66......",
  ".....6666.....",
  "....65..56....",
  "...65....56...",
  "..65......56..",
  "..6........6..",
  ".6..........6.",
  "6............6",
];

const CLAW_CLOSED = [
  "......66......",
  "......66......",
  ".....6666.....",
  "....65..56....",
  "...65....56...",
  "...6......6...",
  "...6......6...",
  "...6......6...",
  "....66..66....",
];

type GameState = {
  status: "START" | "PLAYING" | "GAME_OVER" | "NAME_ENTRY";
  score: number;
  highScores: { name: string; score: number }[];
  timeLeft: number;
  claw: {
    x: number;
    y: number;
    state:
      | "IDLE"
      | "DROPPING"
      | "GRABBING"
      | "RAISING"
      | "RETURNING"
      | "DROPPING_PRIZE";
    grabbedPlush: any | null;
    timer: number;
    fallTimer: number;
  };
  plushies: any[];
  fallingPlushies: any[];
  floatingTexts: {
    x: number;
    y: number;
    text: string;
    life: number;
    color: string;
  }[];
  keys: {
    isPressed: boolean;
  };
};

export default function LuckyDoll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState("AAA");

  const state = useRef<GameState>({
    status: "START",
    score: 0,
    highScores: [],
    timeLeft: 60,
    claw: {
      x: DROP_ZONE_WIDTH + 30,
      y: 40,
      state: "IDLE",
      grabbedPlush: null,
      timer: 0,
      fallTimer: -1,
    },
    plushies: [],
    fallingPlushies: [],
    floatingTexts: [],
    keys: {
      isPressed: false,
    },
  });

  const initGame = () => {
    const plushies = [];
    const startY = CANVAS_HEIGHT - 80;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 9; col++) {
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        const rand = Math.random();
        let type = "PANDA";
        if (rand > 0.95) type = "STAR";
        else if (rand > 0.85) type = "BOMB";
        else if (rand > 0.7) type = "UNICORN";

        plushies.push({
          id: Math.random().toString(),
          type,
          x: DROP_ZONE_WIDTH + 20 + col * 65 + (row % 2) * 32 + offsetX,
          y: startY - row * 45 + offsetY,
          width: 56,
          height: 64,
          isCaught: false,
        });
      }
    }
    // Sort by Y so lower ones are drawn in front
    plushies.sort((a, b) => a.y - b.y);

    state.current = {
      ...state.current,
      status: "PLAYING",
      score: 0,
      timeLeft: 60,
      claw: {
        x: DROP_ZONE_WIDTH + 30,
        y: 40,
        state: "IDLE",
        grabbedPlush: null,
        timer: 0,
        fallTimer: -1,
      },
      plushies,
      fallingPlushies: [],
      floatingTexts: [],
    };
  };

  const handlePressDown = () => {
    if (
      state.current.status === "START" ||
      state.current.status === "GAME_OVER"
    ) {
      initGame();
    } else {
      state.current.keys.isPressed = true;
    }
  };

  const handlePressUp = () => {
    if (
      state.current.status === "PLAYING" &&
      state.current.claw.state === "IDLE" &&
      state.current.keys.isPressed
    ) {
      state.current.claw.state = "DROPPING";
    }
    state.current.keys.isPressed = false;
  };

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const scoreRef = collection(db, "game/lucky-doll/score");
        const q = query(scoreRef, orderBy("score", "desc"), limit(10));

        const querySnapshot = await getDocs(q);
        const highScores = querySnapshot.docs.map((doc) => ({
          name: doc.data().name,
          score: doc.data().score,
        }));
        state.current.highScores = highScores;
      } catch (error) {
        console.error("Error fetching score:", error);
      }
    };

    fetchScore();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.current.status === "NAME_ENTRY") return;
      if (e.code === "Space" && !e.repeat) {
        handlePressDown();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (state.current.status === "NAME_ENTRY") return;
      if (e.code === "Space") {
        handlePressUp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const CLAW_SPEED_X = 0.3;
    const CLAW_SPEED_Y = 0.4;
    const CLAW_MIN_Y = 40;
    const CLAW_MAX_Y = CANVAS_HEIGHT - 60;

    const update = (dt: number) => {
      const s = state.current;
      if (s.status !== "PLAYING") return;

      s.timeLeft -= dt / 1000;
      if (s.timeLeft <= 0) {
        s.timeLeft = 0;

        const isTop10 =
          s.score > 0 &&
          (s.highScores.length < 10 ||
            s.score > (s.highScores[s.highScores.length - 1]?.score || 0));
        if (isTop10) {
          s.status = "NAME_ENTRY";
          setFinalScore(s.score);
          setShowNameEntry(true);
        } else {
          s.status = "GAME_OVER";
        }
      }

      const claw = s.claw;

      switch (claw.state) {
        case "IDLE":
          if (s.keys.isPressed) {
            claw.x += CLAW_SPEED_X * dt;
            claw.x = Math.min(CANVAS_WIDTH - 30, claw.x);
          }
          break;

        case "DROPPING":
          claw.y += CLAW_SPEED_Y * dt;

          let hit = false;
          for (let i = s.plushies.length - 1; i >= 0; i--) {
            const p = s.plushies[i];
            if (!p.isCaught) {
              const cx = claw.x;
              const cy = claw.y + 36;
              if (
                cx > p.x &&
                cx < p.x + p.width &&
                cy > p.y &&
                cy < p.y + p.height
              ) {
                claw.state = "GRABBING";
                claw.grabbedPlush = p;
                p.isCaught = true;
                hit = true;
                // 1/4 chance to fall
                claw.fallTimer =
                  Math.random() < 0.25 ? Math.random() * 1500 + 500 : -1;
                break;
              }
            }
          }

          if (!hit && claw.y >= CLAW_MAX_Y) {
            claw.state = "RAISING";
          }
          break;

        case "GRABBING":
          claw.state = "RAISING";
          break;

        case "RAISING":
          claw.y -= CLAW_SPEED_Y * dt;
          if (claw.grabbedPlush) {
            claw.grabbedPlush.x = claw.x - claw.grabbedPlush.width / 2;
            claw.grabbedPlush.y = claw.y + 20;

            if (claw.fallTimer > 0) {
              claw.fallTimer -= dt;
              if (claw.fallTimer <= 0) {
                s.fallingPlushies.push({ ...claw.grabbedPlush, vy: 0 });
                s.plushies = s.plushies.filter(
                  (p) => p.id !== claw.grabbedPlush!.id,
                );
                claw.grabbedPlush = null;
              }
            }
          }
          if (claw.y <= CLAW_MIN_Y) {
            claw.y = CLAW_MIN_Y;
            claw.state = "RETURNING";
          }
          break;

        case "RETURNING":
          claw.x -= CLAW_SPEED_X * dt;
          if (claw.grabbedPlush) {
            claw.grabbedPlush.x = claw.x - claw.grabbedPlush.width / 2;

            if (claw.fallTimer > 0) {
              claw.fallTimer -= dt;
              if (claw.fallTimer <= 0) {
                s.fallingPlushies.push({ ...claw.grabbedPlush, vy: 0 });
                s.plushies = s.plushies.filter(
                  (p) => p.id !== claw.grabbedPlush!.id,
                );
                claw.grabbedPlush = null;
              }
            }
          }
          if (claw.x <= DROP_ZONE_WIDTH / 2) {
            claw.x = DROP_ZONE_WIDTH / 2;
            claw.state = "DROPPING_PRIZE";
            claw.timer = 500;
            if (claw.grabbedPlush) {
              s.fallingPlushies.push({
                ...claw.grabbedPlush,
                vy: 0,
              });
              s.plushies = s.plushies.filter(
                (p) => p.id !== claw.grabbedPlush!.id,
              );
              claw.grabbedPlush = null;
            }
          }
          break;

        case "DROPPING_PRIZE":
          claw.timer -= dt;
          if (claw.timer <= 0) {
            claw.state = "IDLE";
            claw.x = DROP_ZONE_WIDTH + 30; // Reset position for next turn
          }
          break;
      }

      // Update falling plushies
      for (let i = s.fallingPlushies.length - 1; i >= 0; i--) {
        const p = s.fallingPlushies[i];
        p.vy += 0.002 * dt;
        p.y += p.vy * dt;

        if (p.x < DROP_ZONE_WIDTH) {
          if (p.y > CANVAS_HEIGHT) {
            if (p.type === "PANDA") {
              s.score += 10;
              s.floatingTexts.push({
                x: p.x,
                y: CANVAS_HEIGHT - 50,
                text: "+10",
                life: 1000,
                color: "#FFFFFF",
              });
            }
            if (p.type === "UNICORN") {
              s.score += 50;
              s.floatingTexts.push({
                x: p.x,
                y: CANVAS_HEIGHT - 50,
                text: "+50",
                life: 1000,
                color: "#FF69B4",
              });
            }
            if (p.type === "STAR") {
              s.score *= 2;
              s.floatingTexts.push({
                x: p.x,
                y: CANVAS_HEIGHT - 50,
                text: "2X SCORE!",
                life: 1500,
                color: "#FFD700",
              });
            }
            if (p.type === "BOMB") {
              s.score -= 20;
              s.floatingTexts.push({
                x: p.x,
                y: CANVAS_HEIGHT - 50,
                text: "-20",
                life: 1000,
                color: "#e74c3c",
              });
            }
            s.fallingPlushies.splice(i, 1);
          }
        } else {
          if (p.y > CANVAS_HEIGHT - 80) {
            s.floatingTexts.push({
              x: p.x,
              y: p.y - 20,
              text: "OOPS!",
              life: 1000,
              color: "#e74c3c",
            });
            p.y = CANVAS_HEIGHT - 80 - Math.random() * 20;
            p.isCaught = false;
            p.vy = 0;
            s.plushies.push(p);
            s.fallingPlushies.splice(i, 1);
          }
        }
      }

      // Update floating texts
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.life -= dt;
        ft.y -= 0.05 * dt;
        if (ft.life <= 0) {
          s.floatingTexts.splice(i, 1);
        }
      }
    };

    const drawPixelArt = (
      ctx: CanvasRenderingContext2D,
      art: string[],
      x: number,
      y: number,
      scale: number,
    ) => {
      for (let r = 0; r < art.length; r++) {
        for (let c = 0; c < art[r].length; c++) {
          const char = art[r][c];
          if (char !== ".") {
            ctx.fillStyle = PALETTE[char];
            ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
          }
        }
      }
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
      const s = state.current;

      // Background
      ctx.fillStyle = "#2c3e50";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Drop Zone
      ctx.fillStyle = "#34495e";
      ctx.fillRect(0, 0, DROP_ZONE_WIDTH, CANVAS_HEIGHT);

      // Drop Hole
      ctx.fillStyle = "#1a252f";
      ctx.fillRect(20, CANVAS_HEIGHT - 100, DROP_ZONE_WIDTH - 40, 80);

      // Glass reflection
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.moveTo(DROP_ZONE_WIDTH, 0);
      ctx.lineTo(CANVAS_WIDTH, 0);
      ctx.lineTo(CANVAS_WIDTH - 100, CANVAS_HEIGHT);
      ctx.lineTo(DROP_ZONE_WIDTH, CANVAS_HEIGHT);
      ctx.fill();

      // Plushies
      for (const p of s.plushies) {
        const art =
          p.type === "PANDA"
            ? PANDA
            : p.type === "UNICORN"
              ? UNICORN
              : p.type === "STAR"
                ? STAR
                : BOMB;
        drawPixelArt(ctx, art, p.x, p.y, PIXEL_SCALE);
      }

      // Falling Plushies
      for (const p of s.fallingPlushies) {
        const art =
          p.type === "PANDA"
            ? PANDA
            : p.type === "UNICORN"
              ? UNICORN
              : p.type === "STAR"
                ? STAR
                : BOMB;
        drawPixelArt(ctx, art, p.x, p.y, PIXEL_SCALE);
      }

      // Claw Line
      ctx.strokeStyle = "#7f8c8d";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(s.claw.x, 0);
      ctx.lineTo(s.claw.x, s.claw.y);
      ctx.stroke();

      // Claw
      const clawArt =
        s.claw.state === "IDLE" ||
        s.claw.state === "DROPPING" ||
        s.claw.state === "DROPPING_PRIZE"
          ? CLAW_OPEN
          : CLAW_CLOSED;
      drawPixelArt(
        ctx,
        clawArt,
        s.claw.x - (clawArt[0].length * PIXEL_SCALE) / 2,
        s.claw.y,
        PIXEL_SCALE,
      );

      // Floating Texts
      for (const ft of s.floatingTexts) {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.life / 1000);
        ctx.font = '20px "Press Start 2P", "Courier New", monospace';
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x + 28, ft.y);
        ctx.globalAlpha = 1.0;
      }

      // UI
      ctx.fillStyle = "#ecf0f1";
      ctx.font = '24px "Press Start 2P", "Courier New", monospace';
      ctx.textAlign = "left";
      ctx.fillText(`SCORE:${s.score}`, 20, 40);

      ctx.fillStyle = "#f39c12";
      ctx.font = '16px "Press Start 2P", "Courier New", monospace';
      const topScore = s.highScores[0] || { name: "---", score: 0 };
      ctx.fillText(`HI:${topScore.name} ${topScore.score}`, 20, 70);

      ctx.fillStyle = "#ecf0f1";
      ctx.font = '24px "Press Start 2P", "Courier New", monospace';
      ctx.textAlign = "right";
      ctx.fillText(`TIME:${Math.ceil(s.timeLeft)}`, CANVAS_WIDTH - 20, 40);

      if (s.status === "START") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "#f1c40f";
        ctx.textAlign = "center";
        ctx.font = '48px "Press Start 2P", "Courier New", monospace';
        ctx.fillText("CLAW MACHINE", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

        ctx.fillStyle = "#ecf0f1";
        ctx.font = '20px "Press Start 2P", "Courier New", monospace';
        ctx.fillText(
          "Hold SPACE/TAP to Start",
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 20,
        );

        ctx.fillStyle = "#bdc3c7";
        ctx.font = '16px "Press Start 2P", "Courier New", monospace';
        ctx.fillText(
          "Hold to Move | Release to Drop",
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 80,
        );

        ctx.fillText(
          "Panda:10 Unicorn:50 Star:2x Bomb:-20",
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 120,
        );
      } else if (s.status === "GAME_OVER") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = "#f1c40f";
        ctx.textAlign = "center";
        ctx.font = '36px "Press Start 2P", "Courier New", monospace';
        ctx.fillText("LEADERBOARD", CANVAS_WIDTH / 2, 80);

        ctx.font = '20px "Press Start 2P", "Courier New", monospace';
        s.highScores.forEach((hs, i) => {
          ctx.fillStyle =
            hs.name === playerName && hs.score === s.score
              ? "#e74c3c"
              : "#ecf0f1";
          ctx.textAlign = "right";
          ctx.fillText(`${i + 1}.`, CANVAS_WIDTH / 2 - 100, 140 + i * 35);
          ctx.textAlign = "left";
          ctx.fillText(`${hs.name}`, CANVAS_WIDTH / 2 - 60, 140 + i * 35);
          ctx.textAlign = "right";
          ctx.fillText(`${hs.score}`, CANVAS_WIDTH / 2 + 120, 140 + i * 35);
        });

        ctx.fillStyle = "#f1c40f";
        ctx.textAlign = "center";
        ctx.fillText(`YOUR SCORE: ${s.score}`, CANVAS_WIDTH / 2, 520);

        ctx.fillStyle = "#ecf0f1";
        ctx.font = '16px "Press Start 2P", "Courier New", monospace';
        ctx.fillText("Hold SPACE/TAP to Play Again", CANVAS_WIDTH / 2, 560);
      }
    };

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      update(dt);
      draw(ctx);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = state.current;

    s.highScores.push({ name: playerName, score: finalScore });
    s.highScores.sort((a, b) => b.score - a.score);
    s.highScores = s.highScores.slice(0, 10);

    await addDoc(collection(db, "game/lucky-doll/score"), {
      score: finalScore,
      name: playerName,
      updatedAt: new Date(),
    });

    s.status = "GAME_OVER";
    setShowNameEntry(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-6 text-center">
        <h1
          className="text-4xl font-bold text-yellow-400 mb-2"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          8-BIT LUCKY DOLL
        </h1>
        <p className="text-neutral-400">Grab the Pandas and Unicorns!</p>
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-yellow-500/20 border-4 border-neutral-700 select-none">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block bg-neutral-800 w-full max-w-[800px] h-auto cursor-pointer touch-none"
          style={{ imageRendering: "pixelated" }}
          onPointerDown={(e) => {
            e.preventDefault();
            handlePressDown();
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handlePressUp();
          }}
          onPointerLeave={(e) => {
            e.preventDefault();
            handlePressUp();
          }}
        />

        {showNameEntry && (
          <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4 z-50">
            <h2
              className="text-yellow-400 text-2xl md:text-5xl mb-4 text-center"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                lineHeight: "1.5",
              }}
            >
              NEW HIGH SCORE!
            </h2>
            <p
              className="text-white text-lg md:text-2xl mb-8"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              SCORE: {finalScore}
            </p>
            <form
              onSubmit={handleNameSubmit}
              className="flex flex-col items-center w-full max-w-sm"
            >
              <label
                className="text-neutral-400 mb-2 text-center"
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "10px",
                }}
              >
                ENTER YOUR INITIALS
              </label>
              <input
                type="text"
                maxLength={3}
                value={playerName}
                onChange={(e) =>
                  setPlayerName(
                    e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, ""),
                  )
                }
                className="bg-neutral-800 border-4 border-neutral-600 text-white text-center text-3xl md:text-4xl p-3 md:p-4 w-32 md:w-48 mb-6 uppercase focus:outline-none focus:border-yellow-400"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
                autoFocus
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 md:px-8 py-3 md:py-4 rounded font-bold text-lg md:text-xl"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                SUBMIT
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-8 flex md:hidden w-full max-w-[400px] px-4">
        <button
          className="bg-neutral-800 active:bg-neutral-700 text-white w-full py-6 rounded-xl border-2 border-neutral-600 font-bold touch-none select-none"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "14px",
            lineHeight: "1.5",
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            handlePressDown();
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handlePressUp();
          }}
          onPointerLeave={(e) => {
            e.preventDefault();
            handlePressUp();
          }}
        >
          HOLD TO MOVE
          <br />
          RELEASE TO DROP
        </button>
      </div>

      <div className="mt-8 hidden md:flex gap-8 text-neutral-500 text-sm">
        <div className="flex items-center gap-2">
          <kbd className="bg-neutral-800 px-4 py-1 rounded border border-neutral-700">
            SPACE
          </kbd>
          <span>Hold to Move / Release to Drop</span>
        </div>
      </div>
    </div>
  );
}
