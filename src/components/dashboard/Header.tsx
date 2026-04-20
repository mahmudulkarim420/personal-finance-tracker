'use client'

import { motion } from 'framer-motion'
import { Search, Bell, HelpCircle } from 'lucide-react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRole } from "@/hooks/use-role";

export default function Header() {
  const { isLoaded, user } = useUser()
  const { role, isLoaded: isRoleLoaded } = useRole()
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex h-16 items-center justify-between rounded-[24px] border border-white/10 bg-[#0D0D0D]/85 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl shrink-0"
    >
      {/* Title */}
      <h1 className="text-[15px] font-semibold text-white tracking-tight">
        Obsidian Lens
      </h1>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#181818] border border-[#272727] rounded-lg px-3 py-1.5 w-64 group hover:border-[#333] transition-colors duration-200">
        <Search className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-[13px] text-neutral-400 placeholder:text-neutral-600 outline-none flex-1 w-full"
        />
        <kbd className="text-[10px] text-neutral-600 bg-[#222] border border-[#333] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 border-r border-white/5 pr-1 mr-1">
          <button className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all duration-200 group">
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-[#0D0D0D] group-hover:scale-110 transition-transform" />
          </button>
          <button className="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all duration-200">
            <HelpCircle className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {isLoaded ? (
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-[13px] font-semibold text-white/90">
                {user?.fullName || user?.username || 'Guest'}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium mt-1 uppercase tracking-tighter">
                {isRoleLoaded ? (role === 'admin' ? 'System Administrator' : 'Standard User') : '...'}
              </span>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative  bg-[#111] hover:border-emerald-500/30 transition-colors duration-300">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-7 h-7",
                      userButtonTrigger: "focus:shadow-none focus:outline-none ring-0",
                      userButtonPopoverCard: "bg-[#0D0D0D] border border-white/10 shadow-2xl rounded-2xl",
                      userButtonPopoverActionButtonText: "text-neutral-300 font-medium",
                      userButtonPopoverActionButton: "hover:bg-white/5 transition-colors",
                      userButtonPopoverFooter: "hidden"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 pl-2 animate-pulse">
            <div className="hidden md:flex flex-col items-end gap-1.5">
              <div className="w-20 h-2.5 bg-white/5 rounded-full" />
              <div className="w-12 h-2 bg-white/5 rounded-full" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5" />
          </div>
        )}
      </div>
    </motion.header>
  )
}
