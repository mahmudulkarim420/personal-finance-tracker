'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function CapitalEventButton() {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.35, ease: 'backOut' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[13px] px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_28px_rgba(16,185,129,0.45)] transition-all duration-200"
    >
      <Plus className="w-4 h-4" strokeWidth={2.5} />
      Capital Event
    </motion.button>
  )
}
