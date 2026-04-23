export interface Student {
  mssv: string
  fullName: string
  gpa: number
  major: string
  birthYear: number
}

export type SortOrder = 'asc' | 'desc' | null

export interface StudentFormData {
  mssv: string
  fullName: string
  gpa: string
  major: string
  birthYear: string
}
