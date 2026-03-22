import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const INSTAGRAM_URL = "https://www.instagram.com/hemerza";

const CustomOrders = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="custom-orders" className="relative overflow-hidden bg-gradient-dark py-24 lg:py-32">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

      <div ref={ref} className="container relative mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-light">
            {t("custom.label")}
          </p>
          <h2 className="mx-auto mb-6 max-w-2xl font-serif text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            {t("custom.title")}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-primary-foreground/60">
            {t("custom.description")}
          </p>

          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 rounded-full bg-accent px-10 py-4 font-sans text-base font-semibold text-accent-foreground shadow-glow-gold transition-shadow hover:shadow-[0_0_50px_hsl(43_74%_49%_/_0.5)]"
          >
            <Instagram className="h-5 w-5" />
            {t("custom.cta")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomOrders;
