import { MonthlyStudentRecap } from '../types';
import { getDaysInMonth, INDONESIAN_MONTHS, isSunday } from './attendance';

export interface SchoolInfo {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  dinasPendidikan?: string;
  logoUrl?: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  waliKelas?: string;
  nipWaliKelas?: string;
}

/**
 * Generates an Excel-compatible CSV string with UTF-8 BOM
 */
export function generateMonthlyRecapCSV(
  recaps: MonthlyStudentRecap[],
  year: number,
  month: number,
  kelas: string,
  schoolInfo: SchoolInfo
): string {
  const daysInMonth = getDaysInMonth(year, month);
  const monthName = INDONESIAN_MONTHS[month - 1];

  const lines: string[] = [];

  // Metadata headers
  lines.push(`"REKAPITULASI DAFTAR KEHADIRAN SISWA"`);
  lines.push(`"${schoolInfo.namaSekolah.toUpperCase()}"`);
  lines.push(`"NPSN: ${schoolInfo.npsn} - Tahun Ajaran 2026/2027"`);
  lines.push(`"Kelas: ${kelas} | Bulan: ${monthName} ${year}"`);
  lines.push('');

  // Table header row 1: Dates
  const dateHeaders: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    dateHeaders.push(`"${d}"`);
  }

  const header = [
    '"No"',
    '"NISN"',
    '"Nama Lengkap"',
    '"L/P"',
    ...dateHeaders,
    '"Hadir (H)"',
    '"Sakit (S)"',
    '"Izin (I)"',
    '"Alpa (A)"',
    '"% Kehadiran"'
  ].join(';');

  lines.push(header);

  // Student rows
  let totalAllHadir = 0;
  let totalAllSakit = 0;
  let totalAllIzin = 0;
  let totalAllAlpa = 0;

  recaps.forEach((recap, index) => {
    const student = recap.student;
    const dailyMarks: string[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const st = recap.dailyStatus[d];
      dailyMarks.push(`"${st || '-'}"`);
    }

    totalAllHadir += recap.totalHadir;
    totalAllSakit += recap.totalSakit;
    totalAllIzin += recap.totalIzin;
    totalAllAlpa += recap.totalAlpa;

    const row = [
      `"${index + 1}"`,
      `"${student.nisn}"`,
      `"${student.nama.replace(/"/g, '""')}"`,
      `"${student.jenisKelamin}"`,
      ...dailyMarks,
      `"${recap.totalHadir}"`,
      `"${recap.totalSakit}"`,
      `"${recap.totalIzin}"`,
      `"${recap.totalAlpa}"`,
      `"${recap.persentase}%"`
    ].join(';');

    lines.push(row);
  });

  // Summary row
  lines.push('');
  const avgAttendance = recaps.length > 0
    ? Math.round(recaps.reduce((acc, curr) => acc + curr.persentase, 0) / recaps.length)
    : 0;

  lines.push([
    '"TOTAL"',
    '""',
    `"Total Siswa: ${recaps.length}"`,
    '""',
    ...Array(daysInMonth).fill('""'),
    `"${totalAllHadir}"`,
    `"${totalAllSakit}"`,
    `"${totalAllIzin}"`,
    `"${totalAllAlpa}"`,
    `"${avgAttendance}% (Rata-rata)"`
  ].join(';'));

  lines.push('');
  lines.push(`"Keterangan Simbol: H = Hadir, S = Sakit, I = Izin, A = Alpa / Tanpa Keterangan, L = Libur Hari Minggu"`);
  lines.push(`"Dicetak pada: ${new Date().toLocaleString('id-ID')}"`);

  // UTF-8 BOM (\uFEFF) ensures Excel opens without garbled Indonesian characters
  return '\uFEFF' + lines.join('\r\n');
}

/**
 * Triggers file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
