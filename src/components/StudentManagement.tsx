import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student } from '../types';
import { SD_CLASSES } from '../utils/attendance';
import { BarcodeRenderer } from './BarcodeRenderer';
import { Users, Plus, Search, Filter, Edit3, Trash2, X, QrCode, CheckCircle2 } from 'lucide-react';

interface StudentManagementProps {
  onScanForStudent?: (student: Student) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ onScanForStudent }) => {
  const { students, addStudent, updateStudent, deleteStudent } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('Semua Kelas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewBarcodeStudent, setViewBarcodeStudent] = useState<Student | null>(null);

  // Form states
  const [nama, setNama] = useState('');
  const [nisn, setNisn] = useState('');
  const [nis, setNis] = useState('');
  const [kelas, setKelas] = useState('Kelas 1A');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [namaWali, setNamaWali] = useState('');
  const [noHpWali, setNoHpWali] = useState('');
  const [alamat, setAlamat] = useState('');

  const openAddModal = () => {
    setEditingStudent(null);
    setNama('');
    // Generate sample NISN
    setNisn(`01${Math.floor(10000000 + Math.random() * 90000000)}`);
    setNis(`26${Math.floor(1000 + Math.random() * 9000)}`);
    setKelas('Kelas 1A');
    setJenisKelamin('L');
    setNamaWali('');
    setNoHpWali('0812-');
    setAlamat('');
    setIsModalOpen(true);
  };

  const openEditModal = (st: Student) => {
    setEditingStudent(st);
    setNama(st.nama);
    setNisn(st.nisn);
    setNis(st.nis);
    setKelas(st.kelas);
    setJenisKelamin(st.jenisKelamin);
    setNamaWali(st.namaWali);
    setNoHpWali(st.noHpWali);
    setAlamat(st.alamat || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nisn.trim()) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        nama,
        nisn,
        nis,
        kelas,
        jenisKelamin,
        namaWali,
        noHpWali,
        alamat
      });
    } else {
      addStudent({
        nama,
        nisn,
        nis,
        kelas,
        jenisKelamin,
        namaWali,
        noHpWali,
        alamat
      });
    }

    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(st => {
    const matchesClass = selectedClass === 'Semua Kelas' || st.kelas === selectedClass;
    const matchesSearch =
      st.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nisn.includes(searchQuery) ||
      st.namaWali.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Data Induk Siswa & Barcode Presensi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data murid, NISN, wali murid, dan barcode kartu tanda siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none text-slate-800"
          >
            {SD_CLASSES.map(cls => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama, NISN, wali..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Siswa Baru
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap Siswa</th>
                <th className="py-3 px-3 font-mono">NISN / NIS</th>
                <th className="py-3 px-3">Kelas</th>
                <th className="py-3 px-3 text-center">L/P</th>
                <th className="py-3 px-4">Wali Murid & Kontak</th>
                <th className="py-3 px-4 text-center">Barcode NISN</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{st.nama}</div>
                    {st.alamat && <div className="text-[10px] text-slate-400 truncate max-w-xs">{st.alamat}</div>}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    <div className="font-semibold text-blue-700">{st.nisn}</div>
                    <div className="text-[10px] text-slate-400">NIS: {st.nis}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {st.kelas}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}
                    >
                      {st.jenisKelamin}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-medium">{st.namaWali}</div>
                    <div className="text-[11px] font-mono text-slate-500">{st.noHpWali}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setViewBarcodeStudent(st)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] transition-colors"
                      title="Klik untuk melihat barcode"
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>{st.nisn}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onScanForStudent && (
                        <button
                          onClick={() => onScanForStudent(st)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                        >
                          Scan Presensi
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(st)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                        title="Edit data siswa"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data siswa ${st.nama}?`)) {
                            deleteStudent(st.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                        title="Hapus data siswa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Tidak ada siswa yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode Preview Modal */}
      {viewBarcodeStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Barcode Presensi Siswa
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 text-base">{viewBarcodeStudent.nama}</div>
              <div className="text-xs text-blue-700 font-semibold">{viewBarcodeStudent.kelas}</div>
              <div className="my-3 flex justify-center">
                <BarcodeRenderer value={viewBarcodeStudent.nisn} height={55} width={2} fontSize={12} />
              </div>
              <div className="text-[11px] text-slate-500 font-mono">NISN: {viewBarcodeStudent.nisn}</div>
            </div>
            <button
              onClick={() => setViewBarcodeStudent(null)}
              className="w-full py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingStudent ? 'Edit Data Murid' : 'Pendaftaran Murid Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-blue-800 text-blue-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Rafif Al-Banjari"
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NISN (10 Digit) *</label>
                  <input
                    type="text"
                    required
                    placeholder="0158923401"
                    value={nisn}
                    onChange={e => setNisn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIS Sekolah</label>
                  <input
                    type="text"
                    placeholder="260101"
                    value={nis}
                    onChange={e => setNis(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas *</label>
                  <select
                    value={kelas}
                    onChange={e => setKelas(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {SD_CLASSES.filter(c => c !== 'Semua Kelas').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={jenisKelamin}
                    onChange={e => setJenisKelamin(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Ayah / Ibu / Wali"
                    value={namaWali}
                    onChange={e => setNamaWali(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp Wali</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={noHpWali}
                    onChange={e => setNoHpWali(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Tinggal</label>
                <input
                  type="text"
                  placeholder="Jl. Merak No. 12, RT 01/RW 03"
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
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
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
