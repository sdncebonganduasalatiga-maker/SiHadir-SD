import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isTimeLate,
  formatIndonesianDate,
  getDaysInMonth,
  getEffectiveSchoolDays,
  computeMonthlyRecap,
  calculateTodayStats
} from './attendance';
import { Student, AttendanceRecord } from '../types';

test('isTimeLate correctly flags times after cutoff', () => {
  assert.equal(isTimeLate('06:55', '07:15'), false);
  assert.equal(isTimeLate('07:15', '07:15'), false);
  assert.equal(isTimeLate('07:16', '07:15'), true);
  assert.equal(isTimeLate('07:45:00', '07:15'), true);
});

test('getDaysInMonth returns correct days count', () => {
  assert.equal(getDaysInMonth(2026, 1), 31); // Januari
  assert.equal(getDaysInMonth(2026, 2), 28); // Februari 2026 non-kabisat
  assert.equal(getDaysInMonth(2026, 11), 30); // November 2026
});

test('getEffectiveSchoolDays excludes Sundays', () => {
  // November 2026 has 30 days: Sundays are Nov 1, 8, 15, 22, 29 = 5 Sundays -> 25 effective days
  const effective = getEffectiveSchoolDays(2026, 11);
  assert.equal(effective, 25);
});

test('formatIndonesianDate formats correctly', () => {
  // 2026-11-06 is a Friday (Jumat)
  const formatted = formatIndonesianDate('2026-11-06T00:00:00');
  assert.match(formatted, /Jumat/);
  assert.match(formatted, /6/);
  assert.match(formatted, /November/);
  assert.match(formatted, /2026/);
});

test('computeMonthlyRecap calculates H, S, I, A correctly', () => {
  const mockStudent: Student = {
    id: 's1',
    nisn: '0123456789',
    nis: '1001',
    nama: 'Ahmad Faiz',
    kelas: 'Kelas 5A',
    jenisKelamin: 'L',
    namaWali: 'Budi Santoso',
    noHpWali: '081234567890'
  };

  const mockRecords: AttendanceRecord[] = [
    {
      id: 'r1',
      studentId: 's1',
      nisn: '0123456789',
      nama: 'Ahmad Faiz',
      kelas: 'Kelas 5A',
      tanggal: '2026-11-02',
      waktu: '07:05:00',
      status: 'hadir',
      terlambat: false
    },
    {
      id: 'r2',
      studentId: 's1',
      nisn: '0123456789',
      nama: 'Ahmad Faiz',
      kelas: 'Kelas 5A',
      tanggal: '2026-11-03',
      waktu: '07:08:00',
      status: 'hadir',
      terlambat: false
    },
    {
      id: 'r3',
      studentId: 's1',
      nisn: '0123456789',
      nama: 'Ahmad Faiz',
      kelas: 'Kelas 5A',
      tanggal: '2026-11-04',
      waktu: '08:00:00',
      status: 'sakit',
      terlambat: false,
      catatan: 'Demam'
    },
    {
      id: 'r4',
      studentId: 's1',
      nisn: '0123456789',
      nama: 'Ahmad Faiz',
      kelas: 'Kelas 5A',
      tanggal: '2026-11-05',
      waktu: '08:00:00',
      status: 'izin',
      terlambat: false
    }
  ];

  const recap = computeMonthlyRecap([mockStudent], mockRecords, 2026, 11);
  assert.equal(recap.length, 1);
  assert.equal(recap[0].totalHadir, 2);
  assert.equal(recap[0].totalSakit, 1);
  assert.equal(recap[0].totalIzin, 1);
  assert.equal(recap[0].totalAlpa, 0);
  // dailyStatus on Nov 1 is Sunday -> 'L'
  assert.equal(recap[0].dailyStatus[1], 'L');
  // dailyStatus on Nov 2 is 'H'
  assert.equal(recap[0].dailyStatus[2], 'H');
  // dailyStatus on Nov 4 is 'S'
  assert.equal(recap[0].dailyStatus[4], 'S');
});

test('calculateTodayStats returns accurate counts and percentage', () => {
  const students: Student[] = [
    { id: '1', nisn: '1', nis: '1', nama: 'Siti', kelas: '1A', jenisKelamin: 'P', namaWali: 'W', noHpWali: '0' },
    { id: '2', nisn: '2', nis: '2', nama: 'Budi', kelas: '1A', jenisKelamin: 'L', namaWali: 'W', noHpWali: '0' },
    { id: '3', nisn: '3', nis: '3', nama: 'Rani', kelas: '1A', jenisKelamin: 'P', namaWali: 'W', noHpWali: '0' },
    { id: '4', nisn: '4', nis: '4', nama: 'Doni', kelas: '1A', jenisKelamin: 'L', namaWali: 'W', noHpWali: '0' },
  ];

  const records: AttendanceRecord[] = [
    { id: 'a1', studentId: '1', nisn: '1', nama: 'Siti', kelas: '1A', tanggal: '2026-11-06', waktu: '07:00:00', status: 'hadir', terlambat: false },
    { id: 'a2', studentId: '2', nisn: '2', nama: 'Budi', kelas: '1A', tanggal: '2026-11-06', waktu: '07:20:00', status: 'hadir', terlambat: true },
    { id: 'a3', studentId: '3', nisn: '3', nama: 'Rani', kelas: '1A', tanggal: '2026-11-06', waktu: '07:00:00', status: 'sakit', terlambat: false },
  ];

  const stats = calculateTodayStats(students, records, '2026-11-06');
  assert.equal(stats.totalStudents, 4);
  assert.equal(stats.hadir, 2);
  assert.equal(stats.terlambat, 1);
  assert.equal(stats.sakit, 1);
  assert.equal(stats.izin, 0);
  assert.equal(stats.belumHadir, 1);
  assert.equal(stats.attendanceRate, 50); // 2 out of 4 = 50%
});
