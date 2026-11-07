import { Student, Teacher, AttendanceRecord, SchoolAnnouncement, PermissionRequest } from '../types';

import { PRESET_LOGOS } from '../utils/schoolLogos';

export const INITIAL_SCHOOL_INFO = {
  namaSekolah: 'SD Negeri 1 Nusantara',
  npsn: '20104567',
  akreditasi: 'A (Unggul)',
  dinasPendidikan: 'Pemerintah Kota Bahari · Dinas Pendidikan dan Kebudayaan',
  alamat: 'Jl. Ki Hajar Dewantara No. 45, Kota Bahari, Jawa Barat',
  telepon: '(021) 8765-4321',
  email: 'sdn1nusantara@sekolah.belajar.id',
  website: 'https://sdn1nusantara.sch.id',
  kepalaSekolah: 'Dra. Hj. Siti Aminah, M.Pd.',
  nipKepalaSekolah: '19720514 199803 2 004',
  jamMasuk: '07:15',
  jamPulang: '12:30',
  tahunAjaran: '2026/2027',
  semester: 'Ganjil',
  logoUrl: PRESET_LOGOS[0].svgDataUri
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    nip: '19720514 199803 2 004',
    nuptk: '4567750652200002',
    nama: 'Dra. Hj. Siti Aminah, M.Pd.',
    jabatan: 'Kepala Sekolah',
    mataPelajaran: 'Manajerial & Supervisi',
    noHp: '0812-3456-7890',
    email: 'siti.aminah@guru.sd.belajar.id',
    statusKepegawaian: 'PNS'
  },
  {
    id: 't-2',
    nip: '19840312 201001 1 018',
    nuptk: '7823762663100013',
    nama: 'Bambang Sudarsono, S.Pd.',
    jabatan: 'Wali Kelas 5A',
    mataPelajaran: 'Tematik (Guru Kelas)',
    noHp: '0813-8899-2311',
    email: 'bambang.sudarsono@guru.sd.belajar.id',
    statusKepegawaian: 'PNS',
    waliKelas: 'Kelas 5A'
  },
  {
    id: 't-3',
    nip: '19890722 201903 2 009',
    nuptk: '1245767669200022',
    nama: 'Dewi Rahmawati, S.Pd.SD',
    jabatan: 'Wali Kelas 1A',
    mataPelajaran: 'Tematik (Guru Kelas)',
    noHp: '0857-1122-3344',
    email: 'dewi.rahmawati@guru.sd.belajar.id',
    statusKepegawaian: 'PNS',
    waliKelas: 'Kelas 1A'
  },
  {
    id: 't-4',
    nip: '19920115 202221 1 005',
    nuptk: '9034770671100031',
    nama: 'Rizky Pratama, S.Pd.',
    jabatan: 'Guru PJOK',
    mataPelajaran: 'Pendidikan Jasmani & Olahraga',
    noHp: '0821-9988-7766',
    email: 'rizky.pratama@guru.sd.belajar.id',
    statusKepegawaian: 'PPPK'
  },
  {
    id: 't-5',
    nip: '19870908 201502 2 003',
    nuptk: '3456765666200045',
    nama: 'Nurul Hidayati, S.Pd.I',
    jabatan: 'Guru PAI',
    mataPelajaran: 'Pendidikan Agama Islam & Budi Pekerti',
    noHp: '0815-4433-2211',
    email: 'nurul.hidayati@guru.sd.belajar.id',
    statusKepegawaian: 'PNS'
  },
  {
    id: 't-6',
    nip: '19951104 202421 2 007',
    nuptk: '6789773674200052',
    nama: 'Annisa Fitriani, S.Pd.',
    jabatan: 'Wali Kelas 3A',
    mataPelajaran: 'Tematik (Guru Kelas)',
    noHp: '0878-5566-7788',
    email: 'annisa.fitriani@guru.sd.belajar.id',
    statusKepegawaian: 'PPPK',
    waliKelas: 'Kelas 3A'
  },
  {
    id: 't-7',
    nip: '19820419 200801 1 009',
    nuptk: '5678760661100067',
    nama: 'Agus Setiawan, S.Pd.',
    jabatan: 'Wali Kelas 6A',
    mataPelajaran: 'Tematik (Guru Kelas)',
    noHp: '0812-7766-5544',
    email: 'agus.setiawan@guru.sd.belajar.id',
    statusKepegawaian: 'PNS',
    waliKelas: 'Kelas 6A'
  },
  {
    id: 't-8',
    nip: '-',
    nuptk: '-',
    nama: 'Wahyu Nugroho, A.Md.Kom.',
    jabatan: 'Operator Sekolah & Dapodik',
    mataPelajaran: 'Teknologi Informasi & Administrasi',
    noHp: '0896-1234-5678',
    email: 'operator.sdn1nusantara@gmail.com',
    statusKepegawaian: 'GTT / Honorer'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  // Kelas 5A (Core showcase class)
  {
    id: 'std-5a-01',
    nisn: '0158923401',
    nis: '210501',
    nama: 'Ahmad Faiz Al-Ghifari',
    kelas: 'Kelas 5A',
    jenisKelamin: 'L',
    tempatLahir: 'Kota Bahari',
    tanggalLahir: '2015-04-12',
    namaWali: 'Budi Santoso',
    noHpWali: '0812-3344-5566',
    alamat: 'Jl. Merak No. 12, Kel. Sukamaju'
  },
  {
    id: 'std-5a-02',
    nisn: '0158923402',
    nis: '210502',
    nama: 'Aisyah Putri Azzahra',
    kelas: 'Kelas 5A',
    jenisKelamin: 'P',
    tempatLahir: 'Kota Bahari',
    tanggalLahir: '2015-08-25',
    namaWali: 'Hendra Setiawan',
    noHpWali: '0813-9988-7711',
    alamat: 'Perumahan Griya Indah Blok B3/14'
  },
  {
    id: 'std-5a-03',
    nisn: '0158923403',
    nis: '210503',
    nama: 'Bagas Aditya Pratama',
    kelas: 'Kelas 5A',
    jenisKelamin: 'L',
    tempatLahir: 'Kota Bahari',
    tanggalLahir: '2015-02-18',
    namaWali: 'Agus Priyono',
    noHpWali: '0857-4455-6677',
    alamat: 'Jl. Flamboyan No. 8, Sukamaju'
  },
  {
    id: 'std-5a-04',
    nisn: '0158923404',
    nis: '210504',
    nama: 'Clarissa Maharani',
    kelas: 'Kelas 5A',
    jenisKelamin: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2015-11-03',
    namaWali: 'Gunawan Prasetyo',
    noHpWali: '0878-1122-8899',
    alamat: 'Jl. Cendrawasih No. 24'
  },
  {
    id: 'std-5a-05',
    nisn: '0158923405',
    nis: '210505',
    nama: 'Dafi Rizqullah Maulana',
    kelas: 'Kelas 5A',
    jenisKelamin: 'L',
    tempatLahir: 'Kota Bahari',
    tanggalLahir: '2015-06-19',
    namaWali: 'Dedi Maulana',
    noHpWali: '0821-6677-8899',
    alamat: 'Jl. Kenanga No. 5'
  },
  {
    id: 'std-5a-06',
    nisn: '0158923406',
    nis: '210506',
    nama: 'Fatimah Zahra Maulida',
    kelas: 'Kelas 5A',
    jenisKelamin: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2015-09-30',
    namaWali: 'Muhammad Farhan',
    noHpWali: '0819-3322-1100',
    alamat: 'Jl. Melati IV No. 17'
  },
  {
    id: 'std-5a-07',
    nisn: '0158923407',
    nis: '210507',
    nama: 'Galih Ramadhan',
    kelas: 'Kelas 5A',
    jenisKelamin: 'L',
    tempatLahir: 'Kota Bahari',
    tanggalLahir: '2015-07-07',
    namaWali: 'Suryanto',
    noHpWali: '0852-9900-1122',
    alamat: 'Kampung Suka Senang RT 02/05'
  },
  {
    id: 'std-5a-08',
    nisn: '0158923408',
    nis: '210508',
    nama: 'Hafizhah Khairunnisa',
    kelas: 'Kelas 5A',
    jenisKelamin: 'P',
    tempatLahir: 'Semarang',
    tanggalLahir: '2015-01-14',
    namaWali: 'Irfan Hakim',
    noHpWali: '0813-2244-6688',
    alamat: 'Jl. Pahlawan No. 31'
  },

  // Kelas 1A
  {
    id: 'std-1a-01',
    nisn: '0198923101',
    nis: '250101',
    nama: 'Alif Arkananta',
    kelas: 'Kelas 1A',
    jenisKelamin: 'L',
    namaWali: 'Arif Wibowo',
    noHpWali: '0812-7788-9900',
    alamat: 'Jl. Dahlia No. 3'
  },
  {
    id: 'std-1a-02',
    nisn: '0198923102',
    nis: '250102',
    nama: 'Bella Amanda Syifa',
    kelas: 'Kelas 1A',
    jenisKelamin: 'P',
    namaWali: 'Rudi Hartono',
    noHpWali: '0857-8899-0011',
    alamat: 'Gg. Salak No. 10'
  },
  {
    id: 'std-1a-03',
    nisn: '0198923103',
    nis: '250103',
    nama: 'Cakra Yudhistira',
    kelas: 'Kelas 1A',
    jenisKelamin: 'L',
    namaWali: 'Bayu Nugraha',
    noHpWali: '0877-2233-4455',
    alamat: 'Jl. Kartini No. 89'
  },
  {
    id: 'std-1a-04',
    nisn: '0198923104',
    nis: '250104',
    nama: 'Dina Safitri',
    kelas: 'Kelas 1A',
    jenisKelamin: 'P',
    namaWali: 'Umar Bakri',
    noHpWali: '0818-4455-6677',
    alamat: 'Jl. Pemuda No. 15'
  },

  // Kelas 3A
  {
    id: 'std-3a-01',
    nisn: '0178923301',
    nis: '230301',
    nama: 'Fahri Hidayat',
    kelas: 'Kelas 3A',
    jenisKelamin: 'L',
    namaWali: 'Hidayatullah',
    noHpWali: '0813-1122-3344',
    alamat: 'Jl. Merpati No. 40'
  },
  {
    id: 'std-3a-02',
    nisn: '0178923302',
    nis: '230302',
    nama: 'Gita Larasati',
    kelas: 'Kelas 3A',
    jenisKelamin: 'P',
    namaWali: 'Bambang Pamungkas',
    noHpWali: '0856-7788-9900',
    alamat: 'Perum Nusa Indah C-12'
  },
  {
    id: 'std-3a-03',
    nisn: '0178923303',
    nis: '230303',
    nama: 'Irfan Maulana',
    kelas: 'Kelas 3A',
    jenisKelamin: 'L',
    namaWali: 'Maulana Malik',
    noHpWali: '0822-4455-6677',
    alamat: 'Jl. Mawar No. 6'
  },

  // Kelas 6A
  {
    id: 'std-6a-01',
    nisn: '0148923601',
    nis: '200601',
    nama: 'Kevin Pratama Wijaya',
    kelas: 'Kelas 6A',
    jenisKelamin: 'L',
    namaWali: 'Wijaya Kusuma',
    noHpWali: '0812-9988-1122',
    alamat: 'Jl. Rajawali No. 19'
  },
  {
    id: 'std-6a-02',
    nisn: '0148923602',
    nis: '200602',
    nama: 'Nabila Nur Azizah',
    kelas: 'Kelas 6A',
    jenisKelamin: 'P',
    namaWali: 'Aziz Muslim',
    noHpWali: '0815-6677-8899',
    alamat: 'Jl. KH Ahmad Dahlan No. 55'
  },
  {
    id: 'std-6a-03',
    nisn: '0148923603',
    nis: '200603',
    nama: 'Raditya Arya Bima',
    kelas: 'Kelas 6A',
    jenisKelamin: 'L',
    namaWali: 'Arya Seno',
    noHpWali: '0878-3344-5566',
    alamat: 'Jl. Diponegoro No. 8'
  }
];

