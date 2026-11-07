import React, { useState, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { PRESET_LOGOS, compressImageFile } from '../utils/schoolLogos';
import {
  School,
  Upload,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Building2,
  Clock,
  ShieldCheck,
  FileCheck,
  FileText,
  CreditCard,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export const SchoolProfileSettings: React.FC = () => {
  const { schoolInfo, updateSchoolInfo } = useSchool();

  const [namaSekolah, setNamaSekolah] = useState(schoolInfo.namaSekolah);
  const [npsn, setNpsn] = useState(schoolInfo.npsn);
  const [akreditasi, setAkreditasi] = useState(schoolInfo.akreditasi);
  const [dinasPendidikan, setDinasPendidikan] = useState(schoolInfo.dinasPendidikan || 'Pemerintah Kota Bahari · Dinas Pendidikan');
  const [alamat, setAlamat] = useState(schoolInfo.alamat);
  const [telepon, setTelepon] = useState(schoolInfo.telepon);
  const [email, setEmail] = useState(schoolInfo.email);
  const [website, setWebsite] = useState(schoolInfo.website || '');
  const [kepalaSekolah, setKepalaSekolah] = useState(schoolInfo.kepalaSekolah);
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState(schoolInfo.nipKepalaSekolah);
  const [jamMasuk, setJamMasuk] = useState(schoolInfo.jamMasuk);
  const [jamPulang, setJamPulang] = useState(schoolInfo.jamPulang || '12:30');
  const [tahunAjaran, setTahunAjaran] = useState(schoolInfo.tahunAjaran);
  const [semester, setSemester] = useState(schoolInfo.semester);
  const [logoUrl, setLogoUrl] = useState<string>(schoolInfo.logoUrl || PRESET_LOGOS[0].svgDataUri);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle custom file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      if (!file.type.startsWith('image/')) {
        setUploadError('Harap pilih file gambar (PNG, JPG, JPEG, atau SVG).');
        setIsUploading(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Ukuran file maksimal 5MB.');
        setIsUploading(false);
        return;
      }

      const compressedDataUrl = await compressImageFile(file, 280, 280);
      setLogoUrl(compressedDataUrl);
      setIsUploading(false);
    } catch (err) {
      console.error('Error processing logo upload:', err);
      setUploadError('Gagal memproses gambar logo. Silakan coba file lain.');
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSchoolInfo({
      namaSekolah: namaSekolah.trim(),
      npsn: npsn.trim(),
      akreditasi: akreditasi.trim(),
      dinasPendidikan: dinasPendidikan.trim(),
      alamat: alamat.trim(),
      telepon: telepon.trim(),
      email: email.trim(),
      website: website.trim(),
      kepalaSekolah: kepalaSekolah.trim(),
      nipKepalaSekolah: nipKepalaSekolah.trim(),
      jamMasuk: jamMasuk.trim(),
      jamPulang: jamPulang.trim(),
      tahunAjaran: tahunAjaran.trim(),
      semester,
      logoUrl
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Pengaturan Profil & Logo Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ubah identitas sekolah, unggah logo resmi, jam masuk presensi, dan data penandatangan laporan.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Perubahan data dan logo sekolah berhasil disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Logo Upload & Preset Selection */}
        <div className="space-y-6">
          {/* Logo Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                Logo Resmi Sekolah
              </h3>
              <span className="text-[10px] text-slate-400">PNG / JPG / SVG</span>
            </div>

            {/* Current Logo Preview */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl relative group">
              <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200 shadow-sm p-2 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Sekolah"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <School className="w-12 h-12 text-slate-300" />
                )}
              </div>
              <div className="mt-3 text-center">
                <div className="font-bold text-xs text-slate-800">{namaSekolah}</div>
                <div className="text-[10px] text-slate-400">NPSN: {npsn}</div>
              </div>

              {/* Upload trigger */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploading ? 'Memproses...' : 'Unggah Logo Baru'}
                </button>
              </div>

              {uploadError && (
                <div className="mt-3 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Logo Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Atau Pilih Logo Standar Sekolah Dasar:
              </label>
              <div className="space-y-2">
                {PRESET_LOGOS.map(preset => {
                  const isSelected = logoUrl === preset.svgDataUri;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLogoUrl(preset.svgDataUri)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/60 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img src={preset.svgDataUri} alt={preset.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 truncate">{preset.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{preset.description}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Impact preview card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Penerapan Logo & Identitas:
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Kop Surat Resmi Cetak PDF Presensi Bulanan</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Kartu Pelajar & Barcode Presensi Murid</span>
              </div>
              <div className="flex items-center gap-2">
                <School className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Header Navigasi & Portal Siswa/Wali Murid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Spans: Comprehensive School Data Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identitas Sekolah Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600" />
              Identitas & Kontak Sekolah
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Resmi Sekolah Dasar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SD Negeri 1 Nusantara"
                  value={namaSekolah}
                  onChange={e => setNamaSekolah(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NPSN (Nomor Pokok Sekolah Nasional) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="20104567"
                  value={npsn}
                  onChange={e => setNpsn(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peringkat Akreditasi
                </label>
                <select
                  value={akreditasi}
                  onChange={e => setAkreditasi(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="A (Unggul)">A (Unggul)</option>
                  <option value="B (Baik)">B (Baik)</option>
                  <option value="C (Cukup)">C (Cukup)</option>
                  <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instansi Pembina / Dinas Pendidikan (Untuk Kop Surat) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemerintah Kota Bahari · Dinas Pendidikan dan Kebudayaan"
                  value={dinasPendidikan}
                  onChange={e => setDinasPendidikan(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jl. Ki Hajar Dewantara No. 45, Kecamatan Sukamaju, Kota Bahari"
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp Sekolah
                </label>
                <input
                  type="text"
                  placeholder="(021) 8765-4321"
                  value={telepon}
                  onChange={e => setTelepon(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Resmi Sekolah / Belajar.id
                </label>
                <input
                  type="email"
                  placeholder="sdn1nusantara@sekolah.belajar.id"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Kepala Sekolah & Penandatangan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Kepala Sekolah (Penandatangan Laporan Presensi)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kepala Sekolah & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dra. Hj. Siti Aminah, M.Pd."
                  value={kepalaSekolah}
                  onChange={e => setKepalaSekolah(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Kepala Sekolah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="19720514 199803 2 004"
                  value={nipKepalaSekolah}
                  onChange={e => setNipKepalaSekolah(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Jam Sekolah & Tahun Ajaran */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Waktu Presensi & Kalender Akademik
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Masuk (Batas Bel) *
                </label>
                <input
                  type="time"
                  required
                  value={jamMasuk}
                  onChange={e => setJamMasuk(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-blue-700"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Scan lewat jam ini = Terlambat</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Pulang
                </label>
                <input
                  type="time"
                  value={jamPulang}
                  onChange={e => setJamPulang(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Waktu kepulangan siswa</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  placeholder="2026/2027"
                  value={tahunAjaran}
                  onChange={e => setTahunAjaran(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Profil & Logo Sekolah
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
