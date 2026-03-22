import { motion, AnimatePresence } from "framer-motion";
import { X, User, AtSign, Mail } from "lucide-react";
import { useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

const PANAMA_FLAG_SVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="h-5 w-7 rounded-sm shadow-sm flex-shrink-0">
    <rect width="900" height="600" fill="#fff"/>
    <rect width="450" height="300" fill="#fff"/>
    <rect x="450" width="450" height="300" fill="#D21034"/>
    <rect y="300" width="450" height="300" fill="#0038A8"/>
    <rect x="450" y="300" width="450" height="300" fill="#fff"/>
    <polygon points="195,85 205,115 237,115 211,135 221,165 195,148 169,165 179,135 153,115 185,115" fill="#0038A8"/>
    <polygon points="705,385 715,415 747,415 721,435 731,465 705,448 679,465 689,435 663,415 695,415" fill="#D21034"/>
  </svg>
);

const formatPhone = (digits: string): string => {
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

const UserLoginModal = () => {
  const { showLoginModal, setShowLoginModal, setUser } = useUser();
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", instagram: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const phoneDigits = form.phone.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length === 8;
  const isPhoneStartValid = phoneDigits.length === 0 || /^[6-7]/.test(phoneDigits);

  const validateField = useCallback((field: string, value: string) => {
    switch (field) {
      case "name": {
        const trimmed = value.trim();
        if (!trimmed) return language === "es" ? "Tu nombre completo es requerido" : "Your full name is required";
        const words = trimmed.split(/\s+/).filter(w => w.length >= 2);
        if (words.length < 2) return language === "es" ? "Ingresa nombre y apellido" : "Enter first and last name";
        if (trimmed.length < 5) return language === "es" ? "Nombre muy corto" : "Name too short";
        if (trimmed.length > 100) return language === "es" ? "Nombre muy largo" : "Name too long";
        return "";
      }
      case "phone": {
        const digits = value.replace(/\D/g, "");
        if (!digits) return language === "es" ? "Tu teléfono es requerido" : "Your phone is required";
        if (!/^[6-7]/.test(digits)) return language === "es" ? "Debe iniciar con 6 o 7" : "Must start with 6 or 7";
        if (digits.length < 8) return language === "es" ? `Faltan ${8 - digits.length} dígitos` : `${8 - digits.length} digits remaining`;
        if (digits.length > 8) return language === "es" ? "Máximo 8 dígitos" : "Maximum 8 digits";
        return "";
      }
      case "instagram":
        if (!value.trim()) return language === "es" ? "Tu usuario de Instagram es requerido" : "Your Instagram username is required";
        if (value.trim().length < 2) return language === "es" ? "Usuario muy corto" : "Username too short";
        return "";
      case "email":
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return language === "es" ? "Email inválido" : "Invalid email";
        }
        return "";
      default:
        return "";
    }
  }, [language]);

  const handleChange = (field: string, value: string) => {
    if (field === "phone") {
      // Only allow digits, max 8
      const digits = value.replace(/\D/g, "").slice(0, 8);
      setForm(prev => ({ ...prev, phone: digits }));
    } else if (field === "name") {
      // Only letters, spaces, accents
      const clean = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "").slice(0, 100);
      setForm(prev => ({ ...prev, name: clean }));
    } else if (field === "instagram") {
      // Remove @ and spaces
      const clean = value.replace(/[@\s]/g, "").slice(0, 30);
      setForm(prev => ({ ...prev, instagram: clean }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }

    if (touched[field]) {
      const newValue = field === "phone" ? value.replace(/\D/g, "").slice(0, 8) : value;
      const error = validateField(field, newValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field as keyof typeof form]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validate = () => {
    const fields = ["name", "phone", "instagram", "email"] as const;
    const errs: Record<string, string> = {};
    fields.forEach(f => {
      const err = validateField(f, form[f]);
      if (err) errs[f] = err;
    });
    setErrors(errs);
    setTouched({ name: true, phone: true, instagram: true, email: true });
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setUser({
      name: form.name.trim(),
      phone: `+507 ${formatPhone(phoneDigits)}`,
      instagram: form.instagram.trim().replace("@", ""),
      email: form.email.trim() || undefined,
    });
  };

  const getFieldStatus = (field: string) => {
    if (!touched[field]) return "idle";
    if (errors[field]) return "error";
    const value = form[field as keyof typeof form];
    if (field === "email" && !value.trim()) return "idle";
    return "valid";
  };

  const fieldBorderClass = (field: string) => {
    const status = getFieldStatus(field);
    if (status === "error") return "border-destructive focus:border-destructive focus:ring-destructive";
    if (status === "valid") return "border-green-500 focus:border-green-500 focus:ring-green-500";
    return "border-border focus:border-accent focus:ring-accent";
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
            className="fixed inset-0 z-[60] bg-foreground/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-background p-6 shadow-elegant sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground">{t("login.title")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t("login.subtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground">
                    {t("login.name")} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder={t("login.name.placeholder")}
                      className={`w-full rounded-xl bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 border ${fieldBorderClass("name")}`}
                    />
                    {getFieldStatus("name") === "valid" && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                    )}
                  </div>
                  {errors.name && touched.name && (
                    <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Phone - Panama */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground">
                    {t("login.phone")} *
                  </label>
                  <div className="relative flex">
                    {/* Panama prefix */}
                    <div className="flex items-center gap-1.5 rounded-l-xl border border-r-0 border-border bg-muted/50 px-3 text-sm text-foreground">
                      <PANAMA_FLAG_SVG />
                      <span className="font-medium text-muted-foreground">+507</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={formatPhone(phoneDigits)}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="6000-0000"
                      maxLength={9}
                      className={`w-full rounded-r-xl bg-muted/30 py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 border ${fieldBorderClass("phone")}`}
                    />
                    {getFieldStatus("phone") === "valid" && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    {errors.phone && touched.phone ? (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/60">
                        {language === "es" ? "Solo números panameños (8 dígitos)" : "Panama numbers only (8 digits)"}
                      </span>
                    )}
                    <span className={`text-[10px] font-medium ${isPhoneValid ? "text-green-500" : "text-muted-foreground/50"}`}>
                      {phoneDigits.length}/8
                    </span>
                  </div>
                </div>

                {/* Instagram */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground">
                    {t("login.instagram")} *
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <input
                      type="text"
                      value={form.instagram}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                      onBlur={() => handleBlur("instagram")}
                      placeholder={t("login.instagram.placeholder")}
                      className={`w-full rounded-xl bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 border ${fieldBorderClass("instagram")}`}
                    />
                    {getFieldStatus("instagram") === "valid" && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                    )}
                  </div>
                  {errors.instagram && touched.instagram && (
                    <p className="mt-1 text-xs text-destructive">{errors.instagram}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground">
                    {t("login.email")} <span className="text-muted-foreground">{t("login.email.optional")}</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="tu@email.com"
                      className={`w-full rounded-xl bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 border ${fieldBorderClass("email")}`}
                    />
                    {getFieldStatus("email") === "valid" && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5 hover:shadow-glow-gold"
                >
                  {t("login.submit")}
                </button>

                <p className="text-center text-[11px] text-muted-foreground/60">
                  {t("login.privacy")}
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserLoginModal;
