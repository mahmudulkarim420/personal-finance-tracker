'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, HelpCircle } from 'lucide-react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRole } from "@/hooks/use-role"
import dynamic from 'next/dynamic'

// Lazy-load heavy components
const CommandSearch = dynamic(() => import('@/components/CommandSearch'), { ssr: false })
const NotificationDropdown = dynamic(() => import('@/components/NotificationDropdown'), { ssr: false })

export default function Header() {
  const { isLoaded, user } = useUser()
  const { role, isLoaded: isRoleLoaded } = useRole()

  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const bellRef = useRef<HTMLButtonElement>(null)

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
        setNotifOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const openSearch = useCallback(() => {
    setSearchOpen(true)
    setNotifOpen(false)
  }, [])

  const toggleNotif = useCallback(() => {
    setNotifOpen((prev) => !prev)
    setSearchOpen(false)
  }, [])

  return (
    <>
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

        {/* Search trigger */}
        <button
          id="cmd-search-trigger"
          onClick={openSearch}
          className="flex items-center gap-2 bg-[#181818] border border-[#272727] rounded-lg px-3 py-1.5 w-64 group hover:border-[#333] transition-colors duration-200 text-left"
          aria-label="Open command search (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-neutral-500 shrink-0" strokeWidth={2} />
          <span className="text-[13px] text-neutral-600 flex-1">Search transactions, pages…</span>
          <kbd className="text-[10px] text-neutral-600 bg-[#222] border border-[#333] rounded px-1.5 py-0.5 font-mono shrink-0">
            ⌘K
          </kbd>
        </button>

        {/* Right icons */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 border-r border-white/5 pr-1 mr-1">
            {/* Bell */}
            <div className="relative">
              <button
                ref={bellRef}
                id="notification-bell"
                onClick={toggleNotif}
                className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all duration-200 group"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" strokeWidth={1.5} />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-[#0D0D0D] group-hover:scale-110 transition-transform" />
                )}
              </button>

              {/* Notification dropdown — portalled to body to escape stacking context */}
              <NotificationDropdown
                anchorRef={bellRef}
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
                onUnreadChange={setHasUnread}
              />
            </div>

            <button
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all duration-200"
              aria-label="Help"
            >
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
                <div className="relative bg-[#111] hover:border-emerald-500/30 transition-colors duration-300">
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

      {/* Command Search — rendered outside header to avoid z-index clipping */}
      <CommandSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
