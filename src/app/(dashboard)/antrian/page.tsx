"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QUEUE_ITEMS, DOCTORS } from "@/lib/data"
import type { QueueItem } from "@/lib/types"
import {
  BellIcon,
  CheckIcon,
  XIcon,
  PlayIcon,
  RefreshCwIcon,
  ClockIcon,
  AlertTriangleIcon,
  UsersIcon,
  ChevronRightIcon,
  MicIcon,
} from "lucide-react"

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  konsultasi: { label: "Konsultasi", color: "bg-blue-100 text-blue-700" },
  kontrol: { label: "Kontrol", color: "bg-green-100 text-green-700" },
  tindakan: { label: "Tindakan", color: "bg-orange-100 text-orange-700" },
  darurat: { label: "Darurat", color: "bg-red-100 text-red-700" },
}

function QueueCard({
  item,
  onCall,
  onStart,
  onFinish,
  onSkip,
}: {
  item: QueueItem
  onCall: (id: string) => void
  onStart: (id: string) => void
  onFinish: (id: string) => void
  onSkip: (id: string) => void
}) {
  const typeInfo = TYPE_MAP[item.type]
  const isEmergency = item.type === "darurat"

  return (
    <div className={`relative p-4 rounded-xl border ${isEmergency ? "border-red-300 bg-red-50" : "bg-card"} transition-all hover:shadow-sm`}>
      {isEmergency && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-red-600 text-white text-xs animate-pulse">DARURAT</Badge>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className={`size-12 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${
          isEmergency ? "bg-red-600 text-white" : "bg-blue-600 text-white"
        }`}>
          {item.queueNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{item.patientName}</p>
            <Badge className={`text-xs ${typeInfo.color}`} variant="secondary">{typeInfo.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{item.doctorName}</p>
          <p className="text-xs text-muted-foreground">Daftar: {item.registeredAt}</p>
          {item.calledAt && <p className="text-xs text-blue-600">Dipanggil: {item.calledAt}</p>}
        </div>
      </div>

      <Separator className="my-3" />

      <div className="flex gap-2">
        {item.status === "menunggu" && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => onCall(item.id)}>
                  <MicIcon className="mr-1 size-3" />
                  Panggil
                </Button>
              </TooltipTrigger>
              <TooltipContent>Panggil pasien</TooltipContent>
            </Tooltip>
            <Button size="sm" className="flex-1 text-xs" onClick={() => onStart(item.id)}>
              <PlayIcon className="mr-1 size-3" />
              Mulai
            </Button>
          </>
        )}
        {item.status === "dipanggil" && (
          <Button size="sm" className="flex-1 text-xs" onClick={() => onStart(item.id)}>
            <PlayIcon className="mr-1 size-3" />
            Mulai Pemeriksaan
          </Button>
        )}
        {item.status === "berlangsung" && (
          <Button size="sm" variant="outline" className="flex-1 text-xs text-green-600 border-green-300" onClick={() => onFinish(item.id)}>
            <CheckIcon className="mr-1 size-3" />
            Selesai
          </Button>
        )}
        {item.status !== "selesai" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-xs text-destructive">
                <XIcon className="size-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Lewati Antrian?</AlertDialogTitle>
                <AlertDialogDescription>
                  Pasien {item.patientName} akan dilewati dan dapat mendaftar kembali.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => onSkip(item.id)}>Lewati</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

export default function AntrianPage() {
  const [queue, setQueue] = React.useState<QueueItem[]>(QUEUE_ITEMS)
  const [doctorFilter, setDoctorFilter] = React.useState("all")
  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const filteredQueue = doctorFilter === "all"
    ? queue
    : queue.filter((q) => q.doctorName === DOCTORS.find((d) => d.id === doctorFilter)?.name)

  const activeQueue = filteredQueue.filter((q) => q.status !== "selesai")
  const finishedQueue = filteredQueue.filter((q) => q.status === "selesai")
  const emergencyCount = activeQueue.filter((q) => q.type === "darurat").length
  const waitingCount = activeQueue.filter((q) => q.status === "menunggu").length
  const progressPercent = queue.length > 0 ? Math.round((finishedQueue.length / queue.length) * 100) : 0

  const handleCall = (id: string) => {
    setQueue((prev) => prev.map((q) => q.id === id ? { ...q, status: "dipanggil", calledAt: currentTime.toTimeString().slice(0, 5) } : q))
    toast.success("Pasien dipanggil")
  }

  const handleStart = (id: string) => {
    setQueue((prev) => prev.map((q) => q.id === id ? { ...q, status: "berlangsung" } : q))
    toast.info("Pemeriksaan dimulai")
  }

  const handleFinish = (id: string) => {
    setQueue((prev) => prev.map((q) => q.id === id ? { ...q, status: "selesai" } : q))
    toast.success("Pemeriksaan selesai")
  }

  const handleSkip = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id))
    toast.warning("Pasien dilewati")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Antrian</h1>
          <p className="text-muted-foreground text-sm">
            {currentTime.toLocaleTimeString("id-ID")} — Manajemen antrian pasien hari ini
          </p>
        </div>
        <Button variant="outline" onClick={() => setQueue(QUEUE_ITEMS)}>
          <RefreshCwIcon className="mr-2 size-4" />
          Reset
        </Button>
      </div>

      {emergencyCount > 0 && (
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangleIcon className="size-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>{emergencyCount} pasien darurat</strong> dalam antrian — harap segera ditangani!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Antrian", value: queue.length, icon: UsersIcon, color: "text-blue-600" },
          { label: "Menunggu", value: waitingCount, icon: ClockIcon, color: "text-yellow-600" },
          { label: "Berlangsung", value: activeQueue.filter((q) => q.status === "berlangsung").length, icon: PlayIcon, color: "text-green-600" },
          { label: "Selesai", value: finishedQueue.length, icon: CheckIcon, color: "text-gray-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
                <Icon className={`size-6 opacity-50 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress Hari Ini</span>
            <span className="text-sm font-bold">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {finishedQueue.length} dari {queue.length} pasien selesai
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Select value={doctorFilter} onValueChange={setDoctorFilter}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Dokter</SelectItem>
            {DOCTORS.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary">{activeQueue.length} aktif</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activeQueue
          .sort((a, b) => {
            if (a.type === "darurat" && b.type !== "darurat") return -1
            if (b.type === "darurat" && a.type !== "darurat") return 1
            const statusOrder = { berlangsung: 0, dipanggil: 1, menunggu: 2 }
            return (statusOrder[a.status as keyof typeof statusOrder] ?? 3) - (statusOrder[b.status as keyof typeof statusOrder] ?? 3)
          })
          .map((item) => (
            <QueueCard
              key={item.id}
              item={item}
              onCall={handleCall}
              onStart={handleStart}
              onFinish={handleFinish}
              onSkip={handleSkip}
            />
          ))}
        {activeQueue.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <CheckIcon className="size-12 mx-auto mb-3 text-green-500 opacity-60" />
            <p className="font-medium">Semua antrian selesai!</p>
            <p className="text-sm">Tidak ada pasien yang menunggu</p>
          </div>
        )}
      </div>

      {finishedQueue.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Antrian Selesai ({finishedQueue.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {finishedQueue.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 opacity-70">
                  <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {item.queueNumber}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.patientName}</p>
                    <p className="text-xs text-muted-foreground">{item.doctorName}</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-green-600 border-green-300">Selesai</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
