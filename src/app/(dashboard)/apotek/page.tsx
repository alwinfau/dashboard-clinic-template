"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
} from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { MEDICINES, MEDICAL_RECORDS } from "@/lib/data"
import type { Medicine } from "@/lib/types"
import {
  PlusIcon,
  SearchIcon,
  AlertTriangleIcon,
  PackageIcon,
  PillIcon,
  CalendarIcon,
  TrendingDownIcon,
  RefreshCwIcon,
  EditIcon,
  TrashIcon,
  CheckCircle2Icon,
} from "lucide-react"

const CATEGORIES = ["Semua", "Antibiotik", "Analgesik", "Antihipertensi", "Antidiabetik", "Antasida", "Antihistamin", "NSAID", "Vitamin"]

function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0) return <Badge variant="destructive" className="text-xs">Habis</Badge>
  if (stock < minStock) return <Badge className="bg-orange-100 text-orange-700 text-xs" variant="secondary">Rendah</Badge>
  return <Badge className="bg-green-100 text-green-700 text-xs" variant="secondary">Aman</Badge>
}

function AddMedicineDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Obat Baru</DialogTitle>
          <DialogDescription>Masukkan informasi obat ke inventaris</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label>Nama Obat *</Label>
            <Input placeholder="Nama obat dan kekuatan" />
          </div>
          <div className="space-y-2">
            <Label>Kategori *</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.slice(1).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Satuan *</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {["Strip", "Botol", "Tube", "Ampul", "Vial", "Sachet"].map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Stok Awal *</Label>
            <Input type="number" placeholder="0" min={0} />
          </div>
          <div className="space-y-2">
            <Label>Stok Minimum *</Label>
            <Input type="number" placeholder="0" min={0} />
          </div>
          <div className="space-y-2">
            <Label>Harga per Satuan *</Label>
            <Input type="number" placeholder="0" min={0} />
          </div>
          <div className="space-y-2">
            <Label>Tanggal Kedaluwarsa *</Label>
            <Input type="date" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Supplier</Label>
            <Input placeholder="Nama supplier" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => { toast.success("Obat berhasil ditambahkan"); onClose() }}>
            <PlusIcon className="mr-2 size-4" />
            Tambah
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RestockDialog({ medicine, open, onClose }: { medicine: Medicine | null; open: boolean; onClose: () => void }) {
  const [qty, setQty] = React.useState([50])
  if (!medicine) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock Obat</DialogTitle>
          <DialogDescription>{medicine.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/50 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Stok Saat Ini</p>
              <p className="font-bold text-lg">{medicine.stock} {medicine.unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stok Minimum</p>
              <p className="font-bold text-lg">{medicine.minStock} {medicine.unit}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Jumlah Restock</Label>
              <span className="font-bold text-blue-600">{qty[0]} {medicine.unit}</span>
            </div>
            <Slider
              min={10}
              max={200}
              step={10}
              value={qty}
              onValueChange={setQty}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span><span>100</span><span>200</span>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-green-200 bg-green-50">
            <p className="text-sm text-green-700">
              Setelah restock: <strong>{medicine.stock + qty[0]} {medicine.unit}</strong>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => { toast.success(`Stok ${medicine.name} ditambah ${qty[0]} ${medicine.unit}`); onClose() }}>
            <RefreshCwIcon className="mr-2 size-4" />
            Konfirmasi Restock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ApotekPage() {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("Semua")
  const [addOpen, setAddOpen] = React.useState(false)
  const [restockTarget, setRestockTarget] = React.useState<Medicine | null>(null)
  const [restockOpen, setRestockOpen] = React.useState(false)
  const [showLowOnly, setShowLowOnly] = React.useState(false)

  const filtered = MEDICINES.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.supplier.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "Semua" || m.category === category
    const matchLow = !showLowOnly || m.stock < m.minStock
    return matchSearch && matchCat && matchLow
  })

  const lowStockCount = MEDICINES.filter((m) => m.stock < m.minStock).length
  const outOfStockCount = MEDICINES.filter((m) => m.stock === 0).length
  const totalValue = MEDICINES.reduce((s, m) => s + m.stock * m.price, 0)

  const pendingPrescriptions = MEDICAL_RECORDS.flatMap((r) => r.prescriptions).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Apotek</h1>
          <p className="text-muted-foreground text-sm">Manajemen stok obat dan resep</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Tambah Obat
        </Button>
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangleIcon className="size-4 text-orange-600" />
          <AlertTitle className="text-orange-700">Peringatan Stok</AlertTitle>
          <AlertDescription className="text-orange-600">
            {outOfStockCount > 0 && <span><strong>{outOfStockCount} obat habis</strong> · </span>}
            {lowStockCount > 0 && <span><strong>{lowStockCount} obat stok rendah</strong></span>}
            {" "}— segera lakukan restock.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{MEDICINES.length}</p>
            <p className="text-sm text-muted-foreground">Total Jenis Obat</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
            <p className="text-sm text-muted-foreground">Stok Rendah</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
            <p className="text-sm text-muted-foreground">Obat Habis</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">Rp {(totalValue / 1000000).toFixed(1)}jt</p>
            <p className="text-sm text-muted-foreground">Nilai Inventaris</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventaris">
        <TabsList>
          <TabsTrigger value="inventaris">Inventaris</TabsTrigger>
          <TabsTrigger value="resep">Resep Masuk</TabsTrigger>
        </TabsList>

        <TabsContent value="inventaris" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama obat atau supplier..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch checked={showLowOnly} onCheckedChange={setShowLowOnly} id="low-stock" />
              <Label htmlFor="low-stock" className="text-sm cursor-pointer">Stok Rendah</Label>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead className="hidden sm:table-cell">Kategori</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead className="hidden md:table-cell">Harga</TableHead>
                    <TableHead className="hidden lg:table-cell">Kedaluwarsa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <PillIcon className="size-8 mx-auto mb-2 opacity-30" />
                        Tidak ada obat ditemukan
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{med.name}</p>
                          <p className="text-xs text-muted-foreground">{med.unit} · {med.supplier}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs">{med.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{med.stock}</p>
                          <Progress
                            value={Math.min(100, (med.stock / (med.minStock * 3)) * 100)}
                            className={`h-1 w-16 ${med.stock < med.minStock ? "[&>div]:bg-orange-500" : ""}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        Rp {med.price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {med.expiryDate}
                      </TableCell>
                      <TableCell>
                        <StockBadge stock={med.stock} minStock={med.minStock} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => { setRestockTarget(med); setRestockOpen(true) }}
                        >
                          <RefreshCwIcon className="mr-1 size-3" />
                          Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resep" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Resep Menunggu Pengambilan</CardTitle>
              <CardDescription>Daftar resep dari rekam medis terbaru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MEDICAL_RECORDS.map((record) => (
                  <div key={record.id} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{record.patientName}</p>
                        <p className="text-xs text-muted-foreground">{record.doctorName} · {record.date}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{record.prescriptions.length} obat</Badge>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      {record.prescriptions.map((rx) => (
                        <div key={rx.id} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="font-medium">{rx.medicineName}</p>
                            <p className="text-xs text-muted-foreground">{rx.dosage} — {rx.frequency}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{rx.duration}</Badge>
                        </div>
                      ))}
                    </div>
                    <Button size="sm" className="w-full text-xs" onClick={() => toast.success(`Resep ${record.patientName} selesai disiapkan`)}>
                      <CheckCircle2Icon className="mr-1 size-3" />
                      Tandai Selesai Disiapkan
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddMedicineDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <RestockDialog medicine={restockTarget} open={restockOpen} onClose={() => setRestockOpen(false)} />
    </div>
  )
}
