import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student } from '../types';
import { BarcodeRenderer } from './BarcodeRenderer';
import { SD_CLASSES } from '../utils/attendance';
import { Printer, Search, CreditCard, User } from 'lucide-react';

export const StudentIdCards: React.FC = () => {
  const { students, schoolInfo } = useSchool();
  const [selectedClass, setSelectedClass] = useState<string>('Kelas 5A');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStudents = students.filter(st => {
    const matchesClass = selectedClass === 'Semua Kelas' || st.kelas === selectedClass;
    const matchesSearch =
      st.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nisn.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Print Controls */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Cetak Kartu Pelajar & Barcode Presensi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kartu tanda siswa resmi dilengkapi barcode NISN untuk absensi harian di sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SD_CLASSES.map(cls => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama / NISN..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <a
            href="https://www.canva.com/create/id-cards/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            title="Buka Template Kartu Pelajar di Canva for Education"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Desain di Canva</span>
          </a>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Cetak Kartu ({filteredStudents.length})
          </button>
        </div>
      </div>

      {/* Cards Grid Container (Printable) */}
      <div className="print-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white border-2 border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              style={{ minHeight: '340px' }}
            >
              {/* Card Header (Kop Kartu) */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-3 flex items-center gap-3 border-b-2 border-amber-400">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs p-1 overflow-hidden">
                  {schoolInfo.logoUrl ? (
                    <img src={schoolInfo.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-amber-300 font-extrabold text-[10px] text-center leading-tight">
                      SD
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="text-[10px] tracking-wider uppercase opacity-90 font-medium truncate">
                    {schoolInfo.dinasPendidikan || 'Pemerintah Kota Bahari · Dinas Pendidikan'}
                  </div>
                  <div className="text-xs font-extrabold tracking-wide uppercase truncate">{schoolInfo.namaSekolah}</div>
                  <div className="text-[9px] text-blue-100">NPSN: {schoolInfo.npsn} · KARTU TANDA SISWA</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex gap-4 items-start flex-1">
                {/* Photo frame */}
                <div className="w-24 h-32 rounded-lg border-2 border-slate-300 bg-slate-100 flex flex-col items-center justify-center shrink-0 p-1 text-center shadow-xs overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase">{student.kelas}</span>
                  <span className="text-[8px] text-slate-400">3 x 4 cm</span>
                </div>

                {/* Student Details */}
                <div className="text-xs space-y-1.5 flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nama Murid</span>
                    <h3 className="font-bold text-slate-900 leading-snug truncate text-sm">{student.nama}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 block">NISN</span>
                      <span className="font-mono font-bold text-blue-700">{student.nisn}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">NIS</span>
                      <span className="font-mono font-medium text-slate-700">{student.nis}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Kelas</span>
                      <span className="font-semibold text-slate-800">{student.kelas}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Jenis Kelamin</span>
                      <span className="font-medium text-slate-700">{student.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                    </div>
                  </div>

                  <div className="text-[11px]">
                    <span className="text-[10px] text-slate-400 block">Wali Murid</span>
                    <span className="font-medium text-slate-700 truncate block">{student.namaWali}</span>
                  </div>
                </div>
              </div>

              {/* Barcode Strip & Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex flex-col items-center justify-center">
                <BarcodeRenderer
                  value={student.nisn}
                  height={38}
                  width={1.6}
                  fontSize={11}
                  className="bg-transparent"
                />
                <div className="flex justify-between w-full text-[9px] text-slate-500 mt-1">
                  <span>Berlaku s/d: Thn 2027</span>
                  <span className="font-medium text-slate-700">Kepala Sekolah: {schoolInfo.kepalaSekolah}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">Tidak ada kartu murid yang sesuai dengan filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
