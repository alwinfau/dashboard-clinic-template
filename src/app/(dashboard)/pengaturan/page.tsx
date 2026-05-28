"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Field } from "@/components/ui/field"
import { useAuth } from "@/contexts/auth-context"
import { useClinic } from "@/contexts/clinic-context"
import {
  UserIcon,
  BuildingIcon,
  BellIcon,
  ShieldIcon,
  PaletteIcon,
  ChevronDownIcon,
  SaveIcon,
  KeyIcon,
  LogOutIcon,
  CheckIcon,
} from "lucide-react"

const ROLE_LABEL: Record<string, string> = {
  dokter: "Dokter",
  pasien: "Pasien",
  kasir: "Kasir",
  resepsionis: "Resepsionis",
  apoteker: "Apoteker",
  pimpinan: "Pimpinan",
}

function ProfileTab() {
  const { user } = useAuth()
  const [name, setName] = React.useState(user?.name ?? "")
  const [phone, setPhone] = React.useState(user?.phone ?? "")

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Update data profil Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge className="mt-1 capitalize" variant="secondary">
                {user?.role && ROLE_LABEL[user.role]}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {user?.specialization && (
              <div className="space-y-2">
                <Label>Spesialisasi</Label>
                <Input value={user.specialization} disabled className="bg-muted" />
              </div>
            )}
            {user?.licenseNumber && (
              <div className="space-y-2">
                <Label>No. SIP/STR</Label>
                <Input value={user.licenseNumber} disabled className="bg-muted" />
              </div>
            )}
          </div>
          <Button onClick={() => toast.success("Profil berhasil diperbarui")}>
            <SaveIcon className="mr-2 size-4" />
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center gap-2">
                <KeyIcon className="size-4 text-muted-foreground" />
                <span className="font-medium text-sm">Ubah Password</span>
              </div>
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <Label>Password Lama</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Password Baru</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Konfirmasi Password Baru</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button onClick={() => toast.success("Password berhasil diubah")}>
                <KeyIcon className="mr-2 size-4" />
                Ubah Password
              </Button>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">
                <LogOutIcon className="mr-2 size-4" />
                Hapus Semua Sesi Aktif
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Semua Sesi?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ini akan menghapus semua sesi aktif di semua perangkat. Anda perlu login ulang.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.success("Semua sesi dihapus")}>
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}

