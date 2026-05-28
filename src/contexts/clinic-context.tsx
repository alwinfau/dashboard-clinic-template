"use client"

import * as React from "react"
import type { Clinic } from "@/lib/types"
import { CLINICS } from "@/lib/data"
import { useAuth } from "./auth-context"

interface ClinicContextValue {
  activeClinic: Clinic | null
  availableClinics: Clinic[]
  switchClinic: (clinicId: string) => void
}

const ClinicContext = React.createContext<ClinicContextValue | null>(null)

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [activeClinicId, setActiveClinicId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (user) {
      const stored = localStorage.getItem("clinic_active")
      const validId = stored && user.clinicIds.includes(stored) ? stored : user.clinicIds[0]
      setActiveClinicId(validId ?? null)
    }
  }, [user])

  const availableClinics = React.useMemo(
    () => CLINICS.filter((c) => user?.clinicIds.includes(c.id)),
    [user]
  )

  const activeClinic = React.useMemo(
    () => CLINICS.find((c) => c.id === activeClinicId) ?? null,
    [activeClinicId]
  )

  const switchClinic = React.useCallback((clinicId: string) => {
    setActiveClinicId(clinicId)
    localStorage.setItem("clinic_active", clinicId)
  }, [])

  const value = React.useMemo(
    () => ({ activeClinic, availableClinics, switchClinic }),
    [activeClinic, availableClinics, switchClinic]
  )

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
}

export function useClinic() {
  const ctx = React.useContext(ClinicContext)
  if (!ctx) throw new Error("useClinic must be used within ClinicProvider")
  return ctx
}
