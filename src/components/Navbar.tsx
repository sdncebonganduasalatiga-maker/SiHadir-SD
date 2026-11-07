import React from 'react';
import { Camera, School, ShieldCheck, User, LogIn, LogOut, Lock } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenScanner: () => void;
  onOpenLogin: () => void;
  schoolName: string;
  schoolLogo?: string;
  userRole: UserRole;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanner,
  onOpenLogin,
  schoolName,
  schoolLogo,
  userRole,
  userName
}) => {
  // Navigation items filtered strictly by user role
  const allAdminNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'rekap', label: 'Rekap Bulanan' },
    { id: 'kartu', label: 'Kartu Barcode' },
    { id: 'siswa', label: 'Data Murid' },
    { id: 'guru', label: 'Data Guru' },
    { id: 'pengumuman', label: 'Pengumuman' },
    { id: 'profil', label: 'Profil' },
    { id: 'portal', label: 'Portal Siswa/Ortu' }
  ];

  const publicNavItems = [
    { id: 'pengumuman', label: 'Pengumuman Sekolah' },
    { id: 'portal', label: 'Portal Siswa / Ortu' }
  ];

  const navItems = userRole === 'admin' ? allAdminNavItems : publicNavItems;

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 xl:gap-6 h-16">
        {/* Zone 1: Single text element brand wordmark with school logo */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 overflow-hidden shrink-0">
            {schoolLogo ? (
              <img src={schoolLogo} alt="Logo Sekolah" className="w-full h-full object-contain" />
            ) : (
              <School className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <button
            onClick={() => setActiveTab(userRole === 'admin' ? 'dashboard' : 'portal')}
            className="text-base font-extrabold tracking-tight text-slate-900 hover:text-blue-700 transition-colors cursor-pointer text-left"
          >
            SiHadir <span className="text-blue-600">SD</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links based on role) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2 xl:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action CTA + Login / Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Role Status and Login Switcher Button */}
          {userRole === 'admin' ? (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin</span>
              </span>
              <button
                onClick={onOpenLogin}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                title="Ganti ke Akses Umum atau Keluar"
              >
                Ganti Akses
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Login Admin</span>
            </button>
          )}

          {/* Barcode scanner action (Only for admin) */}
          {userRole === 'admin' && (
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Barcode</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile secondary navigation strip for responsive mobile viewports */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto text-xs">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
