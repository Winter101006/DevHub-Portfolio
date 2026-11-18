import type { CategoryId, DevHubProject, Language, ProjectMetric } from '../types/project';

interface ProjectTranslation {
  title: string;
  tagline: string;
  overview: string;
  technicalHighlights: string[];
  architectureSummary?: string;
  metrics?: ProjectMetric[];
}

export const PROJECT_EN_TRANSLATIONS: Record<string, ProjectTranslation> = {
  'SemEval-2027-Task3': {
    title: 'SemEval-2027 Task 3 Pipeline',
    tagline:
      'Diachronic Lexical Semantic Change Detection for Swedish corpora using BGE-M3 Embeddings and Graph Label Propagation.',
    overview:
      'Addresses diachronic lexical semantic shift across historical Swedish time periods. Extracts multi-layer contextual token representations, constructs semantic similarity graphs, and validates via strict Leave-One-Lemma-Out cross-validation (achieving 0.87+ F1-score on Task 1a).',
    technicalHighlights: [
      'Dense contextual representation extraction via BGE-M3 with Layer Fusion and ±1 neighboring context token window expansion.',
      'Cross-period semantic similarity graph construction paired with Graph Label Propagation to cluster and quantify sense distribution shift (0.87+ on Task 1a).',
      'Rigorous Leave-One-Lemma-Out (LOLO) cross-validation protocol preventing target lemma leakage during hyperparameter optimization.',
    ],
    architectureSummary:
      'Diachronic Swedish Corpora → BGE-M3 Layer Fusion Embeddings → Similarity Graph → Graph Label Propagation → Leave-One-Lemma-Out CV',
    metrics: [
      { label: 'Task 1a Score', value: '0.87+' },
      { label: 'Embeddings', value: 'BGE-M3' },
      { label: 'Algorithm', value: 'Label Propagation' },
      { label: 'Validation', value: 'LOLO Cross-Val' },
    ],
  },
  'GPA-Huan': {
    title: 'HUS CS GPA & Curriculum Roadmap',
    tagline:
      'Interactive prerequisite course graph and Hybrid RAG AI academic advisor for VNU-HUS Computer Science students.',
    overview:
      'Digitizes all 61 courses (129 credits under Decision 3568) of the Computer & Information Science program at VNU-HUS. Features degree progress tracking, 4.0/10.0 CPA simulation, D/D+ retake policy validation, and an AI Advisor.',
    technicalHighlights: [
      'Interactive directed graph for 61 courses built with @xyflow/react supporting both Mandatory Prerequisites and Knowledge Graph views.',
      'VNU-compliant 4.0 & 10.0 CPA simulator with semester grade forecasting and compatibility scoring across 6 engineering career tracks.',
      'FastAPI backend powered by Hybrid RAG (3072-dim Gemini Embeddings + BM25 lexical matching) indexed over 67 course syllabus chunks.',
    ],
    architectureSummary:
      'React 19 + TypeScript + @xyflow/react (Vercel) ↔ Python FastAPI + Hybrid RAG (Gemini 3072-dim Embeddings + BM25)',
    metrics: [
      { label: 'Curriculum', value: '61 Courses / 129 Cr' },
      { label: 'RAG Vectors', value: '3072-dim' },
      { label: 'Knowledge Base', value: '67 Chunks' },
      { label: 'Career Tracks', value: '6 Paths' },
    ],
  },
  'custom-hanoi-explorer': {
    title: 'Hanoi Explorer AI Chatbot',
    tagline:
      'Conversational RAG AI assistant recommending 1,360+ attractions, dining spots, and cultural landmarks in Hanoi.',
    overview:
      'Applies Retrieval-Augmented Generation (RAG) with ChromaDB vector search and multilingual sentence embeddings to deliver context-aware Hanoi travel recommendations and custom itineraries.',
    technicalHighlights: [
      'ChromaDB vector database indexing semantic embeddings for over 1,360 cultural, dining, and entertainment venues across Hanoi.',
      'Multilingual query encoding via paraphrase-multilingual-MiniLM-L12-v2 supporting accented/unaccented Vietnamese and English queries.',
      'Pre-filtering by district, budget, and opening hours prior to LLM synthesis to eliminate hallucinated locations.',
    ],
    architectureSummary:
      'User Query → MiniLM-L12-v2 Multilingual Encoder → ChromaDB Vector Search (1,360+ Places) + Metadata Filter → LLM Synthesis → Web UI',
    metrics: [
      { label: 'Vector DB', value: 'ChromaDB' },
      { label: 'Knowledge Base', value: '1,360+ Places' },
      { label: 'Embedding', value: 'MiniLM-L12-v2' },
      { label: 'Architecture', value: 'Hybrid RAG' },
    ],
  },
  'finance-tracker-backend_new': {
    title: 'Personal Finance Tracker',
    tagline:
      'Full-Stack personal finance and cashflow analytics platform built with Java 21 Spring Boot, Neon PostgreSQL, and Render.',
    overview:
      'Solves real-time income/expense tracking, budget categorization, and 12-month cashflow visualization. Containerized with Docker on Render backed by Neon PostgreSQL and Uptime Monitors for instant 24/7 response.',
    technicalHighlights: [
      'Clean layered MVC & RESTful architecture (Controller – Service – Repository – JPA Criteria Specifications) built on Java 21 and Spring Boot.',
      'Cloud persistence with Spring Data JPA + Neon Serverless PostgreSQL and strict Jakarta Bean Validation rules.',
      'Server-side rendered Thymeleaf + Chart.js 4 analytics, multi-stage Dockerfile deployed on Render with active Uptime Monitoring and JUnit 5 + MockMvc tests.',
    ],
    architectureSummary:
      'Thymeleaf + Chart.js UI ↔ Java 21 Spring Boot (JPA Criteria) ↔ Neon Cloud PostgreSQL · Docker on Render + Uptime Monitor',
    metrics: [
      { label: 'Backend', value: 'Java 21 / Spring' },
      { label: 'Database', value: 'Neon PostgreSQL' },
      { label: 'Availability', value: '24/7 Monitored' },
      { label: 'Testing', value: 'JUnit 5 + MockMvc' },
    ],
  },
  'finance-pro': {
    title: 'Finance Pro — AI Voice Personal Finance',
    tagline:
      'Mobile-first personal finance app with real-time Vietnamese voice input, live waveform, Gemini AI and cashflow charts.',
    overview:
      'Multi-account personal finance web app (Next.js + Supabase) that logs income/expenses by voice or natural text ("mom gave 75k", "pho 45k"), correctly separates money in vs. out, supports multiple wallets, Donut + 12-month cashflow charts, and Detailed / Simple interfaces tuned for phones.',
    technicalHighlights: [
      'Sub-millisecond local Vietnamese parser (k/nghìn/lít/củ/trăm rưỡi slang, "mẹ cho 75k" = income) combined with Gemini under a 2.5s timeout, LRU cache and circuit breaker; Optimistic UI updates instantly.',
      '60fps Web Audio API canvas waveform: flat when silent, amplitude proportional to voice loudness via RMS and an adaptive noise gate.',
      'PBKDF2-HMAC-SHA256 (100k iterations + salt), signed session tokens, XSS sanitization, per-account data isolation (Supabase RLS) and 115 automated test scenarios.',
    ],
    architectureSummary:
      'Next.js 14 (Mobile-First UI) ↔ Gemini AI + Vietnamese NLP Parser ↔ Supabase Auth/PostgreSQL (RLS) with local fallback',
    metrics: [
      { label: 'Voice', value: 'Waveform 60fps' },
      { label: 'Security', value: 'PBKDF2-SHA256' },
      { label: 'AI Engine', value: 'Gemini + NLP' },
      { label: 'Test Cases', value: '115 PASS' },
    ],
  },
  'custom-nutrition-ai': {
    title: 'Student Nutrition & Calorie AI Tracker',
    tagline:
      'Smart nutrition tracker computing biometric indices (BMI, BMR, TDEE, Macros) and parsing Vietnamese meals via LLM.',
    overview:
      'Streamlines daily energy and macro tracking for students using a standardized Vietnamese food database, enabling natural-language meal logging parsed automatically into calories and Protein–Carb–Fat ratios by LLM.',
    technicalHighlights: [
      'Medical-grade biometric calculation engine (BMI, Mifflin-St Jeor BMR, activity-adjusted TDEE) with dynamic macro split targets.',
      'Standardized nutritional database tailored for Vietnamese dishes (Pho, Bun Cha, Com Tam...) mapped to practical serving units.',
      'LLM Structured Output pipeline converting free-text meal descriptions into structured nutritional JSON and daily caloric balance alerts.',
    ],
    architectureSummary:
      'Web Tracker UI → Biometric Engine (BMI/BMR/TDEE) + Vietnamese Food DB → LLM Structured Meal Parser → Macro Analytics Dashboard',
    metrics: [
      { label: 'Biometrics', value: 'BMI/BMR/TDEE' },
      { label: 'Database', value: 'VN Food DB' },
      { label: 'AI Engine', value: 'LLM Parser' },
      { label: 'Analytics', value: 'Macro Ratios' },
    ],
  },
  Game_Micute: {
    title: 'KawaiiCraft V2.0 — 3D Co-op World',
    tagline:
      '4-season multi-biome 3D Voxel web game with real-time 2-player Co-op, engineered for smooth 60 FPS on low-end laptops.',
    overview:
      'Browser-native 3D sandbox featuring a 4-season continent and interactive couple mini-games. Supports 1-click real-time 2-player multiplayer via Firebase Realtime Database and custom HTML5 Canvas/WebGL optimizations.',
    technicalHighlights: [
      'WebGL/Three.js optimization using procedural HTML5 Canvas textures (36 voxel materials generated in RAM), InstancedMesh, and hidden-face culling for locked 60 FPS.',
      'Real-time 2-player Co-op synchronization over Firebase Realtime Database (15Hz network tickrate paired with 60 FPS client-side Lerp interpolation).',
      '11 interactive mini-games (Hide & Seek, Heart Maze, Swing, Ferris Wheel, 100 HP Arena), Delta Compression world saves, and Web Audio API synth music.',
    ],
    architectureSummary:
      'Three.js + HTML5 Canvas Procedural Engine ↔ Firebase Realtime Database (15Hz Sync + 60FPS Lerp) ↔ Vercel Edge',
    metrics: [
      { label: 'Performance', value: '60 FPS' },
      { label: 'World Scale', value: '3 × 320×320' },
      { label: 'Minigames', value: '11 Modes' },
      { label: 'Netcode', value: 'Firebase RTDB' },
    ],
  },
  'student-productivity-ml': {
    title: 'Student Productivity & Spending ML Pipelines',
    tagline:
      'End-to-End Machine Learning pipelines analyzing student consumption and digital distraction with an interactive Streamlit dashboard.',
    overview:
      'Executes zero-leakage preprocessing, dimensionality reduction (PCA/SVD), unsupervised clustering (K-Means, GMM, DBSCAN), and a 7-classifier benchmark with Ridge regression transformation, deployed on Streamlit.',
    technicalHighlights: [
      'Industrial zero-leakage preprocessing pipeline (Median/Mode imputation, IQR outlier capping, 35-dimensional encoding, and Z-Score standardization).',
      'Dimensionality reduction comparing PCA (90% variance in 23 components) vs TruncatedSVD and clustering across K-Means, GMM (BIC/AIC), and DBSCAN.',
      '7-classifier experimental matrix (SVM, MLP, LogReg, Decision Tree...) with overfitting regularization (ROC-AUC > 0.93) and exact Ridge regression recovery.',
    ],
    architectureSummary:
      'Raw Behavioral Datasets → Zero-Leakage Preprocessing → PCA/SVD + K-Means/GMM → 7-Classifier Benchmark & Ridge Regression → Streamlit App',
    metrics: [
      { label: 'Dataset', value: '3.5K – 20K rows' },
      { label: 'Benchmark', value: '7 Classifiers' },
      { label: 'ROC-AUC', value: '> 0.93' },
      { label: 'Dashboard', value: 'Streamlit' },
    ],
  },
};

