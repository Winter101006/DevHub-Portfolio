export interface TechGroup {
  id: string;
  label: string;
  accent: string;
  items: string[];
}

export interface DevConsoleLink {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  icon: string;
  colorClass: string;
}

export const PROFILE_CONFIG = {
  fullName: 'Phạm Ngọc Huân',
  handle: '@Winter101006',
  avatarUrl: '/avatar-huan.jpg',
  birthDate: '10/10/2006',
  studentId: '24002015',
  role: 'AI/ML Researcher & Full-Stack Software Engineer',
  headline:
    'Sinh viên năm 3 ngành Khoa học Máy tính & Thông tin (K69) · Trường ĐH Khoa học Tự nhiên - ĐHQGHN',
  university: 'Trường ĐH Khoa học Tự nhiên - ĐHQGHN (VNU-HUS)',
  major: 'Khoa học Máy tính & Thông tin (K69 · QĐ 3568)',
  location: 'Mỹ Đình 1, Nam Từ Liêm, Hà Nội',
  shortLocation: 'Nam Từ Liêm, Hà Nội',
  bio: 'Tập trung thiết kế và triển khai các hệ thống phần mềm hoàn chỉnh từ kiến trúc Backend (Java Spring Boot, FastAPI, PostgreSQL), giao diện tương tác hiện đại (React, TypeScript, Three.js) cho tới mô hình Machine Learning & Xử lý Ngôn ngữ Tự nhiên (RAG, BGE-M3).',
  githubUsername: 'Winter101006',
  secondaryGithubUsername: '24002015-art',
  githubUrl: 'https://github.com/Winter101006',
  email: 'huananh20062012@gmail.com',
  academicEmail: '24002015@gmail.hus.edu.vn',
  availability: 'Sẵn sàng cho cơ hội Thực tập AI/ML & Full-Stack',
  currentFocus: [
    {
      badge: 'NCKH NLP',
      title: 'SemEval-2027 Task 3',
      description:
        'Nghiên cứu phát hiện biến đổi ngữ nghĩa từ vựng đa thời kỳ (Lexical Semantic Change Detection) dùng BGE-M3 & Graph Label Propagation (Task 1a đạt 0.87).',
      status: 'Research · 2026–2027',
    },
    {
      badge: 'Production Cloud',
      title: 'Full-Stack & RAG Systems',
      description:
        'Vận hành các dịch vụ thực tế trên Vercel, Render + Monitors và Neon PostgreSQL cùng trợ lý học tập RAG cho sinh viên VNU-HUS.',
      status: 'Always-On Stack',
    },
    {
      badge: 'Cộng đồng',
      title: 'CLB Toán Tin (HAMIC)',
      description:
        'Thành viên CLB Toán Tin Khoa Toán - Cơ - Tin học VNU-HUS: nghiên cứu thuật toán, học thuật AI/ML và phát triển sản phẩm ứng dụng.',
      status: 'VNU-HUS · K69',
    },
  ],
  techArsenal: [
    {
      id: 'languages',
      label: 'Languages',
      accent: 'text-sky-600 dark:text-sky-400',
      items: ['Python', 'Java 21', 'TypeScript / JS', 'C / C++', 'SQL'],
    },
    {
      id: 'ai-data',
      label: 'AI, ML & NLP',
      accent: 'text-violet-600 dark:text-violet-400',
      items: [
        'PyTorch',
        'scikit-learn',
        'Sentence-Transformers',
        'ChromaDB (RAG)',
        'Pandas / NumPy',
        'OpenCV',
      ],
    },
    {
      id: 'web-cloud',
      label: 'Web, Backend & Cloud',
      accent: 'text-emerald-600 dark:text-emerald-400',
      items: [
        'Spring Boot',
        'React / Vite',
        'FastAPI / Flask',
        'Streamlit',
        'PostgreSQL (Neon)',
        'Firebase',
        'Docker',
        'Vercel / Render',
      ],
    },
  ] satisfies TechGroup[],
  devConsoles: [
    {
      id: 'vercel',
      name: 'Vercel Dashboard',
      subtitle: 'Frontend & Edge Deploys',
      url: 'https://vercel.com/dashboard',
      icon: '▲',
      colorClass: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
    },
    {
      id: 'render',
      name: 'Render Dashboard',
      subtitle: 'Java / Docker Services',
      url: 'https://dashboard.render.com',
      icon: '⚡',
      colorClass: 'bg-emerald-600 text-white',
    },
    {
      id: 'neon',
      name: 'Neon Console',
      subtitle: 'Cloud PostgreSQL DB',
      url: 'https://console.neon.tech',
      icon: '🗄️',
      colorClass: 'bg-teal-600 text-white',
    },
    {
      id: 'firebase',
      name: 'Firebase Console',
      subtitle: 'Realtime DB (KawaiiCraft)',
      url: 'https://console.firebase.google.com',
      icon: '🔥',
      colorClass: 'bg-amber-500 text-white',
    },
    {
      id: 'github',
      name: 'GitHub Repos',
      subtitle: '@Winter101006',
      url: 'https://github.com/Winter101006?tab=repositories',
      icon: '🐙',
      colorClass: 'bg-indigo-600 text-white',
    },
    {
      id: 'colab',
      name: 'Google Colab',
      subtitle: 'GPU Notebooks & NLP',
      url: 'https://colab.research.google.com',
      icon: '🧪',
      colorClass: 'bg-orange-500 text-white',
    },
  ] satisfies DevConsoleLink[],
};
