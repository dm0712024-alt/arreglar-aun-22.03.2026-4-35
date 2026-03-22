import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, MapPin, Mail, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.79a4.83 4.83 0 0 1-1-.1z" />
  </svg>
);

const Footer = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  const footerLinks = [
    { label: t("nav.home"), href: "#hero" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.collections"), href: "#collections" },
    { label: t("nav.catalog"), href: "#products" },
    { label: t("nav.orders"), href: "#custom-orders" },
    { label: t("footer.nav.sizeguide"), href: "#size-guide" },
    { label: t("nav.faq"), href: "#faq" },
  ];

  const handleClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden bg-gradient-dark"
    >
      <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-sport-blue/5 blur-[120px]" />


      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <h3 className="mb-1 font-serif text-3xl font-bold tracking-wider text-primary-foreground">HEMERZA</h3>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-accent/70">Swim & Sport</p>
            <p className="mb-6 text-sm leading-relaxed text-primary-foreground/50">
              {t("footer.brand.desc")}
            </p>
            <p className="font-serif text-base italic text-accent">{t("footer.brand.quote")}</p>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/80">
              {t("footer.nav.title")}
            </h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className="group flex items-center text-left text-sm text-primary-foreground/40 transition-colors hover:text-accent"
                >
                  <span className="mr-2 inline-block h-px w-0 bg-accent transition-all group-hover:w-4" />
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/80">
              {t("footer.contact.title")}
            </h4>
            <div className="flex flex-col gap-4">
              <a href="https://www.instagram.com/hemerza" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-primary-foreground/40 transition-colors hover:text-accent">
                <Instagram className="h-4 w-4 text-accent/60" />
                @hemerza
              </a>
              <a href="https://www.tiktok.com/@hemerzaa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-primary-foreground/40 transition-colors hover:text-accent">
                <TikTokIcon />
                @hemerzaa
              </a>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/40">
                <Mail className="h-4 w-4 text-accent/60" />
                info@hemerza.com
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/40">
                <MapPin className="h-4 w-4 text-accent/60" />
                {t("footer.contact.shipping")}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/80">
              {t("footer.payment.title")}
            </h4>
            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4">
              <p className="text-sm text-primary-foreground/40">{t("footer.payment.methods")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
          <p className="text-xs text-primary-foreground/30">
            © {new Date().getFullYear()} Hemerza Swim & Sport. {t("footer.rights")}
          </p>
          <p className="flex items-center gap-1 text-xs text-primary-foreground/30">
            {t("footer.made")} <Heart className="h-3 w-3 text-accent/60" /> {t("footer.location")}
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