export const INITIAL_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'ann-1',
    judul: 'Pelaksanaan Penilaian Tengah Semester (PTS) Genap TA 2026/2027',
    tanggal: '2026-11-04',
    kategori: 'akademik',
    sasaran: 'semua',
    konten: 'Diberitahukan kepada seluruh siswa dan Bapak/Ibu Wali Murid kelas 1 s/d 6 bahwa PTS Genap akan dilaksanakan mulai hari Senin, 16 November 2026. Diharapkan siswa mempersiapkan diri dengan baik dan menjaga kesehatan.',
    penulis: 'Dra. Hj. Siti Aminah, M.Pd.',
    tersemat: true
  },
  {
    id: 'ann-2',
    judul: 'Kegiatan Senam Bersama dan Pembiasaan Makan Buah Serentak',
    tanggal: '2026-11-05',
    kategori: 'kegiatan',
    sasaran: 'wali_murid',
    konten: 'Dalam rangka mewujudkan Sekolah Sehat Berkarakter, seluruh murid dihimbau membawa bekal buah potong dan memakai seragam olahraga pada hari Jumat pagi pukul 06.45 WIB.',
    penulis: 'Rizky Pratama, S.Pd. (Guru PJOK)',
    tersemat: true
  },
  {
    id: 'ann-3',
    judul: 'Edaran Jadwal Masuk Sekolah dan Ketertiban Presensi Barcode',
    tanggal: '2026-11-02',
    kategori: 'edaran',
    sasaran: 'wali_murid',
    konten: 'Pintu gerbang sekolah dibuka pukul 06.30 WIB dan bel masuk berbunyi tepat pukul 07.15 WIB. Mohon dipastikan murid selalu membawa Kartu Barcode Pelajar dan melakukan scan di meja presensi depan piket.',
    penulis: 'Wahyu Nugroho (Operator)',
    tersemat: false
  },
  {
    id: 'ann-4',
    judul: 'Vaksinasi & Pemeriksaan Kesehatan Gigi Anak oleh Puskesmas',
    tanggal: '2026-10-28',
    kategori: 'kegiatan',
    sasaran: 'wali_murid',
    konten: 'Puskesmas Kecamatan akan mengadakan pemeriksaan berkala kesehatan gigi dan mata untuk siswa kelas 1 dan 5. Orang tua dimohon mengisi formulir kesediaan yang dibagikan wali kelas.',
    penulis: 'Dewi Rahmawati, S.Pd.SD',
    tersemat: false
  }
];

