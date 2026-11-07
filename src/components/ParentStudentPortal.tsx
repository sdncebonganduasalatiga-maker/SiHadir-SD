import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student } from '../types';
import { BarcodeRenderer } from './BarcodeRenderer';
import {
  formatIndonesianDate,
  INDONESIAN_MONTHS,
  getDaysInMonth,
  isSunday,
  computeMonthlyRecap
} from '../utils/attendance';
import {
  UserCheck,
  Search,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Send,
  Megaphone,
  HeartPulse,
  Info,
  LogOut,
  Sparkles
} from 'lucide-react';

export const ParentStudentPortal: React.FC = () => {
  const {
    students,
    attendanceRecords,
    schoolInfo,
    announcements,
    submitPermissionRequest,
    permissionRequests,
    currentDate,
    currentUser
  } = useSchool();

  const [searchNisn, setSearchNisn] = useState('');
  const [activeStudent, setActiveStudent] = useState<Student | null>(() => {
    if (currentUser?.role === 'umum' && currentUser.nisn) {
      const match = students.find(s => s.nisn === currentUser.nisn);
      if (match) return match;
    }
    // Default to first student in Kelas 5A for instant demonstration
    return students.find(s => s.nisn === '0158923401') || students[0] || null;
  });

  React.useEffect(() => {
    if (currentUser?.role === 'umum' && currentUser.nisn) {
      const match = students.find(s => s.nisn === currentUser.nisn);
      if (match) {
        setActiveStudent(match);
        setPermNamaWali(match.namaWali);
        setPermNoHp(match.noHpWali);
      }
    }
  }, [currentUser, students]);

  const [activeTab, setActiveTab] = useState<'presensi' | 'izin' | 'pengumuman'>('presensi');

  // Permission form states
  const [permJenis, setPermJenis] = useState<'sakit' | 'izin'>('sakit');
  const [permTanggalMulai, setPermTanggalMulai] = useState(currentDate);
  const [permTanggalSelesai, setPermTanggalSelesai] = useState(currentDate);
  const [permAlasan, setPermAlasan] = useState('');
  const [permNamaWali, setPermNamaWali] = useState(activeStudent?.namaWali || '');
  const [permNoHp, setPermNoHp] = useState(activeStudent?.noHpWali || '');
  const [permSuccessMessage, setPermSuccessMessage] = useState<string | null>(null);

  // Today's attendance for active student
  const todayRecord = useMemo(() => {
    if (!activeStudent) return null;
    return attendanceRecords.find(
      r => (r.studentId === activeStudent.id || r.nisn === activeStudent.nisn) && r.tanggal === currentDate
    );
  }, [activeStudent, attendanceRecords, currentDate]);

  // Monthly records for active student
  const studentRecap = useMemo(() => {
    if (!activeStudent) return null;
    const [yearStr, monthStr] = currentDate.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    const recaps = computeMonthlyRecap([activeStudent], attendanceRecords, year, month);
    return recaps[0] || null;
  }, [activeStudent, attendanceRecords, currentDate]);

  // History list of records for this student
  const studentHistory = useMemo(() => {
    if (!activeStudent) return [];
    return attendanceRecords
      .filter(r => r.studentId === activeStudent.id || r.nisn === activeStudent.nisn)
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [activeStudent, attendanceRecords]);

  // Permissions submitted for this student
  const myPermissions = useMemo(() => {
    if (!activeStudent) return [];
    return permissionRequests.filter(
      p => p.studentId === activeStudent.id || p.nisn === activeStudent.nisn
    );
  }, [activeStudent, permissionRequests]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchNisn.trim();
    if (!query) return;

    const matched = students.find(
      s => s.nisn === query || s.nis === query || s.nama.toLowerCase().includes(query.toLowerCase())
    );

    if (matched) {
      setActiveStudent(matched);
      setPermNamaWali(matched.namaWali);
      setPermNoHp(matched.noHpWali);
      setSearchNisn('');
    } else {
      alert(`Siswa dengan NISN/Nama "${query}" tidak ditemukan.`);
    }
  };

  const handlePermissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent || !permAlasan.trim()) return;

    submitPermissionRequest({
      studentId: activeStudent.id,
      nisn: activeStudent.nisn,
      nama: activeStudent.nama,
      kelas: activeStudent.kelas,
      tanggalMulai: permTanggalMulai,
      tanggalSelesai: permTanggalSelesai,
      jenis: permJenis,
      alasan: permAlasan,
      namaPengirim: permNamaWali || activeStudent.namaWali,
      noHpPengirim: permNoHp || activeStudent.noHpWali
    });

    setPermSuccessMessage('Permohonan izin / sakit berhasil dikirim ke pihak sekolah dan sedang diproses.');
    setPermAlasan('');
    setTimeout(() => {
      setPermSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Student Selector Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              {schoolInfo.logoUrl ? (
                <img src={schoolInfo.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="font-extrabold text-sm text-white">SD</span>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-200 uppercase tracking-widest">
                Portal Mandiri Siswa & Wali Murid · {schoolInfo.namaSekolah}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">
                Buku Penghubung & Presensi Digital
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed">
                Cek kehadiran putra/putri Anda secara langsung, pantau riwayat absensi bulanan, dan ajukan surat izin/sakit tanpa perlu datang ke sekolah.
              </p>
            </div>
          </div>

          {/* Quick NISN Search Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Masukkan NISN atau Nama..."
                value={searchNisn}
                onChange={e => setSearchNisn(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Search className="w-4 h-4 text-blue-200 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold bg-white text-blue-900 hover:bg-blue-50 rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Cari Siswa
            </button>
          </form>
        </div>

        {/* Quick Student Switcher for testing */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-blue-200 text-[11px] whitespace-nowrap">Pilih Cepat Siswa Contoh:</span>
          {students.slice(0, 6).map(st => (
            <button
              key={st.id}
              onClick={() => {
                setActiveStudent(st);
                setPermNamaWali(st.namaWali);
                setPermNoHp(st.noHpWali);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeStudent?.id === st.id
                  ? 'bg-white text-blue-900 shadow-xs font-bold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {st.nama.split(' ')[0]} ({st.kelas})
            </button>
          ))}
        </div>
      </div>

      {activeStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student Identity & Barcode Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
                  {activeStudent.nama.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {activeStudent.nama}
                  </h3>
                  <div className="text-xs text-blue-700 font-semibold">{activeStudent.kelas}</div>
                  <div className="text-[11px] font-mono text-slate-500">NISN: {activeStudent.nisn}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">NIS Sekolah:</span>
                  <span className="font-mono">{activeStudent.nis}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Jenis Kelamin:</span>
                  <span>{activeStudent.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Nama Wali:</span>
                  <span className="font-semibold text-slate-800">{activeStudent.namaWali}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Kontak Wali:</span>
                  <span className="font-mono">{activeStudent.noHpWali}</span>
                </div>
              </div>

              {/* Barcode display */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-medium">
                  Barcode Absensi Siswa
                </span>
                <BarcodeRenderer value={activeStudent.nisn} height={42} width={1.8} fontSize={11} />
                <p className="text-[10px] text-slate-400 mt-1">
                  Tunjukkan barcode ini ke meja scanner di gerbang sekolah
                </p>
              </div>
            </div>

            {/* Today's Live Attendance Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Kehadiran Hari Ini ({formatIndonesianDate(currentDate)}):
              </span>

              {todayRecord ? (
                <div
                  className={`p-4 rounded-xl border ${
                    todayRecord.status === 'hadir'
                      ? todayRecord.terlambat
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : todayRecord.status === 'sakit'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : todayRecord.status === 'izin'
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {todayRecord.status === 'hadir' ? (
                      todayRecord.terlambat ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )
                    ) : (
                      <HeartPulse className="w-5 h-5 text-amber-600" />
                    )}
                    <span className="font-bold text-sm uppercase">
                      {todayRecord.status}
                      {todayRecord.terlambat && ' (Terlambat)'}
                    </span>
                  </div>

                  <div className="mt-2 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="opacity-75">Waktu Scan:</span>
                      <span className="font-mono font-bold">{todayRecord.waktu} WIB</span>
                    </div>
                    {todayRecord.catatan && (
                      <div className="pt-1 text-[11px] opacity-90 border-t border-black/10">
                        {todayRecord.catatan}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs text-center space-y-1">
                  <Clock className="w-6 h-6 text-slate-400 mx-auto" />
                  <div className="font-bold text-slate-700">Belum Tercatat Masuk Hari Ini</div>
                  <div className="text-slate-500 text-[11px]">
                    Siswa belum melakukan scan barcode di sekolah (Bel masuk: {schoolInfo.jamMasuk} WIB).
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (2 spans): Tabs for Monthly Record, Permission Form, Announcements */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tab Navigation */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('presensi')}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'presensi'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                Rekap Kehadiran Bulan Ini
              </button>
              <button
                onClick={() => setActiveTab('izin')}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'izin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-600" />
                Kirim Surat Izin / Sakit
              </button>
              <button
                onClick={() => setActiveTab('pengumuman')}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'pengumuman'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Megaphone className="w-4 h-4 text-indigo-600" />
                Pengumuman Sekolah ({announcements.length})
              </button>
            </div>

            {/* TAB 1: PRESENSI BULANAN */}
            {activeTab === 'presensi' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Ringkasan Presensi Bulan November 2026
                  </h3>
                  <p className="text-xs text-slate-500">
                    Statistik kehadiran ananda di {schoolInfo.namaSekolah}.
                  </p>
                </div>

                {/* Scorecards */}
                {studentRecap && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl">
                      <span className="text-[11px] text-emerald-800 font-semibold block">Hadir (H)</span>
                      <span className="text-2xl font-bold text-emerald-700 tabular-nums">
                        {studentRecap.totalHadir}
                      </span>
                      <span className="text-[10px] text-emerald-600 block">Hari</span>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-xl">
                      <span className="text-[11px] text-amber-800 font-semibold block">Sakit (S)</span>
                      <span className="text-2xl font-bold text-amber-700 tabular-nums">
                        {studentRecap.totalSakit}
                      </span>
                      <span className="text-[10px] text-amber-600 block">Hari</span>
                    </div>

                    <div className="bg-blue-50/60 border border-blue-200 p-3 rounded-xl">
                      <span className="text-[11px] text-blue-800 font-semibold block">Izin (I)</span>
                      <span className="text-2xl font-bold text-blue-700 tabular-nums">
                        {studentRecap.totalIzin}
                      </span>
                      <span className="text-[10px] text-blue-600 block">Hari</span>
                    </div>

                    <div className="bg-indigo-50/60 border border-indigo-200 p-3 rounded-xl">
                      <span className="text-[11px] text-indigo-800 font-semibold block">% Kehadiran</span>
                      <span className="text-2xl font-bold text-indigo-700 tabular-nums">
                        {studentRecap.persentase}%
                      </span>
                      <span className="text-[10px] text-indigo-600 block">Kategori Sangat Baik</span>
                    </div>
                  </div>
                )}

                {/* Riwayat Absensi Terkini */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Riwayat Kehadiran Terakhir:
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    {studentHistory.slice(0, 8).map(rec => (
                      <div key={rec.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <div className="font-semibold text-slate-800">
                            {formatIndonesianDate(rec.tanggal)}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Pukul: {rec.waktu} WIB {rec.catatan ? `· ${rec.catatan}` : ''}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase ${
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
                        </div>
                      </div>
                    ))}

                    {studentHistory.length === 0 && (
                      <div className="p-6 text-center text-slate-500">
                        Belum ada riwayat kehadiran tercatat.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FORMULIR IZIN / SAKIT ONLINE */}
            {activeTab === 'izin' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Pengajuan Surat Izin / Sakit Online
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bapak/Ibu Orang Tua dapat memberitahukan ketidakhadiran siswa langsung ke wali kelas secara resmi.
                  </p>
                </div>

                {permSuccessMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{permSuccessMessage}</span>
                  </div>
                )}

                <form onSubmit={handlePermissionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jenis Keterangan *
                      </label>
                      <select
                        value={permJenis}
                        onChange={e => setPermJenis(e.target.value as 'sakit' | 'izin')}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="sakit">Sakit (Memerlukan Istirahat)</option>
                        <option value="izin">Izin (Urusan Keluarga / Acara Penting)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tanggal Berhalangan *
                      </label>
                      <input
                        type="date"
                        required
                        value={permTanggalMulai}
                        onChange={e => {
                          setPermTanggalMulai(e.target.value);
                          setPermTanggalSelesai(e.target.value);
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alasan Lengkap Ketidakhadiran *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={
                        permJenis === 'sakit'
                          ? 'Contoh: Ananda mengalami flu dan batuk sejak kemarin malam, sedang berobat ke klinik.'
                          : 'Contoh: Ananda menghadiri acara keluarga di luar kota bersama orang tua.'
                      }
                      value={permAlasan}
                      onChange={e => setPermAlasan(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Orang Tua / Wali *
                      </label>
                      <input
                        type="text"
                        required
                        value={permNamaWali}
                        onChange={e => setPermNamaWali(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        No. HP / WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        value={permNoHp}
                        onChange={e => setPermNoHp(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim Surat Permohonan ke Sekolah
                  </button>
                </form>

                {/* Riwayat Surat Permohonan Sebelumnya */}
                {myPermissions.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">
                      Riwayat Permohonan Terkirim:
                    </h4>
                    <div className="space-y-2">
                      {myPermissions.map(p => (
                        <div
                          key={p.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-start"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 capitalize">
                              Surat {p.jenis} — {p.tanggalMulai}
                            </div>
                            <div className="text-slate-600 text-[11px] mt-0.5">{p.alasan}</div>
                            <div className="text-slate-400 text-[10px] mt-1">Oleh: {p.namaPengirim}</div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.status === 'disetujui'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'ditolak'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PENGUMUMAN SEKOLAH */}
            {activeTab === 'pengumuman' && (
              <div className="space-y-3">
                {announcements.map(ann => (
                  <div
                    key={ann.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      ann.tersemat
                        ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-bold text-amber-800 uppercase">{ann.kategori}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatIndonesianDate(ann.tanggal)}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-1 leading-snug">
                      {ann.judul}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                      {ann.konten}
                    </p>

                    <div className="mt-3 text-[11px] text-slate-400 italic">
                      Diterbitkan oleh: {ann.penulis}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">Silakan pilih atau cari siswa dengan NISN di atas.</p>
        </div>
      )}
    </div>
  );
};
