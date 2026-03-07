'use client'
import { useState, useEffect } from 'react'
import { BookTable } from '@/components/BookTable'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useAppStore } from '@/lib/store'
import { dict } from '@/lib/translations'
import { Library, LogOut, Settings } from 'lucide-react'
import { FurnitureManager } from '@/components/FurnitureManager'

export default function Home() {
  const { lang } = useAppStore()
  const t = dict[lang]
  const dir = lang === 'AR' ? 'rtl' : 'ltr'
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [isManagerOpen, setIsManagerOpen] = useState(false)

  useEffect(() => {
    // Basic session persistence for the Access Code
    if (localStorage.getItem('lib_access_code') === process.env.NEXT_PUBLIC_ACCESS_CODE) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessCode === process.env.NEXT_PUBLIC_ACCESS_CODE) {
      localStorage.setItem('lib_access_code', accessCode)
      setIsAuthenticated(true)
    } else {
      alert('Invalid Access Code')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('lib_access_code')
    setAccessCode('')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir={dir}>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-96 flex flex-col items-center">
          <img src="/profile.jpg" alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-100 shadow-sm" />
          <h1 className="text-xl font-bold mb-6 text-gray-800">{t.app_title}</h1>
          <input 
            type="password" 
            placeholder={t.enter_code} 
            value={accessCode} 
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 text-center text-black font-bold text-lg tracking-widest focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 placeholder:text-base"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            {t.access}
          </button>
        </form>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-20" dir={dir}>
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-14 h-14 rounded-md object-contain" />
            <h1 className="font-bold text-xl hidden sm:block text-slate-800">{t.app_title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsManagerOpen(true)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium text-sm border hover:bg-slate-50 px-3 py-1.5 rounded-lg" title={t.manage_furnitures as string}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:block">{t.manage_furnitures as string}</span>
            </button>
            <LanguageSwitcher />
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 transition font-medium text-sm border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg" title={t.logout as string}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">{t.logout as string}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BookTable />
      </div>

      {isManagerOpen && <FurnitureManager onClose={() => setIsManagerOpen(false)} />}
    </main>
  )
}
