'use client'

import { Student } from './types'

// Mock data with Vietnamese names
const initialStudents: Student[] = [
  { mssv: 'SV001', fullName: 'Nguyễn Văn An', gpa: 3.8, major: 'Công nghệ thông tin', birthYear: 2002 },
  { mssv: 'SV002', fullName: 'Trần Thị Bình', gpa: 3.5, major: 'Kinh tế', birthYear: 2001 },
  { mssv: 'SV003', fullName: 'Lê Hoàng Cường', gpa: 2.9, major: 'Công nghệ thông tin', birthYear: 2003 },
  { mssv: 'SV004', fullName: 'Phạm Minh Dũng', gpa: 3.2, major: 'Điện tử viễn thông', birthYear: 2002 },
  { mssv: 'SV005', fullName: 'Hoàng Thị Hoa', gpa: 3.9, major: 'Kinh tế', birthYear: 2001 },
  { mssv: 'SV006', fullName: 'Vũ Đức Hùng', gpa: 2.5, major: 'Cơ khí', birthYear: 2002 },
  { mssv: 'SV007', fullName: 'Đặng Thanh Lan', gpa: 3.6, major: 'Công nghệ thông tin', birthYear: 2003 },
  { mssv: 'SV008', fullName: 'Bùi Văn Mạnh', gpa: 2.8, major: 'Xây dựng', birthYear: 2001 },
  { mssv: 'SV009', fullName: 'Ngô Thị Ngọc', gpa: 3.4, major: 'Kinh tế', birthYear: 2002 },
  { mssv: 'SV010', fullName: 'Đỗ Quang Phú', gpa: 3.1, major: 'Điện tử viễn thông', birthYear: 2003 },
  { mssv: 'SV011', fullName: 'Trương Minh Quân', gpa: 2.7, major: 'Cơ khí', birthYear: 2002 },
  { mssv: 'SV012', fullName: 'Lý Thị Sương', gpa: 3.7, major: 'Công nghệ thông tin', birthYear: 2001 },
]

let students: Student[] = [...initialStudents]
let listeners: Set<() => void> = new Set()

export const studentStore = {
  getStudents: () => students,
  
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  
  addStudent: (student: Student) => {
    students = [...students, student]
    listeners.forEach(listener => listener())
  },
  
  deleteStudent: (mssv: string) => {
    students = students.filter(s => s.mssv !== mssv)
    listeners.forEach(listener => listener())
  },
  
  getStudentByMssv: (mssv: string) => {
    return students.find(s => s.mssv === mssv)
  },
  
  getStats: () => {
    const total = students.length
    const avgGpa = total > 0 ? students.reduce((sum, s) => sum + s.gpa, 0) / total : 0
    const topStudent = students.length > 0 
      ? students.reduce((top, s) => s.gpa > top.gpa ? s : top, students[0])
      : null
    
    return { total, avgGpa, topStudent }
  },
  
  getGpaDistribution: () => {
    const distribution = [
      { range: '0.0-1.0', count: 0 },
      { range: '1.0-2.0', count: 0 },
      { range: '2.0-2.5', count: 0 },
      { range: '2.5-3.0', count: 0 },
      { range: '3.0-3.5', count: 0 },
      { range: '3.5-4.0', count: 0 },
    ]
    
    students.forEach(s => {
      if (s.gpa < 1.0) distribution[0].count++
      else if (s.gpa < 2.0) distribution[1].count++
      else if (s.gpa < 2.5) distribution[2].count++
      else if (s.gpa < 3.0) distribution[3].count++
      else if (s.gpa < 3.5) distribution[4].count++
      else distribution[5].count++
    })
    
    return distribution
  },
  
  getMajorDistribution: () => {
    const majorCount: Record<string, number> = {}
    students.forEach(s => {
      majorCount[s.major] = (majorCount[s.major] || 0) + 1
    })
    return Object.entries(majorCount).map(([major, count]) => ({ major, count }))
  }
}
