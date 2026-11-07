import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { MonthlyRecap } from './components/MonthlyRecap';
import { StudentIdCards } from './components/StudentIdCards';
import { StudentManagement } from './components/StudentManagement';
import { TeacherManagement } from './components/TeacherManagement';
import { AnnouncementsBoard } from './components/AnnouncementsBoard';
import { ParentStudentPortal } from './components/ParentStudentPortal';
import { SchoolProfileSettings } from './components/SchoolProfileSettings';
import { ScannerModal } from './components/ScannerModal';
import { LoginModal } from './components/LoginModal';
import { RestrictedAccessCard } from './components/RestrictedAccessCard';
import { Student, UserRole } from './types';
import { RotateCcw, ShieldCheck, User } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { schoolInfo, resetAllData, currentUser } = useSchool();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [presetStudent, setPresetStudent] = useState<Student | undefined>(undefined);

  // When role changes to 'umum', redirect away from admin tabs to 'portal'
  useEffect(() => {
    const adminOnlyTabs = ['dashboard', 'rekap', 'kartu', 'siswa', 'guru', 'profil'];
    if (currentUser.role === 'umum' && adminOnlyTabs.includes(activeTab)) {
      setActiveTab('portal');
    }
  }, [currentUser.role]);

  const handleOpenScanner = (student?: Student) => {
    if (currentUser.role !== 'admin') {
      setIsLoginOpen(true);
      return;
    }
    setPresetStudent(student);
    setIsScannerOpen(true);
  };

  const isAdminTab = (tab: string) => {
    return ['dashboard', 'rekap', 'kartu', 'siswa', 'guru', 'profil'].includes(tab);
  };

  const getMenuDisplayName = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Operator';
      case 'rekap': return 'Rekapitulasi Bulanan';
      case 'kartu': return 'Kartu Siswa & Barcode';
      case 'siswa': return 'Data Murid';
      case 'guru': return 'Data Guru';
      case 'profil': return 'Profil Sekolah';
      default: return tab;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => handleOpenScanner()}
        onOpenLogin={() => setIsLoginOpen(true)}
        schoolName={schoolInfo.namaSekolah}
        schoolLogo={schoolInfo.logoUrl}
        userRole={currentUser.role}
        userName={currentUser.name}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* If user is in Akses Umum and tries to access an admin menu, show Restricted Access screen */}
        {currentUser.role === 'umum' && isAdminTab(activeTab) ? (
          <RestrictedAccessCard
            menuName={getMenuDisplayName(activeTab)}
            onOpenLogin={() => setIsLoginOpen(true)}
            onNavigateTab={tab => setActiveTab(tab)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardOverview
                onOpenScanner={() => handleOpenScanner()}
                onNavigateTab={tab => setActiveTab(tab)}
              />
            )}

            {activeTab === 'rekap' && <MonthlyRecap />}

            {activeTab === 'kartu' && <StudentIdCards />}

            {activeTab === 'siswa' && (
              <StudentManagement onScanForStudent={st => handleOpenScanner(st)} />
            )}

            {activeTab === 'guru' && <TeacherManagement />}

            {activeTab === 'pengumuman' && <AnnouncementsBoard />}

            {activeTab === 'profil' && <SchoolProfileSettings />}

            {activeTab === 'portal' && <ParentStudentPortal />}
          </>
        )}
      </main>

      {/* Floating Scanner Modal (Admin only) */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          setPresetStudent(undefined);
        }}
        presetStudent={presetStudent}
      />

      {/* Login & Role Selection Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccessRole={(role: UserRole) => {
          if (role === 'umum') {
            setActiveTab('portal');
          } else {
            setActiveTab('dashboard');
          }
        }}
      />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-700">{schoolInfo.namaSekolah}</span>
            <span>·</span>
            <span>NPSN: {schoolInfo.npsn}</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {currentUser.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Akses: Operator (Admin)</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Akses: Umum (Siswa/Ortu)</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('Pulihkan data bawaan awal sekolah (reset demo data)?')) {
                  resetAllData();
                }
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
              title="Reset ke data awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
            <span>Aplikasi Presensi Barcode SD © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainAppContent />
    </SchoolProvider>
  );
}
