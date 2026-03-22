import { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  "nav.home": { es: "Inicio", en: "Home" },
  "nav.about": { es: "Nosotras", en: "About" },
  "nav.collections": { es: "Colecciones", en: "Collections" },
  "nav.catalog": { es: "Catálogo", en: "Catalog" },
  "nav.orders": { es: "Pedidos", en: "Orders" },
  "nav.faq": { es: "FAQ", en: "FAQ" },

  // Settings
  "settings.language": { es: "Idioma", en: "Language" },
  "settings.theme": { es: "Tema", en: "Theme" },
  "settings.dark": { es: "Modo Oscuro", en: "Dark Mode" },
  "settings.light": { es: "Modo Claro", en: "Light Mode" },

  // Hero
  "hero.subtitle": { es: "Swimwear & Activewear", en: "Swimwear & Activewear" },
  "hero.title": { es: "Delicada al vestir, fuerte al moverte.", en: "Delicate in style, powerful in motion." },
  "hero.description": { es: "Swimwear & Activewear de alta calidad.", en: "Premium Swimwear & Activewear." },
  "hero.collection": { es: "Ver Colección", en: "View Collection" },
  "hero.order": { es: "Hacer Pedido", en: "Place Order" },
  "hero.scroll": { es: "Scroll", en: "Scroll" },

  // About
  "about.label": { es: "Nuestra Historia", en: "Our Story" },
  "about.title": { es: "Sobre Hemerza", en: "About Hemerza" },
  "about.p1": { es: "Hemerza nace de la pasión por empoderar a la mujer moderna. Creamos piezas que combinan elegancia, comodidad y rendimiento para que te sientas poderosa en cada momento.", en: "Hemerza was born from a passion for empowering the modern woman. We create pieces that combine elegance, comfort, and performance so you feel powerful at every moment." },
  "about.p2": { es: "Cada prenda está diseñada con materiales de alta calidad, pensada para acompañarte desde tu rutina de ejercicio hasta tus días bajo el sol. Porque mereces sentirte increíble, siempre.", en: "Each garment is designed with high-quality materials, made to accompany you from your workout routine to your days under the sun. Because you deserve to feel amazing, always." },
  "about.p3": { es: "Nuestro compromiso es ofrecerte activewear y swimwear que no solo luzca bien, sino que se sienta como una segunda piel. Diseño premium, ajuste perfecto, confianza infinita.", en: "Our commitment is to offer you activewear and swimwear that not only looks great but feels like a second skin. Premium design, perfect fit, infinite confidence." },
  "about.quality": { es: "Calidad Premium", en: "Premium Quality" },
  "about.love": { es: "Hecho con Amor", en: "Made with Love" },
  "about.support": { es: "Atención Personal", en: "Personal Care" },

  // Collections
  "collections.label": { es: "Explora", en: "Explore" },
  "collections.title": { es: "Nuestras Colecciones", en: "Our Collections" },
  "collections.description": { es: "Cada conjunto está diseñado para resaltar tu figura con elegancia y actitud. Herrajes dorados, texturas premium, acabados delicados y diseños que estilizan.", en: "Each set is designed to enhance your figure with elegance and attitude. Gold hardware, premium textures, delicate finishes, and flattering designs." },
  "collections.animal_print.title": { es: "Animal Print Edition", en: "Animal Print Edition" },
  "collections.animal_print.desc": { es: "Declaración de poder. Estampados intensos con cortes que estilizan la cintura y resaltan la silueta.", en: "A power statement. Bold prints with cuts that slim the waist and enhance the silhouette." },
  "collections.colors.title": { es: "Colores que Impactan", en: "Colors that Impact" },
  "collections.colors.desc": { es: "Coral, azul eléctrico, rojo intenso y blanco elegante. Colores que resaltan tu presencia.", en: "Coral, electric blue, intense red, and elegant white. Colors that highlight your presence." },
  "collections.sets.title": { es: "Sets Completos", en: "Complete Sets" },
  "collections.sets.desc": { es: "Bikini + falda, top + bottom + accesorio. Piezas para crear un look completo, no solo una prenda.", en: "Bikini + skirt, top + bottom + accessory. Pieces to create a complete look, not just a garment." },
  "collections.activewear.title": { es: "Activewear Premium", en: "Premium Activewear" },
  "collections.activewear.desc": { es: "Rendimiento y estilo premium. Conjuntos que te acompañan del gym a tu vida diaria.", en: "Premium performance and style. Sets that take you from the gym to your daily life." },

  // Products
  "products.label": { es: "Catálogo", en: "Catalog" },
  "products.title": { es: "Nuestros Productos", en: "Our Products" },
  "products.description": { es: "Cada pieza está diseñada para resaltar tu figura con elegancia y actitud. No es solo swimwear o activewear, es presencia.", en: "Each piece is designed to enhance your figure with elegance and attitude. It's not just swimwear or activewear, it's presence." },
  "products.all": { es: "Todos", en: "All" },
  "products.view_details": { es: "Ver Detalles", en: "View Details" },
  "products.not_found": { es: "¿No encuentras lo que buscas?", en: "Can't find what you're looking for?" },
  "products.custom": { es: "Pide tu diseño personalizado", en: "Request a custom design" },
  "products.new": { es: "NUEVO", en: "NEW" },
  "products.bestseller": { es: "BESTSELLER", en: "BESTSELLER" },

  // Product Detail Modal
  "detail.details": { es: "Detalles", en: "Details" },
  "detail.size": { es: "Talla", en: "Size" },
  "detail.add": { es: "Añadir a Selección", en: "Add to Selection" },
  "detail.added": { es: "Añadido", en: "Added" },
  "detail.close": { es: "Cerrar detalle", en: "Close detail" },

  // Custom Orders
  "custom.label": { es: "Exclusivo", en: "Exclusive" },
  "custom.title": { es: "Pedidos Personalizados", en: "Custom Orders" },
  "custom.description": { es: "¿Tienes algo especial en mente? Creamos piezas únicas adaptadas a tu estilo, talla y preferencias. Tu visión, nuestra creación.", en: "Have something special in mind? We create unique pieces tailored to your style, size, and preferences. Your vision, our creation." },
  "custom.cta": { es: "Hacer Encargo", en: "Place Custom Order" },

  // Testimonials
  "testimonials.label": { es: "Opiniones", en: "Reviews" },
  "testimonials.title": { es: "Lo Que Dicen Nuestras Clientas", en: "What Our Clients Say" },

  // Size Guide
  "sizeguide.label": { es: "Tu Talla Perfecta", en: "Your Perfect Size" },
  "sizeguide.title": { es: "Guía de Tallas", en: "Size Guide" },
  "sizeguide.description": { es: "Encuentra tu talla ideal. Todas las medidas están en centímetros.", en: "Find your ideal size. All measurements are in centimeters." },
  "sizeguide.size": { es: "Talla", en: "Size" },
  "sizeguide.bust": { es: "Busto (cm)", en: "Bust (cm)" },
  "sizeguide.waist": { es: "Cintura (cm)", en: "Waist (cm)" },
  "sizeguide.hip": { es: "Cadera (cm)", en: "Hip (cm)" },
  "sizeguide.how": { es: "Cómo Tomar Tus Medidas", en: "How to Take Your Measurements" },
  "sizeguide.tip1.title": { es: "Mide sin ropa ajustada", en: "Measure without tight clothing" },
  "sizeguide.tip1.desc": { es: "Para medidas precisas, usa solo ropa interior ligera.", en: "For accurate measurements, wear only light underwear." },
  "sizeguide.tip2.title": { es: "Busto", en: "Bust" },
  "sizeguide.tip2.desc": { es: "Mide en la parte más ancha del pecho, manteniendo la cinta horizontal.", en: "Measure at the widest part of the chest, keeping the tape horizontal." },
  "sizeguide.tip3.title": { es: "Cintura", en: "Waist" },
  "sizeguide.tip3.desc": { es: "Mide en la parte más estrecha del torso, por encima del ombligo.", en: "Measure at the narrowest part of the torso, above the navel." },
  "sizeguide.tip4.title": { es: "Cadera", en: "Hip" },
  "sizeguide.tip4.desc": { es: "Mide en la parte más ancha de la cadera, incluyendo los glúteos.", en: "Measure at the widest part of the hip, including the buttocks." },
  "sizeguide.tip5.title": { es: "Entre tallas", en: "Between sizes" },
  "sizeguide.tip5.desc": { es: "Si estás entre dos tallas, te recomendamos elegir la más grande para mayor comodidad.", en: "If you're between two sizes, we recommend choosing the larger one for comfort." },
  "sizeguide.tip6.title": { es: "¿Dudas?", en: "Questions?" },
  "sizeguide.tip6.desc": { es: "Escríbenos por Instagram y te asesoramos personalmente con tu talla ideal.", en: "Message us on Instagram and we'll personally help you find your ideal size." },

  // FAQ
  "faq.label": { es: "Ayuda", en: "Help" },
  "faq.title": { es: "Preguntas Frecuentes", en: "Frequently Asked Questions" },
  "faq.description": { es: "Todo lo que necesitas saber sobre pedidos, envíos, tallas y devoluciones.", en: "Everything you need to know about orders, shipping, sizes, and returns." },

  // FAQ Items
  "faq.q1": { es: "¿Cómo hago un pedido?", en: "How do I place an order?" },
  "faq.a1": { es: "Puedes hacer tu pedido directamente a través de nuestro Instagram (@hemerza). Selecciona tus productos favoritos, añádelos a tu selección y envíanos tu pedido. Te responderemos con los detalles de envío y pago. Próximamente habilitaremos pedidos vía WhatsApp.", en: "You can place your order directly through our Instagram (@hemerza). Select your favorite products, add them to your selection, and send us your order. We'll respond with shipping and payment details. WhatsApp orders coming soon." },
  "faq.q2": { es: "¿Cuáles son los métodos de pago?", en: "What payment methods do you accept?" },
  "faq.a2": { es: "Aceptamos efectivo (la segunda parte a pagar), transferencia bancaria y Yappy. Los detalles exactos se proporcionan al confirmar tu pedido por Instagram.", en: "We accept cash (second payment), bank transfer, and Yappy. Exact details are provided when confirming your order via Instagram." },
  "faq.q3": { es: "¿Cuánto tarda el envío?", en: "How long does shipping take?" },
  "faq.a3": { es: "Los envíos dentro de Panamá tardan entre 3 a 7 días hábiles. Para piezas por pedido, el tiempo de confección es de 10 a 15 días aproximadamente. También tenemos piezas en stock con entrega inmediata.", en: "Shipping within Panama takes 3 to 7 business days. For made-to-order pieces, production takes approximately 10 to 15 days. We also have in-stock pieces for immediate delivery." },
  "faq.q4": { es: "¿Cuál es la política de abonos?", en: "What is the deposit policy?" },
  "faq.a4": { es: "Todos los pedidos se realizan bajo reserva. Se solicita un abono del 50% o cancelación completa dependiendo la pieza, para confirmar el pedido. En caso de que tu pieza le corresponda abonar el 50%, el restante se paga antes de enviártelo. El abono no es reembolsable. Al realizar el abono, aceptas nuestras condiciones.", en: "All orders are placed as reservations. A 50% deposit or full payment is required depending on the piece, to confirm the order. If your piece requires a 50% deposit, the remainder is paid before shipping. Deposits are non-refundable. By making a deposit, you accept our terms." },
  "faq.q5": { es: "¿Cómo elijo mi talla correcta?", en: "How do I choose the right size?" },
  "faq.a5": { es: "Contamos con una guía de tallas detallada. En general: XS (32-34), S (34-36), M (36-38), L (38-40), XL (40-42). Para un ajuste perfecto, te recomendamos enviarnos tus medidas por Instagram y te asesoramos personalmente.", en: "We have a detailed size guide. In general: XS (32-34), S (34-36), M (36-38), L (38-40), XL (40-42). For a perfect fit, we recommend sending us your measurements via Instagram for personalized advice." },
  "faq.q6": { es: "¿Aceptan cambios o devoluciones?", en: "Do you accept changes or returns?" },
  "faq.a6": { es: "No se realizan cambios ni devoluciones una vez confirmado el pedido. Por eso te recomendamos revisar bien tu talla antes de ordenar. Si tienes dudas, escríbenos por Instagram y te asesoramos.", en: "No changes or returns are made once the order is confirmed. That's why we recommend checking your size carefully before ordering. If you have questions, message us on Instagram and we'll help." },
  "faq.q7": { es: "¿Puedo pedir un diseño personalizado?", en: "Can I request a custom design?" },
  "faq.a7": { es: "¡Por supuesto! En Hemerza creamos piezas únicas adaptadas a tu estilo. Puedes elegir colores, tallas específicas, detalles y acabados. Escríbenos por Instagram con tu idea y te daremos una cotización personalizada.", en: "Of course! At Hemerza, we create unique pieces tailored to your style. You can choose colors, specific sizes, details, and finishes. Message us on Instagram with your idea and we'll give you a personalized quote." },

  // Social
  "social.label": { es: "Síguenos", en: "Follow Us" },
  "social.title": { es: "Redes Sociales", en: "Social Media" },
  "social.description": { es: "Únete a nuestra comunidad y descubre las últimas tendencias, lanzamientos y contenido exclusivo.", en: "Join our community and discover the latest trends, launches, and exclusive content." },

  // Footer
  "footer.cta.title": { es: "¿Lista para brillar?", en: "Ready to shine?" },
  "footer.cta.subtitle": { es: "Únete a la comunidad Hemerza", en: "Join the Hemerza community" },
  "footer.cta.button": { es: "Síguenos en Instagram", en: "Follow us on Instagram" },
  "footer.brand.desc": { es: "Swimwear & Activewear premium para la mujer moderna. Elegancia, fuerza y confianza en cada pieza.", en: "Premium Swimwear & Activewear for the modern woman. Elegance, strength, and confidence in every piece." },
  "footer.brand.quote": { es: "\"Fuerte al moverte.\"", en: "\"Powerful in motion.\"" },
  "footer.nav.title": { es: "Navegación", en: "Navigation" },
  "footer.nav.sizeguide": { es: "Guía de Tallas", en: "Size Guide" },
  "footer.contact.title": { es: "Contacto", en: "Contact" },
  "footer.contact.shipping": { es: "Envíos solo a Panamá", en: "Shipping to Panama only" },
  "footer.social.title": { es: "Redes Sociales", en: "Social Media" },
  "footer.payment.title": { es: "Métodos de pago", en: "Payment methods" },
  "footer.payment.methods": { es: "Efectivo · Transferencia · Yappy", en: "Cash · Bank Transfer · Yappy" },
  "footer.rights": { es: "Todos los derechos reservados.", en: "All rights reserved." },
  "footer.made": { es: "Hecho con", en: "Made with" },
  "footer.location": { es: "en Panamá", en: "in Panama" },

  // Cart
  "cart.title": { es: "Tu Selección", en: "Your Selection" },
  "cart.empty": { es: "Tu selección está vacía", en: "Your selection is empty" },
  "cart.empty.desc": { es: "Explora nuestro catálogo y añade piezas", en: "Explore our catalog and add pieces" },
  "cart.size": { es: "Talla", en: "Size" },
  "cart.total": { es: "Total", en: "Total" },
  "cart.continue": { es: "Continuar con el pedido", en: "Continue with order" },
  "cart.clear": { es: "Vaciar selección", en: "Clear selection" },

  // Order Summary
  "order.title": { es: "Resumen de Pedido", en: "Order Summary" },
  "order.pending": { es: "PENDIENTE", en: "PENDING" },
  "order.client": { es: "Datos del cliente", en: "Client information" },
  "order.products": { es: "Productos", en: "Products" },
  "order.size": { es: "Talla", en: "Size" },
  "order.qty": { es: "Cant", en: "Qty" },
  "order.total": { es: "Total a pagar", en: "Total to pay" },
  "order.note": { es: "Este pedido queda pendiente hasta confirmar el pago. Al enviarlo te coordinaremos el metodo de pago y envio.", en: "This order remains pending until payment is confirmed. Once sent, we'll coordinate the payment method and shipping." },
  "order.choose": { es: "Elige cómo enviar tu pedido", en: "Choose how to send your order" },
  "order.copy": { es: "Copiar resumen al portapapeles", en: "Copy summary to clipboard" },
  "order.copied": { es: "Copiado", en: "Copied" },
  "order.continue_shopping": { es: "Seguir Comprando", en: "Continue Shopping" },
  "order.cancel": { es: "Cancelar", en: "Cancel" },

  // User Login
  "login.title": { es: "¡Hola, reina!", en: "Hello, queen!" },
  "login.subtitle": { es: "Antes de hacer tu pedido, queremos conocerte para brindarte la mejor atención.", en: "Before placing your order, we'd like to get to know you to provide the best service." },
  "login.name": { es: "Nombre completo", en: "Full name" },
  "login.name.placeholder": { es: "Tu nombre", en: "Your name" },
  "login.phone": { es: "Teléfono / WhatsApp", en: "Phone / WhatsApp" },
  "login.instagram": { es: "Instagram", en: "Instagram" },
  "login.instagram.placeholder": { es: "tu_usuario", en: "your_username" },
  "login.email": { es: "Email", en: "Email" },
  "login.email.optional": { es: "(opcional)", en: "(optional)" },
  "login.submit": { es: "Continuar con mi pedido", en: "Continue with my order" },
  "login.privacy": { es: "Tu información solo se usa para procesar tu pedido y darte seguimiento.", en: "Your information is only used to process your order and follow up." },
  "login.error.name": { es: "Tu nombre es requerido", en: "Your name is required" },
  "login.error.phone": { es: "Tu teléfono es requerido", en: "Your phone is required" },
  "login.error.instagram": { es: "Tu usuario de Instagram es requerido", en: "Your Instagram username is required" },

  // Splash
  "splash.tagline": { es: "Fuerte al moverte.", en: "Powerful in motion." },

  // Testimonials content
  "testimonial.1.name": { es: "María G.", en: "María G." },
  "testimonial.1.text": { es: "La calidad de Hemerza es incomparable. Mis leggings se sienten como una segunda piel y el diseño es hermoso.", en: "Hemerza's quality is unmatched. My leggings feel like a second skin and the design is beautiful." },
  "testimonial.2.name": { es: "Valentina R.", en: "Valentina R." },
  "testimonial.2.text": { es: "Compré un bikini para mis vacaciones y recibí tantos cumplidos. La atención personalizada es increíble.", en: "I bought a bikini for my vacation and received so many compliments. The personalized attention is amazing." },
  "testimonial.3.name": { es: "Camila S.", en: "Camila S." },
  "testimonial.3.text": { es: "Me encanta cómo cada pieza de Hemerza me hace sentir poderosa. El set deportivo es perfecto para el gym.", en: "I love how every Hemerza piece makes me feel powerful. The sports set is perfect for the gym." },
  "testimonial.4.name": { es: "Sofía L.", en: "Sofía L." },
  "testimonial.4.text": { es: "Pedí un encargo personalizado y superaron mis expectativas. El ajuste y los materiales son premium de verdad.", en: "I ordered a custom piece and they exceeded my expectations. The fit and materials are truly premium." },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("hemerza-lang") as Language) || "es";
    }
    return "es";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("hemerza-lang", lang);
  };

  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
