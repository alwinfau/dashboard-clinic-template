"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MEDICAL_RECORDS, PATIENTS, DOCTORS } from "@/lib/data"
import type { MedicalRecord, Patient } from "@/lib/types"
import {
  PlusIcon,
  SearchIcon,
  FileTextIcon,
  PillIcon,
  CalendarIcon,
  StethoscopeIcon,
  PrinterIcon,
  DownloadIcon,
  AlertTriangleIcon,
} from "lucide-react"

function RecordDetailSheet({
  record,
  open,
  onClose,
}: {
  record: MedicalRecord | null
  open: boolean
  onClose: () => void
}) {
  if (!record) return null
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Rekam Medis</SheetTitle>
          <SheetDescription>{record.patientName} — {record.date}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="size-10">
              <AvatarFallback>{record.patientName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{record.patientName}</p>
              <p className="text-sm text-muted-foreground">{record.doctorName}</p>
            </div>
            <Badge variant="outline" className="ml-auto">{record.date}</Badge>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangleIcon className="size-4 text-orange-500" />
                Keluhan & Gejala
              </h3>
              <p className="text-sm">{record.symptoms}</p>
            </div>

            <div className="p-4 rounded-lg border space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <StethoscopeIcon className="size-4 text-blue-500" />
                Diagnosis
              </h3>
              <p className="text-sm font-medium">{record.diagnosis}</p>
            </div>

            <div className="p-4 rounded-lg border space-y-3">
              <h3 className="font-semibold text-sm">Tindakan/Pengobatan</h3>
              <p className="text-sm">{record.treatment}</p>
            </div>

            <div className="p-4 rounded-lg border space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <PillIcon className="size-4 text-green-500" />
                Resep ({record.prescriptions.length})
              </h3>
              <div className="space-y-2">
                {record.prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">{rx.medicineName}</p>
                    <p className="text-xs text-muted-foreground">{rx.dosage} — {rx.frequency} — {rx.duration}</p>
                    {rx.notes && <p className="text-xs text-blue-600 mt-1">{rx.notes}</p>}
                  </div>
                ))}
              </div>
            </div>

            {record.followUpDate && (
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 flex items-center gap-2">
                <CalendarIcon className="size-4 text-blue-600" />
                <p className="text-sm text-blue-700">
                  Kontrol: <strong>{record.followUpDate}</strong>
                </p>
              </div>
            )}

            {record.notes && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Catatan</p>
                <p className="text-sm">{record.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => toast.info("Fitur cetak segera hadir")}>
              <PrinterIcon className="mr-2 size-4" />
              Cetak
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => toast.info("Fitur unduh segera hadir")}>
              <DownloadIcon className="mr-2 size-4" />
              Unduh
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function NewRecordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rekam Medis Baru</DialogTitle>
          <DialogDescription>Buat catatan rekam medis untuk kunjungan pasien</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pasien *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Pilih pasien" /></SelectTrigger>
                  <SelectContent>
                    {PATIENTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dokter *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Pilih dokter" /></SelectTrigger>
                  <SelectContent>
                    {DOCTORS.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Keluhan / Gejala *</Label>
              <Textarea placeholder="Deskripsikan keluhan dan gejala pasien..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Diagnosis *</Label>
              <Input placeholder="Masukkan diagnosis" />
            </div>
            <div className="space-y-2">
              <Label>Tindakan/Pengobatan *</Label>
              <Textarea placeholder="Tindakan medis dan rencana pengobatan..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Catatan Tambahan</Label>
              <Textarea placeholder="Catatan tambahan..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Kontrol Berikutnya</Label>
              <Input type="date" />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => { toast.success("Rekam medis berhasil disimpan"); onClose() }}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function RekamMedisPage() {
  const [search, setSearch] = React.useState("")
  const [selectedRecord, setSelectedRecord] = React.useState<MedicalRecord | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [newOpen, setNewOpen] = React.useState(false)

  const filtered = MEDICAL_RECORDS.filter((r) =>
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    r.doctorName.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce<Record<string, MedicalRecord[]>>((acc, r) => {
    const key = r.patientId
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rekam Medis</h1>
          <p className="text-muted-foreground text-sm">Riwayat medis dan resep pasien</p>
        </div>
        <Button onClick={() => setNewOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Rekam Medis Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{MEDICAL_RECORDS.length}</p>
            <p className="text-sm text-muted-foreground">Total Rekam Medis</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{MEDICAL_RECORDS.filter((r) => r.followUpDate).length}</p>
            <p className="text-sm text-muted-foreground">Perlu Kontrol Ulang</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{MEDICAL_RECORDS.reduce((s, r) => s + r.prescriptions.length, 0)}</p>
            <p className="text-sm text-muted-foreground">Total Resep Ditulis</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari pasien, diagnosis, atau dokter..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Daftar Pasien</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(grouped).map(([patientId, records]) => {
                    const patient = PATIENTS.find((p) => p.id === patientId)
                    return (
                      <AccordionItem key={patientId} value={patientId}>
                        <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                          <div className="flex items-center gap-3 text-left">
                            <Avatar className="size-8">
                              <AvatarFallback className="text-xs">{records[0].patientName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{records[0].patientName}</p>
                              <p className="text-xs text-muted-foreground">{records.length} rekam medis</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-4 pb-2 space-y-2">
                            {records.map((r) => (
                              <button
                                key={r.id}
                                onClick={() => { setSelectedRecord(r); setSheetOpen(true) }}
                                className="w-full text-left p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                              >
                                <p className="text-xs font-medium text-muted-foreground">{r.date}</p>
                                <p className="text-sm font-semibold">{r.diagnosis}</p>
                                <p className="text-xs text-muted-foreground">{r.doctorName}</p>
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
                {Object.keys(grouped).length === 0 && (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    <FileTextIcon className="size-8 mx-auto mb-2 opacity-30" />
                    Tidak ada rekam medis ditemukan
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedRecord ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedRecord.patientName}</CardTitle>
                    <CardDescription>{selectedRecord.date} · {selectedRecord.doctorName}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.info("Cetak segera hadir")}>
                      <PrinterIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="rekam">
                  <TabsList className="w-full">
                    <TabsTrigger value="rekam" className="flex-1">Rekam Medis</TabsTrigger>
                    <TabsTrigger value="resep" className="flex-1">Resep</TabsTrigger>
                  </TabsList>
                  <TabsContent value="rekam" className="space-y-4 mt-4">
                    {[
                      { label: "Keluhan/Gejala", value: selectedRecord.symptoms, icon: AlertTriangleIcon, color: "text-orange-500" },
                      { label: "Diagnosis", value: selectedRecord.diagnosis, icon: StethoscopeIcon, color: "text-blue-500" },
                      { label: "Tindakan/Pengobatan", value: selectedRecord.treatment, icon: FileTextIcon, color: "text-green-500" },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="p-4 rounded-lg border">
                        <p className={`font-semibold text-sm flex items-center gap-2 mb-2`}>
                          <Icon className={`size-4 ${color}`} />
                          {label}
                        </p>
                        <p className="text-sm">{value}</p>
                      </div>
                    ))}
                    {selectedRecord.followUpDate && (
                      <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 flex items-center gap-2">
                        <CalendarIcon className="size-4 text-blue-600" />
                        <p className="text-sm text-blue-700">Kontrol: <strong>{selectedRecord.followUpDate}</strong></p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="resep" className="mt-4">
                    <div className="space-y-3">
                      {selectedRecord.prescriptions.map((rx, i) => (
                        <div key={rx.id} className="p-4 rounded-lg border">
                          <div className="flex items-start gap-3">
                            <div className="size-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 shrink-0">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{rx.medicineName}</p>
                              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                <span>Dosis: {rx.dosage}</span>
                                <span>Frekuensi: {rx.frequency}</span>
                                <span>Durasi: {rx.duration}</span>
                              </div>
                              {rx.notes && (
                                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                  <AlertTriangleIcon className="size-3" />
                                  {rx.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground py-16">
                <FileTextIcon className="size-12 mx-auto mb-3 opacity-30" />
                <p>Pilih rekam medis untuk melihat detail</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <RecordDetailSheet record={selectedRecord} open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <NewRecordDialog open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  )
}
