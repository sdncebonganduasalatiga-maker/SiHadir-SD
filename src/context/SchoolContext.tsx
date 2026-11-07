import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  AttendanceRecord,
  AttendanceStatus,
  SchoolAnnouncement,
  PermissionRequest,
  UserRole,
  AuthUser
} from '../types';
import {
  INITIAL_SCHOOL_INFO,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PERMISSIONS,
  generateSeedAttendance
} from '../data/mockData';
import { isTimeLate } from '../utils/attendance';
import { soundEffects } from '../utils/audio';

interface RecordScanParams {
  barcodeOrNisn: string;
  status?: AttendanceStatus;
  catatan?: string;
}

interface SchoolContextType {
  schoolInfo: typeof INITIAL_SCHOOL_INFO;
  students: Student[];
  teachers: Teacher[];
  attendanceRecords: AttendanceRecord[];
  announcements: SchoolAnnouncement[];
  permissionRequests: PermissionRequest[];
  currentDate: string; // YYYY-MM-DD
  currentTime: string; // HH:mm:ss
  setCurrentDate: (d: string) => void;

  // Authentication & Access Roles
  currentUser: AuthUser;
  loginAsAdmin: (password: string) => { success: boolean; message: string };
  loginAsUmum: (name?: string, nisn?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Actions
  recordAttendance: (params: RecordScanParams) => {
    success: boolean;
    student?: Student;
    record?: AttendanceRecord;
    message: string;
    isLate?: boolean;
    isDuplicate?: boolean;
  };
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addTeacher: (teacher: Omit<Teacher, 'id'>) => Teacher;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  addAnnouncement: (announcement: Omit<SchoolAnnouncement, 'id'>) => void;
  updateAnnouncement: (id: string, data: Partial<SchoolAnnouncement>) => void;
  deleteAnnouncement: (id: string) => void;

  submitPermissionRequest: (req: Omit<PermissionRequest, 'id' | 'status' | 'createdAt'>) => void;
  updatePermissionStatus: (id: string, status: 'disetujui' | 'ditolak') => void;

  updateSchoolInfo: (data: Partial<typeof INITIAL_SCHOOL_INFO>) => void;
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | null>(null);

const STORAGE_KEY = 'sihadir_sd_app_v1';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current real date or baseline 2026-11-06
  const [currentDate, setCurrentDate] = useState<string>('2026-11-06');
  const [currentTime, setCurrentTime] = useState<string>('07:05:00');

  const [schoolInfo, setSchoolInfo] = useState<typeof INITIAL_SCHOOL_INFO>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_info`);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_INFO;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teachers`);
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : generateSeedAttendance();
  });

  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [permissionRequests, setPermissionRequests] = useState<PermissionRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_permissions`);
    return saved ? JSON.parse(saved) : INITIAL_PERMISSIONS;
  });

  // Role Authentication: 'admin' (Operator Sekolah) or 'umum' (Siswa / Wali Murid / Publik)
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : { role: 'admin', name: 'Operator Sekolah', username: 'admin' };
  });

  // Ticking clock for live clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_info`, JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_permissions`, JSON.stringify(permissionRequests));
  }, [permissionRequests]);

  // Main barcode scanning logic
  const recordAttendance = ({
    barcodeOrNisn,
    status = 'hadir',
    catatan
  }: RecordScanParams) => {
    const cleanedCode = barcodeOrNisn.trim();
    if (!cleanedCode) {
      soundEffects.playError();
      return { success: false, message: 'Kode barcode atau NISN tidak boleh kosong.' };
    }

    // Match student by NISN, NIS, or ID
    const student = students.find(
      s => s.nisn === cleanedCode || s.nis === cleanedCode || s.id === cleanedCode
    );

    if (!student) {
      soundEffects.playError();
      return {
        success: false,
        message: `Siswa dengan barcode/NISN [${cleanedCode}] tidak terdaftar dalam database sekolah.`
      };
    }

    // Check if student is already recorded today
    const existingIndex = attendanceRecords.findIndex(
      r => (r.studentId === student.id || r.nisn === student.nisn) && r.tanggal === currentDate
    );

    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const timeToRecord = timeFormatted || currentTime;
    const isLate = status === 'hadir' ? isTimeLate(timeToRecord, schoolInfo.jamMasuk) : false;

    let finalNote = catatan;
    if (!finalNote && isLate) {
      finalNote = `Terlambat hadir (Setelah jam ${schoolInfo.jamMasuk} WIB)`;
    }

    const newRecord: AttendanceRecord = {
      id: `rec-${currentDate}-${student.id}-${Date.now()}`,
      studentId: student.id,
      nisn: student.nisn,
      nama: student.nama,
      kelas: student.kelas,
      tanggal: currentDate,
      waktu: timeToRecord,
      status,
      terlambat: isLate,
      catatan: finalNote
    };

    if (existingIndex >= 0) {
      // Overwrite/update today's existing record (e.g. if status was updated from Hadir to Sakit)
      const updated = [...attendanceRecords];
      updated[existingIndex] = newRecord;
      setAttendanceRecords(updated);

      if (isLate) {
        soundEffects.playWarning();
      } else {
        soundEffects.playSuccess();
      }

      return {
        success: true,
        student,
        record: newRecord,
        isLate,
        isDuplicate: true,
        message: `Presensi ${student.nama} (${student.kelas}) berhasil diperbarui menjadi ${status.toUpperCase()}.`
      };
    }

    // Fresh new record
    setAttendanceRecords(prev => [newRecord, ...prev]);

    if (isLate) {
      soundEffects.playWarning();
    } else {
      soundEffects.playSuccess();
    }

    return {
      success: true,
      student,
      record: newRecord,
      isLate,
      isDuplicate: false,
      message: `Presensi ${student.nama} (${student.kelas}) berhasil dicatat: ${status.toUpperCase()}${isLate ? ' (TERLAMBAT)' : ''}.`
    };
  };

  // Student CRUD
  const addStudent = (data: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...data,
      id: `std-${Date.now()}`
    };
    setStudents(prev => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Teacher CRUD
  const addTeacher = (data: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...data,
      id: `t-${Date.now()}`
    };
    setTeachers(prev => [newTeacher, ...prev]);
    return newTeacher;
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  // Announcements CRUD
  const addAnnouncement = (data: Omit<SchoolAnnouncement, 'id'>) => {
    const newAnn: SchoolAnnouncement = {
      ...data,
      id: `ann-${Date.now()}`
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const updateAnnouncement = (id: string, data: Partial<SchoolAnnouncement>) => {
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, ...data } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Permission Requests (from Parent Portal)
  const submitPermissionRequest = (data: Omit<PermissionRequest, 'id' | 'status' | 'createdAt'>) => {
    const now = new Date();
    const createdAt = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
    const newReq: PermissionRequest = {
      ...data,
      id: `perm-${Date.now()}`,
      status: 'menunggu',
      createdAt
    };
    setPermissionRequests(prev => [newReq, ...prev]);
  };

  const updatePermissionStatus = (id: string, status: 'disetujui' | 'ditolak') => {
    const req = permissionRequests.find(r => r.id === id);
    if (!req) return;

    setPermissionRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );

    // If approved, automatically record attendance as sakit or izin for the dates
    if (status === 'disetujui') {
      const student = students.find(s => s.id === req.studentId || s.nisn === req.nisn);
      if (student) {
        const newRecord: AttendanceRecord = {
          id: `rec-perm-${req.tanggalMulai}-${student.id}`,
          studentId: student.id,
          nisn: student.nisn,
          nama: student.nama,
          kelas: student.kelas,
          tanggal: req.tanggalMulai,
          waktu: '07:00:00',
          status: req.jenis,
          terlambat: false,
          catatan: `Surat Permohonan Diterima: ${req.alasan} (Pengirim: ${req.namaPengirim})`
        };

        setAttendanceRecords(prev => {
          const filtered = prev.filter(
            r => !(r.studentId === student.id && r.tanggal === req.tanggalMulai)
          );
          return [newRecord, ...filtered];
        });
      }
    }
  };

  const updateSchoolInfo = (data: Partial<typeof INITIAL_SCHOOL_INFO>) => {
    setSchoolInfo(prev => ({ ...prev, ...data }));
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_info`);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_teachers`);
    localStorage.removeItem(`${STORAGE_KEY}_attendance`);
    localStorage.removeItem(`${STORAGE_KEY}_announcements`);
    localStorage.removeItem(`${STORAGE_KEY}_permissions`);
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    setSchoolInfo(INITIAL_SCHOOL_INFO);
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setAttendanceRecords(generateSeedAttendance());
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setPermissionRequests(INITIAL_PERMISSIONS);
    setCurrentUser({ role: 'admin', name: 'Operator Sekolah', username: 'admin' });
  };

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  const loginAsAdmin = (password: string) => {
    const trimmed = password.trim();
    if (trimmed === 'admin123' || trimmed === 'admin' || trimmed === '123456') {
      const user: AuthUser = { role: 'admin', name: 'Operator Sekolah', username: 'admin' };
      setCurrentUser(user);
      return { success: true, message: 'Berhasil masuk sebagai Admin / Operator Sekolah' };
    }
    return { success: false, message: 'Kata sandi salah! Gunakan kata sandi bawaan: admin123' };
  };

  const loginAsUmum = (name = 'Akses Umum (Siswa/Wali Murid)', nisn?: string) => {
    const user: AuthUser = { role: 'umum', name, nisn };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser({ role: 'umum', name: 'Akses Umum (Siswa/Wali Murid)' });
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser({ role: 'admin', name: 'Operator Sekolah', username: 'admin' });
    } else {
      setCurrentUser({ role: 'umum', name: 'Akses Umum (Siswa/Wali Murid)' });
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolInfo,
        students,
        teachers,
        attendanceRecords,
        announcements,
        permissionRequests,
        currentDate,
        currentTime,
        setCurrentDate,
        currentUser,
        loginAsAdmin,
        loginAsUmum,
        logout,
        switchRole,
        recordAttendance,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        submitPermissionRequest,
        updatePermissionStatus,
        updateSchoolInfo,
        resetAllData
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
