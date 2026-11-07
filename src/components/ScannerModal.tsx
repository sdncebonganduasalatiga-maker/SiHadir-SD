import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { AttendanceStatus, Student, AttendanceRecord } from '../types';
import { Camera, CheckCircle2, AlertTriangle, X, Search, Sparkles, Volume2, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BarcodeRenderer } from './BarcodeRenderer';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetStudent?: Student;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, presetStudent }) => {
  const { students, recordAttendance, schoolInfo, currentDate, currentTime } = useSchool();

  const [inputCode, setInputCode] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('hadir');
  const [catatan, setCatatan] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Result state
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    student?: Student;
    record?: AttendanceRecord;
    message: string;
    isLate?: boolean;
    isDuplicate?: boolean;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // If preset student is given (e.g. from table action), prefill
  useEffect(() => {
    if (presetStudent) {
      setInputCode(presetStudent.nisn);
    }
  }, [presetStudent]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      stopCamera();
      setLastScanResult(null);
      setInputCode('');
      setCatatan('');
    }
  }, [isOpen]);

  // Start camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Kamera web tidak didukung di peramban ini.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);

      // Start BarcodeDetector if supported
      if ('BarcodeDetector' in window) {
        startBarcodeDetection();
      }
    } catch (err: unknown) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Kamera tidak dapat diakses atau izin ditolak. Gunakan input manual atau simulator scanner di bawah.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startBarcodeDetection = () => {
    const BarcodeDetectorClass = (window as unknown as { BarcodeDetector: unknown }).BarcodeDetector as {
      new(options?: { formats: string[] }): {
        detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
      };
    };

    if (!BarcodeDetectorClass) return;

    try {
      const detector = new BarcodeDetectorClass({
        formats: ['code_128', 'code_39', 'qr_code', 'ean_13']
      });

      const interval = setInterval(async () => {
        if (!videoRef.current || !cameraActive || !streamRef.current) {
          clearInterval(interval);
          return;
        }

        try {
          if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const detected = barcodes[0].rawValue;
              handleProcessScan(detected);
              clearInterval(interval);
              setTimeout(() => {
                if (cameraActive) startBarcodeDetection();
              }, 2500);
            }
          }
        } catch {
          // ignore detection frames
        }
      }, 500);
    } catch (e) {
      console.warn('BarcodeDetector error:', e);
    }
  };

  const handleProcessScan = (codeToScan: string) => {
    const result = recordAttendance({
      barcodeOrNisn: codeToScan,
      status: selectedStatus,
      catatan: catatan.trim() || undefined
    });

    setLastScanResult(result);

    if (result.success) {
      if (!result.isLate && selectedStatus === 'hadir') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
      setInputCode('');
      setCatatan('');
    }

    // Keep focus ready for next scan
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      handleProcessScan(inputCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Scan Barcode Presensi Murid</h2>
              <p className="text-xs text-slate-400">
                Pindai kartu barcode siswa atau masukkan NISN manual
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup pemindai barcode"
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Selector Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Status Kehadiran yang Dicatat:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'hadir', label: 'Hadir', desc: 'Tepat / Terlambat', color: 'hover:border-emerald-500' },
                  { id: 'sakit', label: 'Sakit', desc: 'Ada surat/keterangan', color: 'hover:border-amber-500' },
                  { id: 'izin', label: 'Izin', desc: 'Keperluan keluarga/lain', color: 'hover:border-blue-500' },
                  { id: 'alpa', label: 'Alpa', desc: 'Tanpa keterangan', color: 'hover:border-rose-500' }
                ] as const
              ).map(st => {
                const isActive = selectedStatus === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStatus(st.id)}
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? st.id === 'hadir'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                          : st.id === 'sakit'
                          ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                          : st.id === 'izin'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs'
                        : `border-slate-200 bg-slate-50 text-slate-700 ${st.color}`
                    }`}
                  >
                    <div className="font-bold text-sm">{st.label}</div>
                    <div className="text-[11px] opacity-75">{st.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          {selectedStatus !== 'hadir' && (
            <div>
              <label htmlFor="catatan-alasan" className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan / Alasan {selectedStatus === 'sakit' ? 'Sakit' : selectedStatus === 'izin' ? 'Izin' : 'Alpa'}:
              </label>
              <input
                id="catatan-alasan"
                type="text"
                placeholder={selectedStatus === 'sakit' ? 'Contoh: Demam tinggi, flu, istirahat dokter' : 'Contoh: Acara keluarga di luar kota'}
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Camera Scanner View or Activate Camera */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            {cameraActive ? (
              <div className="space-y-3">
                <div className="relative aspect-video max-h-56 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                  <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-1 bg-red-500/80 shadow-md shadow-red-500 animate-pulse pointer-events-none" />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                    Mengarahkan kamera ke barcode...
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Arahkan barcode kartu pelajar tepat di garis merah</span>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Matikan Kamera
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Pemindaian Kamera Web / Barcode Scanner Gun
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gunakan kamera perangkat atau colokkan scanner barcode USB ke laptop
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Camera className="w-4 h-4" />
                  Nyalakan Kamera Web
                </button>
              </div>
            )}

            {cameraError && (
              <div className="mt-3 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                {cameraError}
              </div>
            )}
          </div>

          {/* Barcode & NISN Input Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <label htmlFor="barcode-input" className="block text-xs font-semibold text-slate-700">
              Input Barcode / NISN Siswa:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="barcode-input"
                  ref={inputRef}
                  type="text"
                  placeholder="Ketik NISN (cth: 0158923401) atau gunakan barcode scanner..."
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Catat Presensi
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Tips: Scanner barcode USB otomatis mengirimkan kode dan langsung menekan Enter.
            </p>
          </form>

          {/* Last Scan Result Card */}
          {lastScanResult && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                lastScanResult.success
                  ? lastScanResult.isLate
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {lastScanResult.success ? (
                  lastScanResult.isLate ? (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  )
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{lastScanResult.message}</div>
                  {lastScanResult.student && (
                    <div className="mt-2 text-xs grid grid-cols-2 gap-2 bg-white/70 p-2.5 rounded-lg border border-slate-200/50">
                      <div>
                        <span className="text-slate-500">Nama Siswa:</span>
                        <div className="font-semibold text-slate-800">{lastScanResult.student.nama}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">NISN / Kelas:</span>
                        <div className="font-mono text-slate-800">{lastScanResult.student.nisn} · {lastScanResult.student.kelas}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Waktu Perekaman:</span>
                        <div className="font-mono text-slate-800">{lastScanResult.record?.waktu} WIB</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Status Kehadiran:</span>
                        <div className="font-semibold capitalize">
                          {lastScanResult.record?.status}
                          {lastScanResult.isLate && ' (Terlambat)'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Simulation Barcode Buttons */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">
                Simulator Scan Cepat (Klik siswa untuk simulasi scan):
              </span>
              <span className="text-[11px] text-slate-400">Jam Sekolah: {schoolInfo.jamMasuk} WIB</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
              {students.slice(0, 9).map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleProcessScan(st.nisn)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-left hover:border-blue-400 hover:bg-blue-50 transition-colors text-xs flex flex-col"
                >
                  <span className="font-medium text-slate-800 truncate">{st.nama}</span>
                  <span className="text-[10px] font-mono text-slate-500">{st.nisn} ({st.kelas})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Tanggal Sistem: {currentDate}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
