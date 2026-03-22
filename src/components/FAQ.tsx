import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FAQAccordionItem = ({ questionKey, answerKey, index, t }: { questionKey: string; answerKey: string; index: number; t: (key: string) => string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-border"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-sm font-medium text-foreground sm:text-base">{t(questionKey)}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 text-accent"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{t(answerKey)}</p>
      </motion.div>
    </motion.div>
  );
};

const faqKeys = Array.from({ length: 7 }, (_, i) => ({
  questionKey: `faq.q${i + 1}`,
  answerKey: `faq.a${i + 1}`,
}));

const FAQ = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("faq.label")}</p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {t("faq.title")}
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            {t("faq.description")}
          </p>
        </motion.div>

        <div className="perspective-1000 preserve-3d mx-auto max-w-2xl rounded-2xl border border-border bg-card/50 p-6 shadow-card-3d backdrop-blur-sm sm:p-8">
          {faqKeys.map((item, index) => (
            <FAQAccordionItem key={index} questionKey={item.questionKey} answerKey={item.answerKey} index={index} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
