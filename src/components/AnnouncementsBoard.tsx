import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SchoolAnnouncement } from '../types';
import { Megaphone, Plus, Pin, Calendar, Tag, User, Trash2, Edit3, X, CheckCircle } from 'lucide-react';
import { formatIndonesianDate } from '../utils/attendance';

export const AnnouncementsBoard: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, teachers, currentUser } = useSchool();
  const isAdmin = currentUser.role === 'admin';

  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<SchoolAnnouncement | null>(null);

  // Form states
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<SchoolAnnouncement['kategori']>('akademik');
  const [sasaran, setSasaran] = useState<SchoolAnnouncement['sasaran']>('semua');
  const [konten, setKonten] = useState('');
  const [penulis, setPenulis] = useState('');
  const [tersemat, setTersemat] = useState(false);

  const openAddModal = () => {
    setEditingAnn(null);
    setJudul('');
    setKategori('akademik');
    setSasaran('semua');
    setKonten('');
    setPenulis(teachers[0]?.nama || 'Operator Sekolah');
    setTersemat(false);
    setIsModalOpen(true);
  };

  const openEditModal = (ann: SchoolAnnouncement) => {
    setEditingAnn(ann);
    setJudul(ann.judul);
    setKategori(ann.kategori);
    setSasaran(ann.sasaran);
    setKonten(ann.konten);
    setPenulis(ann.penulis);
    setTersemat(ann.tersemat);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !konten.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];

    if (editingAnn) {
      updateAnnouncement(editingAnn.id, {
        judul,
        kategori,
        sasaran,
        konten,
        penulis,
        tersemat
      });
    } else {
      addAnnouncement({
        judul,
        tanggal: todayStr,
        kategori,
        sasaran,
        konten,
        penulis: penulis || 'Operator Sekolah',
        tersemat
      });
    }

    setIsModalOpen(false);
  };

  const filteredAnnouncements = announcements.filter(ann => {
    if (filterCategory === 'semua') return true;
    return ann.kategori === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-600" />
            Pengumuman & Informasi Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Terbitkan edaran kegiatan, jadwal libur, agenda akademik, dan pesan untuk siswa serta orang tua.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none text-slate-800"
          >
            <option value="semua">Semua Kategori</option>
            <option value="akademik">Akademik & Ujian</option>
            <option value="kegiatan">Kegiatan Siswa</option>
            <option value="edaran">Edaran Wali Murid</option>
            <option value="libur">Libur Sekolah</option>
            <option value="penting">Penting / Darurat</option>
          </select>

          {isAdmin ? (
            <button
              onClick={openAddModal}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Buat Pengumuman Baru
            </button>
          ) : (
            <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg font-medium">
              Mode Baca (Akses Umum)
            </span>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAnnouncements.map(ann => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              ann.tersemat
                ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold capitalize text-amber-800">{ann.kategori}</span>
                  <span aria-hidden="true">·</span>
                  <span>Sasaran: {ann.sasaran === 'semua' ? 'Semua' : ann.sasaran === 'wali_murid' ? 'Wali Murid' : 'Dewan Guru'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatIndonesianDate(ann.tanggal)}</span>
                </div>
                {ann.tersemat && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    <Pin className="w-3 h-3" />
                    Tersemat
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-base mt-2 leading-snug">
                {ann.judul}
              </h3>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed whitespace-pre-line">
                {ann.konten}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 italic">Oleh: {ann.penulis}</span>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(ann)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-amber-700 bg-white hover:bg-amber-50 rounded-md border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus pengumuman "${ann.judul}"?`)) {
                        deleteAnnouncement(ann.id);
                      }
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-md border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">Belum ada pengumuman untuk kategori ini.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingAnn ? 'Edit Pengumuman Sekolah' : 'Buat Pengumuman Sekolah Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-amber-900 text-amber-200 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Penilaian Akhir Semester (PAS) 2026/2027"
                  value={judul}
                  onChange={e => setJudul(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={e => setKategori(e.target.value as SchoolAnnouncement['kategori'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="akademik">Akademik & Ujian</option>
                    <option value="kegiatan">Kegiatan Siswa</option>
                    <option value="edaran">Edaran Wali Murid</option>
                    <option value="libur">Libur Sekolah</option>
                    <option value="penting">Penting / Darurat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Sasaran</label>
                  <select
                    value={sasaran}
                    onChange={e => setSasaran(e.target.value as SchoolAnnouncement['sasaran'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="semua">Semua (Umum)</option>
                    <option value="wali_murid">Khusus Wali Murid</option>
                    <option value="guru">Khusus Dewan Guru</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pengumuman / Pesan Lengkap *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan isi pengumuman atau instruksi secara jelas..."
                  value={konten}
                  onChange={e => setKonten(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Penulis / Pengirim</label>
                  <input
                    type="text"
                    value={penulis}
                    onChange={e => setPenulis(e.target.value)}
                    placeholder="Nama Kepala Sekolah / Wali Kelas / Operator"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={tersemat}
                      onChange={e => setTersemat(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                    />
                    Sematkan di Bagian Atas (Pin)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
                >
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
