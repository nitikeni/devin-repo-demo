/**
 * Database Module for Student Attendance Webapp
 * Handles all data storage and retrieval operations
 */

const Database = (() => {
  // Database keys for localStorage
  const STUDENTS_KEY = 'attendance_students';
  const ATTENDANCE_KEY = 'attendance_records';

  /**
   * Initialize database with default structure if empty
   */
  const init = () => {
    if (!localStorage.getItem(STUDENTS_KEY)) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(ATTENDANCE_KEY)) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify([]));
    }
  };

  /**
   * Student Schema:
   * {
   *   id: string (UUID),
   *   name: string,
   *   email: string,
   *   rollNumber: string,
   *   enrollmentDate: string (ISO date),
   *   createdAt: string (ISO timestamp)
   * }
   */

  /**
   * Attendance Schema:
   * {
   *   id: string (UUID),
   *   studentId: string,
   *   date: string (ISO date YYYY-MM-DD),
   *   status: string ('present' | 'absent' | 'leave'),
   *   remarks: string (optional),
   *   recordedAt: string (ISO timestamp)
   * }
   */

  /**
   * Generate UUID v4
   */
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  /**
   * Get current ISO date string (YYYY-MM-DD)
   */
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  /**
   * Get current ISO timestamp
   */
  const getCurrentTimestamp = () => {
    return new Date().toISOString();
  };

  // ==================== STUDENT OPERATIONS ====================

  /**
   * Add a new student
   * @param {Object} studentData - {name, email, rollNumber, enrollmentDate}
   * @returns {Object} Created student object
   */
  const addStudent = (studentData) => {
    const students = getAllStudents();
    
    if (!studentData.name || !studentData.email || !studentData.rollNumber) {
      throw new Error('Name, email, and roll number are required');
    }

    if (students.some(s => s.rollNumber === studentData.rollNumber)) {
      throw new Error('Student with this roll number already exists');
    }

    const newStudent = {
      id: generateUUID(),
      name: studentData.name.trim(),
      email: studentData.email.trim(),
      rollNumber: studentData.rollNumber.trim(),
      enrollmentDate: studentData.enrollmentDate || getCurrentDate(),
      createdAt: getCurrentTimestamp()
    };

    students.push(newStudent);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    return newStudent;
  };

  /**
   * Get all students
   * @returns {Array} Array of student objects
   */
  const getAllStudents = () => {
    const data = localStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  };

  /**
   * Get student by ID
   * @param {string} studentId
   * @returns {Object|null} Student object or null
   */
  const getStudentById = (studentId) => {
    const students = getAllStudents();
    return students.find(s => s.id === studentId) || null;
  };

  /**
   * Update student information
   * @param {string} studentId
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated student object
   */
  const updateStudent = (studentId, updates) => {
    const students = getAllStudents();
    const index = students.findIndex(s => s.id === studentId);
    
    if (index === -1) {
      throw new Error('Student not found');
    }

    if (updates.rollNumber && updates.rollNumber !== students[index].rollNumber) {
      if (students.some(s => s.rollNumber === updates.rollNumber)) {
        throw new Error('Student with this roll number already exists');
      }
    }

    students[index] = {
      ...students[index],
      ...updates,
      id: students[index].id,
      createdAt: students[index].createdAt
    };

    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    return students[index];
  };

  /**
   * Delete student and their attendance records
   * @param {string} studentId
   * @returns {boolean} Success status
   */
  const deleteStudent = (studentId) => {
    const students = getAllStudents();
    const filtered = students.filter(s => s.id !== studentId);
    
    if (filtered.length === students.length) {
      throw new Error('Student not found');
    }

    localStorage.setItem(STUDENTS_KEY, JSON.stringify(filtered));
    
    const attendance = getAllAttendance();
    const filteredAttendance = attendance.filter(a => a.studentId !== studentId);
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(filteredAttendance));
    
    return true;
  };

  // ==================== ATTENDANCE OPERATIONS ====================

  /**
   * Mark attendance for a student
   * @param {string} studentId
   * @param {string} date - ISO date (YYYY-MM-DD)
   * @param {string} status - 'present' | 'absent' | 'leave'
   * @param {string} remarks - Optional remarks
   * @returns {Object} Attendance record
   */
  const markAttendance = (studentId, date, status, remarks = '') => {
    if (!['present', 'absent', 'leave'].includes(status)) {
      throw new Error('Invalid status. Must be present, absent, or leave');
    }

    const student = getStudentById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const attendance = getAllAttendance();
    
    const existingIndex = attendance.findIndex(
      a => a.studentId === studentId && a.date === date
    );

    const attendanceRecord = {
      id: existingIndex === -1 ? generateUUID() : attendance[existingIndex].id,
      studentId,
      date,
      status,
      remarks: remarks.trim(),
      recordedAt: getCurrentTimestamp()
    };

    if (existingIndex === -1) {
      attendance.push(attendanceRecord);
    } else {
      attendance[existingIndex] = attendanceRecord;
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
    return attendanceRecord;
  };

  /**
   * Get all attendance records
   * @returns {Array} Array of attendance records
   */
  const getAllAttendance = () => {
    const data = localStorage.getItem(ATTENDANCE_KEY);
    return data ? JSON.parse(data) : [];
  };

  /**
   * Get attendance for a specific student
   * @param {string} studentId
   * @param {string} startDate - Optional ISO date filter
   * @param {string} endDate - Optional ISO date filter
   * @returns {Array} Filtered attendance records
   */
  const getStudentAttendance = (studentId, startDate = null, endDate = null) => {
    let records = getAllAttendance().filter(a => a.studentId === studentId);

    if (startDate) {
      records = records.filter(a => a.date >= startDate);
    }
    if (endDate) {
      records = records.filter(a => a.date <= endDate);
    }

    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  /**
   * Get attendance for a specific date
   * @param {string} date - ISO date (YYYY-MM-DD)
   * @returns {Array} Attendance records for that date
   */
  const getAttendanceByDate = (date) => {
    return getAllAttendance().filter(a => a.date === date);
  };

  /**
   * Get attendance statistics for a student
   * @param {string} studentId
   * @param {string} startDate - Optional ISO date filter
   * @param {string} endDate - Optional ISO date filter
   * @returns {Object} Statistics object
   */
  const getStudentStatistics = (studentId, startDate = null, endDate = null) => {
    const records = getStudentAttendance(studentId, startDate, endDate);
    
    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      leave: records.filter(r => r.status === 'leave').length,
      attendancePercentage: 0
    };

    if (stats.total > 0) {
      stats.attendancePercentage = Math.round(
        ((stats.present + stats.leave) / stats.total) * 100
      );
    }

    return stats;
  };

  /**
   * Get attendance statistics for all students on a specific date
   * @param {string} date - ISO date (YYYY-MM-DD)
   * @returns {Object} Statistics object
   */
  const getDateStatistics = (date) => {
    const records = getAttendanceByDate(date);
    
    return {
      date,
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      leave: records.filter(r => r.status === 'leave').length
    };
  };

  /**
   * Delete attendance record
   * @param {string} attendanceId
   * @returns {boolean} Success status
   */
  const deleteAttendance = (attendanceId) => {
    const attendance = getAllAttendance();
    const filtered = attendance.filter(a => a.id !== attendanceId);
    
    if (filtered.length === attendance.length) {
      throw new Error('Attendance record not found');
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(filtered));
    return true;
  };

  /**
   * Export data as JSON
   * @returns {Object} Complete database export
   */
  const exportData = () => {
    return {
      students: getAllStudents(),
      attendance: getAllAttendance(),
      exportedAt: getCurrentTimestamp()
    };
  };

  /**
   * Import data from JSON
   * @param {Object} data - Data object with students and attendance arrays
   * @returns {boolean} Success status
   */
  const importData = (data) => {
    if (!data.students || !Array.isArray(data.students)) {
      throw new Error('Invalid data format: students array required');
    }
    if (!data.attendance || !Array.isArray(data.attendance)) {
      throw new Error('Invalid data format: attendance array required');
    }

    localStorage.setItem(STUDENTS_KEY, JSON.stringify(data.students));
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data.attendance));
    return true;
  };

  /**
   * Clear all data (use with caution)
   * @returns {boolean} Success status
   */
  const clearAll = () => {
    localStorage.removeItem(STUDENTS_KEY);
    localStorage.removeItem(ATTENDANCE_KEY);
    init();
    return true;
  };

  return {
    init,
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    markAttendance,
    getAllAttendance,
    getStudentAttendance,
    getAttendanceByDate,
    getStudentStatistics,
    getDateStatistics,
    deleteAttendance,
    exportData,
    importData,
    clearAll,
    getCurrentDate,
    getCurrentTimestamp
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Database.init());
} else {
  Database.init();
}
