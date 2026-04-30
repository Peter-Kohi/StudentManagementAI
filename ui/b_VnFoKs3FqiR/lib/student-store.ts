'use client'
import { Student } from './types'

const API_URL = 'https://student-api-1-k7kc.onrender.com/api/students'

// Chuyển đổi format giữa UI và Backend
const toBackend = (s: Student) => ({
  id: s.mssv,
  fullName: s.fullName,
  gpa: s.gpa,
  major: s.major,
  birthYear: s.birthYear
})

const toFrontend = (s: any): Student => ({
  mssv: s.id,
  fullName: s.fullName,
  gpa: s.gpa,
  major: s.major,
  birthYear: s.birthYear
})

let students: Student[] = []
let listeners: Set<() => void> = new Set()

const notifyListeners = () => listeners.forEach(l => l())

export const studentStore = {
  getStudents: () => students,

  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  // Load data từ Spring Boot khi khởi động
  fetchAll: async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      students = data.map(toFrontend)
      notifyListeners()
    } catch (e) {
      console.error('Lỗi kết nối backend:', e)
    }
  },

  addStudent: async (student: Student) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toBackend(student))
      })
      if (res.ok) {
        students = [...students, student]
        notifyListeners()
      }
    } catch (e) {
      console.error('Lỗi thêm sinh viên:', e)
    }
  },

  deleteStudent: async (mssv: string) => {
    try {
      await fetch(`${API_URL}/${mssv}`, { method: 'DELETE' })
      students = students.filter(s => s.mssv !== mssv)
      notifyListeners()
    } catch (e) {
      console.error('Lỗi xóa sinh viên:', e)
    }
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