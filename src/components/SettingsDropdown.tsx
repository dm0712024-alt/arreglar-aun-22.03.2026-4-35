import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

interface SettingsDropdownProps {
  scrolled: boolean;
}

const SettingsDropdown = ({ scrolled }: SettingsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all backdrop-blur-sm hover:border-accent hover:text-accent ${
          scrolled ? "border-border text-foreground" : "border-primary-foreground/20 text-primary-foreground/80"
        }`}
        aria-label="Configuración"
      >
        <Settings className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-elegant"
          >
            {/* Language */}
            <div className="border-b border-border px-4 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Globe className="mr-1.5 inline h-3 w-3" />
                Idioma
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setLanguage("es")}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    language === "es"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    language === "en"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="px-4 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {theme === "light" ? <Sun className="mr-1.5 inline h-3 w-3" /> : <Moon className="mr-1.5 inline h-3 w-3" />}
                Tema
              </p>
              <button
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium text-card-foreground transition-all hover:bg-muted"
              >
                <span>{theme === "light" ? "Modo Claro" : "Modo Oscuro"}</span>
                <div className="relative h-5 w-9 rounded-full bg-muted transition-colors">
                  <motion.div
                    animate={{ x: theme === "dark" ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-accent"
                  />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsDropdown;
