import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sun, Moon, Globe, X, User, LogOut } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";

interface SettingsDropdownProps {
  scrolled: boolean;
}

const SettingsDropdown = ({ scrolled }: SettingsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, clearUser } = useUser();

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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-md"
            />

            {/* Full-screen panel */}
            <motion.div
              initial={{ clipPath: "circle(0% at calc(100% - 100px) 28px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 100px) 28px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 100px) 28px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex flex-col bg-background"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12">
                <div className="mx-auto max-w-md space-y-6">

                  {/* Language */}
                  <motion.div
                    initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                    initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.43, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

                  {/* Profile — only visible if user is registered */}
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.51, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-2xl border border-border bg-card p-5"
                    >
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        <User className="mr-1.5 inline h-3.5 w-3.5" />
                        {language === "es" ? "Perfil" : "Profile"}
                      </p>
                      <div className="space-y-2.5 text-sm text-card-foreground">
                        <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.phone}</p>
                          </div>
                        </div>
                        {user.instagram && (
                          <p className="px-1 text-xs text-muted-foreground">
                            IG: @{user.instagram}
                          </p>
                        )}
                        {user.email && (
                          <p className="px-1 text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                        <button
                          onClick={() => { clearUser(); setOpen(false); }}
                          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-destructive hover:text-destructive active:scale-95"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          {language === "es" ? "Cerrar sesión" : "Log out"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Not registered hint */}
                  {!user && (
                    <motion.div
                      initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.51, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center"
                    >
                      <User className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        {language === "es"
                          ? "Regístrate al hacer tu primer pedido para ver tu perfil aquí"
                          : "Register when placing your first order to see your profile here"}
                      </p>
                    </motion.div>
                  )}
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