export const INITIAL_PERMISSIONS: PermissionRequest[] = [
  {
    id: 'perm-1',
    studentId: 'std-5a-04',
    nisn: '0158923404',
    nama: 'Clarissa Maharani',
    kelas: 'Kelas 5A',
    tanggalMulai: '2026-11-06',
    tanggalSelesai: '2026-11-06',
    jenis: 'sakit',
    alasan: 'Ananda mengalami demam tinggi dan flu sejak semalam. Surat dokter terlampir dalam arsip WA wali kelas.',
    namaPengirim: 'Gunawan Prasetyo (Ayah)',
    noHpPengirim: '0878-1122-8899',
    status: 'disetujui',
    createdAt: '2026-11-06 06:40:00'
  },
  {
    id: 'perm-2',
    studentId: 'std-5a-07',
    nisn: '0158923407',
    nama: 'Galih Ramadhan',
    kelas: 'Kelas 5A',
    tanggalMulai: '2026-11-06',
    tanggalSelesai: '2026-11-06',
    jenis: 'izin',
    alasan: 'Menghadiri acara pernikahan keluarga di luar kota (Cirebon) bersama orang tua.',
    namaPengirim: 'Suryanto (Ayah)',
    noHpPengirim: '0852-9900-1122',
    status: 'disetujui',
    createdAt: '2026-11-05 20:15:00'
  }
];

