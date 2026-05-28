"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { MONTHLY_STATS, DIAGNOSIS_STATS, VISIT_TREND, CLINICS } from "@/lib/data"
import { useClinic } from "@/contexts/clinic-context"
import {
  DownloadIcon,
  TrendingUpIcon,
  UsersIcon,
  BarChart3Icon,
  PieChartIcon,
  CalendarIcon,
  BuildingIcon,
} from "lucide-react"

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const DOCTOR_PERFORMANCE = [
  { name: "Dr. Ahmad", pasien: 145, rating: 4.8 },
  { name: "Dr. Lisa", pasien: 120, rating: 4.9 },
  { name: "Dr. Bambang", pasien: 98, rating: 4.6 },
]

const MONTHLY_COMPARISON = MONTHLY_STATS.map((m, i) => ({
  ...m,
  pendapatanPrev: MONTHLY_STATS[Math.max(0, i - 1)]?.pendapatan ?? m.pendapatan * 0.9,
}))

export default function LaporanPage() {
  const [period, setPeriod] = React.useState("2026")
  const { activeClinic, availableClinics } = useClinic()

  const totalPendapatan = MONTHLY_STATS.reduce((s, m) => s + m.pendapatan, 0)
  const totalPasien = MONTHLY_STATS.reduce((s, m) => s + m.pasien, 0)
  const avgPerMonth = totalPendapatan / 12
  const bestMonth = MONTHLY_STATS.reduce((a, b) => a.pendapatan > b.pendapatan ? a : b)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laporan</h1>
          <p className="text-muted-foreground text-sm">Analitik dan laporan kinerja klinik</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <CalendarIcon className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast.info("Ekspor laporan segera hadir")}>
            <DownloadIcon className="mr-2 size-4" />
            Ekspor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">Rp {(totalPendapatan / 1000000000).toFixed(1)}M</p>
            <p className="text-sm text-muted-foreground">Total Pendapatan {period}</p>
            <Badge className="mt-2 bg-green-100 text-green-700 text-xs" variant="secondary">+14% YoY</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{totalPasien.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Pasien {period}</p>
            <Badge className="mt-2 bg-blue-100 text-blue-700 text-xs" variant="secondary">+8% YoY</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">Rp {(avgPerMonth / 1000000).toFixed(0)}jt</p>
            <p className="text-sm text-muted-foreground">Rata-rata per Bulan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{bestMonth.month}</p>
            <p className="text-sm text-muted-foreground">Bulan Terbaik</p>
            <p className="text-xs text-muted-foreground">Rp {(bestMonth.pendapatan / 1000000).toFixed(0)}jt</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendapatan">
        <TabsList>
          <TabsTrigger value="pendapatan">Pendapatan</TabsTrigger>
          <TabsTrigger value="kunjungan">Kunjungan</TabsTrigger>
          <TabsTrigger value="dokter">Kinerja Dokter</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
          {availableClinics.length > 1 && <TabsTrigger value="klinik">Per Klinik</TabsTrigger>}
        </TabsList>

        <TabsContent value="pendapatan" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tren Pendapatan Bulanan</CardTitle>
              <CardDescription>Perbandingan pendapatan {period}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  pendapatan: { label: "Pendapatan", color: "#3b82f6" },
                  pendapatanPrev: { label: "Bulan Lalu", color: "#94a3b8" },
                }}
                className="h-72"
              >
                <AreaChart data={MONTHLY_COMPARISON}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent formatter={(v) => [`Rp ${Number(v).toLocaleString("id-ID")}`, ""]} />} />
                  <Area type="monotone" dataKey="pendapatan" stroke="#3b82f6" fill="url(#grad1)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MONTHLY_STATS.slice(-3).map((m) => (
              <Card key={m.month}>
                <CardContent className="pt-4">
                  <p className="font-semibold">{m.month} {period}</p>
                  <p className="text-xl font-bold mt-1">Rp {(m.pendapatan / 1000000).toFixed(0)}jt</p>
                  <Progress value={m.pendapatan / (bestMonth.pendapatan / 100)} className="mt-2 h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">{m.pasien} pasien</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kunjungan" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Kunjungan Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ pasien: { label: "Pasien", color: "#10b981" } }} className="h-72">
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

          <Card>
            <CardHeader>
              <CardTitle>Kunjungan per Hari (Minggu Ini)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ kunjungan: { label: "Kunjungan", color: "#8b5cf6" } }} className="h-48">
                <BarChart data={VISIT_TREND}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="kunjungan" fill="#8b5cf6" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dokter" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Kinerja Dokter Bulan Ini</CardTitle>
              <CardDescription>Jumlah pasien dan rating kepuasan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {DOCTOR_PERFORMANCE.map((doc) => (
                <div key={doc.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.pasien} pasien</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-yellow-100 text-yellow-700">⭐ {doc.rating}</Badge>
                    </div>
                  </div>
                  <Progress value={(doc.pasien / 150) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64">
                  <PieChart>
                    <Pie
                      data={DIAGNOSIS_STATS}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, value }) => `${name} ${value}%`}
                      labelLine
                    >
                      {DIAGNOSIS_STATS.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Penyakit</CardTitle>
                <CardDescription>Berdasarkan frekuensi diagnosis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {DIAGNOSIS_STATS.map((d, i) => (
                  <div key={d.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                        <span className="font-medium">{d.name}</span>
                      </div>
                      <span className="font-bold">{d.value}%</span>
                    </div>
                    <Progress value={d.value} className="h-2" style={{ "--progress-color": CHART_COLORS[i] } as React.CSSProperties} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {availableClinics.length > 1 && (
          <TabsContent value="klinik" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableClinics.map((clinic) => (
                <Card key={clinic.id} className={activeClinic?.id === clinic.id ? "border-blue-300 bg-blue-50/30" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BuildingIcon className="size-4 text-blue-600" />
                      <CardTitle className="text-sm">{clinic.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="w-fit capitalize">{clinic.type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Total Dokter</p>
                        <p className="font-bold text-lg">{clinic.totalDokter}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Total Pasien</p>
                        <p className="font-bold text-lg">{clinic.totalPasien.toLocaleString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground">{clinic.address}</p>
                      <p className="text-xs text-muted-foreground">{clinic.phone}</p>
                    </div>
                    <Badge
                      className={clinic.status === "aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                      variant="secondary"
                    >
                      {clinic.status === "aktif" ? "Aktif" : "Non-Aktif"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
