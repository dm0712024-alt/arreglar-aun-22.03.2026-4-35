import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const testimonials = [
    { id: 1, nameKey: "testimonial.1.name", textKey: "testimonial.1.text", rating: 5 },
    { id: 2, nameKey: "testimonial.2.name", textKey: "testimonial.2.text", rating: 5 },
    { id: 3, nameKey: "testimonial.3.name", textKey: "testimonial.3.text", rating: 5 },
    { id: 4, nameKey: "testimonial.4.name", textKey: "testimonial.4.text", rating: 5 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("testimonials.label")}</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        <div className="perspective-1000 preserve-3d mx-auto max-w-2xl rounded-2xl border border-border bg-card/50 p-8 shadow-card-3d backdrop-blur-sm sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="h-5 w-5 fill-accent text-accent" />
                  </motion.div>
                ))}
              </div>
              <p className="mb-6 font-serif text-xl italic leading-relaxed text-foreground sm:text-2xl">
                "{t(testimonials[current].textKey)}"
              </p>
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                — {t(testimonials[current].nameKey)}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-accent" : "w-2 bg-border"
                }`}
                aria-label={`${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
