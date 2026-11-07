import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { computeMonthlyRecap, INDONESIAN_MONTHS, SD_CLASSES, getDaysInMonth, isSunday } from '../utils/attendance';
import { generateMonthlyRecapCSV, downloadFile } from '../utils/export';
import { OfficialReportPrintModal } from './OfficialReportPrintModal';
import { FileSpreadsheet, Printer, Calendar, Filter, Users, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export const MonthlyRecap: React.FC = () => {
  const { students, attendanceRecords, schoolInfo, teachers } = useSchool();

  const [selectedMonth, setSelectedMonth] = useState<number>(11); // November
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedClass, setSelectedClass] = useState<string>('Kelas 5A');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Filter students based on class selection
  const classStudents = useMemo(() => {
    if (selectedClass === 'Semua Kelas') return students;
    return students.filter(s => s.kelas === selectedClass);
  }, [students, selectedClass]);

  // Compute recapitulation data
  const recaps = useMemo(() => {
    return computeMonthlyRecap(classStudents, attendanceRecords, selectedYear, selectedMonth);
  }, [classStudents, attendanceRecords, selectedYear, selectedMonth]);

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  // Aggregated totals
  const totalHadir = recaps.reduce((acc, r) => acc + r.totalHadir, 0);
  const totalSakit = recaps.reduce((acc, r) => acc + r.totalSakit, 0);
  const totalIzin = recaps.reduce((acc, r) => acc + r.totalIzin, 0);
  const totalAlpa = recaps.reduce((acc, r) => acc + r.totalAlpa, 0);
  const avgAttendance = recaps.length > 0
    ? Math.round(recaps.reduce((acc, r) => acc + r.persentase, 0) / recaps.length)
    : 0;

  // Find assigned Wali Kelas for this class
  const classTeacher = teachers.find(t => t.waliKelas === selectedClass) || {
    nama: 'Bambang Sudarsono, S.Pd.',
    nip: '19840312 201001 1 018'
  };

  const handleExportCSV = () => {
    const csvContent = generateMonthlyRecapCSV(
      recaps,
      selectedYear,
      selectedMonth,
      selectedClass,
      {
        namaSekolah: schoolInfo.namaSekolah,
        npsn: schoolInfo.npsn,
        alamat: schoolInfo.alamat,
        kepalaSekolah: schoolInfo.kepalaSekolah,
        nipKepalaSekolah: schoolInfo.nipKepalaSekolah,
        waliKelas: classTeacher.nama,
        nipWaliKelas: classTeacher.nip
      }
    );

    const filename = `Rekap_Presensi_${selectedClass.replace(/\s+/g, '_')}_${INDONESIAN_MONTHS[selectedMonth - 1]}_${selectedYear}.csv`;
    downloadFile(csvContent, filename);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            Rekapitulasi Bulanan Presensi Murid
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Perhitungan otomatis daftar kehadiran harian siswa dengan ekspor Excel (.csv) dan cetak PDF resmi.
          </p>
        </div>

        {/* Filters and Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="text-xs font-semibold bg-transparent focus:outline-none text-slate-800"
            >
              {SD_CLASSES.map(cls => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Month Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="text-xs font-semibold bg-transparent focus:outline-none text-slate-800"
            >
              {INDONESIAN_MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none text-slate-800"
          >
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>

          {/* Export to Excel */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel (.csv)
          </button>

          {/* Print / PDF Report */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            Cetak PDF Resmi
          </button>
        </div>
      </div>

      {/* Metric Strip (Clean, unboxed metadata and figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 block">Total Siswa</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{recaps.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{selectedClass}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-emerald-700 block font-medium">Total Hadir (H)</span>
          <span className="text-xl font-bold text-emerald-700 tabular-nums">{totalHadir}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Akumulasi Bulan Ini</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-amber-700 block font-medium">Total Sakit (S)</span>
          <span className="text-xl font-bold text-amber-700 tabular-nums">{totalSakit}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Surat Keterangan</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-blue-700 block font-medium">Total Izin (I)</span>
          <span className="text-xl font-bold text-blue-700 tabular-nums">{totalIzin}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Izin Orang Tua</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-rose-700 block font-medium">Total Alpa (A)</span>
          <span className="text-xl font-bold text-rose-700 tabular-nums">{totalAlpa}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Tanpa Keterangan</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] text-indigo-700 block font-medium">Rata-rata Kehadiran</span>
          <span className="text-xl font-bold text-indigo-700 tabular-nums">{avgAttendance}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Target KKM: 85%</span>
        </div>
      </div>

      {/* Recapitulation Matrix Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              Matriks Presensi: {selectedClass} — {INDONESIAN_MONTHS[selectedMonth - 1]} {selectedYear}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span>Wali Kelas: {classTeacher.nama}</span>
              <span aria-hidden="true">·</span>
              <span>Jumlah Murid: {recaps.length} Anak</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded bg-emerald-200 inline-block text-center text-[9px] leading-tight">H</span> Hadir
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-700">
              <span className="w-2.5 h-2.5 rounded bg-amber-200 inline-block text-center text-[9px] leading-tight">S</span> Sakit
            </span>
            <span className="flex items-center gap-1 font-semibold text-blue-700">
              <span className="w-2.5 h-2.5 rounded bg-blue-200 inline-block text-center text-[9px] leading-tight">I</span> Izin
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-700">
              <span className="w-2.5 h-2.5 rounded bg-rose-200 inline-block text-center text-[9px] leading-tight">A</span> Alpa
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-red-100 inline-block text-center text-[9px] leading-tight text-red-500">L</span> Libur
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-center font-semibold">
                <th className="py-2.5 px-2 w-10 border-r border-slate-200">No</th>
                <th className="py-2.5 px-3 text-left min-w-44 border-r border-slate-200">Nama Siswa</th>
                <th className="py-2.5 px-2 w-10 border-r border-slate-200">L/P</th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const sunday = isSunday(selectedYear, selectedMonth, day);
                  return (
                    <th
                      key={day}
                      className={`py-2 px-1 w-6 border-r border-slate-200 ${
                        sunday ? 'bg-red-50 text-red-600 font-bold' : ''
                      }`}
                    >
                      {day}
                    </th>
                  );
                })}
                <th className="py-2 px-2.5 w-10 bg-emerald-50 text-emerald-800 border-r border-slate-200 font-bold">H</th>
                <th className="py-2 px-2.5 w-10 bg-amber-50 text-amber-800 border-r border-slate-200 font-bold">S</th>
                <th className="py-2 px-2.5 w-10 bg-blue-50 text-blue-800 border-r border-slate-200 font-bold">I</th>
                <th className="py-2 px-2.5 w-10 bg-rose-50 text-rose-800 border-r border-slate-200 font-bold">A</th>
                <th className="py-2 px-3 w-16 bg-slate-100 text-slate-900 font-bold">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recaps.map((recap, idx) => (
                <tr key={recap.student.id} className="hover:bg-slate-50 transition-colors text-center">
                  <td className="py-2 px-2 text-slate-400 font-mono text-[11px] border-r border-slate-200">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 text-left font-medium text-slate-800 truncate max-w-56 border-r border-slate-200">
                    <div>{recap.student.nama}</div>
                    <div className="text-[10px] font-mono text-slate-400">{recap.student.nisn}</div>
                  </td>
                  <td className="py-2 px-2 text-slate-600 border-r border-slate-200">
                    {recap.student.jenisKelamin}
                  </td>

                  {/* Daily cells */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const st = recap.dailyStatus[day];
                    const sunday = isSunday(selectedYear, selectedMonth, day);

                    return (
                      <td
                        key={day}
                        className={`py-1.5 px-0.5 text-center font-bold text-[11px] border-r border-slate-100 ${
                          sunday
                            ? 'bg-red-50 text-red-400'
                            : st === 'H'
                            ? 'text-emerald-700 bg-emerald-50/40'
                            : st === 'S'
                            ? 'text-amber-700 bg-amber-50/50'
                            : st === 'I'
                            ? 'text-blue-700 bg-blue-50/50'
                            : st === 'A'
                            ? 'text-rose-700 bg-rose-100'
                            : 'text-slate-200'
                        }`}
                      >
                        {st || '·'}
                      </td>
                    );
                  })}

                  <td className="py-2 px-2 font-bold text-emerald-700 border-r border-slate-200 bg-emerald-50/30 tabular-nums">
                    {recap.totalHadir}
                  </td>
                  <td className="py-2 px-2 font-bold text-amber-700 border-r border-slate-200 bg-amber-50/30 tabular-nums">
                    {recap.totalSakit}
                  </td>
                  <td className="py-2 px-2 font-bold text-blue-700 border-r border-slate-200 bg-blue-50/30 tabular-nums">
                    {recap.totalIzin}
                  </td>
                  <td className="py-2 px-2 font-bold text-rose-700 border-r border-slate-200 bg-rose-50/30 tabular-nums">
                    {recap.totalAlpa}
                  </td>
                  <td className="py-2 px-2.5 font-bold text-slate-800 bg-slate-50 tabular-nums">
                    {recap.persentase}%
                  </td>
                </tr>
              ))}

              {recaps.length === 0 && (
                <tr>
                  <td colSpan={daysInMonth + 8} className="py-8 text-center text-slate-500">
                    Tidak ada siswa pada kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Print Modal */}
      <OfficialReportPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        recaps={recaps}
        year={selectedYear}
        month={selectedMonth}
        kelas={selectedClass}
        schoolInfo={{
          namaSekolah: schoolInfo.namaSekolah,
          npsn: schoolInfo.npsn,
          akreditasi: schoolInfo.akreditasi,
          dinasPendidikan: schoolInfo.dinasPendidikan,
          logoUrl: schoolInfo.logoUrl,
          alamat: schoolInfo.alamat,
          telepon: schoolInfo.telepon,
          email: schoolInfo.email,
          kepalaSekolah: schoolInfo.kepalaSekolah,
          nipKepalaSekolah: schoolInfo.nipKepalaSekolah,
          waliKelas: classTeacher.nama,
          nipWaliKelas: classTeacher.nip
        }}
      />
    </div>
  );
};
