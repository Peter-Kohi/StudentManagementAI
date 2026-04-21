package com.studentapp.model;

/**
 * Class Student dùng để mô tả một sinh viên
 * Implements Comparable để hỗ trợ sắp xếp theo GPA mặc định
 */
public class Student implements Comparable<Student> {  // THÊM implements Comparable<Student>

    private String id;
    private String fullName;
    private double gpa;
    private String major;
    private int birthyear;

    public Student(String id, String fullName, double gpa, String major, int birthyear) {
        this.id = id;
        this.major = major;
        this.birthyear = birthyear;
        setFullName(fullName);
        setGpa(gpa);
    }

    // ================== GETTERS ==================
    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public double getGpa() { return gpa; }
    public String getMajor() { return major; }
    public int getBirthyear() { return birthyear; }

    // ================== SETTERS ==================
    public void setGpa(double gpa) {
        if (gpa < 0.0 || gpa > 4.0) {
            throw new IllegalArgumentException("GPA phải nằm trong khoảng 0.0 - 4.0");
        }
        this.gpa = gpa;
    }

    public void setFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Họ tên không được để trống");
        }
        this.fullName = fullName;
    }

    public void setMajor(String major) { this.major = major; }
    public void setBirthyear(int birthyear) { this.birthyear = birthyear; }

    // ================== COMPARABLE ==================
    /**
     * Sắp xếp mặc định: GPA cao → thấp (descending)
     * Double.compare(other.gpa, this.gpa) = descending
     * Double.compare(this.gpa, other.gpa) = ascending
     */
    @Override
    public int compareTo(Student other) {
        return Double.compare(other.gpa, this.gpa); // cao → thấp
    }

    // ================== toString ==================
    @Override
    public String toString() {
        return String.format(
            "MSSV: %-10s | Họ tên: %-20s | GPA: %.2f | Ngành: %-15s | Năm sinh: %d",
            id, fullName, gpa, major, birthyear
        );
    }
}