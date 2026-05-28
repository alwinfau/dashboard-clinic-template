"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { User, Role } from "@/lib/types"
import { USERS, DEMO_CREDENTIALS } from "@/lib/data"

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    const stored = localStorage.getItem("clinic_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("clinic_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = React.useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      await new Promise((r) => setTimeout(r, 800))
      const expectedPassword = DEMO_CREDENTIALS[email]
      if (!expectedPassword || expectedPassword !== password) {
        return { success: false, error: "Email atau password salah" }
      }
      const foundUser = USERS.find((u) => u.email === email)
      if (!foundUser) {
        return { success: false, error: "Pengguna tidak ditemukan" }
      }
      setUser(foundUser)
      localStorage.setItem("clinic_user", JSON.stringify(foundUser))
      localStorage.setItem("clinic_active", foundUser.clinicIds[0])
      return { success: true }
    },
    []
  )

  const logout = React.useCallback(() => {
    setUser(null)
    localStorage.removeItem("clinic_user")
    localStorage.removeItem("clinic_active")
    router.push("/login")
  }, [router])

  const value = React.useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function useRequireAuth(allowedRoles?: Role[]) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
    if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router, allowedRoles])

  return { user, isLoading }
}
