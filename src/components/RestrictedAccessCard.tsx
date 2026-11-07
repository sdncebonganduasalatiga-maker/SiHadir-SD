import React from 'react';
import { Lock, ShieldAlert, KeyRound, ArrowRight, FileText, Megaphone } from 'lucide-react';

interface RestrictedAccessCardProps {
  menuName: string;
  onOpenLogin: () => void;
  onNavigateTab: (tab: string) => void;
}

export const RestrictedAccessCard: React.FC<RestrictedAccessCardProps> = ({
  menuName,
  onOpenLogin,
  onNavigateTab
}) => {
  return (
    <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full">
          Akses Terbatas
        </span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Menu "{menuName}" Khusus Admin / Operator
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Anda saat ini berada pada <strong>Akses Umum</strong>. Menu manajemen sekolah, data induk, rekapitulasi, dan pemindaian barcode memerlukan login sebagai Operator Sekolah.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenLogin}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <KeyRound className="w-4 h-4" />
          <span>Masuk sebagai Admin (Kata Sandi: admin123)</span>
        </button>

        <button
          onClick={() => onNavigateTab('portal')}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Buka Portal Siswa / Ortu</span>
        </button>
      </div>
    </div>
  );
};
