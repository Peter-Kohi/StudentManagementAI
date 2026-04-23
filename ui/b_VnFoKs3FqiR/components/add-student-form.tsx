'use client'

import { useState } from 'react'
import { useStudents } from '@/hooks/use-students'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const majors = [
  'Công nghệ thông tin',
  'Kinh tế',
  'Điện tử viễn thông',
  'Cơ khí',
  'Xây dựng',
  'Y khoa',
  'Luật',
  'Ngoại ngữ',
]

interface FormErrors {
  mssv?: string
  fullName?: string
  gpa?: string
  major?: string
  birthYear?: string
}

export function AddStudentForm() {
  const { addStudent, students } = useStudents()
  const [formData, setFormData] = useState({
    mssv: '',
    fullName: '',
    gpa: '',
    major: '',
    birthYear: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // MSSV validation
    if (!formData.mssv.trim()) {
      newErrors.mssv = 'Vui lòng nhập MSSV'
    } else if (students.some(s => s.mssv === formData.mssv.trim())) {
      newErrors.mssv = 'MSSV đã tồn tại'
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự'
    }

    // GPA validation
    const gpa = parseFloat(formData.gpa)
    if (!formData.gpa) {
      newErrors.gpa = 'Vui lòng nhập GPA'
    } else if (isNaN(gpa) || gpa < 0 || gpa > 4) {
      newErrors.gpa = 'GPA phải từ 0.0 đến 4.0'
    }

    // Major validation
    if (!formData.major) {
      newErrors.major = 'Vui lòng chọn ngành học'
    }

    // Birth year validation
    const birthYear = parseInt(formData.birthYear)
    const currentYear = new Date().getFullYear()
    if (!formData.birthYear) {
      newErrors.birthYear = 'Vui lòng nhập năm sinh'
    } else if (isNaN(birthYear) || birthYear < 1950 || birthYear > currentYear - 16) {
      newErrors.birthYear = `Năm sinh phải từ 1950 đến ${currentYear - 16}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    addStudent({
      mssv: formData.mssv.trim(),
      fullName: formData.fullName.trim(),
      gpa: parseFloat(formData.gpa),
      major: formData.major,
      birthYear: parseInt(formData.birthYear),
    })

    setIsSuccess(true)
    toast.success('Thêm sinh viên thành công!')
    
    setFormData({
      mssv: '',
      fullName: '',
      gpa: '',
      major: '',
      birthYear: '',
    })
    setErrors({})

    setTimeout(() => setIsSuccess(false), 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Thêm sinh viên mới</h2>
        <p className="text-muted-foreground">
          Nhập thông tin sinh viên để thêm vào hệ thống
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Thông tin sinh viên
          </CardTitle>
          <CardDescription>
            Điền đầy đủ các trường thông tin bên dưới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MSSV */}
              <div className="space-y-2">
                <Label htmlFor="mssv">Mã số sinh viên (MSSV) *</Label>
                <Input
                  id="mssv"
                  placeholder="VD: SV013"
                  value={formData.mssv}
                  onChange={(e) => handleInputChange('mssv', e.target.value)}
                  className={errors.mssv ? 'border-destructive' : ''}
                />
                {errors.mssv && (
                  <p className="text-sm text-destructive">{errors.mssv}</p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* GPA */}
              <div className="space-y-2">
                <Label htmlFor="gpa">Điểm GPA (0.0 - 4.0) *</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="VD: 3.5"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                  className={errors.gpa ? 'border-destructive' : ''}
                />
                {errors.gpa && (
                  <p className="text-sm text-destructive">{errors.gpa}</p>
                )}
              </div>

              {/* Major */}
              <div className="space-y-2">
                <Label htmlFor="major">Ngành học *</Label>
                <Select
                  value={formData.major}
                  onValueChange={(value) => handleInputChange('major', value)}
                >
                  <SelectTrigger className={errors.major ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Chọn ngành học" />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((major) => (
                      <SelectItem key={major} value={major}>
                        {major}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.major && (
                  <p className="text-sm text-destructive">{errors.major}</p>
                )}
              </div>

              {/* Birth Year */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="birthYear">Năm sinh *</Label>
                <Input
                  id="birthYear"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() - 16}
                  placeholder="VD: 2002"
                  value={formData.birthYear}
                  onChange={(e) => handleInputChange('birthYear', e.target.value)}
                  className={errors.birthYear ? 'border-destructive' : ''}
                />
                {errors.birthYear && (
                  <p className="text-sm text-destructive">{errors.birthYear}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 md:flex-none">
                {isSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đã thêm thành công!
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm sinh viên
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    mssv: '',
                    fullName: '',
                    gpa: '',
                    major: '',
                    birthYear: '',
                  })
                  setErrors({})
                }}
              >
                Làm mới
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