// Generate past 30 days realistic attendance data (October & November 2026)
export function generateSeedAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const students = INITIAL_STUDENTS;

  // Generate for November 1 to November 6 (today)
  const novemberDays = [2, 3, 4, 5, 6]; // excluding Nov 1 Sunday

  novemberDays.forEach(day => {
    const dateStr = `2026-11-${String(day).padStart(2, '0')}`;
    students.forEach(st => {
      // Deterministic variations based on student and day
      if (day === 6) {
        // Today's attendance
        if (st.id === 'std-5a-04') {
          // Clarissa is Sakit today
          records.push({
            id: `rec-${dateStr}-${st.id}`,
            studentId: st.id,
            nisn: st.nisn,
            nama: st.nama,
            kelas: st.kelas,
            tanggal: dateStr,
            waktu: '06:40:00',
            status: 'sakit',
            terlambat: false,
            catatan: 'Flu dan demam (Surat dari orang tua)'
          });
        } else if (st.id === 'std-5a-07') {
          // Galih is Izin today
          records.push({
            id: `rec-${dateStr}-${st.id}`,
            studentId: st.id,
            nisn: st.nisn,
            nama: st.nama,
            kelas: st.kelas,
            tanggal: dateStr,
            waktu: '06:45:00',
            status: 'izin',
            terlambat: false,
            catatan: 'Acara keluarga di luar kota'
          });
        } else if (st.id === 'std-5a-03') {
          // Bagas is late today (scanned at 07:22)
          records.push({
            id: `rec-${dateStr}-${st.id}`,
            studentId: st.id,
            nisn: st.nisn,
            nama: st.nama,
            kelas: st.kelas,
            tanggal: dateStr,
            waktu: '07:22:15',
            status: 'hadir',
            terlambat: true,
            catatan: 'Terlambat 7 menit (Macet jalan raya)'
          });
        } else if (st.id === 'std-5a-08' || st.id === 'std-1a-04') {
          // Hasn't scanned yet today (Belum Hadir / can be scanned by user!)
        } else {
          // Scanned on time
          const min = (parseInt(st.nisn.slice(-2)) % 25) + 40; // 06:40 - 07:05
          const sec = (parseInt(st.nisn.slice(-2)) * 7) % 60;
          const timeStr = `06:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
          records.push({
            id: `rec-${dateStr}-${st.id}`,
            studentId: st.id,
            nisn: st.nisn,
            nama: st.nama,
            kelas: st.kelas,
            tanggal: dateStr,
            waktu: timeStr,
            status: 'hadir',
            terlambat: false
          });
        }
      } else {
        // Past days in November
        const isSick = (day === 3 && st.id === 'std-5a-02') || (day === 4 && st.id === 'std-1a-01');
        const isPerm = (day === 4 && st.id === 'std-5a-05');
        const isLate = (day === 2 && st.id === 'std-5a-01');

        if (isSick) {
          records.push({
            id: `rec-${dateStr}-${st.id}`,
            studentId: st.id,
            nisn: st.nisn,
            nama: st.nama,
            kelas: st.kelas,
            tanggal: dateStr,
            waktu: '07:00:00',
            status: 'sakit',
            terlambat: false,
            catatan: 'Sakit flu/batuk'
          });
        } else if (isPerm) {
          records.push({
            id: `rec-${dateStr}-${st.id}`,
            studentId: st.id,
            nisn: st.nisn,
            nama: st.nama,
            kelas: st.kelas,
            tanggal: dateStr,
            waktu: '07:00:00',
            status: 'izin',
            terlambat: false,
            catatan: 'Izin urusan keluarga'
          });
        } else {
          const min = isLate ? 20 : (parseInt(st.nisn.slice(-2)) % 20) + 45;
          const timeStr = isLate ? `07:${min}:00` : `06:${min}:00`;
          records.push({
            id: `rec-${dateStr}-${st.id}`,
            studentId: st.id,
            nisn: st.nisn,
            nama: st.nama,
            kelas: st.kelas,
            tanggal: dateStr,
            waktu: timeStr,
            status: 'hadir',
            terlambat: isLate
          });
        }
      }
    });
  });

  return records;
}
