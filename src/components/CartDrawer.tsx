import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Package } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import OrderSummaryModal from "@/components/OrderSummaryModal";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { user, requireLogin } = useUser();
  const { t } = useLanguage();
  const [showSummary, setShowSummary] = useState(false);

  const handleProceedToOrder = () => {
    requireLogin(() => {
      setShowSummary(true);
    });
  };

  const handleOrderComplete = () => {
    setShowSummary(false);
    clearCart();
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Full-screen backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-md"
            />

            {/* Full-screen cart panel */}
            <motion.div
              initial={{ clipPath: "circle(0% at calc(100% - 40px) 28px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 40px) 28px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 40px) 28px)" }}
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
                    <ShoppingBag className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-foreground leading-tight">
                      {t("cart.title")}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all active:scale-95"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto px-6 py-6 md:px-12">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
                      <Package className="h-9 w-9 text-muted-foreground/40" />
                    </div>
                    <p className="font-serif text-lg text-muted-foreground">{t("cart.empty")}</p>
                    <p className="mt-2 text-sm text-muted-foreground/60">{t("cart.empty.desc")}</p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-6 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:border-foreground hover:text-foreground transition-all active:scale-97"
                    >
                      Explorar productos
                    </button>
                  </motion.div>
                ) : (
                  <div className="mx-auto max-w-2xl">
                    <div className="grid gap-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.product.id + item.selectedSize}
                          layout
                          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
                          transition={{ delay: 0.35 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="group flex gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-card"
                        >
                          <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                            {item.quantity > 1 && (
                              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-card-foreground">{item.product.name}</p>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    {item.selectedSize}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground/60">{item.product.category}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="flex-shrink-0 text-muted-foreground/30 transition-colors hover:text-destructive opacity-0 group-hover:opacity-100"
                                aria-label="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-1.5 py-1">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95"
                                  aria-label="-"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95"
                                  aria-label="+"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <p className="font-serif text-lg font-bold text-accent">${item.product.price * item.quantity}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-border bg-card/80 backdrop-blur-sm px-6 py-5 md:px-12"
                >
                  <div className="mx-auto max-w-2xl">
                    <div className="mb-4 space-y-2 rounded-xl bg-muted/30 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                        <span className="font-medium text-foreground">${totalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>
                        <span className="text-xs font-medium text-accent">A coordinar</span>
                      </div>
                      <div className="border-t border-border pt-2 flex items-center justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-serif text-2xl font-bold text-foreground">${totalPrice} USD</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceedToOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-sans text-sm font-semibold text-accent-foreground shadow-glow-gold transition-all hover:shadow-[0_0_40px_hsl(43_74%_49%_/_0.4)]"
                    >
                      {t("cart.continue")}
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>

                    <button
                      onClick={clearCart}
                      className="mt-3 w-full text-center text-xs text-muted-foreground/50 hover:text-destructive transition-colors"
                    >
                      {t("cart.clear")}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {user && (
        <OrderSummaryModal
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          items={items}
          totalPrice={totalPrice}
          user={user}
          onComplete={handleOrderComplete}
        />
      )}
    </>
  );
};

export default CartDrawer;
