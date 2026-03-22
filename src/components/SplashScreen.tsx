import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"logo" | "tagline" | "exit">("logo");
  const { t } = useLanguage();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 2600);
    const t3 = setTimeout(onComplete, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-hero"
        >
          <div className="absolute h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute -top-6 left-1/2 h-px w-16 -translate-x-1/2 bg-accent/60"
            />

            <motion.h1
              className="font-serif text-5xl font-bold tracking-[0.3em] text-primary-foreground sm:text-6xl md:text-7xl"
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              animate={{ letterSpacing: "0.3em", opacity: 1 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            >
              HEMERZA
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute -bottom-6 left-1/2 h-px w-16 -translate-x-1/2 bg-accent/60"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={phase === "tagline" ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-xs font-medium uppercase tracking-[0.4em] text-primary-foreground/50"
          >
            Swim & Sport
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={phase === "tagline" ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 font-serif text-sm italic text-accent/80"
          >
            {t("splash.tagline")}
          </motion.p>

          <motion.div className="absolute bottom-12 h-px w-32 overflow-hidden rounded-full bg-primary-foreground/10">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="h-full w-1/2 bg-accent/50"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SplashScreen;
