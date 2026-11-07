import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserRole } from '../types';
import { ShieldCheck, User, KeyRound, Lock, CheckCircle2, AlertCircle, X, Sparkles, School } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: UserRole;
  onSuccessRole?: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onSuccessRole
}) => {
  const { currentUser, loginAsAdmin, loginAsUmum, schoolInfo } = useSchool();

  const [selectedRole, setSelectedRole] = useState<UserRole>(targetRole || 'admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [namaUmum, setNamaUmum] = useState('');
  const [nisnUmum, setNisnUmum] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = loginAsAdmin(adminPassword);
    if (result.success) {
      setSuccessMsg(result.message);
      if (onSuccessRole) onSuccessRole('admin');
      setTimeout(() => {
        setSuccessMsg(null);
        setAdminPassword('');
        onClose();
      }, 700);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleQuickAdminLogin = () => {
    setErrorMsg(null);
    const result = loginAsAdmin('admin123');
    if (result.success) {
      setSuccessMsg('Berhasil masuk sebagai Admin / Operator Sekolah!');
      if (onSuccessRole) onSuccessRole('admin');
      setTimeout(() => {
        setSuccessMsg(null);
        setAdminPassword('');
        onClose();
      }, 600);
    }
  };

  const handleUmumLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsUmum(namaUmum.trim() || 'Akses Umum (Siswa/Wali Murid)', nisnUmum.trim() || undefined);
    setSuccessMsg('Berhasil masuk ke Akses Umum!');
    if (onSuccessRole) onSuccessRole('umum');
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 relative">
          <button
            onClick={onClose}
            aria-label="Tutup login"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center absolute right-4 top-4 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
              {schoolInfo.logoUrl ? (
                <img src={schoolInfo.logoUrl} alt="Logo" className="w-7 h-7 object-contain" />
              ) : (
                <School className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Pilih Akses Masuk Sistem</h2>
              <p className="text-xs text-slate-300">{schoolInfo.namaSekolah}</p>
            </div>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-white/10 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Akses Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('umum');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'umum'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Akses Umum</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* TAB ADMIN */}
          {selectedRole === 'admin' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Hak Akses Admin / Operator:
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Dapat mengakses <strong>semua menu</strong>: Dashboard, Scan Barcode Presensi, Rekap Bulanan PDF/Excel, Cetak Kartu Siswa, Data Murid, Data Guru, Pengumuman, dan Profil Sekolah.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi / PIN Operator *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Masukkan kata sandi admin (bawaan: admin123)"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Kata sandi bawaan sistem: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-700">admin123</code>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                >
                  Masuk sebagai Admin
                </button>
              </form>

              {/* 1-Click Quick Demo Login */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Klik Masuk Demo Admin (admin123)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB UMUM */}
          {selectedRole === 'umum' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  Hak Akses Umum (Siswa & Wali Murid):
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800">
                  Akses publik yang mencakup <strong>Website Profil Sekolah (Canva)</strong>, <strong>Pengumuman Sekolah</strong>, dan <strong>Portal Siswa / Ortu</strong> (cek presensi dan pengajuan izin). Menu operator dan manajemen sekolah dikunci untuk keamanan.
                </p>
              </div>

              <form onSubmit={handleUmumLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Siswa / Wali Murid (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso / Wali Murid Kelas 5A"
                    value={namaUmum}
                    onChange={e => setNamaUmum(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN Siswa (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan NISN siswa untuk cek cepat..."
                    value={nisnUmum}
                    onChange={e => setNisnUmum(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                >
                  Lanjut ke Akses Umum
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer status */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
          <span>
            Status saat ini: <strong>{currentUser.role === 'admin' ? 'Operator (Admin)' : 'Akses Umum'}</strong>
          </span>
          <button onClick={onClose} className="text-slate-600 hover:underline font-semibold">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
