# Huân's DevHub & Portfolio

**Personal Project Launcher & Engineering Portfolio** của **Phạm Ngọc Huân** (`@Winter101006`) — Sinh viên năm 3 ngành Khoa học Máy tính & Thông tin (K69), Trường ĐH Khoa học Tự nhiên - ĐHQGHN (VNU-HUS).

## Tính năng nổi bật

- **Bento Grid Tiểu sử & Tech Arsenal:** Phong cách Linear / Vercel hỗ trợ mượt mà Dark Mode & Light Mode.
- **Tự động quét & phân loại GitHub Repositories:** Đồng bộ trực tiếp từ `https://api.github.com/users/Winter101006/repos` kèm cơ chế cache & fallback snapshot local khi rate-limit.
- **Hồ sơ Case Study 3 tầng:** Mỗi dự án có sẵn *Tagline*, *Overview* cho người ngoài ngành, và *Technical Highlights* chuyên sâu cho dân IT.
- **Hybrid Project Management (`Ctrl + Shift + E` hoặc nút `Manage Hub`):**
  - **Tab 1:** Bật/tắt Ẩn/Hiện repo & Ghim dự án nổi bật ngay lập tức.
  - **Tab 2:** Thêm mới hoặc chỉnh sửa thông tin dự án (live URL, tech stack, mô tả 3 tầng).
  - **Tab 3:** Lưu tạm `localStorage` và xuất trực tiếp file `src/data/projectsConfig.json`.
- **Command Palette (`Ctrl + K`):** Tìm kiếm nhanh hỗ trợ tiếng Việt không dấu (`"tien"`, `"gpa"`, `"game"`, `"hanoi"`), bấm `Enter` để mở thẳng app trong 1 giây.
- **Server Health Ping & Wake Up All:** Theo dõi trạng thái Vercel Edge & đánh thức Render Cold Start chỉ với 1 chạm.
- **Portfolio Mode vs Launcher Mode:** Chuyển đổi giữa chế độ giới thiệu bản thân đầy đủ và trạm bookmark tốc độ cao kèm Cloud Consoles Dock.

## Chạy ở máy cá nhân (Local)

```bash
npm install
npm run dev
```

## Thêm / Ẩn dự án trong 30 giây

1. **Cách nhanh trực tiếp trên Web:** Nhấn `Ctrl + Shift + E` (hoặc bấm `Manage Hub`), bật/tắt công tắc hoặc thêm dự án mới, sau đó vào **Tab 3 → Download `projectsConfig.json`** và chép đè vào `src/data/projectsConfig.json`.
2. **Cách sửa code trực tiếp:** Mở [`src/data/projectsConfig.json`](src/data/projectsConfig.json):
   - Thêm tên repo vào `hiddenRepoNames` để ẩn repo GitHub.
   - Thêm object vào `customProjects` để thêm dự án không nằm trên GitHub (Colab, Streamlit, nghiên cứu...).

## Triển khai lên GitHub & Vercel

```bash
git init
git add .
git commit -m "feat: build Huan's DevHub & Portfolio"
git branch -M main
git remote add origin https://github.com/Winter101006/DevHub-Portfolio.git
git push -u origin main
```

Sau đó vào [Vercel Dashboard](https://vercel.com/new), chọn repo `DevHub-Portfolio` và bấm **Deploy** (Framework Preset: `Vite`, Output Directory: `dist`).
