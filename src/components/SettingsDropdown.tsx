import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sun, Moon, Globe, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

interface SettingsDropdownProps {
  scrolled: boolean;
}

const SettingsDropdown = ({ scrolled }: SettingsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all backdrop-blur-sm hover:border-accent hover:text-accent ${
          scrolled ? "border-border text-foreground" : "border-primary-foreground/20 text-primary-foreground/80"
        }`}
        aria-label="Configuración"
      >
        <Settings className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ clipPath: "circle(0% at calc(100% - 100px) 28px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 100px) 28px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 100px) 28px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex flex-col bg-background"
            >
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="flex items-center justify-between border-b border-border px-6 py-5 md:px-12"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                    <Settings className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    {language === "es" ? "Configuración" : "Settings"}
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all active:scale-95"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>

              <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12">
                <div className="mx-auto max-w-md space-y-6">
                  {/* Language */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <Globe className="mr-1.5 inline h-3.5 w-3.5" />
                      {language === "es" ? "Idioma" : "Language"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLanguage("es")}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95 ${
                          language === "es"
                            ? "bg-accent text-accent-foreground shadow-glow-gold"
                            : "border border-border text-muted-foreground hover:border-accent hover:text-foreground"
                        }`}
                      >
                        Español
                      </button>
                      <button
                        onClick={() => setLanguage("en")}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95 ${
                          language === "en"
                            ? "bg-accent text-accent-foreground shadow-glow-gold"
                            : "border border-border text-muted-foreground hover:border-accent hover:text-foreground"
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </motion.div>

                  {/* Theme */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.4 }}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {theme === "light" ? <Sun className="mr-1.5 inline h-3.5 w-3.5" /> : <Moon className="mr-1.5 inline h-3.5 w-3.5" />}
                      {language === "es" ? "Tema" : "Theme"}
                    </p>
                    <button
                      onClick={toggleTheme}
                      className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium text-card-foreground transition-all hover:border-accent active:scale-98"
                    >
                      <span>{theme === "light" ? (language === "es" ? "Modo Claro" : "Light Mode") : (language === "es" ? "Modo Oscuro" : "Dark Mode")}</span>
                      <div className="relative h-6 w-11 rounded-full bg-muted transition-colors">
                        <motion.div
                          animate={{ x: theme === "dark" ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-accent shadow-sm"
                        />
                      </div>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsDropdown;
