import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X, LogOut, Phone, AtSign, Mail, ShoppingBag, Calendar } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

interface ProfileDrawerProps {
  scrolled: boolean;
}

const ProfileDrawer = ({ scrolled }: ProfileDrawerProps) => {
  const [open, setOpen] = useState(false);
  const { user, clearUser, requireLogin } = useUser();
  const { language } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleOpen = () => {
    if (user) {
      setOpen(true);
    } else {
      requireLogin(() => setOpen(true));
    }
  };

  const memberSince = user
    ? new Date().toLocaleDateString(language === "es" ? "es-PA" : "en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <>
      <button
        onClick={handleOpen}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all backdrop-blur-sm hover:border-accent hover:text-accent ${
          scrolled ? "border-border text-foreground" : "border-primary-foreground/20 text-primary-foreground/80"
        }`}
        aria-label="Perfil"
      >
        {user ? (
          <span className="text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
        ) : (
          <User className="h-4 w-4" />
        )}
        {user && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
        )}
      </button>

      <AnimatePresence>
        {open && user && (
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
              initial={{ clipPath: "circle(0% at calc(100% - 60px) 28px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 60px) 28px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 60px) 28px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex flex-col bg-background"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="flex items-center justify-between border-b border-border px-6 py-5 md:px-12"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    {language === "es" ? "Mi Perfil" : "My Profile"}
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

                  {/* Avatar + Name Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="rounded-2xl border border-border bg-card p-6 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10 ring-4 ring-accent/10">
                      <span className="font-serif text-3xl font-bold text-accent">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground">{user.name}</h3>
                    <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{language === "es" ? "Miembro desde" : "Member since"} {memberSince}</span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1">
                      <ShoppingBag className="h-3 w-3 text-accent" />
                      <span className="text-[11px] font-semibold text-accent">
                        {language === "es" ? "Cliente HEMERZA" : "HEMERZA Client"}
                      </span>
                    </div>
                  </motion.div>

                  {/* Contact Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.4 }}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {language === "es" ? "Información de contacto" : "Contact information"}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                          <Phone className="h-3.5 w-3.5 text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">{language === "es" ? "Teléfono" : "Phone"}</p>
                          <p className="text-sm font-medium text-foreground">{user.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                          <AtSign className="h-3.5 w-3.5 text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Instagram</p>
                          <p className="text-sm font-medium text-foreground">@{user.instagram}</p>
                        </div>
                      </div>

                      {user.email && (
                        <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                            <Mail className="h-3.5 w-3.5 text-accent" />
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Email</p>
                            <p className="text-sm font-medium text-foreground">{user.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Data notice */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.39, duration: 0.4 }}
                    className="rounded-xl bg-muted/20 px-4 py-3 text-center"
                  >
                    <p className="text-[11px] text-muted-foreground/60">
                      {language === "es"
                        ? "Tus datos se guardan localmente en este dispositivo"
                        : "Your data is stored locally on this device"}
                    </p>
                  </motion.div>

                  {/* Logout */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                  >
                    <button
                      onClick={() => { clearUser(); setOpen(false); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-destructive hover:text-destructive active:scale-95"
                    >
                      <LogOut className="h-4 w-4" />
                      {language === "es" ? "Cerrar sesión" : "Log out"}
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

export default ProfileDrawer;
