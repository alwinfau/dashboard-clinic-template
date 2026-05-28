"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { useClinic } from "@/contexts/clinic-context"
import {
  APPOINTMENTS,
  MONTHLY_STATS,
  DIAGNOSIS_STATS,
  VISIT_TREND,
  TRANSACTIONS,
  QUEUE_ITEMS,
  PATIENTS,
} from "@/lib/data"
import {
  UsersIcon,
  TrendingUpIcon,
  ListOrderedIcon,
  StethoscopeIcon,
  CalendarCheckIcon,
  AlertTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react"

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  menunggu: { label: "Menunggu", variant: "secondary" },
  berlangsung: { label: "Berlangsung", variant: "default" },
  selesai: { label: "Selesai", variant: "outline" },
  dibatalkan: { label: "Dibatalkan", variant: "destructive" },
}

function StatCard({
  title,
  value,
  desc,
  icon: Icon,
  trend,
  color,
}: {
  title: string
  value: string
  desc: string
  icon: React.ComponentType<{ className?: string }>
  trend?: { value: number; label: string }
  color: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`size-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend.value >= 0 ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />}
            {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DoctorDashboard() {
  const todayAppts = APPOINTMENTS.filter((a) => a.date === "2026-05-28")
  const myAppts = todayAppts.filter((a) => a.doctorId === "d1")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pasien Hari Ini"
          value={String(myAppts.length)}
          desc="Jadwal praktik hari ini"
          icon={UsersIcon}
          color="bg-blue-100 text-blue-600"
          trend={{ value: 12, label: "vs kemarin" }}
        />
        <StatCard
          title="Sudah Selesai"
          value={String(myAppts.filter((a) => a.status === "selesai").length)}
          desc="Dari total jadwal"
          icon={CheckCircle2Icon}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Sedang Berlangsung"
          value={String(myAppts.filter((a) => a.status === "berlangsung").length)}
          desc="Pasien di ruang periksa"
          icon={StethoscopeIcon}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="Menunggu"
          value={String(myAppts.filter((a) => a.status === "menunggu").length)}
          desc="Antrean tersisa"
          icon={ClockIcon}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Antrian Hari Ini</CardTitle>
            <CardDescription>Daftar pasien yang terjadwal</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {myAppts.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                      {appt.queueNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{appt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{appt.time} · {appt.complaint}</p>
                    </div>
                    <Badge {...STATUS_BADGE[appt.status]}>{STATUS_BADGE[appt.status].label}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Minggu Ini</CardTitle>
            <CardDescription>Kunjungan per hari</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ kunjungan: { label: "Kunjungan", color: "#3b82f6" } }} className="h-56">
              <BarChart data={VISIT_TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="kunjungan" fill="#3b82f6" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KasirDashboard() {
  const todayTx = TRANSACTIONS.filter((t) => t.date === "2026-05-28")
  const totalPendapatan = todayTx.filter((t) => t.status === "lunas").reduce((s, t) => s + t.total, 0)
  const pending = todayTx.filter((t) => t.status === "pending" || t.status === "partial")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pendapatan Hari Ini"
          value={`Rp ${(totalPendapatan / 1000000).toFixed(1)}jt`}
          desc="Total transaksi lunas"
          icon={TrendingUpIcon}
          color="bg-green-100 text-green-600"
          trend={{ value: 8, label: "vs kemarin" }}
        />
        <StatCard
          title="Transaksi Lunas"
          value={String(todayTx.filter((t) => t.status === "lunas").length)}
          desc="Pembayaran selesai"
          icon={CheckCircle2Icon}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Belum Bayar"
          value={String(pending.length)}
          desc="Menunggu pembayaran"
          icon={ClockIcon}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="Total Pasien"
          value={String(todayTx.length)}
          desc="Hari ini"
          icon={UsersIcon}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {pending.length > 0 && (
        <Alert>
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Transaksi Belum Selesai</AlertTitle>
          <AlertDescription>
            Ada {pending.length} transaksi yang belum dilunasi hari ini.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Hari Ini</CardTitle>
          <CardDescription>Daftar pembayaran pasien</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayTx.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs">{tx.patientName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{tx.patientName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{tx.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">Rp {tx.total.toLocaleString("id-ID")}</p>
                  <Badge variant={tx.status === "lunas" ? "outline" : tx.status === "partial" ? "secondary" : "destructive"} className="text-xs">
                    {tx.status === "lunas" ? "Lunas" : tx.status === "partial" ? "Sebagian" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PimpinanDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pasien Bulan Ini"
          value="620"
          desc="+8% dari bulan lalu"
          icon={UsersIcon}
          color="bg-blue-100 text-blue-600"
          trend={{ value: 8, label: "vs bulan lalu" }}
        />
        <StatCard
          title="Pendapatan Bulan Ini"
          value="Rp 89.4jt"
          desc="Total pendapatan bersih"
          icon={TrendingUpIcon}
          color="bg-green-100 text-green-600"
          trend={{ value: 14, label: "vs bulan lalu" }}
        />
        <StatCard
          title="Antrian Aktif"
          value="7"
          desc="Pasien dalam antrian"
          icon={ListOrderedIcon}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="Dokter Aktif"
          value="3"
          desc="Praktek hari ini"
          icon={StethoscopeIcon}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <Tabs defaultValue="pendapatan">
        <TabsList>
          <TabsTrigger value="pendapatan">Pendapatan</TabsTrigger>
          <TabsTrigger value="kunjungan">Kunjungan</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
        </TabsList>
        <TabsContent value="pendapatan">
          <Card>
            <CardHeader>
              <CardTitle>Pendapatan Tahunan</CardTitle>
              <CardDescription>Januari – Desember 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ pendapatan: { label: "Pendapatan (jt)", color: "#3b82f6" } }}
                className="h-64"
              >
                <AreaChart data={MONTHLY_STATS}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} className="text-xs" />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(v) => [`Rp ${Number(v).toLocaleString("id-ID")}`, "Pendapatan"]} />}
                  />
                  <Area type="monotone" dataKey="pendapatan" stroke="#3b82f6" fill="url(#grad)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kunjungan">
          <Card>
            <CardHeader>
              <CardTitle>Kunjungan Pasien Bulanan</CardTitle>
              <CardDescription>Januari – Desember 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ pasien: { label: "Pasien", color: "#10b981" } }}
                className="h-64"
              >
                <BarChart data={MONTHLY_STATS}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="pasien" fill="#10b981" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diagnosis">
          <Card>
            <CardHeader>
              <CardTitle>Top Diagnosis</CardTitle>
              <CardDescription>Distribusi penyakit bulan ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ChartContainer config={{}} className="h-48 w-48 shrink-0">
                  <PieChart>
                    <Pie data={DIAGNOSIS_STATS} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
                      {DIAGNOSIS_STATS.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-3 flex-1 w-full">
                  {DIAGNOSIS_STATS.map((d, i) => (
                    <div key={d.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                          <span>{d.name}</span>
                        </div>
                        <span className="font-medium">{d.value}%</span>
                      </div>
                      <Progress value={d.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Antrian Aktif</CardTitle>
            <CardDescription>Pasien dalam antrian saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-56">
              <div className="space-y-2">
                {QUEUE_ITEMS.filter((q) => q.status !== "selesai").map((q) => (
                  <div key={q.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      q.type === "darurat" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {q.queueNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{q.patientName}</p>
                      <p className="text-xs text-muted-foreground">{q.doctorName}</p>
                    </div>
                    <Badge variant={q.status === "berlangsung" ? "default" : "secondary"} className="text-xs">
                      {q.status === "berlangsung" ? "Berlangsung" : "Menunggu"}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pasien Terbaru</CardTitle>
            <CardDescription>Pendaftaran pasien baru</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-56">
              <div className="space-y-2">
                {PATIENTS.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{p.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.lastVisit ? `Kunjungan: ${p.lastVisit}` : "Belum pernah kunjung"}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{p.gender === "L" ? "Laki-laki" : "Perempuan"}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function GenericDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Antrian Hari Ini" value="7" desc="Total pasien terdaftar" icon={ListOrderedIcon} color="bg-blue-100 text-blue-600" />
        <StatCard title="Sedang Berlangsung" value="1" desc="Dalam pemeriksaan" icon={StethoscopeIcon} color="bg-green-100 text-green-600" />
        <StatCard title="Menunggu" value="5" desc="Belum dipanggil" icon={ClockIcon} color="bg-orange-100 text-orange-600" />
        <StatCard title="Selesai" value="1" desc="Hari ini" icon={CheckCircle2Icon} color="bg-purple-100 text-purple-600" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {QUEUE_ITEMS.slice(0, 5).map((q) => (
              <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-700">{q.queueNumber}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{q.patientName}</p>
                  <p className="text-xs text-muted-foreground">{q.doctorName} · {q.registeredAt}</p>
                </div>
                <Badge variant={q.status === "berlangsung" ? "default" : q.status === "selesai" ? "outline" : "secondary"} className="text-xs capitalize">
                  {q.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PasienDashboard() {
  const myAppts = APPOINTMENTS.filter((a) => a.patientId === "p1")
  const upcomingAppts = myAppts.filter((a) => a.status === "menunggu")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Jadwal Mendatang" value={String(upcomingAppts.length)} desc="Kunjungan terjadwal" icon={CalendarCheckIcon} color="bg-blue-100 text-blue-600" />
        <StatCard title="Total Kunjungan" value={String(myAppts.length)} desc="Riwayat semua kunjungan" icon={StethoscopeIcon} color="bg-green-100 text-green-600" />
        <StatCard title="Resep Aktif" value="2" desc="Obat sedang dikonsumsi" icon={ListOrderedIcon} color="bg-purple-100 text-purple-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jadwal Kunjungan Saya</CardTitle>
          <CardDescription>Riwayat dan jadwal mendatang</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myAppts.map((appt) => (
              <div key={appt.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                  appt.status === "selesai" ? "bg-green-100" : "bg-blue-100"
                }`}>
                  <StethoscopeIcon className={`size-5 ${appt.status === "selesai" ? "text-green-600" : "text-blue-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{appt.doctorName}</p>
                  <p className="text-xs text-muted-foreground">{appt.date} · {appt.time}</p>
                  {appt.complaint && <p className="text-xs text-muted-foreground truncate">{appt.complaint}</p>}
                </div>
                <Badge {...STATUS_BADGE[appt.status]}>{STATUS_BADGE[appt.status].label}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { activeClinic } = useClinic()

  if (!user) return null

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return "Selamat Pagi"
    if (h < 15) return "Selamat Siang"
    if (h < 18) return "Selamat Sore"
    return "Selamat Malam"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{greeting()}, {user.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {activeClinic?.name} · {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {user.role === "dokter" && <DoctorDashboard />}
      {user.role === "kasir" && <KasirDashboard />}
      {user.role === "pimpinan" && <PimpinanDashboard />}
      {user.role === "pasien" && <PasienDashboard />}
      {(user.role === "resepsionis" || user.role === "apoteker") && <GenericDashboard />}
    </div>
  )
}
