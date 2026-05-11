import { create } from 'zustand'

export const useUIStore = create((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  themeMode: 'dark',
  toggleTheme: () => set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
  
  // Avatar Preview Modal State
  previewData: null, // { src, name }
  setPreviewData: (data) => set({ previewData: data })
}))
