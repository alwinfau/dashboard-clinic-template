"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { APPOINTMENTS, DOCTORS, PATIENTS } from "@/lib/data"
import type { Appointment } from "@/lib/types"
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  Stethoscope,
  ChevronLeftIcon,
  ChevronRightIcon,
  GridIcon,
  ListIcon,
} from "lucide-react"

const TYPE_COLORS: Record<string, string> = {
  konsultasi: "bg-blue-100 text-blue-700 border-blue-200",
  kontrol: "bg-green-100 text-green-700 border-green-200",
  tindakan: "bg-orange-100 text-orange-700 border-orange-200",
  darurat: "bg-red-100 text-red-700 border-red-200",
}

const STATUS_BADGE_MAP: Record<string, { label: string; className: string }> = {
  menunggu: { label: "Menunggu", className: "bg-yellow-100 text-yellow-700" },
  berlangsung: { label: "Berlangsung", className: "bg-blue-100 text-blue-700" },
  selesai: { label: "Selesai", className: "bg-green-100 text-green-700" },
  dibatalkan: { label: "Dibatalkan", className: "bg-red-100 text-red-700" },
}

function AddAppointmentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Janji Temu</DialogTitle>
          <DialogDescription>Tambahkan jadwal kunjungan pasien</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Pasien *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih pasien" />
              </SelectTrigger>
              <SelectContent>
                {PATIENTS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Dokter *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih dokter" />
              </SelectTrigger>
              <SelectContent>
                {DOCTORS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialization}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tanggal *</Label>
              <Input type="date" defaultValue="2026-05-28" />
            </div>
            <div className="space-y-2">
              <Label>Jam *</Label>
              <Input type="time" defaultValue="09:00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Jenis Kunjungan *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="konsultasi">Konsultasi</SelectItem>
                <SelectItem value="kontrol">Kontrol</SelectItem>
                <SelectItem value="tindakan">Tindakan</SelectItem>
                <SelectItem value="darurat">Darurat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Keluhan / Catatan</Label>
            <Textarea placeholder="Keluhan atau catatan tambahan..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => { toast.success("Jadwal berhasil dibuat"); onClose() }}>
            <PlusIcon className="mr-2 size-4" />
            Buat Jadwal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AppointmentCard({ appt }: { appt: Appointment }) {
  const s = STATUS_BADGE_MAP[appt.status]
  return (
    <div className={`p-3 rounded-lg border ${TYPE_COLORS[appt.type]} space-y-2`}>
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs capitalize">{appt.type}</Badge>
        <span className="text-xs font-medium">{appt.time}</span>
      </div>
      <div>
        <p className="font-semibold text-sm">{appt.patientName}</p>
        <p className="text-xs opacity-70">{appt.doctorName}</p>
      </div>
      {appt.complaint && <p className="text-xs opacity-60 truncate">{appt.complaint}</p>}
      <Badge className={`text-xs ${s.className}`} variant="secondary">{s.label}</Badge>
    </div>
  )
}

export default function JadwalPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date("2026-05-28"))
  const [view, setView] = React.useState<"list" | "grid">("list")
  const [addOpen, setAddOpen] = React.useState(false)
  const [doctorFilter, setDoctorFilter] = React.useState("all")

  const dateStr = selectedDate?.toISOString().split("T")[0] ?? ""
  const dayAppts = APPOINTMENTS.filter((a) => a.date === dateStr)
  const filteredAppts = doctorFilter === "all"
    ? dayAppts
    : dayAppts.filter((a) => a.doctorId === doctorFilter)

  const apptDates = new Set(APPOINTMENTS.map((a) => a.date))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jadwal</h1>
          <p className="text-muted-foreground text-sm">Manajemen jadwal dan janji temu pasien</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Buat Jadwal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                modifiers={{ hasAppt: (d) => apptDates.has(d.toISOString().split("T")[0]) }}
                modifiersClassNames={{ hasAppt: "bg-blue-100 font-bold rounded-full" }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Jadwal Dokter</CardTitle>
              <CardDescription className="text-xs">Jadwal praktik hari ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DOCTORS.map((doc) => {
                const count = dayAppts.filter((a) => a.doctorId === doc.id).length
                return (
                  <div key={doc.id} className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{doc.name.split(" ")[1]?.[0] ?? "D"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{count} px</Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Dokter</SelectItem>
                {DOCTORS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "list" | "grid")}>
                <ToggleGroupItem value="list" size="sm">
                  <ListIcon className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" size="sm">
                  <GridIcon className="size-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate?.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) ?? "Pilih tanggal"}
              </CardTitle>
              <CardDescription>{filteredAppts.length} jadwal terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAppts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <CalendarIcon className="size-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Tidak ada jadwal untuk tanggal ini</p>
                </div>
              ) : view === "list" ? (
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {filteredAppts.map((appt) => {
                      const s = STATUS_BADGE_MAP[appt.status]
                      return (
                        <div key={appt.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="text-center shrink-0">
                            <p className="text-lg font-bold text-blue-600">#{appt.queueNumber}</p>
                            <p className="text-xs text-muted-foreground">{appt.time}</p>
                          </div>
                          <Separator orientation="vertical" className="h-10" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm">{appt.patientName}</p>
                              <Badge variant="outline" className="text-xs capitalize">{appt.type}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{appt.doctorName}</p>
                            {appt.complaint && <p className="text-xs text-muted-foreground truncate">{appt.complaint}</p>}
                          </div>
                          <Badge className={`text-xs shrink-0 ${s.className}`} variant="secondary">{s.label}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <ScrollArea className="h-80">
                  <div className="grid grid-cols-2 gap-3">
                    {filteredAppts.map((appt) => (
                      <AppointmentCard key={appt.id} appt={appt} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Rangkuman Jadwal Bulan Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Jadwal", value: APPOINTMENTS.length, color: "text-blue-600" },
                  { label: "Selesai", value: APPOINTMENTS.filter((a) => a.status === "selesai").length, color: "text-green-600" },
                  { label: "Menunggu", value: APPOINTMENTS.filter((a) => a.status === "menunggu").length, color: "text-yellow-600" },
                  { label: "Dibatalkan", value: APPOINTMENTS.filter((a) => a.status === "dibatalkan").length, color: "text-red-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center p-3 rounded-lg bg-muted/50">
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddAppointmentDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
