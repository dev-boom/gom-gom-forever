import { Facebook, Instagram, MapPin, X } from "lucide-react";
import { useState } from "react";
import map from "../assets/map/map.webp";
import plush from "../assets/value-proposition/plush.webp";
import tree from "../assets/value-proposition/tree.webp";
import utensil from "../assets/value-proposition/utensils.webp";
import { useLanguage } from "../hooks/language";
import { Link } from "react-router-dom";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function EventDetails() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors duration-500">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF66B2]/10 dark:bg-[#FF66B2]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C1E1A6]/20 dark:bg-[#C1E1A6]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Value Proposition */}
        <div className="mb-24 text-center">
          <h3 className="text-[#FF66B2] font-black text-3xl md:text-5xl italic tracking-tight mb-8">
            {t("valueProp")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 rounded-3xl bg-[#C1E1A6]/20 dark:bg-[#C1E1A6]/10 hover:bg-[#C1E1A6]/30 dark:hover:bg-[#C1E1A6]/20 transition-colors">
              <img className="max-w-30" src={utensil} alt="utensil" />
              <h4 className="font-bold text-lg text-[#8CBF69]">{t("lunch")}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {t("lunchDesc")}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t("lunchSub")}
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-3xl bg-[#C1E1A6]/20 dark:bg-[#C1E1A6]/10 hover:bg-[#C1E1A6]/30 dark:hover:bg-[#C1E1A6]/20 transition-colors">
              <img className="max-w-30" src={plush} alt="plush" />
              <h4 className="font-bold text-lg text-[#8CBF69]">{t("lucky")}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {t("luckyDesc")}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t("luckySub")}
              </p>

              {/* Trigger Button */}
              <Link
                to="/lucky-doll"
                className="mt-4 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full text-xs font-bold text-[#8CBF69] border border-[#8CBF69]/30 hover:bg-[#8CBF69] hover:text-white transition-all shadow-sm"
              >
                {t("luckyButton")}
              </Link>
            </div>

            <div className="flex flex-col items-center p-6 rounded-3xl bg-[#C1E1A6]/20 dark:bg-[#C1E1A6]/10 hover:bg-[#C1E1A6]/30 dark:hover:bg-[#C1E1A6]/20 transition-colors">
              <img className="max-w-30" src={tree} alt="tree" />
              <h4 className="font-bold text-lg text-[#8CBF69]">{t("grass")}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {t("grassDesc")}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {t("grassSub")}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start bg-[#C1E1A6]/20 dark:bg-[#C1E1A6]/10 p-8 md:p-12 rounded-[3rem]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <h3 className="font-serif text-3xl text-gray-800 dark:text-gray-100">
                {t("location")}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed whitespace-pre-line">
              {t("address")}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="font-mono text-lg font-bold text-gray-800 dark:text-gray-200 w-20 pt-1">
                  07:39
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">
                    {t("khanMak")}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("roomTarn")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="font-mono text-lg font-bold text-gray-800 dark:text-gray-200 w-20 pt-1">
                  08:39
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">
                    {t("tea")}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("roomTarn")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="font-mono text-lg font-bold text-gray-800 dark:text-gray-200 w-20 pt-1">
                  11:00
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">
                    {t("lunchTime")}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("roomSila")}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-10 rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative group bg-[#FDFBF7] dark:bg-gray-900">
              <div className="aspect-4/3 relative flex items-center justify-center bg-[#e5e3df] dark:bg-gray-800">
                <img src={map} />
              </div>

              <div className="w-full p-4 flex justify-center">
                <a
                  href="https://maps.app.goo.gl/9RjTGLHdptg72VaG6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-6 py-3 rounded-full font-bold text-gray-800 dark:text-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,102,178,0.2)] transition-all flex items-center gap-2 border border-gray-100 dark:border-gray-700 text-sm whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 text-[#FF66B2]" />
                  {t("openMap")}
                </a>
              </div>
            </div>
          </div>

          {/* Dress Code & Hashtags */}
          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 uppercase tracking-widest text-sm">
                {t("dressCode")}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {t("sentai")}
              </p>
              <div className="flex justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF3B30] shadow-inner"></div>
                <div className="w-10 h-10 rounded-full bg-[#007AFF] shadow-inner"></div>
                <div className="w-10 h-10 rounded-full bg-[#FFCC00] shadow-inner"></div>
                <div className="w-10 h-10 rounded-full bg-[#34C759] shadow-inner"></div>
                <div className="w-10 h-10 rounded-full bg-[#FF66B2] shadow-inner"></div>
              </div>
              <p className="mt-8 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {t("sunday")} 14/06/2026
              </p>
            </div>

            {/* Hashtag Links */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors">
              <p className="text-[#FF66B2] font-bold text-xl tracking-wider mb-6">
                #forevergomgom
              </p>
              <div className="flex flex-col justify-center gap-4">
                <a
                  href="https://www.instagram.com/explore/tags/forevergomgom/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-linear-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-bold shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
                <a
                  href="https://www.facebook.com/hashtag/forevergomgom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#1877F2] text-white font-bold shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
                <a
                  href="https://www.tiktok.com/tag/forevergomgom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-black dark:bg-gray-800 text-white font-bold shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm border border-gray-700"
                >
                  <TikTokIcon className="w-4 h-4" /> TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
