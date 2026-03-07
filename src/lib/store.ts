import { create } from 'zustand'

type Lang = 'FR' | 'EN' | 'AR'

interface AppState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useAppStore = create<AppState>((set) => ({
  lang: 'FR',
  setLang: (lang) => set({ lang }),
}))
