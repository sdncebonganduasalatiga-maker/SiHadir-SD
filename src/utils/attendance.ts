import { AttendanceRecord, AttendanceStatus, MonthlyStudentRecap, Student } from '../types';

export const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const SD_CLASSES = [
  'Semua Kelas',
  'Kelas 1A', 'Kelas 1B',
  'Kelas 2A', 'Kelas 2B',
  'Kelas 3A', 'Kelas 3B',
  'Kelas 4A', 'Kelas 4B',
  'Kelas 5A', 'Kelas 5B',
  'Kelas 6A', 'Kelas 6B'
];

/**
 * Checks if a given time string (HH:mm or HH:mm:ss) exceeds the school morning cutoff (default 07:15)
 */
export function isTimeLate(timeStr: string, cutoff: string = '07:15'): boolean {
  if (!timeStr) return false;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const [cutoffH, cutoffM] = cutoff.split(':').map(Number);

  if (hours > cutoffH) return true;
  if (hours === cutoffH && minutes > cutoffM) return true;
  return false;
}

/**
 * Format date string into Indonesian standard (e.g., "Jumat, 6 November 2026")
 */
export function formatIndonesianDate(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return dateInput.toString();

  const dayName = INDONESIAN_DAYS[d.getDay()];
  const dayNum = d.getDate();
  const monthName = INDONESIAN_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Get count of days in a month (1-based month: 1 = Januari, 12 = Desember)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Check if a date in year/month is Sunday
 */
export function isSunday(year: number, month: number, day: number): boolean {
  const d = new Date(year, month - 1, day);
  return d.getDay() === 0;
}

/**
 * Calculate effective school days in a month (excluding Sundays)
 */
export function getEffectiveSchoolDays(year: number, month: number): number {
  const totalDays = getDaysInMonth(year, month);
  let effective = 0;
  for (let day = 1; day <= totalDays; day++) {
    if (!isSunday(year, month, day)) {
      effective++;
    }
  }
  return effective;
}

/**
 * Computes monthly recap matrix for students
 */
export function computeMonthlyRecap(
  students: Student[],
  records: AttendanceRecord[],
  year: number,
  month: number
): MonthlyStudentRecap[] {
  const daysInMonth = getDaysInMonth(year, month);
  const effectiveDays = getEffectiveSchoolDays(year, month);

  // Month string padded e.g. "2026-11"
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

  // Filter records belonging to this month
  const monthRecords = records.filter(r => r.tanggal.startsWith(monthPrefix));

  return students.map(student => {
    const studentRecords = monthRecords.filter(r => r.studentId === student.id || r.nisn === student.nisn);
    const dailyStatus: Record<number, 'H' | 'S' | 'I' | 'A' | '-' | 'L'> = {};

    let totalHadir = 0;
    let totalSakit = 0;
    let totalIzin = 0;
    let totalAlpa = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      if (isSunday(year, month, day)) {
        dailyStatus[day] = 'L'; // Libur Hari Minggu
        continue;
      }

      const dayStr = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      const record = studentRecords.find(r => r.tanggal === dayStr);

      if (record) {
        if (record.status === 'hadir') {
          dailyStatus[day] = 'H';
          totalHadir++;
        } else if (record.status === 'sakit') {
          dailyStatus[day] = 'S';
          totalSakit++;
        } else if (record.status === 'izin') {
          dailyStatus[day] = 'I';
          totalIzin++;
        } else {
          dailyStatus[day] = 'A';
          totalAlpa++;
        }
      } else {
        dailyStatus[day] = '-';
      }
    }

    // Persentase kehadiran = (Hadir / Hari Efektif) * 100
    // If effective days is 0, default to 100%
    const totalRecorded = totalHadir + totalSakit + totalIzin + totalAlpa;
    const baseDays = totalRecorded > 0 ? totalRecorded : effectiveDays;
    const persentase = baseDays > 0 ? Math.round((totalHadir / baseDays) * 100) : 100;

    return {
      student,
      dailyStatus,
      totalHadir,
      totalSakit,
      totalIzin,
      totalAlpa,
      persentase
    };
  });
}

/**
 * Calculates summary statistics for today's attendance
 */
export function calculateTodayStats(students: Student[], records: AttendanceRecord[], todayDate: string) {
  const totalStudents = students.length;
  const todayRecords = records.filter(r => r.tanggal === todayDate);

  const hadir = todayRecords.filter(r => r.status === 'hadir').length;
  const sakit = todayRecords.filter(r => r.status === 'sakit').length;
  const izin = todayRecords.filter(r => r.status === 'izin').length;
  const alpa = todayRecords.filter(r => r.status === 'alpa').length;
  const terlambat = todayRecords.filter(r => r.status === 'hadir' && r.terlambat).length;
  const belumHadir = Math.max(0, totalStudents - (hadir + sakit + izin + alpa));

  const attendanceRate = totalStudents > 0 ? Math.round((hadir / totalStudents) * 100) : 0;

  return {
    totalStudents,
    hadir,
    sakit,
    izin,
    alpa,
    terlambat,
    belumHadir,
    attendanceRate
  };
}
