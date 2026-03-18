import confetti from "canvas-confetti";
import clsx, { ClassValue } from "clsx";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "../hooks/language";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function RSVPSection() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(
    Boolean(localStorage.getItem("submitted")),
  );

  const handleConfetti = (e?: React.MouseEvent) => {
    const x = e ? e.clientX / window.innerWidth : 0.5;
    const y = e ? e.clientY / window.innerHeight : 0.5;

    const heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });
    const unicorn = confetti.shapeFromText({ text: "🦄", scalar: 2 });
    const panda = confetti.shapeFromText({ text: "🐼", scalar: 2 });

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x, y },
      colors: ["#FF66B2", "#FFB3D9", "#C1E1A6", "#ffffff"],
      shapes: [heart, unicorn, panda],
      scalar: 1.2,
      zIndex: 100,
    });
  };

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const nickNameRef = useRef(null);
  const attendeeRef = useRef(null);
  const isBrideGuestRef = useRef(null);
  const isGroomGuestRef = useRef(null);
  const canAttendRef = useRef(null);
  const dietRef = useRef(null);
  const messageRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "rsvp"), {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        nickName: nickNameRef.current.value,
        attendee: attendeeRef.current.value,
        isBrideGuest: isBrideGuestRef.current.checked,
        isGroomGuest: isGroomGuestRef.current.checked,
        canAttend: canAttendRef.current.value === "true",
        diet: dietRef.current.value,
        message: messageRef.current.value,
        updatedAt: new Date(),
      });
      localStorage.setItem("submitted", "true");
      handleConfetti();
      setSubmitted(true);
    } catch (e) {
      alert(
        "Something went wrong. Check your internet or ask Boom (The groom) to fix it",
      );
      console.error(e);
    }
  };

  return (
    <section
      className={cn(
        "py-24 px-6 bg-[#1a1a1a] dark:bg-black text-white relative overflow-hidden transition-colors duration-500",
        submitted && "cursor-pointer",
      )}
      onClick={submitted ? handleConfetti : undefined}
    >
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">{t("rsvp")}</h2>
          <p className="text-gray-400">{t("rsvpDesc")}</p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md p-12 rounded-3xl text-center border border-white/20"
          >
            <CheckCircle2 className="w-16 h-16 text-[#C1E1A6] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">{t("thankYou")}</h3>
            <p className="text-gray-300">{t("recorded")}</p>
            <button className="mt-4 px-4 py-2  bg-gray-800/50 rounded-full text-sm font-bold text-[#8CBF69] border border-[#8CBF69]/30 hover:bg-[#8CBF69] hover:text-white transition-all shadow-sm">
              <Link to="/lucky-doll">{t("warmupGame")}</Link>
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1">
                  {t("fname")}
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF66B2]/50 transition-all"
                  placeholder="Satoshi"
                  ref={firstNameRef}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1">
                  {t("lname")}
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF66B2]/50 transition-all"
                  placeholder="Nakamoto"
                  ref={lastNameRef}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1">
                  {t("nickName")}
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF66B2]/50 transition-all"
                  placeholder="GomGom"
                  ref={nickNameRef}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1">
                  {t("plusOne")}
                </label>
                <select
                  name="attendee"
                  defaultValue="1"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF66B2]/50 transition-all"
                  ref={attendeeRef}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <label className="text-sm text-gray-300 ml-1">
              {t("connection")}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <input
                  type="checkbox"
                  id="isBrideGuest"
                  className="mr-2"
                  ref={isBrideGuestRef}
                />
                <label htmlFor="isBrideGuest">{t("teamBride")}</label>
              </div>

              <div className="space-y-2">
                <input
                  type="checkbox"
                  id="teamGroom"
                  className="mr-2"
                  ref={isGroomGuestRef}
                />
                <label htmlFor="teamGroom">{t("teamGroom")}</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 ml-1">
                {t("attend")}
              </label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF66B2]/50 transition-all appearance-none"
                ref={canAttendRef}
              >
                <option value="true" className="bg-gray-900">
                  {t("yes")}
                </option>
                <option value="false" className="bg-gray-900">
                  {t("no")}
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 ml-1">{t("diet")}</label>
              <input
                type="text"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF66B2]/50 transition-all"
                placeholder={t("dietPlaceholder")}
                ref={dietRef}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 ml-1">
                {t("message")}
              </label>
              <textarea
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF66B2]/50 transition-all resize-none"
                placeholder={t("messagePlaceholder")}
                ref={messageRef}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-[#FF66B2] to-[#C1E1A6] text-gray-900 font-bold text-lg py-4 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(255,102,178,0.3)] cursor-pointer"
            >
              {t("send")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
