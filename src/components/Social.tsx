import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.79a4.83 4.83 0 0 1-1-.1z" />
  </svg>
);

const socials = [
  {
    name: "Instagram",
    icon: <Instagram className="h-6 w-6" />,
    url: "https://www.instagram.com/hemerza",
    handle: "@hemerza",
  },
  {
    name: "TikTok",
    icon: <TikTokIcon />,
    url: "https://www.tiktok.com/@hemerzaa",
    handle: "@hemerzaa",
  },
];

const Social = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-subtle py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("social.label")}</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {t("social.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            {t("social.description")}
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, rotateX: 2, rotateY: -3 }}
              className="perspective-1000 preserve-3d flex w-full max-w-xs items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-card-3d transition-all duration-300 hover:shadow-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                {social.icon}
              </div>
              <div>
                <p className="font-semibold text-card-foreground">{social.name}</p>
                <p className="text-sm text-muted-foreground">{social.handle}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Social;
