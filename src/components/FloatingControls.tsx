import { clsx, type ClassValue } from "clsx";
import { Globe, Moon, Sun, Gamepad } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { useLanguage } from "../hooks/language";
import { useTheme } from "../hooks/theme";
import { Link } from "react-router-dom";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function FloatingControls() {
  const { isDark, setIsDark } = useTheme();
  const { lang, setLang } = useLanguage();
  const [showLang, setShowLang] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:scale-105 transition-transform">
        <Link to="/lucky-doll">
          <Gamepad className="w-5 h-5" />
        </Link>
      </button>
      <div className="relative">
        <button
          onClick={() => setShowLang(!showLang)}
          className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:scale-105 transition-transform"
        >
          <Globe className="w-5 h-5" />
        </button>
        {showLang && (
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col w-36">
            <button
              onClick={() => {
                setLang("th");
                setShowLang(false);
              }}
              className={cn(
                "px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-gray-200 font-medium transition-colors",
                lang === "th" && "bg-gray-50 dark:bg-gray-700/50",
              )}
            >
              🇹🇭 ไทย
            </button>
            <button
              onClick={() => {
                setLang("en");
                setShowLang(false);
              }}
              className={cn(
                "px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-gray-200 font-medium transition-colors",
                lang === "en" && "bg-gray-50 dark:bg-gray-700/50",
              )}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => {
                setLang("zh");
                setShowLang(false);
              }}
              className={cn(
                "px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-gray-200 font-medium transition-colors",
                lang === "zh" && "bg-gray-50 dark:bg-gray-700/50",
              )}
            >
              🇭🇰 繁體中文
            </button>
            <button
              onClick={() => {
                setLang("ja");
                setShowLang(false);
              }}
              className={cn(
                "px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-gray-200 font-medium transition-colors",
                lang === "ja" && "bg-gray-50 dark:bg-gray-700/50",
              )}
            >
              🇯🇵 日本語
            </button>
            <button
              onClick={() => {
                setLang("ko");
                setShowLang(false);
              }}
              className={cn(
                "px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-gray-200 font-medium transition-colors",
                lang === "ko" && "bg-gray-50 dark:bg-gray-700/50",
              )}
            >
              🇰🇷 한국어
            </button>
            <button
              onClick={() => {
                setLang("bin");
                setShowLang(false);
              }}
              className={cn(
                "px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-gray-200 font-mono transition-colors",
                lang === "bin" && "bg-gray-50 dark:bg-gray-700/50",
              )}
            >
              💻 101010
            </button>
          </div>
        )}
      </div>
      <button
        onClick={() => setIsDark(!isDark)}
        className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:scale-105 transition-transform"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}
