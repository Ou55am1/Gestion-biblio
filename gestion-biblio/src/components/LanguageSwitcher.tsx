'use client'
import { useAppStore } from '@/lib/store'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
  const { lang, setLang } = useAppStore()

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-5 h-5 text-gray-500" />
      <select 
        value={lang}
        onChange={(e) => setLang(e.target.value as 'FR' | 'EN' | 'AR')}
        className="bg-transparent border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"
      >
        <option value="FR">Français</option>
        <option value="EN">English</option>
        <option value="AR">العربية</option>
      </select>
    </div>
  )
}