export function localizeProject(project: DevHubProject, lang: Language): DevHubProject {
  if (lang === 'vi') return project;
  const en = PROJECT_EN_TRANSLATIONS[project.id] || (project.repoName ? PROJECT_EN_TRANSLATIONS[project.repoName] : undefined);
  if (!en) {
    return {
      ...project,
      tagline: project.tagline,
      overview: project.overview,
    };
  }
  return {
    ...project,
    title: en.title,
    tagline: en.tagline,
    overview: en.overview,
    technicalHighlights: en.technicalHighlights,
    architectureSummary: en.architectureSummary ?? project.architectureSummary,
    metrics: en.metrics ?? project.metrics,
  };
}

export function getCategoryLabel(category: CategoryId, lang: Language): string {
  if (lang === 'en') {
    switch (category) {
      case 'ai-ds':
        return 'AI & NLP Research';
      case 'study-life':
        return 'Full-Stack Web';
      case 'game-creative':
        return 'Interactive & 3D';
      default:
        return 'Systems & Utils';
    }
  }
  switch (category) {
    case 'ai-ds':
      return 'AI & NLP Research';
    case 'study-life':
      return 'Full-Stack Web';
    case 'game-creative':
      return 'Interactive & 3D';
    default:
      return 'Thư viện & Khác';
  }
}

