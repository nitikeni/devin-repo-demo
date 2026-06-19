# Student Attendance Webapp - Data Schema

## Overview
This document describes the data structure and schema used in the Student Attendance Webapp. The application uses browser localStorage for data persistence.

## Database Structure

### 1. Students Collection
**Storage Key:** `attendance_students`

**Schema:**
```json
{
  "id": "string (UUID v4)",
  "name": "string",
  "email": "string",
  "rollNumber": "string (unique)",
  "enrollmentDate": "string (ISO date YYYY-MM-DD)",
  "createdAt": "string (ISO timestamp)"
}
```

**Example:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "CS001",
    "enrollmentDate": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "rollNumber": "CS002",
    "enrollmentDate": "2024-01-15",
    "createdAt": "2024-01-15T10:31:00.000Z"
  }
]
```

### 2. Attendance Collection
**Storage Key:** `attendance_records`

**Schema:**
```json
{
  "id": "string (UUID v4)",
  "studentId": "string (references Students.id)",
  "date": "string (ISO date YYYY-MM-DD)",
  "status": "string ('present' | 'absent' | 'leave')",
  "remarks": "string (optional)",
  "recordedAt": "string (ISO timestamp)"
}
```

**Example:**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "studentId": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2024-01-20",
    "status": "present",
    "remarks": "",
    "recordedAt": "2024-01-20T09:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "studentId": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2024-01-21",
    "status": "absent",
    "remarks": "Sick leave",
    "recordedAt": "2024-01-21T09:00:00.000Z"
  }
]
```

## Data Constraints

### Students
- **id**: Auto-generated UUID v4, unique
- **name**: Required, non-empty string
- **email**: Required, valid email format
- **rollNumber**: Required, unique across all students
- **enrollmentDate**: ISO date format (YYYY-MM-DD), defaults to current date
- **createdAt**: Auto-generated ISO timestamp

### Attendance
- **id**: Auto-generated UUID v4, unique
- **studentId**: Must reference an existing student
- **date**: ISO date format (YYYY-MM-DD)
- **status**: Must be one of: 'present', 'absent', 'leave'
- **remarks**: Optional text field for additional notes
- **recordedAt**: Auto-generated ISO timestamp
- **Composite Unique**: (studentId, date) - Only one attendance record per student per day

## Data Operations

### Student Operations
- `addStudent(studentData)` - Create new student
- `getAllStudents()` - Retrieve all students
- `getStudentById(studentId)` - Retrieve specific student
- `updateStudent(studentId, updates)` - Update student information
- `deleteStudent(studentId)` - Delete student and related attendance records

### Attendance Operations
- `markAttendance(studentId, date, status, remarks)` - Create or update attendance
- `getAllAttendance()` - Retrieve all attendance records
- `getStudentAttendance(studentId, startDate, endDate)` - Get attendance for specific student
- `getAttendanceByDate(date)` - Get all attendance for specific date
- `getStudentStatistics(studentId, startDate, endDate)` - Calculate attendance statistics
- `getDateStatistics(date)` - Get statistics for specific date
- `deleteAttendance(attendanceId)` - Delete attendance record

### Data Management
- `exportData()` - Export all data as JSON
- `importData(data)` - Import data from JSON
- `clearAll()` - Clear all data (destructive)

## Statistics Calculation

**Student Statistics Object:**
```json
{
  "total": "number (total attendance records)",
  "present": "number (present count)",
  "absent": "number (absent count)",
  "leave": "number (leave count)",
  "attendancePercentage": "number (0-100, calculated as (present + leave) / total * 100)"
}
```

**Date Statistics Object:**
```json
{
  "date": "string (ISO date)",
  "total": "number (total marked)",
  "present": "number (present count)",
  "absent": "number (absent count)",
  "leave": "number (leave count)"
}
```

## Data Persistence

- All data is stored in browser's localStorage
- Data persists across browser sessions
- Data is lost if browser cache is cleared
- Export/Import functionality allows data backup and transfer

## Data Validation

- Roll numbers must be unique
- Email format is validated
- Attendance status must be one of predefined values
- Student ID references are validated before creating attendance records
- Dates are validated to be in ISO format (YYYY-MM-DD)

## Future Enhancements

- Backend database integration (MongoDB, PostgreSQL, etc.)
- User authentication and authorization
- Role-based access control (Admin, Teacher, Student)
- Audit logging for data changes
- Data encryption for sensitive information
- Automated backups
