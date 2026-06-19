/**
 * Main Application Script for Student Attendance Webapp
 * Handles UI interactions and integrates with Database module
 */

const App = (() => {
  // DOM Elements
  let elements = {};
  let currentDate = new Date().toISOString().split('T')[0];
  let attendanceMarks = {}; // Temporary storage for current session marks

  /**
   * Initialize the application
   */
  const init = () => {
    cacheElements();
    attachEventListeners();
    setDefaultDate();
    renderStudents();
    updateReports();
  };

  /**
   * Cache all DOM elements for better performance
   */
  const cacheElements = () => {
    elements = {
      // Forms
      addStudentForm: document.getElementById('addStudentForm'),
      studentName: document.getElementById('studentName'),
      studentId: document.getElementById('studentId'),
      studentEmail: document.getElementById('studentEmail'),
      studentRoll: document.getElementById('studentRoll'),
      
      // Attendance
      attendanceDate: document.getElementById('attendanceDate'),
      attendanceTable: document.getElementById('attendanceTable'),
      attendanceTableBody: document.getElementById('attendanceTableBody'),
      noStudentsMessage: document.getElementById('noStudentsMessage'),
      saveAttendanceBtn: document.getElementById('saveAttendanceBtn'),
      clearAttendanceBtn: document.getElementById('clearAttendanceBtn'),
      
      // Reports
      totalStudents: document.getElementById('totalStudents'),
      totalRecords: document.getElementById('totalRecords'),
      studentFilterSelect: document.getElementById('studentFilterSelect'),
      studentHistoryContent: document.getElementById('studentHistoryContent'),
      exportReportBtn: document.getElementById('exportReportBtn'),
      clearAllDataBtn: document.getElementById('clearAllDataBtn')
    };
  };

  /**
   * Attach event listeners to DOM elements
   */
  const attachEventListeners = () => {
    // Add student form submission
    elements.addStudentForm.addEventListener('submit', handleAddStudent);
    
    // Attendance date change
    elements.attendanceDate.addEventListener('change', handleDateChange);
    
    // Attendance buttons
    elements.saveAttendanceBtn.addEventListener('click', handleSaveAttendance);
    elements.clearAttendanceBtn.addEventListener('click', handleClearAttendance);
    
    // Report buttons
    elements.exportReportBtn.addEventListener('click', handleExportReport);
    elements.clearAllDataBtn.addEventListener('click', handleClearAllData);
    
    // Student filter for history
    elements.studentFilterSelect.addEventListener('change', handleStudentFilter);
  };

  /**
   * Set default date to today
   */
  const setDefaultDate = () => {
    const today = new Date().toISOString().split('T')[0];
    elements.attendanceDate.value = today;
    currentDate = today;
  };

  /**
   * Handle adding a new student
   */
  const handleAddStudent = (e) => {
    e.preventDefault();
    
    try {
      const studentData = {
        name: elements.studentName.value,
        email: elements.studentEmail.value,
        rollNumber: elements.studentRoll.value,
        enrollmentDate: currentDate
      };

      // Validate required fields
      if (!studentData.name || !studentData.rollNumber) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }

      // Add student to database
      const newStudent = Database.addStudent(studentData);
      
      // Clear form
      elements.addStudentForm.reset();
      
      // Update UI
      renderStudents();
      updateReports();
      
      showNotification(`Student "${newStudent.name}" added successfully!`, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  /**
   * Handle date change
   */
  const handleDateChange = (e) => {
    currentDate = e.target.value;
    attendanceMarks = {}; // Reset marks for new date
    renderStudents();
  };

  /**
   * Render students in attendance table
   */
  const renderStudents = () => {
    const students = Database.getAllStudents();
    const tbody = elements.attendanceTableBody;
    tbody.innerHTML = '';

    if (students.length === 0) {
      elements.noStudentsMessage.style.display = 'block';
      elements.attendanceTable.style.display = 'none';
      return;
    }

    elements.noStudentsMessage.style.display = 'none';
    elements.attendanceTable.style.display = 'table';

    students.forEach(student => {
      // Check if attendance already exists for this student on this date
      const existingAttendance = Database.getStudentAttendance(student.id)
        .find(a => a.date === currentDate);
      
      const status = existingAttendance ? existingAttendance.status : 'unmarked';
      const attendanceId = existingAttendance ? existingAttendance.id : null;

      const row = document.createElement('tr');
      row.className = `attendance-row status-${status}`;
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email || '-'}</td>
        <td>
          <div class="status-buttons">
            <button class="btn btn-status btn-present ${status === 'present' ? 'active' : ''}" 
                    data-student-id="${student.id}" data-status="present">
              Present
            </button>
            <button class="btn btn-status btn-absent ${status === 'absent' ? 'active' : ''}" 
                    data-student-id="${student.id}" data-status="absent">
              Absent
            </button>
            <button class="btn btn-status btn-leave ${status === 'leave' ? 'active' : ''}" 
                    data-student-id="${student.id}" data-status="leave">
              Leave
            </button>
          </div>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" data-student-id="${student.id}" data-attendance-id="${attendanceId}">
            Delete
          </button>
        </td>
      `;

      tbody.appendChild(row);
    });

    // Attach event listeners to status buttons
    attachStatusButtonListeners();
    attachDeleteButtonListeners();
    
    // Update student filter select
    updateStudentFilterSelect();
  };

  /**
   * Attach listeners to status buttons
   */
  const attachStatusButtonListeners = () => {
    const statusButtons = document.querySelectorAll('.btn-status');
    statusButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const studentId = btn.dataset.studentId;
        const status = btn.dataset.status;
        
        // Mark in temporary storage
        attendanceMarks[studentId] = status;
        
        // Update UI
        const row = btn.closest('tr');
        row.querySelectorAll('.btn-status').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        row.className = `attendance-row status-${status}`;
      });
    });
  };

  /**
   * Attach listeners to delete buttons
   */
  const attachDeleteButtonListeners = () => {
    const deleteButtons = document.querySelectorAll('td .btn-danger');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const attendanceId = btn.dataset.attendanceId;
        
        if (!attendanceId) {
          showNotification('No attendance record to delete', 'warning');
          return;
        }
        
        if (confirm('Are you sure you want to delete this attendance record?')) {
          try {
            Database.deleteAttendance(attendanceId);
            renderStudents();
            updateReports();
            showNotification('Attendance record deleted successfully', 'success');
          } catch (error) {
            showNotification(error.message, 'error');
          }
        }
      });
    });
  };

  /**
   * Handle saving attendance
   */
  const handleSaveAttendance = () => {
    try {
      if (Object.keys(attendanceMarks).length === 0) {
        showNotification('Please mark attendance for at least one student', 'warning');
        return;
      }

      let savedCount = 0;
      Object.entries(attendanceMarks).forEach(([studentId, status]) => {
        // Check if attendance already exists
        const existing = Database.getStudentAttendance(studentId)
          .find(a => a.date === currentDate);
        
        if (existing) {
          // Update existing record
          Database.markAttendance(studentId, status, currentDate);
        } else {
          // Create new record
          Database.markAttendance(studentId, status, currentDate);
        }
        savedCount++;
      });

      // Clear temporary storage
      attendanceMarks = {};
      
      // Update UI
      renderStudents();
      updateReports();
      
      showNotification(`Attendance saved for ${savedCount} student(s)!`, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  /**
   * Handle clearing attendance marks
   */
  const handleClearAttendance = () => {
    if (confirm('Are you sure you want to clear all attendance marks for this date?')) {
      attendanceMarks = {};
      renderStudents();
      showNotification('Attendance marks cleared', 'info');
    }
  };

  /**
   * Update reports and statistics
   */
  const updateReports = () => {
    const students = Database.getAllStudents();
    const allAttendance = Database.getAllAttendance();
    
    // Update overall statistics
    elements.totalStudents.textContent = students.length;
    elements.totalRecords.textContent = allAttendance.length;
    
    // Update student filter select
    updateStudentFilterSelect();
  };

  /**
   * Update student filter select dropdown
   */
  const updateStudentFilterSelect = () => {
    const students = Database.getAllStudents();
    const currentValue = elements.studentFilterSelect.value;
    
    elements.studentFilterSelect.innerHTML = '<option value="">Select a student...</option>';
    
    students.forEach(student => {
      const option = document.createElement('option');
      option.value = student.id;
      option.textContent = `${student.name} (${student.id})`;
      elements.studentFilterSelect.appendChild(option);
    });
    
    // Restore previous selection if it still exists
    if (currentValue) {
      elements.studentFilterSelect.value = currentValue;
    }
  };

  /**
   * Handle student filter change
   */
  const handleStudentFilter = (e) => {
    const studentId = e.target.value;
    
    if (!studentId) {
      elements.studentHistoryContent.innerHTML = '<p>Select a student to view attendance history</p>';
      return;
    }

    try {
      const student = Database.getStudentById(studentId);
      const attendance = Database.getStudentAttendance(studentId);
      const stats = Database.getStudentStatistics(studentId);

      let html = `
        <div class="student-history">
          <h4>${student.name}</h4>
          <div class="history-stats">
            <p><strong>Total Classes:</strong> ${stats.total}</p>
            <p><strong>Present:</strong> <span class="stat-present">${stats.present}</span></p>
            <p><strong>Absent:</strong> <span class="stat-absent">${stats.absent}</span></p>
            <p><strong>Leave:</strong> <span class="stat-leave">${stats.leave}</span></p>
            <p><strong>Attendance %:</strong> <span class="stat-percentage">${stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : 0}%</span></p>
          </div>
          <div class="history-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
      `;

      if (attendance.length === 0) {
        html += '<tr><td colspan="3">No attendance records found</td></tr>';
      } else {
        // Sort by date descending
        attendance.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        attendance.forEach(record => {
          html += `
            <tr class="status-${record.status}">
              <td>${new Date(record.date).toLocaleDateString()}</td>
              <td><span class="badge badge-${record.status}">${record.status.toUpperCase()}</span></td>
              <td>${record.remarks || '-'}</td>
            </tr>
          `;
        });
      }

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `;

      elements.studentHistoryContent.innerHTML = html;
    } catch (error) {
      elements.studentHistoryContent.innerHTML = `<p class="error">Error loading history: ${error.message}</p>`;
    }
  };

  /**
   * Handle exporting report
   */
  const handleExportReport = () => {
    try {
      const data = Database.exportData();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance_report_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('Report exported successfully!', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  /**
   * Handle clearing all data
   */
  const handleClearAllData = () => {
    if (confirm('WARNING: This will delete ALL students and attendance records. This action cannot be undone. Are you sure?')) {
      if (confirm('Are you absolutely sure? This is irreversible!')) {
        try {
          Database.clearAll();
          attendanceMarks = {};
          renderStudents();
          updateReports();
          showNotification('All data has been cleared', 'success');
        } catch (error) {
          showNotification(error.message, 'error');
        }
      }
    }
  };

  /**
   * Show notification message
   */
  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: ${getNotificationColor(type)};
      color: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  /**
   * Get notification color based on type
   */
  const getNotificationColor = (type) => {
    const colors = {
      success: '#48bb78',
      error: '#f56565',
      warning: '#ed8936',
      info: '#4299e1'
    };
    return colors[type] || colors.info;
  };

  return {
    init
  };
})();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .status-buttons {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .btn-status {
    padding: 6px 12px;
    font-size: 0.85em;
    border: 2px solid #ddd;
    background-color: #f8f9fa;
    color: #333;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
  }

  .btn-status.active {
    border-color: #667eea;
    background-color: #667eea;
    color: white;
  }

  .btn-present.active {
    background-color: #48bb78;
    border-color: #48bb78;
  }

  .btn-absent.active {
    background-color: #f56565;
    border-color: #f56565;
  }

  .btn-leave.active {
    background-color: #ed8936;
    border-color: #ed8936;
  }

  .attendance-row.status-present {
    background-color: #f0fdf4;
  }

  .attendance-row.status-absent {
    background-color: #fef2f2;
  }

  .attendance-row.status-leave {
    background-color: #fffbeb;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.85em;
  }

  .btn-danger {
    background-color: #f56565;
    color: white;
  }

  .btn-danger:hover {
    background-color: #e53e3e;
  }

  .btn-info {
    background-color: #4299e1;
    color: white;
  }

  .btn-info:hover {
    background-color: #3182ce;
  }

  .no-data-message {
    text-align: center;
    color: #999;
    padding: 20px;
    font-style: italic;
  }

  .attendance-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .reports-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .report-card {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  .report-card h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.2em;
  }

  .stats-content p {
    margin: 10px 0;
    font-size: 1.1em;
  }

  .stats-content span {
    font-weight: bold;
    color: #667eea;
  }

  .history-controls {
    margin-bottom: 15px;
  }

  .history-content {
    background-color: white;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .student-history h4 {
    color: #333;
    margin-bottom: 15px;
  }

  .history-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
  }

  .history-stats p {
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 4px;
    margin: 0;
  }

  .stat-present {
    color: #48bb78;
    font-weight: bold;
  }

  .stat-absent {
    color: #f56565;
    font-weight: bold;
  }

  .stat-leave {
    color: #ed8936;
    font-weight: bold;
  }

  .stat-percentage {
    color: #667eea;
    font-weight: bold;
  }

  .history-table {
    margin-top: 15px;
    overflow-x: auto;
  }

  .history-table table {
    width: 100%;
    border-collapse: collapse;
  }

  .history-table th,
  .history-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .history-table th {
    background-color: #f8f9fa;
    font-weight: 600;
  }

  .badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: 600;
    text-transform: uppercase;
  }

  .badge-present {
    background-color: #c6f6d5;
    color: #22543d;
  }

  .badge-absent {
    background-color: #fed7d7;
    color: #742a2a;
  }

  .badge-leave {
    background-color: #feebc8;
    color: #7c2d12;
  }

  .report-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .reports-container {
      grid-template-columns: 1fr;
    }

    .status-buttons {
      flex-direction: column;
    }

    .btn-status {
      width: 100%;
    }

    .history-stats {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
