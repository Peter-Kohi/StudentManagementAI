'use client'

import { useState } from 'react'
import { useStudents, useFilteredStudents } from '@/hooks/use-students'
import { SortOrder } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  UserPlus,
} from 'lucide-react'

interface StudentListProps {
  onAddClick: () => void
}

export function StudentList({ onAddClick }: StudentListProps) {
  const { students, deleteStudent } = useStudents()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const filteredStudents = useFilteredStudents(students, searchTerm, sortOrder)

  const handleSort = () => {
    if (sortOrder === null) setSortOrder('desc')
    else if (sortOrder === 'desc') setSortOrder('asc')
    else setSortOrder(null)
  }

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <ArrowUp className="h-4 w-4" />
    if (sortOrder === 'desc') return <ArrowDown className="h-4 w-4" />
    return <ArrowUpDown className="h-4 w-4" />
  }

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600 bg-green-50'
    if (gpa >= 2.5) return 'text-primary bg-primary/10'
    if (gpa >= 2.0) return 'text-yellow-600 bg-yellow-50'
    return 'text-destructive bg-destructive/10'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Danh sách sinh viên</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin sinh viên ({filteredStudents.length} sinh viên)
          </p>
        </div>
        <Button onClick={onAddClick} className="w-full sm:w-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm sinh viên
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo MSSV, tên, hoặc ngành..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={sortOrder ? 'default' : 'outline'}
              onClick={handleSort}
              className="w-full sm:w-auto"
            >
              {getSortIcon()}
              <span className="ml-2">
                {sortOrder === 'asc'
                  ? 'GPA tăng dần'
                  : sortOrder === 'desc'
                  ? 'GPA giảm dần'
                  : 'Sắp xếp GPA'}
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">MSSV</TableHead>
                    <TableHead className="font-semibold">Họ và tên</TableHead>
                    <TableHead className="font-semibold">GPA</TableHead>
                    <TableHead className="font-semibold">Ngành học</TableHead>
                    <TableHead className="font-semibold">Năm sinh</TableHead>
                    <TableHead className="font-semibold text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm
                          ? 'Không tìm thấy sinh viên phù hợp'
                          : 'Chưa có sinh viên nào'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.mssv} className="hover:bg-muted/30">
                        <TableCell className="font-mono font-medium">
                          {student.mssv}
                        </TableCell>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-medium ${getGpaColor(
                              student.gpa
                            )}`}
                          >
                            {student.gpa.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>{student.major}</TableCell>
                        <TableCell>{student.birthYear}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa sinh viên{' '}
                                  <strong>{student.fullName}</strong> ({student.mssv})?
                                  Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteStudent(student.mssv)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
