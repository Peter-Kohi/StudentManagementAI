package com.studentapp.ai;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.studentapp.model.Student;
import okhttp3.*;

import java.io.IOException;
import java.util.List;

/**
 * GeminiService: Gọi Gemini API để phân tích và gợi ý cải thiện điểm số
 * Dùng OkHttp để gọi REST API trực tiếp — không cần SDK nặng
 */
public class GeminiService {

        private static final String API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private final String apiKey;
    private final OkHttpClient client = new OkHttpClient.Builder()
    .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
    .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
    .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
    .build();

    public GeminiService() {
        // Đọc API key từ biến môi trường — không hardcode
        this.apiKey = System.getenv("GEMINI_API_KEY");
        if (this.apiKey == null || this.apiKey.isEmpty()) {
            throw new IllegalStateException(
                "❌ Chưa set GEMINI_API_KEY! Chạy: export GEMINI_API_KEY=\"your_key\""
            );
        }
    }

    /**
     * Gợi ý cải thiện điểm số cho một sinh viên cụ thể
     * @param student Sinh viên cần phân tích
     * @return Chuỗi gợi ý từ Gemini
     */
    public String suggestImprovement(Student student) {
        String prompt = buildPrompt(student);
        return callGemini(prompt);
    }

    /**
     * Phân tích toàn bộ lớp và đưa ra nhận xét tổng quan
     * @param students Danh sách toàn bộ sinh viên
     * @param averageGpa GPA trung bình của lớp
     * @return Nhận xét tổng quan từ Gemini
     */
    public String analyzeClass(List<Student> students, double averageGpa) {
        String prompt = buildClassPrompt(students, averageGpa);
        return callGemini(prompt);
    }

    // ================== PROMPT BUILDER ==================

    private String buildPrompt(Student student) {
        return String.format("""
            Bạn là một cố vấn học tập tại trường đại học Việt Nam.
            Hãy phân tích kết quả học tập và đưa ra gợi ý cải thiện cụ thể cho sinh viên sau:
            
            - Họ tên: %s
            - Ngành học: %s
            - GPA hiện tại: %.2f / 4.0
            - Năm sinh: %d
            
            Hãy:
            1. Nhận xét ngắn gọn về tình hình học tập hiện tại
            2. Đưa ra 3 gợi ý cụ thể để cải thiện GPA
            3. Động viên sinh viên bằng 1 câu ngắn
            
            Trả lời bằng tiếng Việt, ngắn gọn và thực tế.
            """,
            student.getFullName(),
            student.getMajor(),
            student.getGpa(),
            student.getBirthyear()
        );
    }

    private String buildClassPrompt(List<Student> students, double averageGpa) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("""
            Bạn là cố vấn học tập. Hãy phân tích tổng quan lớp học sau:
            GPA trung bình lớp: %.2f / 4.0
            Danh sách sinh viên:
            """, averageGpa));

        for (Student s : students) {
            sb.append(String.format("- %s (GPA: %.2f, Ngành: %s)%n",
                s.getFullName(), s.getGpa(), s.getMajor()));
        }

        sb.append("""
            Hãy:
            1. Nhận xét tổng quan về chất lượng học tập của lớp
            2. Chỉ ra nhóm sinh viên cần hỗ trợ đặc biệt (GPA < 2.0)
            3. Đề xuất 2 giải pháp nâng cao chất lượng chung
            Trả lời bằng tiếng Việt, súc tích.
            """);

        return sb.toString();
    }

    // ================== API CALL ==================

    private String callGemini(String prompt) {
        // Xây dựng JSON body theo format của Gemini API
        JsonObject textPart = new JsonObject();
        textPart.addProperty("text", prompt);

        JsonArray parts = new JsonArray();
        parts.add(textPart);

        JsonObject content = new JsonObject();
        content.add("parts", parts);

        JsonArray contents = new JsonArray();
        contents.add(content);

        JsonObject body = new JsonObject();
        body.add("contents", contents);

        // Gọi API
        RequestBody requestBody = RequestBody.create(
            body.toString(),
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(API_URL + "?key=" + apiKey)
            .post(requestBody)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return "❌ Lỗi API: " + response.code() + " - " + response.message();
            }

            String responseBody = response.body().string();
            return parseResponse(responseBody);

        } catch (IOException e) {
            return "❌ Lỗi kết nối: " + e.getMessage();
        }
    }

    private String parseResponse(String json) {
        try {
            JsonObject root = JsonParser.parseString(json).getAsJsonObject();
            return root
                .getAsJsonArray("candidates")
                .get(0).getAsJsonObject()
                .getAsJsonObject("content")
                .getAsJsonArray("parts")
                .get(0).getAsJsonObject()
                .get("text").getAsString();
        } catch (Exception e) {
            return "❌ Lỗi parse response: " + e.getMessage();
        }
    }
}