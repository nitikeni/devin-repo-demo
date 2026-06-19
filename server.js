/**
 * Simple Express Server for Student Attendance Webapp
 * Serves static files and provides API endpoints
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Student Attendance Webapp is running',
    timestamp: new Date().toISOString()
  });
});

// API endpoint to get sample data
app.get('/api/sample-data', (req, res) => {
  const sampleData = {
    students: [
      {
        id: 'uuid-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        rollNumber: 'STU001',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'uuid-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        rollNumber: 'STU002',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:05:00Z'
      },
      {
        id: 'uuid-3',
        name: 'Michael Johnson',
        email: 'michael.j@example.com',
        rollNumber: 'STU003',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:10:00Z'
      },
      {
        id: 'uuid-4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        rollNumber: 'STU004',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:15:00Z'
      },
      {
        id: 'uuid-5',
        name: 'Robert Wilson',
        email: 'robert.w@example.com',
        rollNumber: 'STU005',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:20:00Z'
      }
    ],
    attendance: [
      {
        id: 'att-1',
        studentId: 'uuid-1',
        date: '2024-06-18',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-18T09:00:00Z'
      },
      {
        id: 'att-2',
        studentId: 'uuid-2',
        date: '2024-06-18',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-18T09:05:00Z'
      },
      {
        id: 'att-3',
        studentId: 'uuid-3',
        date: '2024-06-18',
        status: 'absent',
        remarks: 'Sick leave',
        recordedAt: '2024-06-18T09:10:00Z'
      },
      {
        id: 'att-4',
        studentId: 'uuid-4',
        date: '2024-06-18',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-18T09:15:00Z'
      },
      {
        id: 'att-5',
        studentId: 'uuid-5',
        date: '2024-06-18',
        status: 'leave',
        remarks: 'Approved leave',
        recordedAt: '2024-06-18T09:20:00Z'
      },
      {
        id: 'att-6',
        studentId: 'uuid-1',
        date: '2024-06-17',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-17T09:00:00Z'
      },
      {
        id: 'att-7',
        studentId: 'uuid-2',
        date: '2024-06-17',
        status: 'absent',
        remarks: '',
        recordedAt: '2024-06-17T09:05:00Z'
      },
      {
        id: 'att-8',
        studentId: 'uuid-3',
        date: '2024-06-17',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-17T09:10:00Z'
      },
      {
        id: 'att-9',
        studentId: 'uuid-4',
        date: '2024-06-17',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-17T09:15:00Z'
      },
      {
        id: 'att-10',
        studentId: 'uuid-5',
        date: '2024-06-17',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-17T09:20:00Z'
      }
    ]
  };
  res.json(sampleData);
});

// API endpoint to initialize with sample data
app.post('/api/init-sample-data', (req, res) => {
  const sampleData = {
    students: [
      {
        id: 'uuid-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        rollNumber: 'STU001',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'uuid-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        rollNumber: 'STU002',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:05:00Z'
      },
      {
        id: 'uuid-3',
        name: 'Michael Johnson',
        email: 'michael.j@example.com',
        rollNumber: 'STU003',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:10:00Z'
      },
      {
        id: 'uuid-4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        rollNumber: 'STU004',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:15:00Z'
      },
      {
        id: 'uuid-5',
        name: 'Robert Wilson',
        email: 'robert.w@example.com',
        rollNumber: 'STU005',
        enrollmentDate: '2024-01-15',
        createdAt: '2024-01-15T10:20:00Z'
      }
    ],
    attendance: [
      {
        id: 'att-1',
        studentId: 'uuid-1',
        date: '2024-06-18',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-18T09:00:00Z'
      },
      {
        id: 'att-2',
        studentId: 'uuid-2',
        date: '2024-06-18',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-18T09:05:00Z'
      },
      {
        id: 'att-3',
        studentId: 'uuid-3',
        date: '2024-06-18',
        status: 'absent',
        remarks: 'Sick leave',
        recordedAt: '2024-06-18T09:10:00Z'
      },
      {
        id: 'att-4',
        studentId: 'uuid-4',
        date: '2024-06-18',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-18T09:15:00Z'
      },
      {
        id: 'att-5',
        studentId: 'uuid-5',
        date: '2024-06-18',
        status: 'leave',
        remarks: 'Approved leave',
        recordedAt: '2024-06-18T09:20:00Z'
      },
      {
        id: 'att-6',
        studentId: 'uuid-1',
        date: '2024-06-17',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-17T09:00:00Z'
      },
      {
        id: 'att-7',
        studentId: 'uuid-2',
        date: '2024-06-17',
        status: 'absent',
        remarks: '',
        recordedAt: '2024-06-17T09:05:00Z'
      },
      {
        id: 'att-8',
        studentId: 'uuid-3',
        date: '2024-06-17',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-17T09:10:00Z'
      },
      {
        id: 'att-9',
        studentId: 'uuid-4',
        date: '2024-06-17',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-17T09:15:00Z'
      },
      {
        id: 'att-10',
        studentId: 'uuid-5',
        date: '2024-06-17',
        status: 'present',
        remarks: '',
        recordedAt: '2024-06-17T09:20:00Z'
      }
    ]
  };
  res.json({
    success: true,
    message: 'Sample data initialized',
    data: sampleData
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('Student Attendance Webapp Server');
  console.log(`${'='.repeat(60)}`);
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`${'='.repeat(60)}\n`);
});

module.exports = app;
