import { clsx, type ClassValue } from "clsx";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import PongsabutraLogo from "../assets/logo/pongsabutra-logo.webp";
import NattamonLogo from "../assets/logo/nattamon-logo.webp";
import AndroidIcon from "../assets/icons/android.svg?react";
import CreditCardIcon from "../assets/icons/credit-card.svg?react";
import EthIcon from "../assets/icons/eth.svg?react";
import GameIcon from "../assets/icons/game.svg?react";
import LotionIcon from "../assets/icons/lotion.svg?react";
import PandaIcon from "../assets/icons/panda.svg?react";
import RainbowIcon from "../assets/icons/rainbow.svg?react";
import TteokbokkiIcon from "../assets/icons/tteokbokki.svg?react";
import UnicornIcon from "../assets/icons/unicorn.svg?react";
import VrIcon from "../assets/icons/vr.svg?react";
import CreditCardFront from "../assets/credit-card/front.svg?react";
import CreditCardBack from "../assets/credit-card/back.svg?react";
import { useLanguage } from "../hooks/language";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { t } = useLanguage();

  useEffect(() => {
    // 14/06/2026 07:39:00 (Bangkok time is UTC+7)
    const target = new Date("2026-06-14T07:39:00+07:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 sm:gap-6 text-center justify-center mt-2 mb-2">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="w-8 h-8 sm:w-14 sm:h-14 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm border border-white/50 dark:border-gray-700/50">
            <span className="text-xl sm:text-2xl font-mono font-bold text-gray-800 dark:text-gray-100">
              {value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2 font-bold">
            {t(unit)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CreditCard() {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto aspect-[1.586/1] group mb-12 cursor-pointer">
      <motion.div
        ref={cardRef}
        className="w-full h-full relative preserve-3d transition-transform duration-700 ease-out"
        style={{
          rotateY: isFlipped ? 180 : 0,
          rotateX: mousePos.y * -0.05,
          rotateZ: mousePos.x * 0.05,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsFlipped(!isFlipped);
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl shadow-2xl bg-linear-to-t from-lime-300 to-pink-400">
          <CreditCardFront width="100%" height="100%" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl shadow-2xl"
          style={{ transform: "rotateY(180deg)" }}
        >
          <CreditCardBack width="100%" height="100%" />
        </div>
      </motion.div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 animate-pulse">
        {t("tapToFlip")}
      </p>
    </div>
  );
}

function Marquee({
  icons: Icons,
  direction = "left",
  color = "gray",
  className,
}: {
  icons: any[];
  direction?: "left" | "right";
  color?: string;
  className?: string;
}) {
  const iconSet = [...Icons, ...Icons, ...Icons, ...Icons];
  const colorMap = {
    pink: "text-pink-400 dark:text-pink-500",
    lime: "text-lime-400 dark:text-lime-500",
  };

  return (
    <div className={cn("overflow-hidden w-full", className)}>
      <div
        className={cn(
          "flex w-max",
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right",
        )}
      >
        <div className="flex gap-12 sm:gap-24 px-6 sm:px-12">
          {iconSet.map((Icon, i) => (
            <Icon
              key={`set1-${i}`}
              className={cn(
                "w-8 h-8 sm:w-12 sm:h-12 opacity-30",
                colorMap[color as keyof typeof colorMap],
              )}
            />
          ))}
        </div>
        <div className="flex gap-12 sm:gap-24 px-6 sm:px-12">
          {iconSet.map((Icon, i) => (
            <Icon
              key={`set2-${i}`}
              className={cn(
                "w-8 h-8 sm:w-12 sm:h-12 opacity-30",
                colorMap[color as keyof typeof colorMap],
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Top flap rotates up and fades out slightly
  const topRotateX = useTransform(smoothProgress, [0, 0.4], [0, -110]);
  const topOpacity = useTransform(smoothProgress, [0.3, 0.5], [1, 0]);
  const topY = useTransform(smoothProgress, [0, 0.4], [0, -200]);

  // Bottom flap rotates down and fades out slightly
  const bottomRotateX = useTransform(smoothProgress, [0, 0.4], [0, 110]);
  const bottomOpacity = useTransform(smoothProgress, [0.3, 0.5], [1, 0]);
  const bottomY = useTransform(smoothProgress, [0, 0.4], [0, 200]);

  // Inside content scales up and fades in
  const insideScale = useTransform(smoothProgress, [0.1, 0.5], [0.8, 1]);
  const insideOpacity = useTransform(smoothProgress, [0.1, 0.4], [0, 1]);
  const insideY = useTransform(smoothProgress, [0, 0.5], [50, 0]);

  const handleCoverClick = () => {
    // Only scroll if we are near the top (cover is closed)
    if (window.scrollY < window.innerHeight * 0.5) {
      window.scrollTo({
        top: window.innerHeight * 1.5,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-[250vh] relative bg-[#FDFBF7] dark:bg-gray-900 transition-colors duration-500"
    >
      <div
        className="sticky top-0 h-screen overflow-hidden perspective-1000 flex items-center justify-center"
        // onClick={handleConfetti}
        onClick={handleCoverClick}
      >
        {/* The Inside (Revealed Content) */}
        <motion.div
          style={{
            scale: insideScale,
            opacity: insideOpacity,
            y: insideY,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center z-0 px-4"
        >
          <div className="text-center mb-2">
            <h2 className="font-serif text-3xl md:text-5xl text-gray-800 dark:text-gray-100 mb-2">
              {t("invited")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 tracking-widest uppercase text-sm mb-2">
              {t("weddingOf")}
            </p>
          </div>

          <CreditCard />

          <div className="inline-block border-y border-gray-300 dark:border-gray-700 py-2">
            <p className="font-mono text-2xl tracking-[0.2em] text-gray-700 dark:text-gray-300">
              {t("weddingDate")}
            </p>
          </div>

          <Countdown />

          <div className="mb-2 z-10">
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Jan+%26+Boom+Wedding&dates=20260614T003900Z/20260614T070000Z&details=Celebrate+with+us!&location=Rin+at+Raintree,+276+Rama+9+Soi+17,+Bangkapi,+Huai+Khwang,+Bangkok+10310"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <CalendarPlus className="w-4 h-4" />
              {t("addToCalendar")}
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 sm:bottom-4 flex flex-col items-center text-gray-400 dark:text-gray-500"
          >
            <span className="text-xs uppercase tracking-widest mb-2">
              {t("scroll")}
            </span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </motion.div>

        {/* Top Flap (Cover) */}
        <motion.div
          style={{
            rotateX: topRotateX,
            opacity: topOpacity,
            y: topY,
            transformOrigin: "top",
          }}
          className="absolute top-0 left-0 w-full h-1/2 bg-[#FDFBF7] dark:bg-gray-900 z-25 flex flex-col items-center justify-end pb-8 border-b border-gray-200/50 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-colors duration-500"
        >
          {/* Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-5 dark:opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="absolute inset-0 w-full h-full flex flex-col justify-evenly opacity-80 pointer-events-none overflow-hidden py-4 bg-[#fffafe]">
            <Marquee
              icons={[
                UnicornIcon,
                LotionIcon,
                CreditCardIcon,
                RainbowIcon,
                TteokbokkiIcon,
              ]}
              color="pink"
              direction="left"
            />
            <Marquee
              icons={[
                UnicornIcon,
                LotionIcon,
                CreditCardIcon,
                RainbowIcon,
                TteokbokkiIcon,
              ]}
              color="pink"
              direction="right"
            />
            <Marquee
              icons={[
                UnicornIcon,
                LotionIcon,
                CreditCardIcon,
                RainbowIcon,
                TteokbokkiIcon,
              ]}
              color="pink"
              direction="left"
            />
            <Marquee
              icons={[
                UnicornIcon,
                LotionIcon,
                CreditCardIcon,
                RainbowIcon,
                TteokbokkiIcon,
              ]}
              color="pink"
              direction="right"
            />
            <Marquee
              icons={[
                UnicornIcon,
                LotionIcon,
                CreditCardIcon,
                RainbowIcon,
                TteokbokkiIcon,
              ]}
              color="pink"
              direction="left"
            />
            <Marquee
              icons={[
                UnicornIcon,
                LotionIcon,
                CreditCardIcon,
                RainbowIcon,
                TteokbokkiIcon,
              ]}
              color="pink"
              direction="right"
            />
          </div>

          <div className="relative z-10 max-w-120 px-4 -mb-12 mr-9">
            <img src={NattamonLogo} alt="nattamon" />
          </div>
        </motion.div>

        {/* Bottom Flap (Cover) */}
        <motion.div
          style={{
            rotateX: bottomRotateX,
            opacity: bottomOpacity,
            y: bottomY,
            transformOrigin: "bottom",
          }}
          className="absolute bottom-0 left-0 w-full h-1/2 bg-[#FDFBF7] dark:bg-gray-900 z-20 flex flex-col items-center justify-start pt-8 border-t border-gray-200/50 dark:border-gray-800 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] transition-colors duration-500"
        >
          {/* Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-5 dark:opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10 max-w-140 px-4 -mt-7 ml-9">
            <img src={PongsabutraLogo} alt="pongsabutra" />
          </div>

          <div className="absolute inset-0 w-full h-full flex flex-col justify-evenly opacity-80 pointer-events-none overflow-hidden py-4 bg-[#fafff1]">
            <Marquee
              icons={[PandaIcon, AndroidIcon, EthIcon, GameIcon, VrIcon]}
              color="lime"
              direction="right"
            />
            <Marquee
              icons={[PandaIcon, AndroidIcon, EthIcon, GameIcon, VrIcon]}
              color="lime"
              direction="left"
            />
            <Marquee
              icons={[PandaIcon, AndroidIcon, EthIcon, GameIcon, VrIcon]}
              color="lime"
              direction="right"
            />

            <Marquee
              icons={[PandaIcon, AndroidIcon, EthIcon, GameIcon, VrIcon]}
              color="lime"
              direction="left"
            />
            <Marquee
              icons={[PandaIcon, AndroidIcon, EthIcon, GameIcon, VrIcon]}
              color="lime"
              direction="right"
            />

            <Marquee
              icons={[PandaIcon, AndroidIcon, EthIcon, GameIcon, VrIcon]}
              color="lime"
              direction="left"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 sm:bottom-4 flex flex-col items-center text-gray-800 dark:text-white"
          >
            <span className="text-xs uppercase tracking-widest mb-2">
              {t("scroll")}
            </span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
