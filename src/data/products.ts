import productActivewear1 from "@/assets/product-activewear-1.jpg";
import productActivewear3 from "@/assets/product-activewear-3.jpg";
import productSwimwear1 from "@/assets/product-swimwear-1.jpg";
import productSwimwear2 from "@/assets/product-swimwear-2.jpg";
import productAnimalPrint1 from "@/assets/product-animal-print-1.jpg";
import productAnimalPrint2 from "@/assets/product-animal-print-2.jpg";
import productCoralSet from "@/assets/product-coral-set.jpg";
import productBlueSet from "@/assets/product-blue-set.jpg";
import productWhiteSet from "@/assets/product-white-set.jpg";
import productBlackCoverup from "@/assets/product-black-coverup.jpg";
import productGreenActive from "@/assets/product-green-active.jpg";

export type ProductCategory = "Animal Print" | "Colores Vibrantes" | "Sets Completos" | "Activewear" | "Salidas de Playa";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  image: string;
  images?: string[];
  price: number;
  description: string;
  details: string[];
  sizes: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: "ap-1",
    name: "Bikini Leopardo Clásico",
    category: "Animal Print",
    subcategory: "Bikini",
    image: productAnimalPrint1,
    price: 89,
    description: "Bikini de estampado leopardo con corte clásico que estiliza la cintura y resalta la silueta.",
    details: ["Estampado animal print premium", "Top triangular ajustable", "Bottom de cobertura media", "Herraje dorado"],
    sizes: ["XS", "S", "M", "L"],
    isBestseller: true,
  },
  {
    id: "ap-2",
    name: "Pareo Animal Print + Accesorios",
    category: "Animal Print",
    subcategory: "Accesorios",
    image: productAnimalPrint2,
    price: 45,
    description: "Pareo en estampado leopardo con diadema a juego y accesorios dorados. Complemento perfecto.",
    details: ["Pareo multifuncional", "Diadema a juego", "Tela suave y liviana", "Accesorios dorados incluidos"],
    sizes: ["Talla única"],
  },
  {
    id: "cv-1",
    name: "Set Coral Sol Dorado",
    category: "Colores Vibrantes",
    subcategory: "Bikini",
    image: productCoralSet,
    price: 95,
    description: "Bikini coral vibrante con herraje dorado en forma de sol. Resalta tu bronceado con elegancia.",
    details: ["Color coral vibrante", "Herraje dorado sol", "Amarres ajustables", "Acabado premium"],
    sizes: ["XS", "S", "M", "L"],
    isNew: true,
  },
  {
    id: "cv-2",
    name: "Set Azul Eléctrico con Falda",
    category: "Colores Vibrantes",
    subcategory: "Set completo",
    image: productBlueSet,
    price: 120,
    description: "Set de 3 piezas en azul eléctrico: top, bottom y falda con movimiento. Look completo de playa.",
    details: ["3 piezas incluidas", "Azul eléctrico intenso", "Falda con caída elegante", "Tela con protección UV"],
    sizes: ["S", "M", "L"],
    isBestseller: true,
  },
  {
    id: "sc-1",
    name: "Set Blanco Joya Nupcial",
    category: "Sets Completos",
    subcategory: "Set con accesorios",
    image: productWhiteSet,
    price: 150,
    description: "Set premium en blanco con accesorios tipo joya dorados. Perfecto para ocasiones especiales y lunas de miel.",
    details: ["Bikini + falda + collar", "Accesorios joya dorados", "Blanco elegante", "Edición limitada"],
    sizes: ["XS", "S", "M", "L"],
    isNew: true,
  },
  {
    id: "sp-1",
    name: "Kimono Black & Gold",
    category: "Salidas de Playa",
    subcategory: "Cover-up",
    image: productBlackCoverup,
    price: 75,
    description: "Kimono transparente en negro con detalles dorados. Salida de playa con elegancia premium.",
    details: ["Tela transparente premium", "Ribetes dorados", "Cinturón ajustable", "Talla única"],
    sizes: ["Talla única"],
  },
  {
    id: "aw-1",
    name: "Set Deportivo Elite Negro",
    category: "Activewear",
    subcategory: "Conjunto",
    image: productActivewear1,
    price: 110,
    description: "Conjunto deportivo de alto rendimiento. Sports bra y leggings en negro con ajuste perfecto.",
    details: ["Tela de compresión", "Secado rápido", "Costuras planas", "Soporte medio-alto"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isBestseller: true,
  },
  {
    id: "aw-2",
    name: "Top Navy Performance",
    category: "Activewear",
    subcategory: "Top",
    image: productSwimwear1,
    price: 55,
    description: "Top deportivo en azul navy con soporte y estilo. Ideal para entrenamiento de alta intensidad.",
    details: ["Tela absorbente", "Soporte medio", "Diseño ergonómico", "Azul navy premium"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "aw-3",
    name: "Colección Essentials Black & Gold",
    category: "Activewear",
    subcategory: "Set",
    image: productSwimwear2,
    price: 135,
    description: "Colección completa de piezas esenciales en negro con detalles dorados. Tu armario deportivo premium.",
    details: ["3 piezas esenciales", "Detalles dorados", "Mix & match", "Packaging premium"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "aw-4",
    name: "Leggings Power Fit",
    category: "Activewear",
    subcategory: "Leggings",
    image: productActivewear3,
    price: 65,
    description: "Leggings de alta compresión que definen y estilizan. Comodidad y soporte en cada movimiento.",
    details: ["Alta compresión", "Cintura alta", "Tela anti-transparencia", "Costuras estratégicas"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "aw-5",
    name: "Sports Bra Esmeralda",
    category: "Activewear",
    subcategory: "Top",
    image: productGreenActive,
    price: 50,
    description: "Sports bra en verde esmeralda con detalle dorado. Soporte y estilo en un diseño único.",
    details: ["Verde esmeralda premium", "Detalle botón dorado", "Tirantes cruzados", "Soporte medio"],
    sizes: ["XS", "S", "M", "L"],
    isNew: true,
  },
];

export const categories: ProductCategory[] = ["Animal Print", "Colores Vibrantes", "Sets Completos", "Activewear", "Salidas de Playa"];
