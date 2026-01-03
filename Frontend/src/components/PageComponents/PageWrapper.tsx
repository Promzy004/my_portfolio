import { motion } from "framer-motion";

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}     // start
      animate={{ opacity: 1, y: 0 }}      // enter
      exit={{ opacity: 0, y: -20 }}       // leave
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};