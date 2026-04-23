import { streamText } from 'ai'

export async function POST(req: Request) {
  const { student, allStudents, type } = await req.json()

  let prompt = ''

  if (type === 'individual' && student) {
    prompt = `Bạn là một cố vấn học tập AI chuyên nghiệp. Hãy phân tích và đưa ra gợi ý cải thiện điểm số cho sinh viên sau:

Thông tin sinh viên:
- MSSV: ${student.mssv}
- Họ tên: ${student.fullName}
- GPA hiện tại: ${student.gpa}/4.0
- Ngành học: ${student.major}
- Năm sinh: ${student.birthYear}

Hãy đưa ra:
1. Đánh giá tổng quan về kết quả học tập hiện tại
2. 3-5 gợi ý cụ thể để cải thiện GPA dựa trên ngành học
3. Các phương pháp học tập hiệu quả phù hợp
4. Lời khuyên về kế hoạch học tập

Trả lời bằng tiếng Việt, thân thiện và khích lệ.`
  } else if (type === 'class' && allStudents) {
    const avgGpa = allStudents.reduce((sum: number, s: { gpa: number }) => sum + s.gpa, 0) / allStudents.length
    const topStudent = allStudents.reduce((top: { gpa: number; fullName: string }, s: { gpa: number; fullName: string }) => 
      s.gpa > top.gpa ? s : top, allStudents[0])
    const lowGpaCount = allStudents.filter((s: { gpa: number }) => s.gpa < 2.5).length
    
    const majorStats: Record<string, { count: number; totalGpa: number }> = {}
    allStudents.forEach((s: { major: string; gpa: number }) => {
      if (!majorStats[s.major]) majorStats[s.major] = { count: 0, totalGpa: 0 }
      majorStats[s.major].count++
      majorStats[s.major].totalGpa += s.gpa
    })

    prompt = `Bạn là một cố vấn học tập AI chuyên nghiệp. Hãy phân tích tổng thể lớp học với các thông tin sau:

Thống kê lớp:
- Tổng số sinh viên: ${allStudents.length}
- GPA trung bình: ${avgGpa.toFixed(2)}/4.0
- Sinh viên xuất sắc nhất: ${topStudent.fullName} (GPA: ${topStudent.gpa})
- Số sinh viên cần cải thiện (GPA < 2.5): ${lowGpaCount}

Phân bố theo ngành:
${Object.entries(majorStats).map(([major, data]) => 
  `- ${major}: ${data.count} SV, GPA TB: ${(data.totalGpa / data.count).toFixed(2)}`
).join('\n')}

Danh sách sinh viên:
${allStudents.map((s: { fullName: string; gpa: number; major: string }) => 
  `- ${s.fullName}: GPA ${s.gpa} (${s.major})`
).join('\n')}

Hãy đưa ra:
1. Đánh giá tổng quan về kết quả học tập của lớp
2. Nhận xét về điểm mạnh và điểm yếu
3. So sánh giữa các ngành học
4. 5-7 đề xuất cải thiện cụ thể cho cả lớp
5. Các hoạt động nhóm có thể giúp sinh viên yếu tiến bộ

Trả lời bằng tiếng Việt, chuyên nghiệp và có tính xây dựng.`
  } else {
    return new Response('Invalid request', { status: 400 })
  }

  const result = streamText({
    model: 'google/gemini-2.0-flash',
    prompt,
  })

  return result.toTextStreamResponse()
}
