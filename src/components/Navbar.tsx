import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import SettingsDropdown from "@/components/SettingsDropdown";

const navLinks = [
  { labelKey: "nav.collections", href: "#collections" },
  { labelKey: "nav.catalog", href: "#products" },
  { labelKey: "nav.orders", href: "#custom-orders" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-[padding,background-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        scrolled
          ? "glass shadow-elegant py-3"
          : "py-5 bg-gradient-to-b from-foreground/10 to-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <button
          onClick={() => handleClick("#hero")}
          className={`font-serif text-2xl font-bold tracking-wider transition-colors duration-300 ${
            scrolled ? "text-foreground" : "text-primary-foreground drop-shadow-sm"
          }`}
        >
          HEMERZA
        </button>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground drop-shadow-sm"
              }`}
            >
              {t(link.labelKey)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Settings Dropdown */}
          <SettingsDropdown scrolled={scrolled} />

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all backdrop-blur-sm hover:border-accent hover:text-accent ${
              scrolled ? "border-border text-foreground" : "border-primary-foreground/20 text-primary-foreground/80"
            }`}
            aria-label="Ver carrito"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className="text-left text-base font-medium text-foreground"
                >
                  {t(link.labelKey)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
