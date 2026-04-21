package com.studentapp.repository;

import com.studentapp.model.Student;
import java.util.ArrayList;
import java.util.List;

/**
 * Repository: Chịu trách nhiệm lưu trữ và truy xuất dữ liệu Student
 * Hiện tại lưu trong RAM (ArrayList), sau này có thể đổi sang file/database
 */
public class StudentRepository {

    // Danh sách sinh viên — private để bên ngoài không đụng thẳng vào
    private final List<Student> students = new ArrayList<>();

    // ================== CREATE ==================

    /** Thêm sinh viên mới vào danh sách */
    public void add(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student không được null");
        }
        students.add(student);
    }

    // ================== READ ==================

    /** Lấy toàn bộ danh sách (trả về bản copy để tránh bị sửa từ ngoài) */
    public List<Student> findAll() {
        return new ArrayList<>(students);
    }

    /** Tìm theo MSSV — trả về null nếu không tìm thấy */
    public Student findById(String id) {
        for (Student s : students) {
            if (s.getId().equals(id)) {
                return s;
            }
        }
        return null;
    }

    /** Tìm theo tên (không phân biệt hoa thường) */
    public List<Student> findByName(String keyword) {
        List<Student> result = new ArrayList<>();
        for (Student s : students) {
            if (s.getFullName().toLowerCase().contains(keyword.toLowerCase())) {
                result.add(s);
            }
        }
        return result;
    }

    // ================== DELETE ==================

    /** Xóa sinh viên theo MSSV — trả về true nếu xóa thành công */
    public boolean deleteById(String id) {
        return students.removeIf(s -> s.getId().equals(id));
    }

    // ================== UTILITY ==================

    /** Đếm số lượng sinh viên */
    public int count() {
        return students.size();
    }

    /** Kiểm tra MSSV đã tồn tại chưa (tránh trùng) */
    public boolean existsById(String id) {
        return findById(id) != null;
    }
}