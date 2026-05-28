"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/auth-context"
import { ClinicProvider, useClinic } from "@/contexts/clinic-context"
import type { Role } from "@/lib/types"
import {
  LayoutDashboardIcon,
  UsersIcon,
  CalendarIcon,
  ListOrderedIcon,
  FileTextIcon,
  PillIcon,
  ReceiptIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  HeartPulseIcon,
  BuildingIcon,
  ChevronDownIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  CheckCircle2Icon,
  UserCogIcon,
} from "lucide-react"

type NavItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles: Role[]
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
    roles: ["dokter", "kasir", "resepsionis", "apoteker", "pimpinan", "pasien"],
  },
  {
    title: "Data Pasien",
    url: "/pasien",
    icon: UsersIcon,
    roles: ["dokter", "resepsionis", "pimpinan"],
  },
  {
    title: "Jadwal",
    url: "/jadwal",
    icon: CalendarIcon,
    roles: ["dokter", "resepsionis", "pimpinan", "pasien"],
  },
  {
    title: "Antrian",
    url: "/antrian",
    icon: ListOrderedIcon,
    badge: 7,
    roles: ["dokter", "kasir", "resepsionis", "pimpinan"],
  },
  {
    title: "Rekam Medis",
    url: "/rekam-medis",
    icon: FileTextIcon,
    roles: ["dokter", "pimpinan"],
  },
  {
    title: "Apotek",
    url: "/apotek",
    icon: PillIcon,
    badge: 2,
    roles: ["apoteker", "dokter", "pimpinan"],
  },
  {
    title: "Keuangan",
    url: "/keuangan",
    icon: ReceiptIcon,
    roles: ["kasir", "pimpinan"],
  },
  {
    title: "Laporan",
    url: "/laporan",
    icon: BarChart3Icon,
    roles: ["pimpinan"],
  },
  {
    title: "Pengaturan",
    url: "/pengaturan",
    icon: SettingsIcon,
    roles: ["pimpinan", "dokter", "kasir", "resepsionis", "apoteker", "pasien"],
  },
]

const ROLE_LABEL: Record<Role, string> = {
  dokter: "Dokter",
  pasien: "Pasien",
  kasir: "Kasir",
  resepsionis: "Resepsionis",
  apoteker: "Apoteker",
  pimpinan: "Pimpinan",
}

const ROLE_COLOR: Record<Role, string> = {
  dokter: "bg-blue-100 text-blue-700",
  pasien: "bg-green-100 text-green-700",
  kasir: "bg-yellow-100 text-yellow-700",
  resepsionis: "bg-purple-100 text-purple-700",
  apoteker: "bg-orange-100 text-orange-700",
  pimpinan: "bg-red-100 text-red-700",
}

function getBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const map: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/pasien": "Data Pasien",
    "/jadwal": "Jadwal",
    "/antrian": "Antrian",
    "/rekam-medis": "Rekam Medis",
    "/apotek": "Apotek",
    "/keuangan": "Keuangan",
    "/laporan": "Laporan",
    "/pengaturan": "Pengaturan",
  }
  const label = map[pathname] ?? "Halaman"
  if (pathname === "/dashboard") return [{ label }]
  return [{ label: "Dashboard", href: "/dashboard" }, { label }]
}

function AppSidebar() {
  const { user, logout } = useAuth()
  const { activeClinic, availableClinics, switchClinic } = useClinic()
  const pathname = usePathname()
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)

  const toggleDark = () => {
    setIsDark((v) => {
      const next = !v
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  const filteredNav = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role))

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              {user?.role === "pimpinan" && availableClinics.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                      <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <HeartPulseIcon className="size-4 text-white" />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold text-sm truncate">{activeClinic?.name ?? "KlinikPro"}</span>
                        <span className="text-xs text-muted-foreground">{activeClinic?.type ?? "Klinik"}</span>
                      </div>
                      <ChevronDownIcon className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Pilih Klinik</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableClinics.map((c) => (
                      <DropdownMenuItem
                        key={c.id}
                        onClick={() => {
                          switchClinic(c.id)
                          toast.success(`Beralih ke ${c.name}`)
                        }}
                        className="flex items-center gap-2"
                      >
                        <BuildingIcon className="size-4" />
                        <div className="flex-1">
                          <p className="text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{c.type}</p>
                        </div>
                        {activeClinic?.id === c.id && <CheckCircle2Icon className="size-4 text-blue-600" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SidebarMenuButton size="lg">
                  <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <HeartPulseIcon className="size-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-sm truncate">{activeClinic?.name ?? "KlinikPro"}</span>
                    <span className="text-xs text-muted-foreground">{activeClinic?.type ?? "Klinik"}</span>
                  </div>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNav.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                    <ChevronDownIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      {user?.role && (
                        <Badge className={`text-xs w-fit mt-1 ${ROLE_COLOR[user.role]}`} variant="secondary">
                          {ROLE_LABEL[user.role]}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleDark}>
                    {isDark ? <SunIcon className="mr-2 size-4" /> : <MoonIcon className="mr-2 size-4" />}
                    {isDark ? "Mode Terang" : "Mode Gelap"}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pengaturan">
                      <UserCogIcon className="mr-2 size-4" />
                      Profil Saya
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setLogoutDialogOpen(true)}
                  >
                    <LogOutIcon className="mr-2 size-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Keluar</DialogTitle>
            <DialogDescription>
              Anda yakin ingin keluar dari sistem? Sesi aktif akan dihapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                logout()
                toast.info("Anda telah keluar.")
              }}
            >
              <LogOutIcon className="mr-2 size-4" />
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function DashboardHeader() {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumb(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.label}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="relative">
              <BellIcon className="size-4" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifikasi</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <HeartPulseIcon className="size-8 text-blue-600 mx-auto animate-pulse" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) return null
  return <>{children}</>
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ClinicProvider>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <DashboardHeader />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </ClinicProvider>
    </AuthGuard>
  )
}
