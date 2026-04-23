'use client'

import { useState } from 'react'
import { useStudents } from '@/hooks/use-students'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, Search, Users, Sparkles, Loader2, User, AlertCircle } from 'lucide-react'
import { Student } from '@/lib/types'

export function AIAnalysis() {
  const { students, getStudentByMssv } = useStudents()
  const [mssv, setMssv] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [individualResult, setIndividualResult] = useState('')
  const [classResult, setClassResult] = useState('')
  const [isLoadingIndividual, setIsLoadingIndividual] = useState(false)
  const [isLoadingClass, setIsLoadingClass] = useState(false)
  const [error, setError] = useState('')

  const handleSearchStudent = () => {
    setError('')
    const student = getStudentByMssv(mssv.trim())
    if (student) {
      setSelectedStudent(student)
    } else {
      setSelectedStudent(null)
      setError('Không tìm thấy sinh viên với MSSV này')
    }
  }

  const handleAnalyzeIndividual = async () => {
    if (!selectedStudent) return
    
    setIsLoadingIndividual(true)
    setIndividualResult('')
    
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'individual',
          student: selectedStudent,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to analyze')
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const text = decoder.decode(value)
          setIndividualResult(prev => prev + text)
        }
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi phân tích. Vui lòng thử lại.')
    } finally {
      setIsLoadingIndividual(false)
    }
  }

  const handleAnalyzeClass = async () => {
    if (students.length === 0) {
      setError('Không có sinh viên nào trong danh sách')
      return
    }
    
    setIsLoadingClass(true)
    setClassResult('')
    
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'class',
          allStudents: students,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to analyze')
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const text = decoder.decode(value)
          setClassResult(prev => prev + text)
        }
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi phân tích. Vui lòng thử lại.')
    } finally {
      setIsLoadingClass(false)
    }
  }

  const getGpaStatus = (gpa: number) => {
    if (gpa >= 3.5) return { label: 'Xuất sắc', color: 'text-green-600' }
    if (gpa >= 3.0) return { label: 'Giỏi', color: 'text-primary' }
    if (gpa >= 2.5) return { label: 'Khá', color: 'text-blue-500' }
    if (gpa >= 2.0) return { label: 'Trung bình', color: 'text-yellow-600' }
    return { label: 'Yếu', color: 'text-destructive' }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Phân tích AI</h2>
        <p className="text-muted-foreground">
          Sử dụng AI để phân tích và đưa ra gợi ý cải thiện
        </p>
      </div>

      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Cá nhân
          </TabsTrigger>
          <TabsTrigger value="class" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Cả lớp
          </TabsTrigger>
        </TabsList>

        {/* Individual Analysis */}
        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Phân tích sinh viên
              </CardTitle>
              <CardDescription>
                Nhập MSSV để nhận gợi ý cải thiện điểm số từ AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="mssv-search">Mã số sinh viên</Label>
                  <div className="flex gap-2">
                    <Input
                      id="mssv-search"
                      placeholder="VD: SV001"
                      value={mssv}
                      onChange={(e) => {
                        setMssv(e.target.value)
                        setError('')
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchStudent()}
                    />
                    <Button onClick={handleSearchStudent} variant="secondary">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {selectedStudent && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{selectedStudent.fullName}</h4>
                    <span className={`font-medium ${getGpaStatus(selectedStudent.gpa).color}`}>
                      {getGpaStatus(selectedStudent.gpa).label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">MSSV</p>
                      <p className="font-mono font-medium">{selectedStudent.mssv}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">GPA</p>
                      <p className="font-medium">{selectedStudent.gpa.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ngành</p>
                      <p className="font-medium">{selectedStudent.major}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Năm sinh</p>
                      <p className="font-medium">{selectedStudent.birthYear}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleAnalyzeIndividual} 
                    disabled={isLoadingIndividual}
                    className="w-full mt-2"
                  >
                    {isLoadingIndividual ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Phân tích với AI
                      </>
                    )}
                  </Button>
                </div>
              )}

              {individualResult && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Kết quả phân tích
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                        {individualResult}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Class Analysis */}
        <TabsContent value="class" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Phân tích toàn lớp
              </CardTitle>
              <CardDescription>
                Phân tích tổng thể và đưa ra đề xuất cải thiện cho cả lớp ({students.length} sinh viên)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleAnalyzeClass} 
                disabled={isLoadingClass || students.length === 0}
                size="lg"
                className="w-full"
              >
                {isLoadingClass ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang phân tích cả lớp...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Phân tích toàn bộ lớp học
                  </>
                )}
              </Button>

              {classResult && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Báo cáo phân tích lớp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                        {classResult}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
