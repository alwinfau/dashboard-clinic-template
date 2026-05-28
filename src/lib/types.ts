export type Role =
  | "dokter"
  | "pasien"
  | "kasir"
  | "resepsionis"
  | "apoteker"
  | "pimpinan"

export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  email: string
  logo?: string
  type: "umum" | "spesialis" | "gigi" | "mata" | "anak"
  status: "aktif" | "nonaktif"
  totalDokter: number
  totalPasien: number
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  clinicIds: string[]
  specialization?: string
  licenseNumber?: string
  phone?: string
}

export interface Patient {
  id: string
  name: string
  dob: string
  gender: "L" | "P"
  phone: string
  address: string
  bloodType?: string
  allergies?: string[]
  insurance?: string
  insuranceNumber?: string
  registeredAt: string
  lastVisit?: string
  clinicId: string
}

export interface Doctor {
  id: string
  name: string
  specialization: string
  licenseNumber: string
  phone: string
  email: string
  schedule: DoctorSchedule[]
  clinicId: string
}

export interface DoctorSchedule {
  day: string
  startTime: string
  endTime: string
  maxPatients: number
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: "konsultasi" | "kontrol" | "tindakan" | "darurat"
  status: "menunggu" | "berlangsung" | "selesai" | "dibatalkan"
  complaint?: string
  clinicId: string
  queueNumber: number
}

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  diagnosis: string
  symptoms: string
  treatment: string
  prescriptions: Prescription[]
  notes?: string
  followUpDate?: string
  clinicId: string
}

export interface Prescription {
  id: string
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  notes?: string
}

export interface Medicine {
  id: string
  name: string
  category: string
  unit: string
  stock: number
  minStock: number
  price: number
  expiryDate: string
  supplier: string
  clinicId: string
}

export interface Transaction {
  id: string
  patientId: string
  patientName: string
  appointmentId: string
  date: string
  items: TransactionItem[]
  total: number
  paid: number
  paymentMethod: "tunai" | "transfer" | "bpjs" | "asuransi"
  status: "pending" | "lunas" | "partial"
  clinicId: string
}

export interface TransactionItem {
  description: string
  quantity: number
  price: number
  total: number
}

export interface QueueItem {
  id: string
  appointmentId: string
  patientId: string
  patientName: string
  queueNumber: number
  type: "konsultasi" | "kontrol" | "tindakan" | "darurat"
  status: "menunggu" | "dipanggil" | "berlangsung" | "selesai"
  registeredAt: string
  calledAt?: string
  doctorName: string
  clinicId: string
}

export interface StatsData {
  totalPasienHariIni: number
  totalPendapatan: number
  totalAntrian: number
  totalDokterAktif: number
  pasienBaru: number
  tingkatKehadiran: number
}
