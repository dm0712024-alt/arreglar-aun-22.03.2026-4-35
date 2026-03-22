import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Ruler, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const sizeData = [
  { size: "XS", bust: "78-82", waist: "60-64", hip: "86-90", us: "0-2", eu: "32-34" },
  { size: "S", bust: "82-86", waist: "64-68", hip: "90-94", us: "4-6", eu: "34-36" },
  { size: "M", bust: "86-90", waist: "68-72", hip: "94-98", us: "8-10", eu: "36-38" },
  { size: "L", bust: "90-94", waist: "72-76", hip: "98-102", us: "10-12", eu: "38-40" },
  { size: "XL", bust: "94-98", waist: "76-80", hip: "102-106", us: "12-14", eu: "40-42" },
];

const tipKeys = [
  { titleKey: "sizeguide.tip1.title", descKey: "sizeguide.tip1.desc" },
  { titleKey: "sizeguide.tip2.title", descKey: "sizeguide.tip2.desc" },
  { titleKey: "sizeguide.tip3.title", descKey: "sizeguide.tip3.desc" },
  { titleKey: "sizeguide.tip4.title", descKey: "sizeguide.tip4.desc" },
  { titleKey: "sizeguide.tip5.title", descKey: "sizeguide.tip5.desc" },
  { titleKey: "sizeguide.tip6.title", descKey: "sizeguide.tip6.desc" },
];

const SizeGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <section id="size-guide" className="bg-gradient-subtle py-16 lg:py-20">
      <div className="container mx-auto px-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-card-3d transition-all hover:shadow-hover"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Ruler className="h-5 w-5 text-accent" />
            </div>
            <div className="text-left">
              <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                {t("sizeguide.title")}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{t("sizeguide.description")}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 text-accent"
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="mx-auto max-w-3xl overflow-hidden"
            >
              <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-card-3d">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground">
                          {t("sizeguide.size")}
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-foreground">{t("sizeguide.bust")}</th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-foreground">{t("sizeguide.waist")}</th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-foreground">{t("sizeguide.hip")}</th>
                        <th className="hidden px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-foreground sm:table-cell">US</th>
                        <th className="hidden px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-foreground sm:table-cell">EU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeData.map((row) => (
                        <tr
                          key={row.size}
                          className="border-b border-border/50 transition-colors last:border-0 hover:bg-accent/5"
                        >
                          <td className="px-6 py-4">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 font-serif text-sm font-bold text-accent">
                              {row.size}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-muted-foreground">{row.bust}</td>
                          <td className="px-6 py-4 text-center text-sm text-muted-foreground">{row.waist}</td>
                          <td className="px-6 py-4 text-center text-sm text-muted-foreground">{row.hip}</td>
                          <td className="hidden px-6 py-4 text-center text-sm text-muted-foreground sm:table-cell">{row.us}</td>
                          <td className="hidden px-6 py-4 text-center text-sm text-muted-foreground sm:table-cell">{row.eu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-center font-serif text-lg font-bold text-foreground">
                  {t("sizeguide.how")}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tipKeys.map((tip) => (
                    <div
                      key={tip.titleKey}
                      className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-hover"
                    >
                      <h4 className="mb-1 text-sm font-semibold text-card-foreground">{t(tip.titleKey)}</h4>
                      <p className="text-xs leading-relaxed text-muted-foreground">{t(tip.descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SizeGuide;
