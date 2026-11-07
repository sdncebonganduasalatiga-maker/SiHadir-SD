export type AttendanceStatus = 'hadir' | 'sakit' | 'izin' | 'alpa';
export type UserRole = 'admin' | 'umum';

export interface AuthUser {
  role: UserRole;
  name: string;
  username?: string;
  nisn?: string;
}

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  kelas: string; // e.g. "Kelas 1A", "Kelas 5A"
  jenisKelamin: 'L' | 'P';
  tempatLahir?: string;
  tanggalLahir?: string;
  namaWali: string;
  noHpWali: string;
  foto?: string;
  alamat?: string;
}

export interface Teacher {
  id: string;
  nip: string;
  nuptk?: string;
  nama: string;
  jabatan: string; // e.g. "Kepala Sekolah", "Guru Kelas 5A", "Guru PJOK"
  mataPelajaran: string;
  noHp: string;
  email?: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT / Honorer';
  waliKelas?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  nisn: string;
  nama: string;
  kelas: string;
  tanggal: string; // Format YYYY-MM-DD
  waktu: string; // Format HH:mm:ss
  status: AttendanceStatus;
  terlambat: boolean;
  catatan?: string;
  suhuTubuh?: string; // e.g. "36.5°C"
}

export interface SchoolAnnouncement {
  id: string;
  judul: string;
  tanggal: string;
  kategori: 'akademik' | 'kegiatan' | 'libur' | 'edaran' | 'penting';
  sasaran: 'semua' | 'wali_murid' | 'guru';
  konten: string;
  penulis: string;
  tersemat: boolean;
}

export interface PermissionRequest {
  id: string;
  studentId: string;
  nisn: string;
  nama: string;
  kelas: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  jenis: 'sakit' | 'izin';
  alasan: string;
  namaPengirim: string;
  noHpPengirim: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  createdAt: string;
}

export interface MonthlyStudentRecap {
  student: Student;
  dailyStatus: Record<number, 'H' | 'S' | 'I' | 'A' | '-' | 'L'>; // Date 1-31 -> status code
  totalHadir: number;
  totalSakit: number;
  totalIzin: number;
  totalAlpa: number;
  persentase: number;
}

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  akreditasi: string;
  dinasPendidikan: string;
  alamat: string;
  telepon: string;
  email: string;
  website?: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  jamMasuk: string; // e.g. "07:15"
  jamPulang: string; // e.g. "12:30"
  tahunAjaran: string; // e.g. "2026/2027"
  semester: string; // "Ganjil" | "Genap"
  logoUrl?: string; // base64 DataURL or preset SVG
}