function ClinicTab() {
  const { activeClinic } = useClinic()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Klinik</CardTitle>
          <CardDescription>Data dan konfigurasi klinik aktif</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Klinik</Label>
              <Input defaultValue={activeClinic?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Jenis Klinik</Label>
              <Select defaultValue={activeClinic?.type ?? "umum"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["umum", "spesialis", "gigi", "mata", "anak"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Telepon</Label>
              <Input defaultValue={activeClinic?.phone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue={activeClinic?.email ?? ""} />
            </div>
            <div className="col-span-full space-y-2">
              <Label>Alamat</Label>
              <Textarea defaultValue={activeClinic?.address ?? ""} rows={2} />
            </div>
          </div>
          <Button onClick={() => toast.success("Data klinik berhasil diperbarui")}>
            <SaveIcon className="mr-2 size-4" />
            Simpan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jam Operasional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <Switch defaultChecked={day !== "Sabtu"} id={`day-${day}`} />
              <Label htmlFor={`day-${day}`} className="w-16 cursor-pointer">{day}</Label>
              <Input type="time" defaultValue="08:00" className="w-28" />
              <span className="text-muted-foreground">—</span>
              <Input type="time" defaultValue={day === "Sabtu" ? "12:00" : "17:00"} className="w-28" />
            </div>
          ))}
          <Button className="mt-2" onClick={() => toast.success("Jam operasional diperbarui")}>
            <SaveIcon className="mr-2 size-4" />
            Simpan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationTab() {
  const [settings, setSettings] = React.useState({
    antrianBaru: true,
    jadwalBaru: true,
    pembayaran: true,
    stokRendah: true,
    kontrolPasien: false,
    email: true,
    sms: false,
    push: true,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifikasi Sistem</CardTitle>
          <CardDescription>Atur jenis notifikasi yang ingin diterima</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "antrianBaru", label: "Antrian Baru", desc: "Notifikasi saat pasien mendaftar antrian" },
            { key: "jadwalBaru", label: "Jadwal Baru", desc: "Notifikasi saat janji temu dibuat" },
            { key: "pembayaran", label: "Pembayaran", desc: "Status pembayaran transaksi" },
            { key: "stokRendah", label: "Stok Obat Rendah", desc: "Peringatan saat stok mendekati minimum" },
            { key: "kontrolPasien", label: "Kontrol Pasien", desc: "Pengingat jadwal kontrol pasien" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={settings[key as keyof typeof settings]}
                onCheckedChange={() => toggle(key as keyof typeof settings)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metode Notifikasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "email", label: "Email", desc: "Terima notifikasi via email" },
            { key: "sms", label: "SMS", desc: "Terima notifikasi via SMS" },
            { key: "push", label: "Push Notification", desc: "Notifikasi browser/perangkat" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={settings[key as keyof typeof settings]}
                onCheckedChange={() => toggle(key as keyof typeof settings)}
              />
            </div>
          ))}
          <Button onClick={() => toast.success("Pengaturan notifikasi disimpan")}>
            <SaveIcon className="mr-2 size-4" />
            Simpan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AppearanceTab() {
  const [theme, setTheme] = React.useState("system")
  const [language, setLanguage] = React.useState("id")
  const [density, setDensity] = React.useState("default")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tampilan</CardTitle>
          <CardDescription>Sesuaikan tampilan aplikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Tema</Label>
            <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Terang" },
                { value: "dark", label: "Gelap" },
                { value: "system", label: "Sistem" },
              ].map(({ value, label }) => (
                <div key={value} className="relative">
                  <RadioGroupItem value={value} id={`theme-${value}`} className="sr-only" />
                  <Label
                    htmlFor={`theme-${value}`}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      theme === value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span>{label}</span>
                    {theme === value && <CheckIcon className="size-4 text-blue-500" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Bahasa</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Kepadatan Tampilan</Label>
            <RadioGroup value={density} onValueChange={setDensity} className="space-y-2">
              {[
                { value: "compact", label: "Kompak", desc: "Lebih banyak informasi dalam satu layar" },
                { value: "default", label: "Default", desc: "Keseimbangan antara informasi dan ruang" },
                { value: "comfortable", label: "Nyaman", desc: "Lebih banyak ruang antar elemen" },
              ].map(({ value, label, desc }) => (
                <div key={value} className="flex items-center gap-3">
                  <RadioGroupItem value={value} id={`density-${value}`} />
                  <Label htmlFor={`density-${value}`} className="cursor-pointer">
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button onClick={() => toast.success("Pengaturan tampilan disimpan")}>
            <SaveIcon className="mr-2 size-4" />
            Simpan Pengaturan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PengaturanPage() {
  const { user } = useAuth()
  const isPimpinan = user?.role === "pimpinan"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground text-sm">Kelola preferensi dan konfigurasi akun Anda</p>
      </div>

      <Tabs defaultValue="profil" orientation="vertical" className="flex flex-col sm:flex-row gap-6">
        <TabsList className="flex sm:flex-col h-auto sm:w-48 gap-1 bg-transparent border rounded-lg p-2 shrink-0">
          {[
            { value: "profil", label: "Profil", icon: UserIcon },
            ...(isPimpinan ? [{ value: "klinik", label: "Klinik", icon: BuildingIcon }] : []),
            { value: "notifikasi", label: "Notifikasi", icon: BellIcon },
            { value: "tampilan", label: "Tampilan", icon: PaletteIcon },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="justify-start gap-2 w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1">
          <TabsContent value="profil"><ProfileTab /></TabsContent>
          {isPimpinan && <TabsContent value="klinik"><ClinicTab /></TabsContent>}
          <TabsContent value="notifikasi"><NotificationTab /></TabsContent>
          <TabsContent value="tampilan"><AppearanceTab /></TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
