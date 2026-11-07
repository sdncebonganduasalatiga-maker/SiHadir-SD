import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  formatIndonesianDate,
  calculateTodayStats
} from '../utils/attendance';
import {
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HeartPulse,
  FileText,
  UserCheck,
  TrendingUp,
  BellRing,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileSpreadsheet,
  Building2
} from 'lucide-react';

interface DashboardOverviewProps {
  onOpenScanner: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenScanner,
  onNavigateTab
}) => {
  const {
    students,
    teachers,
    attendanceRecords,
    schoolInfo,
    currentDate,
    currentTime,
    permissionRequests,
    updatePermissionStatus
  } = useSchool();

  const todayStats = calculateTodayStats(students, attendanceRecords, currentDate);

  // Today's attendance records sorted latest first
  const todayRecords = attendanceRecords
    .filter(r => r.tanggal === currentDate)
    .sort((a, b) => b.waktu.localeCompare(a.waktu));

  // Pending permission requests from parents
  const pendingPermissions = permissionRequests.filter(p => p.status === 'menunggu');

  // Breakdown by classes
  const classesList = ['Kelas 1A', 'Kelas 3A', 'Kelas 5A', 'Kelas 6A'];
  const classBreakdown = classesList.map(cls => {
    const clsStudents = students.filter(s => s.kelas === cls);
    const clsRecords = todayRecords.filter(r => r.kelas === cls);
    const hadirCount = clsRecords.filter(r => r.status === 'hadir').length;
    const rate = clsStudents.length > 0 ? Math.round((hadirCount / clsStudents.length) * 100) : 0;
    return {
      kelas: cls,
      total: clsStudents.length,
      hadir: hadirCount,
      rate
    };
  });

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
            {schoolInfo.logoUrl ? (
              <img src={schoolInfo.logoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                SD
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-blue-700 font-bold">{schoolInfo.namaSekolah}</span>
              <span aria-hidden="true">·</span>
              <span>NPSN: {schoolInfo.npsn}</span>
              <span aria-hidden="true">·</span>
              <span>Akreditasi {schoolInfo.akreditasi}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Presensi Barcode Sekolah Dasar
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Sistem pencatatan kehadiran otomatis siswa dengan pemindai barcode kartu pelajar, rekapitulasi bulanan resmi, dan portal komunikasi wali murid.
            </p>
          </div>
        </div>

        {/* Big Scanner Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenScanner}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-2.5"
          >
            <Camera className="w-5 h-5" />
            <span>Mulai Scan Barcode Presensi</span>
          </button>
        </div>
      </div>

      {/* Today's KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Siswa</span>
            <UserCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {todayStats.totalStudents}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Terdaftar Aktif</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-semibold">Hadir Tepat</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 tabular-nums">
            {todayStats.hadir - todayStats.terlambat}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Sebelum {schoolInfo.jamMasuk} WIB</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-semibold">Terlambat</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 tabular-nums">
            {todayStats.terlambat}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Lewat {schoolInfo.jamMasuk} WIB</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-semibold">Sakit (S)</span>
            <HeartPulse className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800 tabular-nums">
            {todayStats.sakit}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Surat Keterangan</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-xs font-semibold">Izin (I)</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 tabular-nums">
            {todayStats.izin}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Izin Orang Tua</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="text-xs font-semibold">% Kehadiran</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">
            {todayStats.attendanceRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Hari Ini ({todayStats.hadir}/{todayStats.totalStudents})</div>
        </div>
      </div>

      {/* Middle Section: Pending Parent Requests Banner (if any) */}
      {pendingPermissions.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm">
                  Permohonan Izin / Sakit dari Wali Murid ({pendingPermissions.length} Menunggu Persetujuan)
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Orang tua siswa telah mengajukan surat keterangan ketidakhadiran melalui portal mandiri.
                </p>
                <div className="mt-3 space-y-2">
                  {pendingPermissions.map(p => (
                    <div
                      key={p.id}
                      className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {p.nama} ({p.kelas}) — <span className="uppercase text-amber-700">Surat {p.jenis}</span>
                        </div>
                        <div className="text-slate-600 text-[11px] mt-0.5">
                          Alasan: "{p.alasan}" · Wali: {p.namaPengirim} ({p.noHpPengirim})
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updatePermissionStatus(p.id, 'disetujui')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                        >
                          Setujui & Catat
                        </button>
                        <button
                          onClick={() => updatePermissionStatus(p.id, 'ditolak')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Real-Time Feed vs Class Summaries & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Spans: Real-time scan logs today */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Aktivitas Presensi Masuk Hari Ini
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {formatIndonesianDate(currentDate)} · Total Tercatat: {todayRecords.length} Murid
                </div>
              </div>
              <button
                onClick={onOpenScanner}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                Scan Lagi <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {todayRecords.map(rec => (
                <div
                  key={rec.id}
                  className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      {rec.nama.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{rec.nama}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {rec.nisn} · <span className="font-sans text-slate-700">{rec.kelas}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase inline-block ${
                        rec.status === 'hadir'
                          ? rec.terlambat
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                          : rec.status === 'sakit'
                          ? 'bg-amber-100 text-amber-800'
                          : rec.status === 'izin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rec.status} {rec.terlambat && '(Terlambat)'}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {rec.waktu} WIB
                    </div>
                  </div>
                </div>
              ))}

              {todayRecords.length === 0 && (
                <div className="p-10 text-center text-slate-500 text-xs">
                  Belum ada siswa yang melakukan presensi hari ini. Silakan klik tombol "Mulai Scan Barcode".
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Standar Jam Masuk: <strong>{schoolInfo.jamMasuk} WIB</strong></span>
            <span className="text-emerald-700 font-semibold">Tersambung ke Database Sekolah</span>
          </div>
        </div>

        {/* Right 1 Span: Class Attendance Progress & Quick Navigation Shortcuts */}
        <div className="space-y-6">
          {/* Class Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Kehadiran per Kelas Hari Ini
            </h3>

            <div className="space-y-3.5">
              {classBreakdown.map(item => (
                <div key={item.kelas} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.kelas}</span>
                    <span className="font-mono text-slate-600">
                      {item.hadir}/{item.total} ({item.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.rate >= 80 ? 'bg-emerald-500' : item.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('rekap')}
              className="mt-5 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Lihat Rekapitulasi Lengkap Bulanan
            </button>
          </div>

          {/* Quick Access Tiles */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Menu Cepat Operator
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('kartu')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Cetak Kartu Siswa Barcode</div>
                    <div className="text-[10px] text-slate-500">Cetak kartu pelajar siap laminating</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('guru')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Input & Kelola Data Guru</div>
                    <div className="text-[10px] text-slate-500">{teachers.length} Guru terdaftar</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('profil')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Edit Profil & Logo Sekolah</div>
                    <div className="text-[10px] text-slate-500">Ubah identitas, logo resmi, dan jam masuk</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('portal')}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Portal Siswa & Wali Murid</div>
                    <div className="text-[10px] text-slate-500">Cek kehadiran & surat izin online</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
