"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const toastStyles = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    text: 'text-emerald-400'
  },
  error: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon: <AlertCircle className="h-5 w-5 text-rose-400" />,
    text: 'text-rose-400'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: <Info className="h-5 w-5 text-blue-400" />,
    text: 'text-blue-400'
  }
};

export const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  console.log('Toast Rendering. Visible:', isVisible, 'Message:', message);
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-8 right-8 z-[9999]"
        >
          <div className={`${toastStyles[type].bg} ${toastStyles[type].border} border backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 shadow-2xl min-w-[300px]`}>
            <div className="flex-shrink-0">
              {toastStyles[type].icon}
            </div>
            <div className={`flex-grow font-medium text-sm ${toastStyles[type].text}`}>
              {message}
            </div>
            <button 
              onClick={onClose}
              className="flex-shrink-0 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
