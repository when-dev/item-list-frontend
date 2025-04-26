import { motion } from 'framer-motion'

const Loader = () => (
  <motion.div
    className="flex justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin" />
  </motion.div>
)

export default Loader
