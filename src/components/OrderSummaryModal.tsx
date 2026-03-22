import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, User, Phone, AtSign, Mail, Banknote, Smartphone, Building2, Check, Loader2, AlertTriangle, Camera, ArrowLeft, Copy, ShieldCheck } from "lucide-react";
import { useState, useCallback } from "react";
import { CartItem } from "@/context/CartContext";
import { UserInfo } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type PaymentMethod = "efectivo" | "yappy" | "transferencia";

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  user: UserInfo;
  onComplete: () => void;
}

const INSTAGRAM_URL = "https://www.instagram.com/hemerza";
const WHATSAPP_NUMBER = "50760000000";
const PAYMENT_ACCOUNT = "68459722";

type FlowStep = "summary" | "payment-info" | "screenshot-warning" | "report";

const paymentOptions: { value: PaymentMethod; labelEs: string; labelEn: string; icon: typeof Banknote; desc: { es: string; en: string } }[] = [
  { value: "efectivo", labelEs: "Efectivo", labelEn: "Cash", icon: Banknote, desc: { es: "Contra entrega — queda pendiente hasta recibir", en: "Cash on delivery — pending until received" } },
  { value: "yappy", labelEs: "Yappy", labelEn: "Yappy", icon: Smartphone, desc: { es: "Pago móvil Yappy", en: "Yappy mobile payment" } },
  { value: "transferencia", labelEs: "Transferencia", labelEn: "Bank Transfer", icon: Building2, desc: { es: "Transferencia bancaria", en: "Bank transfer" } },
];

