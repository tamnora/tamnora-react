import { motion } from 'framer-motion'; 

export const ShimmerBox = ({ className }) => (
  <motion.div
    className={`bg-zinc-200 dark:bg-zinc-700 overflow-hidden relative ${className} rounded`}
  >
    <motion.div
      className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity
      }}
    />
  </motion.div>
);