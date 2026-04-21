package com.studentapp.repository;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.studentapp.model.Student;

import java.io.*;
import java.lang.reflect.Type;
import java.util.List;

/**
 * JsonFileRepository: Lưu và đọc danh sách sinh viên từ file JSON
 * Kế thừa toàn bộ logic từ StudentRepository, chỉ thêm 2 chức năng:
 * - loadFromFile(): đọc data từ file khi khởi động
 * - saveToFile(): ghi data xuống file khi thoát
 */
public class JsonFileRepository extends StudentRepository {

    private static final String FILE_PATH = "students.json";
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    // ================== ĐỌC FILE ==================

    /**
     * Gọi hàm này khi khởi động app
     * Nếu file chưa tồn tại thì bỏ qua (lần đầu chạy)
     */
    public void loadFromFile() {
        File file = new File(FILE_PATH);

        // Lần đầu chạy chưa có file → bỏ qua
        if (!file.exists()) {
            System.out.println("📂 Chưa có file dữ liệu, bắt đầu danh sách trống.");
            return;
        }

        try (Reader reader = new FileReader(file)) {
            Type listType = new TypeToken<List<Student>>() {}.getType();
            List<Student> loaded = gson.fromJson(reader, listType);

            if (loaded != null) {
                for (Student s : loaded) {
                    add(s);
                }
                System.out.println("✅ Đã tải " + loaded.size() + " sinh viên từ file.");
            }
        } catch (IOException e) {
            System.out.println("❌ Lỗi đọc file: " + e.getMessage());
        }
    }

    // ================== GHI FILE ==================

    /**
     * Gọi hàm này khi thoát app
     * Ghi toàn bộ danh sách hiện tại xuống students.json
     */
    public void saveToFile() {
        try (Writer writer = new FileWriter(FILE_PATH)) {
            gson.toJson(findAll(), writer);
            System.out.println("💾 Đã lưu " + count() + " sinh viên vào file.");
        } catch (IOException e) {
            System.out.println("❌ Lỗi ghi file: " + e.getMessage());
        }
    }
}