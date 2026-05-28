"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/contexts/auth-context"
import {
  HeartPulseIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  StethoscopeIcon,
  PillIcon,
  ReceiptIcon,
  ClipboardListIcon,
  CrownIcon,
  UserCogIcon,
} from "lucide-react"

const DEMO_ACCOUNTS = [
  { role: "dokter", email: "dokter@klinik.id", password: "dokter123", icon: StethoscopeIcon, color: "bg-blue-100 text-blue-700" },
  { role: "pasien", email: "pasien@klinik.id", password: "pasien123", icon: UserIcon, color: "bg-green-100 text-green-700" },
  { role: "kasir", email: "kasir@klinik.id", password: "kasir123", icon: ReceiptIcon, color: "bg-yellow-100 text-yellow-700" },
  { role: "resepsionis", email: "resepsionis@klinik.id", password: "resepsionis123", icon: ClipboardListIcon, color: "bg-purple-100 text-purple-700" },
  { role: "apoteker", email: "apoteker@klinik.id", password: "apoteker123", icon: PillIcon, color: "bg-orange-100 text-orange-700" },
  { role: "pimpinan", email: "pimpinan@klinik.id", password: "pimpinan123", icon: CrownIcon, color: "bg-red-100 text-red-700" },
]

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (user) router.push("/dashboard")
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    const result = await login(email, password)
    setIsLoading(false)
    if (result.success) {
      toast.success("Login berhasil! Selamat datang.")
      router.push("/dashboard")
    } else {
      setError(result.error ?? "Terjadi kesalahan")
    }
  }

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email)
    setPassword(acc.password)
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <HeartPulseIcon className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KlinikPro</h1>
              <p className="text-sm text-gray-500">Sistem Manajemen Klinik Terpadu</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: StethoscopeIcon, title: "Manajemen Dokter & Jadwal", desc: "Atur jadwal praktik dan antrian pasien dengan mudah" },
              { icon: ClipboardListIcon, title: "Rekam Medis Digital", desc: "Akses riwayat medis pasien kapan saja dan di mana saja" },
              { icon: PillIcon, title: "Manajemen Apotek", desc: "Kelola stok obat dan resep secara real-time" },
              { icon: ReceiptIcon, title: "Laporan Keuangan", desc: "Monitor pendapatan dan pengeluaran klinik" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-3 rounded-lg bg-white/60 border border-gray-100">
                <div className="size-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="demo">Akun Demo</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 lg:hidden mb-2">
                    <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <HeartPulseIcon className="size-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">KlinikPro</span>
                  </div>
                  <CardTitle>Selamat Datang</CardTitle>
                  <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircleIcon className="size-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@klinik.id"
                          className="pl-9"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Spinner className="mr-2" />
                          Memverifikasi...
                        </>
                      ) : (
                        "Masuk"
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500 text-center w-full">
                    Hubungi admin untuk reset password
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="demo">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Akun Demo</CardTitle>
                  <CardDescription>Pilih role untuk mencoba fitur dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon
                    return (
                      <button
                        key={acc.role}
                        onClick={() => {
                          fillDemo(acc)
                          const loginTab = document.querySelector('[data-value="login"]') as HTMLElement
                          loginTab?.click()
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left group"
                      >
                        <div className={`size-8 rounded-md flex items-center justify-center shrink-0 ${acc.color}`}>
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm capitalize text-gray-900">{acc.role}</span>
                            <Badge variant="secondary" className="text-xs">{acc.email}</Badge>
                          </div>
                          <p className="text-xs text-gray-500">Password: {acc.password}</p>
                        </div>
                      </button>
                    )
                  })}
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Separator />
                  <p className="text-xs text-gray-500 text-center">
                    Klik untuk mengisi form login otomatis
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