export const UI_DICT = {
  vi: {
    nav: {
      badge: 'CS @ VNU-HUS',
      projects: 'Dự án',
      research: 'Nghiên cứu',
      skills: 'Kỹ năng',
      contact: 'Liên hệ',
      portfolioMode: 'Portfolio',
      launcherMode: 'Dev Launcher',
      searchTitle: 'Tìm kiếm nhanh (Ctrl + K)',
      themeToggle: 'Chuyển giao diện Sáng / Tối',
    },
    hero: {
      statusBadge: 'Sẵn sàng cho vị trí Thực tập AI/ML & Full-Stack (2026–2027)',
      roleSubtitle: 'CS Undergraduate (K69) @ VNU University of Science (ĐH KHTN – ĐHQGHN)',
      location: 'Hà Nội, Việt Nam',
      positioning:
        'Tập trung xây dựng hệ thống phần mềm end-to-end: từ nghiên cứu mô hình Học máy & Xử lý ngôn ngữ tự nhiên (SemEval-2027, RAG Pipelines) đến thiết kế và vận hành kiến trúc Full-Stack & Cloud Production (Java Spring Boot, FastAPI, React, PostgreSQL).',
      ctaPrimary: 'Xem Dự án tiêu biểu',
      ctaResume: 'Tải CV (PDF)',
      ctaGithub: 'GitHub',
      ctaCopyEmail: 'Sao chép Email',
      copiedEmail: 'Đã sao chép',
      highlights: [
        {
          index: '01 / NCKH NLP',
          title: 'SemEval-2027 Task 3',
          desc: 'Đạt 0.87+ F1-score (Task 1a) với BGE-M3 & Graph Label Propagation.',
        },
        {
          index: '02 / FULL-STACK & AI',
          title: '6+ Ứng dụng thực tế',
          desc: 'Vận hành ổn định trên Vercel, Render & Neon PostgreSQL.',
        },
        {
          index: '03 / HỌC THUẬT & CỘNG ĐỒNG',
          title: 'VNU-HUS K69 & CLB Toán Tin (HAMIC)',
          desc: 'Chuyên ngành Khoa học Máy tính & Thông tin (QĐ 3568).',
        },
      ],
    },
    projects: {
      eyebrow: '01. DỰ ÁN TIÊU BIỂU',
      title: 'Các Hệ Thống & Nghiên Cứu Trọng Điểm',
      subtitle:
        'Tuyển tập các dự án tiêu biểu từ nghiên cứu NLP/ML đến ứng dụng Web Full-Stack và đồ họa 3D thời gian thực.',
      filters: {
        all: 'Tất cả',
        'ai-ds': 'AI & NLP Research',
        'study-life': 'Full-Stack Web',
        'game-creative': 'Interactive & 3D',
        others: 'Khác',
      },
      searchPlaceholder: 'Lọc theo tên dự án hoặc công nghệ...',
      liveDemo: 'Live Demo',
      sourceCode: 'Source Code',
      archDetails: 'Chi tiết kiến trúc',
      statusLive: 'Live',
      statusWaking: 'Đang đánh thức...',
      statusCold: 'Cold Start · Chạm để thức',
      statusResearch: 'Research / Repo',
      emptyTitle: 'Không tìm thấy dự án phù hợp',
      emptyDesc: 'Hãy thử chọn danh mục khác hoặc xóa từ khóa tìm kiếm.',
      resetBtn: 'Xem tất cả dự án',
    },
    research: {
      eyebrow: '02. NGHIÊN CỨU & HÀNH TRÌNH',
      title: 'Nghiên Cứu Khoa Học & Đào Tạo',
      items: [
        {
          period: '2026 – 2027',
          role: 'Nghiên cứu viên Sinh viên (NCKH NLP)',
          org: 'SemEval-2027 Task 3 · Trường ĐH Khoa học Tự nhiên (VNU-HUS)',
          summary:
            'Nghiên cứu bài toán Phát hiện biến đổi ngữ nghĩa từ vựng đa thời kỳ (Diachronic Lexical Semantic Change Detection) trên kho ngữ liệu lịch sử tiếng Thụy Điển.',
          bullets: [
            'Thiết kế pipeline trích xuất biểu diễn ngữ cảnh bằng mô hình đa ngữ BGE-M3 kết hợp kỹ thuật Layer Fusion.',
            'Áp dụng thuật toán Graph Label Propagation trên đồ thị tương đồng ngữ nghĩa và kiểm định chéo Leave-One-Lemma-Out (đạt 0.87+ F1-score ở Task 1a).',
            'Giảng viên & Cố vấn hướng dẫn: Cô Hà Mỹ Linh và anh Cao Hải An.',
          ],
        },
        {
          period: '2024 – Hiện tại',
          role: 'Thành viên Ban Học thuật & Dự án',
          org: 'Câu lạc bộ Toán Tin (HAMIC) · Khoa Toán - Cơ - Tin học, VNU-HUS',
          summary:
            'Tham gia sinh hoạt học thuật, trao đổi giải thuật, trí tuệ nhân tạo và phát triển các sản phẩm phần mềm phục vụ sinh viên trong khoa.',
          bullets: [
            'Xây dựng công cụ HUS CS GPA & Curriculum Roadmap hỗ trợ sinh viên K69 tra cứu cây môn học tiên quyết và mô phỏng CPA.',
            'Thực hành xây dựng các pipeline Học máy, RAG Chatbot và ứng dụng Web Full-Stack.',
          ],
        },
        {
          period: '2024 – 2028',
          role: 'Cử nhân Khoa học Máy tính & Thông tin (K69)',
          org: 'Trường Đại học Khoa học Tự nhiên – ĐHQGHN (VNU-HUS)',
          summary:
            'Chương trình đào tạo chuẩn QĐ 3568/QĐ-ĐHKHTN (129 tín chỉ), tập trung chuyên sâu vào Trí tuệ nhân tạo, Học máy và Kỹ nghệ phần mềm.',
          bullets: [
            'Các học phần cốt lõi: Cấu trúc dữ liệu & Giải thuật, Trí tuệ nhân tạo, Học máy, Mạng máy tính, Kiến trúc máy tính, Lập trình hướng đối tượng.',
          ],
        },
      ],
    },
    skills: {
      eyebrow: '03. NĂNG LỰC CÔNG NGHỆ',
      title: 'Tech Arsenal & Công Cụ Phát Triển',
      groups: [
        {
          title: 'Ngôn ngữ Lập trình',
          subtitle: 'Nền tảng thuật toán, xử lý dữ liệu và phát triển hệ thống',
          items: ['Python', 'Java 21', 'TypeScript / JavaScript', 'C / C++', 'SQL'],
        },
        {
          title: 'AI, Machine Learning & NLP',
          subtitle: 'Huấn luyện mô hình, nhúng vector ngữ nghĩa và hệ thống RAG',
          items: [
            'PyTorch',
            'scikit-learn',
            'BGE-M3 / Sentence-Transformers',
            'ChromaDB (Vector RAG)',
            'Gemini Embeddings',
            'Pandas & NumPy',
            'OpenCV',
          ],
        },
        {
          title: 'Full-Stack Web & Cloud Infrastructure',
          subtitle: 'Thiết kế REST API, giao diện tương tác và triển khai đám mây',
          items: [
            'Spring Boot 4',
            'FastAPI',
            'React 19 / Vite',
            'Tailwind CSS',
            'Three.js & HTML5 Canvas',
            'Streamlit',
            'PostgreSQL (Neon)',
            'Firebase RTDB',
            'Docker',
            'Vercel & Render',
          ],
        },
      ],
    },
    contact: {
      eyebrow: '04. LIÊN HỆ & KẾT NỐI',
      title: 'Sẵn Sàng Cho Các Cơ Hội Thực Tập & Hợp Tác Kỹ Thuật',
      desc: 'Tôi đang tìm kiếm cơ hội Thực tập sinh AI/ML Engineer hoặc Full-Stack Developer tại Hà Nội. Hãy liên hệ qua Email hoặc GitHub để trao đổi thêm.',
      primaryEmailLabel: 'Email cá nhân',
      academicEmailLabel: 'Email học thuật (VNU-HUS)',
      copyBtn: 'Sao chép',
      sendMailBtn: 'Gửi Email trực tiếp',
      openResumeBtn: 'Xem & Tải CV (PDF)',
    },
    footer: {
      rights: 'Thiết kế theo phong cách Minimalist Engineering.',
      manageTooltip: 'Quản trị Hub (Ctrl + Shift + E)',
    },
    drawer: {
      close: 'Đóng',
      taglineLabel: '01 · TÓM TẮT ĐỊNH VỊ',
      overviewLabel: '02 · BÀI TOÁN & GIẢI PHÁP THỰC TẾ',
      archLabel: '03 · LUỒNG KIẾN TRÚC HỆ THỐNG (DATA & SYSTEM PIPELINE)',
      highlightsLabel: '04 · ĐIỂM NHẤN KỸ THUẬT & THUẬT TOÁN',
      techLabel: '05 · CÔNG NGHỆ SỬ DỤNG',
      pingBtn: 'Kiểm tra kết nối',
      editBtn: 'Chỉnh sửa dự án',
      githubBtn: 'Mã nguồn GitHub',
      liveBtn: 'Mở Live Demo',
    },
    launcher: {
      eyebrow: 'PERSONAL COMMAND CENTER',
      title: 'Dev Launcher & Trạm Vận Hành Hệ Thống',
      desc: 'Bảng điều khiển cá nhân dùng để kiểm tra sức khỏe server (Vercel, Render, Neon DB), mở nhanh ứng dụng và cấu hình danh sách dự án.',
      wakeAllBtn: 'Ping & Đánh thức tất cả Server',
      wakingAllBtn: 'Đang kiểm tra toàn bộ Server...',
      syncGithubBtn: 'Đồng bộ GitHub API',
      manageHubBtn: 'Mở Quản Trị Dự Án (Manage Hub)',
      healthSectionTitle: 'Trạng thái Real-Time Services & Endpoints',
      openApp: 'Mở App',
      pingNow: 'Ping',
      consolesTitle: 'Cloud & Admin Consoles',
      reposTitle: 'Danh sách tất cả Dự án & GitHub Repositories',
    },
  },
  en: {
    nav: {
      badge: 'CS @ VNU-HUS',
      projects: 'Projects',
      research: 'Research',
      skills: 'Tech Stack',
      contact: 'Contact',
      portfolioMode: 'Portfolio',
      launcherMode: 'Dev Launcher',
      searchTitle: 'Quick Command Palette (Ctrl + K)',
      themeToggle: 'Toggle Light / Dark Theme',
    },
    hero: {
      statusBadge: 'Available for AI/ML & Full-Stack Engineering Internships (2026–2027)',
      roleSubtitle: 'CS Undergraduate (K69) @ VNU University of Science',
      location: 'Hanoi, Vietnam',
      positioning:
        'Building end-to-end software systems: from researching NLP & Machine Learning models (SemEval-2027, RAG Pipelines) to architecting and operating Full-Stack & Cloud Production applications (Java Spring Boot, FastAPI, React, PostgreSQL).',
      ctaPrimary: 'Explore Selected Works',
      ctaResume: 'Resume (PDF)',
      ctaGithub: 'GitHub',
      ctaCopyEmail: 'Copy Email',
      copiedEmail: 'Copied',
      highlights: [
        {
          index: '01 / NLP RESEARCH',
          title: 'SemEval-2027 Task 3',
          desc: 'Achieved 0.87+ F1-score (Task 1a) with BGE-M3 & Graph Label Propagation.',
        },
        {
          index: '02 / FULL-STACK & AI',
          title: '6+ Production Systems',
          desc: 'Deployed across Vercel, Render & Neon Serverless PostgreSQL.',
        },
        {
          index: '03 / ACADEMICS & COMMUNITY',
          title: 'VNU-HUS K69 & HAMIC Club',
          desc: 'B.Sc. in Computer & Information Science (Decision 3568).',
        },
      ],
    },
    projects: {
      eyebrow: '01. SELECTED WORKS',
      title: 'Featured Engineering & Research Projects',
      subtitle:
        'Curated case studies spanning NLP/ML research pipelines, full-stack cloud applications, and real-time 3D web experiences.',
      filters: {
        all: 'All',
        'ai-ds': 'AI & NLP Research',
        'study-life': 'Full-Stack Web',
        'game-creative': 'Interactive & 3D',
        others: 'Others',
      },
      searchPlaceholder: 'Filter by project name or technology...',
      liveDemo: 'Live Demo',
      sourceCode: 'Source Code',
      archDetails: 'Architecture Details',
      statusLive: 'Live',
      statusWaking: 'Waking...',
      statusCold: 'Cold Start · Click to Wake',
      statusResearch: 'Research / Repo',
      emptyTitle: 'No matching projects found',
      emptyDesc: 'Try selecting a different category filter or clearing your search query.',
      resetBtn: 'Show all projects',
    },
    research: {
      eyebrow: '02. RESEARCH & EXPERIENCE',
      title: 'Scientific Research & Academic Background',
      items: [
        {
          period: '2026 – 2027',
          role: 'Undergraduate NLP Researcher',
          org: 'SemEval-2027 Task 3 · VNU University of Science (VNU-HUS)',
          summary:
            'Investigating Diachronic Lexical Semantic Change Detection across historical Swedish corpora.',
          bullets: [
            'Engineered contextual token representation extraction using multilingual BGE-M3 embeddings with multi-layer fusion.',
            'Applied Graph Label Propagation over semantic similarity graphs with strict Leave-One-Lemma-Out cross-validation (reaching 0.87+ F1-score on Task 1a).',
            'Advised by Lecturer Ha My Linh and Mentor Cao Hai An.',
          ],
        },
        {
          period: '2024 – Present',
          role: 'Core Member — Academic & Software Division',
          org: 'HAMIC (Mathematics & Informatics Club) · VNU-HUS',
          summary:
            'Participating in algorithmic seminars, applied AI/ML study groups, and building practical software utilities for students.',
          bullets: [
            'Developed the HUS CS GPA & Curriculum Roadmap platform for K69 students to visualize course prerequisites and simulate CPA trajectories.',
            'Built end-to-end Machine Learning pipelines, RAG Chatbots, and cloud-hosted web applications.',
          ],
        },
        {
          period: '2024 – 2028',
          role: 'B.Sc. in Computer & Information Science (Cohort K69)',
          org: 'VNU University of Science (VNU-HUS), Hanoi',
          summary:
            '129-credit Honours Curriculum (Decision 3568) specializing in Artificial Intelligence, Machine Learning, and Software Engineering.',
          bullets: [
            'Core coursework: Data Structures & Algorithms, Artificial Intelligence, Machine Learning, Computer Networks, Computer Architecture, Object-Oriented Programming.',
          ],
        },
      ],
    },
    skills: {
      eyebrow: '03. TECH ARSENAL',
      title: 'Engineering Stack & Tools',
      groups: [
        {
          title: 'Programming Languages',
          subtitle: 'Core foundations for algorithms, data pipelines, and backend services',
          items: ['Python', 'Java 21', 'TypeScript / JavaScript', 'C / C++', 'SQL'],
        },
        {
          title: 'AI, Machine Learning & NLP',
          subtitle: 'Model training, dense semantic embeddings, and RAG architectures',
          items: [
            'PyTorch',
            'scikit-learn',
            'BGE-M3 / Sentence-Transformers',
            'ChromaDB (Vector RAG)',
            'Gemini Embeddings',
            'Pandas & NumPy',
            'OpenCV',
          ],
        },
        {
          title: 'Full-Stack Web & Cloud Infrastructure',
          subtitle: 'RESTful APIs, interactive frontends, and cloud deployments',
          items: [
            'Spring Boot 4',
            'FastAPI',
            'React 19 / Vite',
            'Tailwind CSS',
            'Three.js & HTML5 Canvas',
            'Streamlit',
            'PostgreSQL (Neon)',
            'Firebase RTDB',
            'Docker',
            'Vercel & Render',
          ],
        },
      ],
    },
    contact: {
      eyebrow: '04. CONTACT',
      title: 'Open for Internship & Engineering Opportunities',
      desc: 'I am actively seeking AI/ML Engineer and Full-Stack Software Engineering internship opportunities in Hanoi. Reach out directly via email or GitHub.',
      primaryEmailLabel: 'Personal Email',
      academicEmailLabel: 'University Email (VNU-HUS)',
      copyBtn: 'Copy',
      sendMailBtn: 'Send Direct Email',
      openResumeBtn: 'View & Download Resume (PDF)',
    },
    footer: {
      rights: 'Minimalist Engineering Portfolio.',
      manageTooltip: 'Manage Hub (Ctrl + Shift + E)',
    },
    drawer: {
      close: 'Close',
      taglineLabel: '01 · EXECUTIVE SUMMARY',
      overviewLabel: '02 · PROBLEM & REAL-WORLD SOLUTION',
      archLabel: '03 · SYSTEM ARCHITECTURE & DATA PIPELINE',
      highlightsLabel: '04 · TECHNICAL HIGHLIGHTS & ALGORITHMS',
      techLabel: '05 · TECHNOLOGY STACK',
      pingBtn: 'Ping Endpoint',
      editBtn: 'Edit Project',
      githubBtn: 'GitHub Source',
      liveBtn: 'Open Live Demo',
    },
    launcher: {
      eyebrow: 'PERSONAL COMMAND CENTER',
      title: 'Dev Launcher & Operations Console',
      desc: 'Private operational dashboard for real-time health checks (Vercel, Render, Neon DB), one-click app launching, and repository management.',
      wakeAllBtn: 'Ping & Wake All Servers',
      wakingAllBtn: 'Pinging all endpoints...',
      syncGithubBtn: 'Sync GitHub API',
      manageHubBtn: 'Open Project Manager (Manage Hub)',
      healthSectionTitle: 'Real-Time Service Health & Endpoints',
      openApp: 'Open App',
      pingNow: 'Ping',
      consolesTitle: 'Cloud & Admin Consoles',
      reposTitle: 'All Projects & GitHub Repositories',
    },
  },
} as const;
