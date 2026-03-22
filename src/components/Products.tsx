import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { products, categories, Product } from "@/data/products";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";

const SITE_URL = window.location.origin;

const generateShareUrl = (productId: string) => `${SITE_URL}?p=${productId}`;

const copyToClipboard = (text: string) => {
  // Fallback for non-secure contexts (iframe, http)
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve();
};

const handleShare = async (product: Product, e: React.MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  const url = generateShareUrl(product.id);
  const text = `${product.name} — $${product.price} | Hemerza`;

  // Always try native share first (works on mobile + desktop with share support)
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: product.name, text, url });
      return;
    } catch (err: any) {
      // User cancelled — don't fallback
      if (err?.name === "AbortError") return;
    }
  }
  
  // Fallback: copy to clipboard
  await copyToClipboard(url);
  toast({ title: "¡Link copiado!", description: url });
};

const ImageWithSkeleton = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle already-cached images (onLoad won't fire if already complete)
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-muted">
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              backgroundImage: "linear-gradient(90deg, transparent 0%, hsl(var(--background) / 0.4) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
          </div>
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

const ProductCard = ({ product, index, onClick, t }: { product: Product; index: number; onClick: () => void; t: (key: string) => string }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x: y, y: x });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={onClick}
      className="perspective-1000 group cursor-pointer"
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="preserve-3d overflow-hidden rounded-2xl border border-border bg-card shadow-card-3d transition-all duration-300 hover:shadow-hover"
      >
        <div className="relative overflow-hidden aspect-[3/4]">
          <ImageWithSkeleton
            src={product.image}
            alt={`${product.name} - Hemerza ${product.category}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/20" />
          
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground">{t("products.new")}</span>
            )}
            {product.isBestseller && (
              <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">{t("products.bestseller")}</span>
            )}
          </div>

          {/* Share button */}
          <button
            onClick={(e) => handleShare(product, e)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-background hover:text-foreground group-hover:opacity-100 active:scale-90"
            aria-label="Compartir"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>

          <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-accent/90 px-5 py-2.5 text-xs font-semibold text-accent-foreground shadow-glow-gold">
              {t("products.view_details")}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="mb-0.5 text-[10px] font-medium uppercase tracking-widest text-accent">
            {product.category}
          </p>
          <h3 className="mb-1 text-sm font-semibold text-card-foreground">{product.name}</h3>
          <p className="font-serif text-lg font-bold text-foreground">${product.price}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Products = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { t } = useLanguage();

  // Handle deep link ?p=productId
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("p");
    if (pid) {
      const found = products.find((p) => p.id === pid);
      if (found) {
        setSelectedProduct(found);
        // Clean URL without reload
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const filteredProducts = activeCategory === "Todos"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="bg-gradient-subtle py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("products.label")}</p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {t("products.title")}
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            {t("products.description")}
          </p>
        </motion.div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {[t("products.all"), ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === t("products.all") ? "Todos" : cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                (cat === t("products.all") && activeCategory === "Todos") || activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onClick={() => setSelectedProduct(product)}
              t={t}
            />
          ))}
        </motion.div>
      </div>

      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
};

export default Products;
