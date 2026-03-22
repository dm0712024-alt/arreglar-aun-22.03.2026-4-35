import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import aboutImage from "@/assets/about-image.jpg";
import { useLanguage } from "@/context/LanguageContext";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-gradient-subtle py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="perspective-1000 relative"
          >
            <div className="preserve-3d relative">
              <div className="absolute -inset-4 rounded-2xl bg-accent/20" style={{ transform: "translateZ(-20px)" }} />
              <img
                src={aboutImage}
                alt="Sobre Hemerza - Activewear y Swimwear premium"
                className="relative rounded-2xl shadow-elegant object-cover w-full aspect-[3/4]"
                loading="lazy"
                style={{ transform: "translateZ(10px)" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("about.label")}</p>
            <h2 className="mb-6 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {t("about.title")}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">{t("about.p1")}</p>
              <p className="leading-relaxed">{t("about.p2")}</p>
              <p className="leading-relaxed">{t("about.p3")}</p>
            </div>
            <div className="mt-8 flex gap-12 rounded-xl border border-border bg-card/50 p-5 shadow-card-3d backdrop-blur-sm">
              <div>
                <p className="font-serif text-3xl font-bold text-gradient-gold">100%</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("about.quality")}</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-gradient-gold">&#9825;</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("about.love")}</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-gradient-gold">24/7</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("about.support")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
