import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import collectionActivewear from "@/assets/collection-activewear.jpg";
import collectionSwimwear from "@/assets/collection-swimwear.jpg";
import productAnimalPrint1 from "@/assets/product-animal-print-1.jpg";
import productWhiteSet from "@/assets/product-white-set.jpg";
import { useLanguage } from "@/context/LanguageContext";

const Collections = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const collections = [
    {
      titleKey: "collections.animal_print.title",
      descKey: "collections.animal_print.desc",
      image: productAnimalPrint1,
      items: { es: ["Bikinis", "Vestidos de Baño", "Pareos", "Accesorios"], en: ["Bikinis", "Swimsuits", "Sarongs", "Accessories"] },
    },
    {
      titleKey: "collections.colors.title",
      descKey: "collections.colors.desc",
      image: collectionSwimwear,
      items: { es: ["Coral Sol", "Azul Eléctrico", "Rojo Intenso", "Blanco Joya"], en: ["Coral Sun", "Electric Blue", "Intense Red", "Jewel White"] },
    },
    {
      titleKey: "collections.sets.title",
      descKey: "collections.sets.desc",
      image: productWhiteSet,
      items: { es: ["Bikini + Falda", "Set 3 Piezas", "Vestidos de Baño", "Salidas de Playa"], en: ["Bikini + Skirt", "3-Piece Set", "Swimsuits", "Beach Cover-ups"] },
    },
    {
      titleKey: "collections.activewear.title",
      descKey: "collections.activewear.desc",
      image: collectionActivewear,
      items: { es: ["Conjuntos", "Leggings", "Tops", "Sports Bras"], en: ["Sets", "Leggings", "Tops", "Sports Bras"] },
    },
  ];

  const scrollToProducts = () => {
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="collections" className="py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("collections.label")}</p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {t("collections.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t("collections.description")}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection, index) => {
            const lang = (t("nav.home") === "Home" ? "en" : "es") as "es" | "en";
            return (
              <motion.div
                key={collection.titleKey}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={scrollToProducts}
                className="perspective-1000 group cursor-pointer"
              >
                <motion.div
                  animate={{
                    rotateX: hoveredIndex === index ? 2 : 0,
                    rotateY: hoveredIndex === index ? -3 : 0,
                    scale: hoveredIndex === index ? 1.03 : 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="preserve-3d relative overflow-hidden rounded-2xl border border-border shadow-card-3d transition-all duration-300 hover:shadow-hover"
                >
                  <img
                    src={collection.image}
                    alt={t(collection.titleKey)}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="mb-1 font-serif text-xl font-bold text-white">
                      {t(collection.titleKey)}
                    </h3>
                    <p className="mb-3 text-xs text-white/70 line-clamp-2">{t(collection.descKey)}</p>
                    <div className="flex flex-wrap gap-1">
                      {collection.items[lang].slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-white/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Collections;
