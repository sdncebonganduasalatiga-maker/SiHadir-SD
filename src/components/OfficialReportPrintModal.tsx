import React from 'react';
import { MonthlyStudentRecap } from '../types';
import { INDONESIAN_MONTHS, getDaysInMonth, isSunday } from '../utils/attendance';
import { Printer, X } from 'lucide-react';
import { SchoolInfo } from '../utils/export';

interface OfficialReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  recaps: MonthlyStudentRecap[];
  year: number;
  month: number;
  kelas: string;
  schoolInfo: SchoolInfo & { akreditasi?: string; telepon?: string; email?: string };
}

export const OfficialReportPrintModal: React.FC<OfficialReportPrintModalProps> = ({
  isOpen,
  onClose,
  recaps,
  year,
  month,
  kelas,
  schoolInfo
}) => {
  if (!isOpen) return null;

  const daysInMonth = getDaysInMonth(year, month);
  const monthName = INDONESIAN_MONTHS[month - 1];

  const totalHadirAll = recaps.reduce((acc, r) => acc + r.totalHadir, 0);
  const totalSakitAll = recaps.reduce((acc, r) => acc + r.totalSakit, 0);
  const totalIzinAll = recaps.reduce((acc, r) => acc + r.totalIzin, 0);
  const totalAlpaAll = recaps.reduce((acc, r) => acc + r.totalAlpa, 0);
  const avgAttendance = recaps.length > 0
    ? Math.round(recaps.reduce((acc, r) => acc + r.persentase, 0) / recaps.length)
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full border border-slate-200 overflow-hidden my-4 max-h-[96vh] flex flex-col">
        {/* Modal Toolbar (hidden during print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold">Pratinjau Cetak / PDF Laporan Presensi Bulanan</h3>
            <p className="text-xs text-slate-400">
              Format standar resmi Dinas Pendidikan (Gunakan opsi "Save as PDF" di menu cetak browser)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup pratinjau cetak"
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-6 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0 print:m-0">
          {/* KOP SURAT RESMI SEKOLAH DASAR DENGAN LOGO */}
          <div className="border-b-4 border-double border-slate-900 pb-3 mb-4 relative flex items-center justify-between gap-4">
            <div className="w-20 h-20 shrink-0 flex items-center justify-center p-1">
              {schoolInfo.logoUrl ? (
                <img
                  src={schoolInfo.logoUrl}
                  alt="Logo Sekolah"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-xs text-center">
                  LOGO
                </div>
              )}
            </div>

            <div className="flex-1 text-center">
              <div className="text-xs uppercase tracking-widest font-bold text-slate-800">
                {schoolInfo.dinasPendidikan || 'Pemerintah Kota Bahari · Dinas Pendidikan dan Kebudayaan'}
              </div>
              <h1 className="text-xl font-extrabold uppercase tracking-wide text-slate-900 mt-0.5">
                {schoolInfo.namaSekolah}
              </h1>
              <div className="text-xs text-slate-600 mt-0.5">
                NPSN: {schoolInfo.npsn} {schoolInfo.akreditasi ? `· Akreditasi: ${schoolInfo.akreditasi}` : ''} · {schoolInfo.alamat}
              </div>
              {schoolInfo.telepon && (
                <div className="text-[11px] text-slate-500">
                  Telp: {schoolInfo.telepon} · Pos-el: {schoolInfo.email || '-'}
                </div>
              )}
            </div>

            {/* Balancing right container so text is perfectly centered */}
            <div className="w-20 shrink-0 hidden sm:block" />
          </div>

          {/* Judul Laporan */}
          <div className="text-center mb-4">
            <h2 className="text-base font-bold uppercase underline tracking-wider">
              REKAPITULASI DAFTAR KEHADIRAN SISWA BULANAN
            </h2>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              Kelas: <span className="text-blue-900 font-bold">{kelas}</span> · Bulan:{' '}
              <span className="text-blue-900 font-bold">{monthName} {year}</span> · Semester: Ganjil (TA 2026/2027)
            </div>
          </div>

          {/* Matriks Presensi Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100 text-slate-900 text-center font-bold">
                  <th className="border border-slate-400 p-1 w-7" rowSpan={2}>No</th>
                  <th className="border border-slate-400 p-1 w-20" rowSpan={2}>NISN</th>
                  <th className="border border-slate-400 p-1 text-left min-w-32" rowSpan={2}>Nama Lengkap Siswa</th>
                  <th className="border border-slate-400 p-1 w-7" rowSpan={2}>L/P</th>
                  <th className="border border-slate-400 p-1" colSpan={daysInMonth}>
                    Tanggal Bulan {monthName}
                  </th>
                  <th className="border border-slate-400 p-1" colSpan={4}>
                    Jumlah
                  </th>
                  <th className="border border-slate-400 p-1 w-12" rowSpan={2}>
                    % Hadir
                  </th>
                </tr>
                <tr className="bg-slate-50 text-[9px] text-center font-semibold">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const sunday = isSunday(year, month, day);
                    return (
                      <th
                        key={day}
                        className={`border border-slate-400 p-0.5 w-5 ${sunday ? 'bg-red-100 text-red-700 font-bold' : ''}`}
                      >
                        {day}
                      </th>
                    );
                  })}
                  <th className="border border-slate-400 p-1 w-6 bg-emerald-50 text-emerald-800">H</th>
                  <th className="border border-slate-400 p-1 w-6 bg-amber-50 text-amber-800">S</th>
                  <th className="border border-slate-400 p-1 w-6 bg-blue-50 text-blue-800">I</th>
                  <th className="border border-slate-400 p-1 w-6 bg-rose-50 text-rose-800">A</th>
                </tr>
              </thead>
              <tbody>
                {recaps.map((recap, idx) => (
                  <tr key={recap.student.id} className="hover:bg-slate-50 text-center">
                    <td className="border border-slate-400 p-1">{idx + 1}</td>
                    <td className="border border-slate-400 p-1 font-mono text-[9px]">{recap.student.nisn}</td>
                    <td className="border border-slate-400 p-1 text-left font-medium truncate max-w-44">
                      {recap.student.nama}
                    </td>
                    <td className="border border-slate-400 p-1">{recap.student.jenisKelamin}</td>

                    {/* Daily marks */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const st = recap.dailyStatus[day];
                      const sunday = isSunday(year, month, day);

                      return (
                        <td
                          key={day}
                          className={`border border-slate-400 p-0.5 font-bold ${
                            sunday
                              ? 'bg-red-50 text-red-500'
                              : st === 'H'
                              ? 'text-emerald-700'
                              : st === 'S'
                              ? 'text-amber-700'
                              : st === 'I'
                              ? 'text-blue-700'
                              : st === 'A'
                              ? 'text-rose-700 bg-rose-50'
                              : 'text-slate-300'
                          }`}
                        >
                          {st || '-'}
                        </td>
                      );
                    })}

                    <td className="border border-slate-400 p-1 font-bold text-emerald-700">{recap.totalHadir}</td>
                    <td className="border border-slate-400 p-1 font-bold text-amber-700">{recap.totalSakit}</td>
                    <td className="border border-slate-400 p-1 font-bold text-blue-700">{recap.totalIzin}</td>
                    <td className="border border-slate-400 p-1 font-bold text-rose-700">{recap.totalAlpa}</td>
                    <td className="border border-slate-400 p-1 font-bold">{recap.persentase}%</td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-slate-100 font-bold text-center border-t-2 border-slate-600">
                  <td className="border border-slate-400 p-1.5" colSpan={4}>
                    JUMLAH REKAPITULASI KELAS ({recaps.length} SISWA)
                  </td>
                  <td className="border border-slate-400 p-1" colSpan={daysInMonth}>
                    -
                  </td>
                  <td className="border border-slate-400 p-1 text-emerald-800">{totalHadirAll}</td>
                  <td className="border border-slate-400 p-1 text-amber-800">{totalSakitAll}</td>
                  <td className="border border-slate-400 p-1 text-blue-800">{totalIzinAll}</td>
                  <td className="border border-slate-400 p-1 text-rose-800">{totalAlpaAll}</td>
                  <td className="border border-slate-400 p-1">{avgAttendance}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Keterangan & Catatan */}
          <div className="mt-4 text-[10px] text-slate-700 flex justify-between items-start">
            <div>
              <span className="font-bold block mb-1">Keterangan Singkatan:</span>
              <ul className="space-y-0.5">
                <li><strong>H</strong> : Hadir tepat waktu / hadir</li>
                <li><strong>S</strong> : Sakit (disertai surat keterangan)</li>
                <li><strong>I</strong> : Izin (pemberitahuan orang tua)</li>
                <li><strong>A</strong> : Alpa / Tanpa Keterangan</li>
                <li><strong>L</strong> : Hari Libur Resmi / Hari Minggu</li>
              </ul>
            </div>
            <div className="text-right">
              <div>Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Sistem Presensi Barcode Digital SD</div>
            </div>
          </div>

          {/* LEMBAR TANDA TANGAN KEPALA SEKOLAH & WALI KELAS */}
          <div className="mt-8 pt-4 flex justify-between items-start text-xs text-slate-900 break-inside-avoid">
            {/* Tanda Tangan Mengetahui Kepala Sekolah */}
            <div className="text-center w-64">
              <div>Mengetahui,</div>
              <div className="font-semibold">Kepala Sekolah {schoolInfo.namaSekolah}</div>
              <div className="h-20" /> {/* Space for signature stamp */}
              <div className="font-bold underline uppercase">{schoolInfo.kepalaSekolah}</div>
              <div className="text-[11px] text-slate-700">NIP. {schoolInfo.nipKepalaSekolah}</div>
            </div>

            {/* Tanda Tangan Wali Kelas */}
            <div className="text-center w-64">
              <div>Kota Bahari, 30 {monthName} {year}</div>
              <div className="font-semibold">Wali Kelas {kelas}</div>
              <div className="h-20" /> {/* Space for signature stamp */}
              <div className="font-bold underline uppercase">
                {schoolInfo.waliKelas || 'Bambang Sudarsono, S.Pd.'}
              </div>
              <div className="text-[11px] text-slate-700">
                NIP. {schoolInfo.nipWaliKelas || '19840312 201001 1 018'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
