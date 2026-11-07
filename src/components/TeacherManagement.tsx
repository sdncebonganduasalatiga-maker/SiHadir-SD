import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Teacher } from '../types';
import { GraduationCap, Plus, Search, Edit3, Trash2, Phone, Mail, Award, X, Check } from 'lucide-react';
import { SD_CLASSES } from '../utils/attendance';

export const TeacherManagement: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form fields
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [nuptk, setNuptk] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [mataPelajaran, setMataPelajaran] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [statusKepegawaian, setStatusKepegawaian] = useState<'PNS' | 'PPPK' | 'GTT / Honorer'>('PNS');
  const [waliKelas, setWaliKelas] = useState('');

  const openAddModal = () => {
    setEditingTeacher(null);
    setNama('');
    setNip('');
    setNuptk('');
    setJabatan('Guru Kelas');
    setMataPelajaran('Tematik (Guru Kelas)');
    setNoHp('');
    setEmail('');
    setStatusKepegawaian('PNS');
    setWaliKelas('Kelas 1A');
    setIsModalOpen(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setNama(t.nama);
    setNip(t.nip);
    setNuptk(t.nuptk || '');
    setJabatan(t.jabatan);
    setMataPelajaran(t.mataPelajaran);
    setNoHp(t.noHp);
    setEmail(t.email || '');
    setStatusKepegawaian(t.statusKepegawaian);
    setWaliKelas(t.waliKelas || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        nama,
        nip: nip || '-',
        nuptk: nuptk || '-',
        jabatan,
        mataPelajaran,
        noHp,
        email,
        statusKepegawaian,
        waliKelas: waliKelas || undefined
      });
    } else {
      addTeacher({
        nama,
        nip: nip || '-',
        nuptk: nuptk || '-',
        jabatan,
        mataPelajaran,
        noHp,
        email,
        statusKepegawaian,
        waliKelas: waliKelas || undefined
      });
    }

    setIsModalOpen(false);
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.includes(searchQuery) ||
      t.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'semua' || t.statusKepegawaian === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Data Guru & Tenaga Kependidikan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data dewan guru, wali kelas, guru mata pelajaran, dan staf sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none text-slate-800"
          >
            <option value="semua">Semua Status</option>
            <option value="PNS">PNS</option>
            <option value="PPPK">PPPK</option>
            <option value="GTT / Honorer">GTT / Honorer</option>
          </select>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama, NIP, jabatan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Data Guru
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map(teacher => (
          <div
            key={teacher.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-sm">
                  {teacher.nama.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    {teacher.statusKepegawaian}
                  </span>
                  {teacher.waliKelas && (
                    <div className="text-[11px] font-bold text-blue-700">{teacher.waliKelas}</div>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-slate-900 text-sm">{teacher.nama}</h3>
                <div className="text-xs text-indigo-700 font-medium mt-0.5">{teacher.jabatan}</div>
                <div className="text-[11px] text-slate-500 mt-1">Mapel: {teacher.mataPelajaran}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">NIP:</span>
                  <span className="font-mono text-[11px]">{teacher.nip}</span>
                </div>
                {teacher.nuptk && (
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">NUPTK:</span>
                    <span className="font-mono text-[11px]">{teacher.nuptk}</span>
                  </div>
                )}
                {teacher.noHp && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">WhatsApp:</span>
                    <span className="font-mono text-[11px]">{teacher.noHp}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(teacher)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus data guru ${teacher.nama}?`)) {
                    deleteTeacher(teacher.id);
                  }
                }}
                className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-md transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">Tidak ada data guru yang cocok dengan pencarian.</p>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-indigo-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingTeacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-indigo-800 text-indigo-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Hj. Siti Aminah, M.Pd."
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIP</label>
                  <input
                    type="text"
                    placeholder="19840312 201001 1 018"
                    value={nip}
                    onChange={e => setNip(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    placeholder="7823762663100013"
                    value={nuptk}
                    onChange={e => setNuptk(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Guru Kelas / Guru PAI / Kepala Sekolah"
                    value={jabatan}
                    onChange={e => setJabatan(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Wali Kelas (Jika Ada)</label>
                  <select
                    value={waliKelas}
                    onChange={e => setWaliKelas(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Bukan Wali Kelas</option>
                    {SD_CLASSES.filter(c => c !== 'Semua Kelas').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    placeholder="Tematik / PJOK / PAI / Matematika"
                    value={mataPelajaran}
                    onChange={e => setMataPelajaran(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={statusKepegawaian}
                    onChange={e => setStatusKepegawaian(e.target.value as 'PNS' | 'PPPK' | 'GTT / Honorer')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="GTT / Honorer">GTT / Honorer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={noHp}
                    onChange={e => setNoHp(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Belajar.id / Resmi</label>
                  <input
                    type="email"
                    placeholder="guru@guru.sd.belajar.id"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
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
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                >
                  Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
