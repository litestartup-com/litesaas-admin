import { create } from "zustand"

interface User {
  id: string
  email: string
  name: string
}

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

// Load user from localStorage on initialization
const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("user")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

export const useUser = create<UserStore>((set) => ({
  user: typeof window !== "undefined" ? getStoredUser() : null,
  setUser: (user: User | null) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
    set({ user })
  },
  clearUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    set({ user: null })
  },
}))
