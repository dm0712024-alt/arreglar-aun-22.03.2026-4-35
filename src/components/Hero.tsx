import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleScrollToCollection = () => {
    document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
  };

  const title = t("hero.title");

  const letterVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.8 + i * 0.03, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    }),
  };

  return (
    <section ref={ref} id="hero" className="relative min-h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hemerza Swim & Sport - Colección premium de swimwear y activewear"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-gold-light"
        >
          {t("hero.subtitle")}
        </motion.p>

        <h1 className="mb-6 max-w-4xl font-serif text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          {title.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : undefined }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mb-10 max-w-xl text-lg font-light text-primary-foreground/70"
        >
          {t("hero.description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <button
            onClick={handleScrollToCollection}
            className="group relative overflow-hidden rounded-full border border-primary-foreground/20 px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-glow-gold"
          >
            <span className="relative z-10">{t("hero.collection")}</span>
          </button>

          <a
            href="#products"
            className="group flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-accent-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-gold"
          >
            <ShoppingBag className="h-4 w-4" />
            {t("hero.order")}
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary-foreground/40"
          >
            {t("hero.scroll")}
          </motion.span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-accent/80 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
