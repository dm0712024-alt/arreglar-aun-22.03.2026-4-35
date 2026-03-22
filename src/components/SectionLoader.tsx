import { motion } from "framer-motion";

const SectionLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <motion.div className="flex flex-col items-center gap-3">
      <div className="relative h-8 w-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-accent/20 border-t-accent"
        />
      </div>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Cargando...
      </p>
    </motion.div>
  </div>
);

export default SectionLoader;