const OrderSummaryModal = ({ isOpen, onClose, items, totalPrice, user, onComplete }: OrderSummaryModalProps) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<FlowStep>("summary");
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();

  const orderDate = new Date().toLocaleDateString("es-PA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const orderNumber = `HMZ-${Date.now().toString(36).toUpperCase()}`;

  const handleClose = useCallback(() => {
    setStep("summary");
    setSelectedPayment(null);
    setCopied(false);
    onClose();
  }, [onClose]);

  const handleSelectPayment = (method: PaymentMethod) => {
    setSelectedPayment(method);
    if (method === "efectivo") {
      // Cash: go directly to report step with info that it's pending
      setStep("report");
    } else {
      // Yappy or transfer: show payment info first
      setStep("payment-info");
    }
  };

  const handleCopyAccount = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(PAYMENT_ACCOUNT);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = PAYMENT_ACCOUNT;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail
    }
  };

  const buildOrderText = () => {
    const itemLines = items
      .map((i, idx) => `${idx + 1}. ${i.product.name}\n   ${t("order.size")}: ${i.selectedSize} | ${t("order.qty")}: ${i.quantity} | $${i.product.price * i.quantity} USD`)
      .join("\n\n");

    const paymentLabel = selectedPayment
      ? paymentOptions.find(p => p.value === selectedPayment)?.[language === "es" ? "labelEs" : "labelEn"] ?? ""
      : "";

    return [
      `*PEDIDO HEMERZA*`,
      `No. ${orderNumber}`,
      `${orderDate}`,
      `${t("order.pending")}`,
      ``,
      `*${t("order.client").toUpperCase()}*`,
      `${user.name}`,
      `${user.phone}`,
      `@${user.instagram}`,
      user.email ? `${user.email}` : null,
      ``,
      `*${t("order.products").toUpperCase()}*`,
      itemLines,
      ``,
      `*${t("order.total").toUpperCase()}:* $${totalPrice} USD`,
      `*${language === "es" ? "METODO DE PAGO" : "PAYMENT METHOD"}:* ${paymentLabel}`,
    ].filter(Boolean).join("\n");
  };

  const saveOrderToDb = async () => {
    const db = supabase as any;
    const { data: existingCustomer } = await db
      .from("customers")
      .select("id")
      .eq("phone", user.phone)
      .maybeSingle();

    let customerId: string;
    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: custErr } = await db
        .from("customers")
        .insert({
          name: user.name,
          phone: user.phone,
          instagram: user.instagram,
          email: user.email || null,
        })
        .select("id")
        .single();
      if (custErr || !newCustomer) throw new Error("Error creating customer");
      customerId = newCustomer.id;
    }

    const { data: order, error: orderErr } = await db
      .from("orders")
      .insert({
        customer_id: customerId,
        order_number: orderNumber,
        payment_method: selectedPayment!,
        total: totalPrice,
        status: selectedPayment === "efectivo" ? "pendiente_entrega" : "pendiente",
      })
      .select("id")
      .single();
    if (orderErr || !order) throw new Error("Error creating order");

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.product.price,
    }));
    const { error: itemsErr } = await db.from("order_items").insert(orderItems);
    if (itemsErr) throw new Error("Error creating order items");

  };

  const handleSendOrder = async (channel: "whatsapp" | "instagram") => {
    if (!selectedPayment) return;
    setSubmitting(true);
    try {
      await saveOrderToDb();
      const text = buildOrderText();

      if (channel === "whatsapp") {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
      } else {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        window.open(INSTAGRAM_URL, "_blank");
      }

      toast({
        title: language === "es" ? "Pedido enviado!" : "Order sent!",
        description: language === "es" ? "Tu pedido ha sido registrado exitosamente." : "Your order has been registered successfully.",
      });
      handleClose();
      onComplete();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: language === "es" ? "No se pudo registrar el pedido. Intenta de nuevo." : "Could not register the order. Try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const paymentMethodLabel = selectedPayment === "yappy" ? "Yappy" : selectedPayment === "transferencia" ? (language === "es" ? "Transferencia" : "Transfer") : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[70] bg-foreground/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-4"
            onClick={handleClose}
          >
            <div
              className="relative w-full max-w-lg rounded-2xl bg-background shadow-elegant overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">

                {/* ========== STEP 1: ORDER SUMMARY ========== */}
                {step === "summary" && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between border-b border-border px-6 py-5">
                      <div>
                        <h2 className="font-serif text-xl font-bold text-foreground">{t("order.title")}</h2>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {orderNumber} — {orderDate}
                          </p>
                          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            {t("order.pending")}
                          </span>
                        </div>
                      </div>
                      <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
                      {/* Client Info */}
                      <div className="mb-5 rounded-xl border border-border bg-muted/30 p-4">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {t("order.client")}
                        </p>
                        <div className="space-y-1.5 text-sm text-foreground">
                          <p className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-accent" />{user.name}</p>
                          <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-accent" />{user.phone}</p>
                          <p className="flex items-center gap-2"><AtSign className="h-3.5 w-3.5 text-accent" />{user.instagram}</p>
                          {user.email && (
                            <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-accent" />{user.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Products */}
                      <div className="mb-5">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {t("order.products")}
                        </p>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div key={item.product.id + item.selectedSize} className="flex items-center gap-3">
                              <img src={item.product.image} alt={item.product.name} className="h-14 w-12 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {t("order.size")}: {item.selectedSize} — {t("order.qty")}: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-foreground">${item.product.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Method Selection */}
                      <div className="mb-5">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {language === "es" ? "Metodo de pago" : "Payment method"}
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {paymentOptions.map((opt) => {
                            const Icon = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => handleSelectPayment(opt.value)}
                                className="relative flex items-center gap-3 rounded-xl border-2 border-border p-3 transition-all hover:border-accent hover:bg-accent/5 active:scale-95 sm:flex-col sm:items-center sm:gap-1.5"
                              >
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <span className="text-xs font-semibold text-foreground">
                                  {language === "es" ? opt.labelEs : opt.labelEn}
                                </span>
                                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                                  {opt.desc[language]}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="text-sm font-medium text-muted-foreground">{t("order.total")}</span>
                        <span className="font-serif text-2xl font-bold text-gradient-gold">${totalPrice} USD</span>
                      </div>
                    </div>

                    <div className="border-t border-border px-6 py-4">
                      <button
                        onClick={handleClose}
                        className="w-full rounded-full border border-border py-3 text-sm font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground active:scale-98"
                      >
                        {t("order.continue_shopping") || "Seguir Comprando"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ========== STEP 2: PAYMENT INFO (Yappy / Transfer) ========== */}
                {step === "payment-info" && (
                  <motion.div
                    key="payment-info"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                      <button
                        onClick={() => { setStep("summary"); setSelectedPayment(null); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-foreground">
                          {language === "es" ? `Pagar con ${paymentMethodLabel}` : `Pay with ${paymentMethodLabel}`}
                        </h2>
                        <p className="text-xs text-muted-foreground">{orderNumber}</p>
                      </div>
                    </div>

                    <div className="px-6 py-8">
                      {/* Account number display */}
                      <div className="mb-6 text-center">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {language === "es" ? "Enviar pago al numero" : "Send payment to number"}
                        </p>
                        <div className="relative mx-auto inline-flex items-center gap-3 rounded-2xl border-2 border-accent bg-accent/5 px-8 py-5">
                          <span className="font-mono text-3xl font-bold tracking-wider text-foreground">{PAYMENT_ACCOUNT}</span>
                          <button
                            onClick={handleCopyAccount}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors active:scale-95"
                            title={language === "es" ? "Copiar" : "Copy"}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="mb-6 rounded-xl bg-muted/40 p-5 text-center">
                        <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wider">
                          {language === "es" ? "Monto a pagar" : "Amount to pay"}
                        </p>
                        <p className="font-serif text-3xl font-bold text-gradient-gold">${totalPrice} USD</p>
                      </div>

                      {/* Method info */}
                      <div className="mb-6 rounded-xl border border-border bg-card p-4">
                        <div className="flex items-start gap-3">
                          {selectedPayment === "yappy" ? (
                            <Smartphone className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                          ) : (
                            <Building2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                          )}
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            {selectedPayment === "yappy" ? (
                              language === "es"
                                ? "Abre tu app de Yappy, selecciona \"Enviar dinero\", ingresa el numero de arriba y el monto indicado."
                                : "Open your Yappy app, select \"Send money\", enter the number above and the indicated amount."
                            ) : (
                              language === "es"
                                ? "Realiza una transferencia bancaria al numero de cuenta indicado arriba por el monto exacto."
                                : "Make a bank transfer to the account number shown above for the exact amount."
                            )}
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStep("screenshot-warning")}
                        className="w-full rounded-full bg-accent py-4 text-sm font-bold text-accent-foreground shadow-glow-gold transition-all hover:shadow-[0_0_40px_hsl(43_74%_49%_/_0.4)] active:scale-98"
                      >
                        {language === "es" ? "Ya realice el pago" : "I already made the payment"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ========== STEP 3: SCREENSHOT WARNING ========== */}
                {step === "screenshot-warning" && (
                  <motion.div
                    key="screenshot-warning"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 py-10 text-center">
                      {/* Animated warning icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 ring-4 ring-amber-500/10"
                      >
                        <AlertTriangle className="h-10 w-10 text-amber-500" />
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-3 font-serif text-2xl font-bold text-foreground"
                      >
                        {language === "es" ? "IMPORTANTE" : "IMPORTANT"}
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6 space-y-3"
                      >
                        <div className="mx-auto flex items-center gap-3 rounded-xl border-2 border-amber-500/30 bg-amber-500/10 p-4 text-left">
                          <Camera className="h-6 w-6 flex-shrink-0 text-amber-500" />
                          <p className="text-sm font-medium text-foreground leading-relaxed">
                            {language === "es"
                              ? "Haz una CAPTURA DE PANTALLA del comprobante de pago antes de continuar. La necesitaras para reportar tu pago."
                              : "Take a SCREENSHOT of your payment receipt before continuing. You will need it to report your payment."}
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {language === "es"
                            ? "Sin el comprobante no podremos verificar tu pago. Asegurate de guardarlo antes de continuar."
                            : "Without the receipt we cannot verify your payment. Make sure to save it before continuing."}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-3"
                      >
                        <button
                          onClick={() => setStep("report")}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-bold text-accent-foreground shadow-glow-gold transition-all hover:shadow-[0_0_40px_hsl(43_74%_49%_/_0.4)] active:scale-98"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          {language === "es" ? "Ya tengo mi captura, continuar" : "I have my screenshot, continue"}
                        </button>

                        <button
                          onClick={() => setStep("payment-info")}
                          className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {language === "es" ? "Volver a la informacion de pago" : "Back to payment info"}
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* ========== STEP 4: REPORT PAYMENT ========== */}
                {step === "report" && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                      <button
                        onClick={() => {
                          if (selectedPayment === "efectivo") {
                            setStep("summary");
                            setSelectedPayment(null);
                          } else {
                            setStep("screenshot-warning");
                          }
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-foreground">
                          {language === "es" ? "Reportar pedido" : "Report order"}
                        </h2>
                        <p className="text-xs text-muted-foreground">{orderNumber}</p>
                      </div>
                    </div>

                    <div className="px-6 py-6">
                      {/* Cash notice */}
                      {selectedPayment === "efectivo" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-5 rounded-xl border-2 border-amber-500/30 bg-amber-500/10 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <Banknote className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {language === "es" ? "Pago contra entrega" : "Cash on delivery"}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                {language === "es"
                                  ? "Tu pedido quedara en estado PENDIENTE hasta que se confirme la entrega y el pago en efectivo. Coordinaremos la entrega contigo."
                                  : "Your order will remain PENDING until delivery and cash payment are confirmed. We will coordinate delivery with you."}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Order summary mini */}
                      <div className="mb-5 rounded-xl bg-muted/30 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("order.total")}</span>
                          <span className="font-serif text-xl font-bold text-gradient-gold">${totalPrice} USD</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {language === "es" ? "Metodo" : "Method"}
                          </span>
                          <span className="font-medium text-foreground">
                            {selectedPayment === "efectivo"
                              ? (language === "es" ? "Efectivo (contra entrega)" : "Cash (on delivery)")
                              : paymentMethodLabel}
                          </span>
                        </div>
                      </div>

                      {/* Report buttons */}
                      <p className="mb-3 text-center text-xs text-muted-foreground">
                        {selectedPayment === "efectivo"
                          ? (language === "es" ? "Envia tu pedido para coordinar la entrega" : "Send your order to coordinate delivery")
                          : (language === "es" ? "Envia tu comprobante junto con el pedido" : "Send your receipt with the order")}
                      </p>

                      <div className="flex gap-3">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSendOrder("whatsapp")}
                          disabled={submitting}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[hsl(142,70%,40%)] py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0 active:scale-98"
                        >
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          )}
                          WhatsApp
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSendOrder("instagram")}
                          disabled={submitting}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5 hover:shadow-glow-gold disabled:opacity-50 disabled:hover:translate-y-0 active:scale-98"
                        >
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Instagram className="h-4 w-4" />}
                          Instagram
                        </motion.button>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={handleClose}
                          className="w-full rounded-full border border-border py-3 text-sm font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground active:scale-98"
                        >
                          {language === "es" ? "Cancelar" : "Cancel"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderSummaryModal;
