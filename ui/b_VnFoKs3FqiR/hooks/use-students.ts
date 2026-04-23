'use client'

import { useSyncExternalStore, useCallback, useMemo } from 'react'
import { studentStore } from '@/lib/student-store'
import { Student, SortOrder } from '@/lib/types'

export function useStudents() {
  const students = useSyncExternalStore(
    studentStore.subscribe,
    studentStore.getStudents,
    studentStore.getStudents
  )
  
  return {
    students,
    addStudent: studentStore.addStudent,
    deleteStudent: studentStore.deleteStudent,
    getStudentByMssv: studentStore.getStudentByMssv,
    getStats: studentStore.getStats,
    getGpaDistribution: studentStore.getGpaDistribution,
    getMajorDistribution: studentStore.getMajorDistribution,
  }
}

export function useFilteredStudents(
  students: Student[],
  searchTerm: string,
  sortOrder: SortOrder
) {
  return useMemo(() => {
    let filtered = students.filter(
      s =>
        s.mssv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.major.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    if (sortOrder === 'asc') {
      filtered = [...filtered].sort((a, b) => a.gpa - b.gpa)
    } else if (sortOrder === 'desc') {
      filtered = [...filtered].sort((a, b) => b.gpa - a.gpa)
    }
    
    return filtered
  }, [students, searchTerm, sortOrder])
}
