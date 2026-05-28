"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { PATIENTS } from "@/lib/data"
import type { Patient } from "@/lib/types"
import {
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  FilterIcon,
  DownloadIcon,
  UserPlusIcon,
  HeartIcon,
  AlertTriangleIcon,
} from "lucide-react"

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

function PatientDetailDialog({ patient, open, onClose }: { patient: Patient | null; open: boolean; onClose: () => void }) {
  if (!patient) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Pasien</DialogTitle>
          <DialogDescription>Informasi lengkap pasien</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="info">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">Informasi</TabsTrigger>
            <TabsTrigger value="medis" className="flex-1">Data Medis</TabsTrigger>
            <TabsTrigger value="riwayat" className="flex-1">Riwayat</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-xl">{patient.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{patient.name}</h3>
                <p className="text-muted-foreground text-sm">ID: {patient.id.toUpperCase()}</p>
                <Badge variant="outline" className="mt-1">{patient.gender === "L" ? "Laki-laki" : "Perempuan"}</Badge>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Tanggal Lahir", value: patient.dob, icon: CalendarIcon },
                { label: "Telepon", value: patient.phone, icon: PhoneIcon },
                { label: "Alamat", value: patient.address, icon: MapPinIcon },
                { label: "Asuransi", value: patient.insurance ?? "-", icon: HeartIcon },
                { label: "No. Asuransi", value: patient.insuranceNumber ?? "-" },
                { label: "Terdaftar", value: patient.registeredAt },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <p className="text-muted-foreground font-medium flex items-center gap-1">
                    {Icon && <Icon className="size-3" />}
                    {label}
                  </p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="medis" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground">Golongan Darah</p>
                <p className="font-bold text-xl text-red-600">{patient.bloodType ?? "-"}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground">Kunjungan Terakhir</p>
                <p className="font-bold">{patient.lastVisit ?? "Belum pernah"}</p>
              </div>
            </div>
            {patient.allergies && patient.allergies.length > 0 && (
              <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangleIcon className="size-4 text-orange-600" />
                  <span className="font-medium text-orange-700 text-sm">Alergi</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {patient.allergies.map((a) => (
                    <Badge key={a} className="bg-orange-100 text-orange-700">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="riwayat" className="mt-4">
            <div className="text-center py-8 text-muted-foreground text-sm">
              <CalendarIcon className="size-8 mx-auto mb-2 opacity-40" />
              Riwayat kunjungan tersedia di modul Rekam Medis
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          <Button>Edit Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddPatientDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tambah Pasien Baru</DialogTitle>
          <DialogDescription>Isi data pasien baru</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4 p-1">
            <div className="col-span-2 space-y-2">
              <Label>Nama Lengkap *</Label>
              <Input placeholder="Masukkan nama lengkap" />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Lahir *</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Jenis Kelamin *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>No. Telepon *</Label>
              <Input placeholder="08xxxxxxxxxx" />
            </div>
            <div className="space-y-2">
              <Label>Golongan Darah</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Alamat</Label>
              <Textarea placeholder="Masukkan alamat lengkap" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Asuransi</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bpjs">BPJS</SelectItem>
                  <SelectItem value="mandiri">Asuransi Mandiri</SelectItem>
                  <SelectItem value="allianz">Allianz</SelectItem>
                  <SelectItem value="umum">Umum (Pribadi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>No. Asuransi</Label>
              <Input placeholder="Nomor polis / kartu" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Alergi (pisahkan dengan koma)</Label>
              <Input placeholder="Penisilin, Aspirin, ..." />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => { toast.success("Pasien berhasil ditambahkan"); onClose() }}>
            <UserPlusIcon className="mr-2 size-4" />
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PasienPage() {
  const [search, setSearch] = React.useState("")
  const [genderFilter, setGenderFilter] = React.useState<string>("all")
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [addOpen, setAddOpen] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const PER_PAGE = 6

  const filtered = PATIENTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.id.includes(search.toLowerCase())
    const matchGender = genderFilter === "all" || p.gender === genderFilter
    return matchSearch && matchGender
  })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === paginated.length ? [] : paginated.map((p) => p.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Pasien</h1>
          <p className="text-muted-foreground text-sm">Kelola data seluruh pasien klinik</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Tambah Pasien
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{PATIENTS.length}</div>
            <p className="text-sm text-muted-foreground">Total Pasien</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{PATIENTS.filter((p) => p.lastVisit?.startsWith("2026-05")).length}</div>
            <p className="text-sm text-muted-foreground">Kunjungan Bulan Ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{PATIENTS.filter((p) => p.insurance).length}</div>
            <p className="text-sm text-muted-foreground">Pasien Berasuransi</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, telepon, atau ID..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <Select value={genderFilter} onValueChange={(v) => { setGenderFilter(v); setPage(1) }}>
              <SelectTrigger className="w-40">
                <FilterIcon className="size-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Gender</SelectItem>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
            {selectedIds.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => toast.info(`${selectedIds.length} pasien diekspor`)}>
                <DownloadIcon className="mr-2 size-4" />
                Ekspor ({selectedIds.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead className="hidden md:table-cell">Tanggal Lahir</TableHead>
                <TableHead className="hidden sm:table-cell">Telepon</TableHead>
                <TableHead className="hidden lg:table-cell">Asuransi</TableHead>
                <TableHead className="hidden lg:table-cell">Kunjungan Terakhir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <SearchIcon className="size-8 mx-auto mb-2 opacity-40" />
                    Tidak ada pasien ditemukan
                  </TableCell>
                </TableRow>
              ) : paginated.map((patient) => (
                <TableRow key={patient.id} className="group">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(patient.id)}
                      onCheckedChange={() => toggleSelect(patient.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center gap-3 cursor-pointer">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">{patient.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{patient.name}</p>
                            <p className="text-xs text-muted-foreground">{patient.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Badge variant="outline">{patient.gender === "L" ? "Laki-laki" : "Perempuan"}</Badge>
                            {patient.bloodType && <Badge className="bg-red-100 text-red-700">{patient.bloodType}</Badge>}
                          </div>
                          <p className="text-sm">{patient.address}</p>
                          {patient.allergies && patient.allergies.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-orange-600">
                              <AlertTriangleIcon className="size-3" />
                              Alergi: {patient.allergies.join(", ")}
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{patient.dob}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{patient.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {patient.insurance ? (
                      <Badge variant="secondary" className="text-xs">{patient.insurance}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {patient.lastVisit ?? <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedPatient(patient); setDetailOpen(true) }}>
                          <EyeIcon className="mr-2 size-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <EditIcon className="mr-2 size-4" />
                          Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Fungsi hapus tidak tersedia di demo")}>
                          <TrashIcon className="mr-2 size-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink onClick={() => setPage(p)} isActive={page === p}>{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <PatientDetailDialog patient={selectedPatient} open={detailOpen} onClose={() => setDetailOpen(false)} />
      <AddPatientDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
