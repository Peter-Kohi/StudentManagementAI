package com.studentapp;

import com.studentapp.ai.GeminiService;
import com.studentapp.model.Student;
import com.studentapp.repository.JsonFileRepository;
import com.studentapp.service.StudentService;

import java.util.List;
import java.util.Scanner;

public class Main {

    private static JsonFileRepository repo = new JsonFileRepository();
    private static StudentService service = new StudentService(repo); // THÊM Service
    private static GeminiService gemini = new GeminiService();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("=== HỆ THỐNG QUẢN LÝ SINH VIÊN ===");
        repo.loadFromFile();

        boolean running = true;
        while (running) {
            printMenu();
            int choice = getIntInput("Nhập lựa chọn: ");

            switch (choice) {
                case 1 -> showAllStudents();
                case 2 -> addStudent();
                case 3 -> findById();
                case 4 -> findByName();
                case 5 -> deleteStudent();
                case 6 -> showSorted();       // MỚI
                case 7 -> showStatistics();   // MỚI
                case 8 -> suggestImprovement();   // THÊM
                case 9 -> analyzeClass();         // THÊM
                case 0 -> {
                    repo.saveToFile();
                    System.out.println("Tạm biệt!");
                    running = false;
                }
                default -> System.out.println("⚠️  Lựa chọn không hợp lệ!");
            }
        }
        scanner.close();
    }

    // ================== MENU ==================
    private static void printMenu() {
        System.out.println("\n--- MENU ---");
        System.out.println("1. Xem danh sách sinh viên");
        System.out.println("2. Thêm sinh viên mới");
        System.out.println("3. Tìm theo MSSV");
        System.out.println("4. Tìm theo tên");
        System.out.println("5. Xóa sinh viên");
        System.out.println("6. Sắp xếp danh sách");
        System.out.println("7. Thống kê");
        System.out.println("8. 🤖 AI gợi ý cải thiện điểm");  // THÊM
        System.out.println("9. 🤖 AI phân tích cả lớp");       // THÊM
        System.out.println("0. Thoát");
        System.out.println("------------");
    }

    // ================== CHỨC NĂNG CŨ ==================
    private static void showAllStudents() {
        List<Student> list = service.findAll();
        if (list.isEmpty()) {
            System.out.println("Danh sách trống!");
            return;
        }
        System.out.println("\n=== DANH SÁCH (" + service.count() + " sinh viên) ===");
        for (int i = 0; i < list.size(); i++) {
            System.out.println((i + 1) + ". " + list.get(i));
        }
    }

    private static void addStudent() {
        System.out.println("\n--- THÊM SINH VIÊN ---");
        System.out.print("MSSV: ");
        String id = scanner.nextLine().trim();

        if (service.existsById(id)) {
            System.out.println("❌ MSSV đã tồn tại!");
            return;
        }

        System.out.print("Họ tên: ");
        String name = scanner.nextLine().trim();
        double gpa = getDoubleInput("GPA (0.0 - 4.0): ");
        System.out.print("Ngành học: ");
        String major = scanner.nextLine().trim();
        int birthYear = getIntInput("Năm sinh: ");

        try {
            service.add(new Student(id, name, gpa, major, birthYear));
            System.out.println("✅ Thêm thành công!");
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Lỗi: " + e.getMessage());
        }
    }

    private static void findById() {
        System.out.print("Nhập MSSV: ");
        String id = scanner.nextLine().trim();
        Student s = service.findById(id);
        if (s != null) {
            System.out.println("✅ " + s);
        } else {
            System.out.println("❌ Không tìm thấy MSSV: " + id);
        }
    }

    private static void findByName() {
        System.out.print("Nhập tên cần tìm: ");
        String keyword = scanner.nextLine().trim();
        List<Student> result = service.findByName(keyword);
        if (result.isEmpty()) {
            System.out.println("❌ Không tìm thấy sinh viên nào!");
        } else {
            System.out.println("✅ Tìm thấy " + result.size() + " sinh viên:");
            result.forEach(s -> System.out.println("  " + s));
        }
    }

    private static void deleteStudent() {
        System.out.print("Nhập MSSV cần xóa: ");
        String id = scanner.nextLine().trim();
        if (service.deleteById(id)) {
            System.out.println("✅ Đã xóa sinh viên " + id);
        } else {
            System.out.println("❌ Không tìm thấy MSSV: " + id);
        }
    }

    // ================== CHỨC NĂNG MỚI ==================

    /** Sắp xếp danh sách theo tiêu chí người dùng chọn */
    private static void showSorted() {
        System.out.println("\n--- SẮP XẾP THEO ---");
        System.out.println("1. GPA cao → thấp");
        System.out.println("2. GPA thấp → cao");
        System.out.println("3. Tên A → Z");
        int choice = getIntInput("Chọn: ");

        List<Student> sorted = switch (choice) {
            case 1 -> service.sortByGpaDesc();
            case 2 -> service.sortByGpaAsc();
            case 3 -> service.sortByName();
            default -> {
                System.out.println("⚠️  Lựa chọn không hợp lệ!");
                yield List.of();
            }
        };

        if (!sorted.isEmpty()) {
            System.out.println("\n=== KẾT QUẢ ===");
            for (int i = 0; i < sorted.size(); i++) {
                System.out.println((i + 1) + ". " + sorted.get(i));
            }
        }
    }

    /** Hiển thị thống kê tổng quan */
    private static void showStatistics() {
        System.out.println("\n=== THỐNG KÊ ===");
        System.out.println("Tổng số sinh viên : " + service.count());
        System.out.printf("GPA trung bình    : %.2f%n", service.getAverageGpa());

        Student top = service.getTopStudent();
        if (top != null) {
            System.out.println("Sinh viên xuất sắc: " + top.getFullName() + " (GPA: " + top.getGpa() + ")");
        }
    }

    // ================== HELPER ==================
    private static int getIntInput(String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                return Integer.parseInt(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("⚠️  Vui lòng nhập số nguyên!");
            }
        }
    }

    private static double getDoubleInput(String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                return Double.parseDouble(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("⚠️  Vui lòng nhập số thực (ví dụ: 3.5)!");
            }
        }
    }
    /** Gợi ý cải thiện điểm cho 1 sinh viên */
private static void suggestImprovement() {
    System.out.print("Nhập MSSV cần phân tích: ");
    String id = scanner.nextLine().trim();

    Student student = service.findById(id);
    if (student == null) {
        System.out.println("❌ Không tìm thấy MSSV: " + id);
        return;
    }

    System.out.println("⏳ Đang hỏi Gemini AI...");
    String result = gemini.suggestImprovement(student);
    System.out.println("\n=== GỢI Ý TỪ GEMINI AI ===");
    System.out.println(result);
}

/** Phân tích tổng quan cả lớp */
private static void analyzeClass() {
    if (service.count() == 0) {
        System.out.println("❌ Danh sách trống!");
        return;
    }

    System.out.println("⏳ Đang phân tích cả lớp...");
    String result = gemini.analyzeClass(service.findAll(), service.getAverageGpa());
    System.out.println("\n=== PHÂN TÍCH LỚP TỪ GEMINI AI ===");
    System.out.println(result);
}
}