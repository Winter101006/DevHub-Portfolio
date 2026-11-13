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
  role: 'CS Undergraduate @ VNU-HUS (K69) | AI/ML & Full-Stack Developer',
  university: 'Trường ĐH Khoa học Tự nhiên - ĐHQGHN (VNU-HUS)',
  major: 'Khoa học Máy tính & Thông tin (K69 · QĐ 3568)',
  location: 'Hà Nội, Việt Nam',
  bio: 'Đam mê xây dựng các sản phẩm ứng dụng thực tế từ hệ thống Full-stack Web, 3D Web Games cho tới các mô hình Machine Learning & NLP.',
  githubUsername: 'Winter101006',
  secondaryGithubUsername: '24002015-art',
  githubUrl: 'https://github.com/Winter101006',
  // Thay bằng email cá nhân chính thức của bạn nếu muốn hiển thị công khai trên CV
  email: '199921144+Winter101006@users.noreply.github.com',
  availability: 'Open to AI/ML & Full-Stack Internships',
  currentFocus: [
    {
      badge: 'NCKH NLP',
      title: 'SemEval-2027 Task 3',
      description:
        'Nghiên cứu phát hiện sự biến đổi ngữ nghĩa từ vựng đa thời kỳ (Lexical Semantic Change Detection) với BGE-M3 Embeddings & Graph Label Propagation.',
      status: 'Active Research · Task 1a (0.87)',
    },
    {
      badge: 'Cộng đồng',
      title: 'CLB Toán Tin (HAMIC)',
      description:
        'Thành viên năng nổ tại CLB Toán Tin Khoa Toán - Cơ - Tin học VNU-HUS: chia sẻ thuật toán, học thuật AI/ML và xây dựng sản phẩm phần mềm ứng dụng.',
      status: 'VNU-HUS · K69',
    },
  ],
  techArsenal: [
    {
      id: 'languages',
      label: 'Languages',
      accent: 'text-sky-600 dark:text-sky-400',
      items: ['Python', 'Java', 'C/C++', 'JavaScript/TypeScript', 'SQL'],
    },
    {
      id: 'ai-data',
      label: 'AI & Data',
      accent: 'text-violet-600 dark:text-violet-400',
      items: [
        'PyTorch',
        'scikit-learn',
        'Pandas',
        'NumPy',
        'Sentence-Transformers',
        'ChromaDB',
        'OpenCV',
      ],
    },
    {
      id: 'web-cloud',
      label: 'Web & Cloud',
      accent: 'text-emerald-600 dark:text-emerald-400',
      items: [
        'Spring Boot',
        'React/Next.js',
        'Flask',
        'Streamlit',
        'HTML5 Canvas',
        'PostgreSQL (Neon)',
        'Firebase',
        'Vercel',
        'Render',
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
