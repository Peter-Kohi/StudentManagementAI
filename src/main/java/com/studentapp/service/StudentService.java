package com.studentapp.service;

import com.studentapp.model.Student;
import com.studentapp.repository.JsonFileRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * StudentService: Chứa toàn bộ business logic
 * - Giao tiếp với Repository để lấy/lưu data
 * - Xử lý sắp xếp, lọc, thống kê
 * - Main.java chỉ cần gọi Service, không cần biết bên trong làm gì
 */
public class StudentService {

    // Service giữ một instance của Repository
    private final JsonFileRepository repo;

    public StudentService(JsonFileRepository repo) {
        this.repo = repo;
    }

    // ================== CRUD (Ủy quyền cho Repository) ==================

    public void add(Student student) {
        repo.add(student);
    }

    public List<Student> findAll() {
        return repo.findAll();
    }

    public Student findById(String id) {
        return repo.findById(id);
    }

    public List<Student> findByName(String keyword) {
        return repo.findByName(keyword);
    }

    public boolean deleteById(String id) {
        return repo.deleteById(id);
    }

    public boolean existsById(String id) {
        return repo.existsById(id);
    }

    public int count() {
        return repo.count();
    }

    // ================== SORTING (Logic mới ở Giai đoạn 3) ==================

    /**
     * Sắp xếp theo GPA cao → thấp (dùng Comparable đã định nghĩa trong Student)
     */
    public List<Student> sortByGpaDesc() {
        List<Student> sorted = new ArrayList<>(repo.findAll());
        Collections.sort(sorted); // Gọi compareTo() trong Student
        return sorted;
    }

    /**
     * Sắp xếp theo GPA thấp → cao (dùng Comparator — ngược lại Comparable)
     */
    public List<Student> sortByGpaAsc() {
        List<Student> sorted = new ArrayList<>(repo.findAll());
        sorted.sort(Comparator.comparingDouble(Student::getGpa));
        return sorted;
    }

    /**
     * Sắp xếp theo tên A → Z (dùng Comparator với String)
     */
    public List<Student> sortByName() {
        List<Student> sorted = new ArrayList<>(repo.findAll());
        sorted.sort(Comparator.comparing(Student::getFullName));
        return sorted;
    }

    // ================== STATISTICS (Thống kê) ==================

    /**
     * Tính GPA trung bình của cả lớp
     */
    public double getAverageGpa() {
        List<Student> list = repo.findAll();
        if (list.isEmpty()) return 0.0;
        double total = 0;
        for (Student s : list) {
            total += s.getGpa();
        }
        return total / list.size();
    }

    /**
     * Tìm sinh viên có GPA cao nhất
     */
    public Student getTopStudent() {
        List<Student> list = repo.findAll();
        if (list.isEmpty()) return null;
        return Collections.min(list); // min vì compareTo sắp xếp cao→thấp
    }
}