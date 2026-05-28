"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Checkbox } from "@/components/ui/checkbox"
import { TRANSACTIONS } from "@/lib/data"
import type { Transaction } from "@/lib/types"
import {
  PlusIcon,
  SearchIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ReceiptIcon,
  CreditCardIcon,
  BanknoteIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  PrinterIcon,
  DownloadIcon,
  FilterIcon,
} from "lucide-react"

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  tunai: "Tunai",
  transfer: "Transfer",
  bpjs: "BPJS",
  asuransi: "Asuransi",
}

const PAYMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  tunai: BanknoteIcon,
  transfer: CreditCardIcon,
  bpjs: CheckCircle2Icon,
  asuransi: CheckCircle2Icon,
}

function PaymentDialog({ tx, open, onClose }: { tx: Transaction | null; open: boolean; onClose: () => void }) {
  const [method, setMethod] = React.useState("tunai")
  const [amount, setAmount] = React.useState("")

  React.useEffect(() => {
    if (tx) setAmount(String(tx.total - tx.paid))
  }, [tx])

  if (!tx) return null
  const remaining = tx.total - tx.paid

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Proses Pembayaran</DialogTitle>
          <DialogDescription>{tx.patientName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            {tx.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.description} × {item.quantity}</span>
                <span>Rp {item.total.toLocaleString("id-ID")}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>Rp {tx.total.toLocaleString("id-ID")}</span>
            </div>
            {tx.paid > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Sudah Bayar</span>
                <span>Rp {tx.paid.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-blue-600">
              <span>Sisa Bayar</span>
              <span>Rp {remaining.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_METHOD_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Jumlah Bayar</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(remaining)}
            />
          </div>
          {Number(amount) > remaining && (
            <Alert>
              <AlertDescription className="text-green-600">
                Kembalian: Rp {(Number(amount) - remaining).toLocaleString("id-ID")}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={() => { toast.success("Pembayaran berhasil dicatat"); onClose() }}>
            <CheckCircle2Icon className="mr-2 size-4" />
            Konfirmasi Bayar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InvoiceDialog({ tx, open, onClose }: { tx: Transaction | null; open: boolean; onClose: () => void }) {
  if (!tx) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invoice</DialogTitle>
          <DialogDescription>#{tx.id.toUpperCase()}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center p-4 border rounded-lg">
            <h3 className="font-bold text-lg">Klinik Sehat Bersama</h3>
            <p className="text-xs text-muted-foreground">Jl. Sudirman No. 45, Jakarta Pusat</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><p className="text-muted-foreground">Pasien</p><p className="font-medium">{tx.patientName}</p></div>
            <div><p className="text-muted-foreground">Tanggal</p><p className="font-medium">{tx.date}</p></div>
            <div><p className="text-muted-foreground">Pembayaran</p><p className="font-medium capitalize">{PAYMENT_METHOD_LABEL[tx.paymentMethod]}</p></div>
            <div><p className="text-muted-foreground">Status</p>
              <Badge variant={tx.status === "lunas" ? "outline" : "secondary"} className="text-xs capitalize">{tx.status}</Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            {tx.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.description} × {item.quantity}</span>
                <span>Rp {item.total.toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>Rp {tx.total.toLocaleString("id-ID")}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => toast.info("Cetak belum tersedia")}>
            <PrinterIcon className="mr-2 size-4" />
            Cetak
          </Button>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function KeuanganPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [paymentTx, setPaymentTx] = React.useState<Transaction | null>(null)
  const [invoiceTx, setInvoiceTx] = React.useState<Transaction | null>(null)

  const filtered = TRANSACTIONS.filter((t) => {
    const matchSearch = t.patientName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalLunas = TRANSACTIONS.filter((t) => t.status === "lunas").reduce((s, t) => s + t.total, 0)
  const totalPending = TRANSACTIONS.filter((t) => t.status !== "lunas").reduce((s, t) => s + (t.total - t.paid), 0)

  const paymentMethodStats = Object.entries(
    TRANSACTIONS.reduce<Record<string, number>>((acc, t) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] ?? 0) + t.total
      return acc
    }, {})
  ).map(([method, total]) => ({ method: PAYMENT_METHOD_LABEL[method], total }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Keuangan</h1>
          <p className="text-muted-foreground text-sm">Manajemen transaksi dan pembayaran</p>
        </div>
        <Button variant="outline" onClick={() => toast.info("Ekspor laporan segera hadir")}>
          <DownloadIcon className="mr-2 size-4" />
          Ekspor
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="size-5 text-green-500" />
              <p className="text-2xl font-bold">Rp {(totalLunas / 1000000).toFixed(1)}jt</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Pendapatan Hari Ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="size-5 text-orange-500" />
              <p className="text-2xl font-bold">Rp {(totalPending / 1000000).toFixed(1)}jt</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Tagihan Belum Lunas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{TRANSACTIONS.filter((t) => t.status === "lunas").length}</p>
            <p className="text-sm text-muted-foreground">Transaksi Lunas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{TRANSACTIONS.filter((t) => t.status !== "lunas").length}</p>
            <p className="text-sm text-muted-foreground">Transaksi Tertunda</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transaksi">
        <TabsList>
          <TabsTrigger value="transaksi">Transaksi</TabsTrigger>
          <TabsTrigger value="statistik">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="transaksi" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari pasien atau ID transaksi..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <FilterIcon className="size-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
                <SelectItem value="partial">Sebagian</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pasien</TableHead>
                    <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                    <TableHead className="hidden md:table-cell">Pembayaran</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Tidak ada transaksi ditemukan
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((tx) => {
                    const Icon = PAYMENT_ICONS[tx.paymentMethod] ?? ReceiptIcon
                    return (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{tx.patientName}</p>
                            <p className="text-xs text-muted-foreground">{tx.id.toUpperCase()}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{tx.date}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Icon className="size-4 text-muted-foreground" />
                            <span className="text-sm">{PAYMENT_METHOD_LABEL[tx.paymentMethod]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-sm">Rp {tx.total.toLocaleString("id-ID")}</p>
                            {tx.paid < tx.total && (
                              <p className="text-xs text-orange-600">
                                Sisa: Rp {(tx.total - tx.paid).toLocaleString("id-ID")}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={tx.status === "lunas" ? "outline" : tx.status === "partial" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {tx.status === "lunas" ? "Lunas" : tx.status === "partial" ? "Sebagian" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            {tx.status !== "lunas" && (
                              <Button size="sm" className="text-xs" onClick={() => setPaymentTx(tx)}>
                                Bayar
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="text-xs" onClick={() => setInvoiceTx(tx)}>
                              <ReceiptIcon className="size-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistik" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan per Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ total: { label: "Total (Rp)", color: "#3b82f6" } }} className="h-48">
                  <BarChart data={paymentMethodStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} className="text-xs" />
                    <YAxis type="category" dataKey="method" width={70} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent formatter={(v) => [`Rp ${Number(v).toLocaleString("id-ID")}`, "Total"]} />} />
                    <Bar dataKey="total" fill="#3b82f6" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Total Transaksi", value: TRANSACTIONS.length },
                  { label: "Transaksi Lunas", value: TRANSACTIONS.filter((t) => t.status === "lunas").length },
                  { label: "Transaksi Pending", value: TRANSACTIONS.filter((t) => t.status === "pending").length },
                  { label: "Metode BPJS", value: TRANSACTIONS.filter((t) => t.paymentMethod === "bpjs").length },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <PaymentDialog tx={paymentTx} open={!!paymentTx} onClose={() => setPaymentTx(null)} />
      <InvoiceDialog tx={invoiceTx} open={!!invoiceTx} onClose={() => setInvoiceTx(null)} />
    </div>
  )
}
