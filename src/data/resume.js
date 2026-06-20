export const personalInfo = {
  name: 'M. Dhamotharan',
  firstName: 'Dhamotharan',
  title: 'Software Engineer | Full Stack Developer | AI Enthusiast',
  email: 'mddhamotharan281@gmail.com',
  phone: '+91-8072781252',
  location: 'Tamil Nadu',
  github: 'https://github.com/Dhamotharan281',
  linkedin: 'https://www.linkedin.com/in/dhamotharan-muthaiyan-3ba50b216/',
  hackerrank: 'https://www.hackerrank.com/your-profile',
  resumeUrl: '#',
  jobTitles: [
    'Software Engineer',
    'Full Stack Developer',
    'MERN Stack Developer',
    'React Native Developer',
    'AI-Integrated App Dev',
  ],
  summary:
    'Software Engineer with hands-on experience in Full Stack Development, AI-powered applications, and cloud-native systems. Skilled in MERN Stack, React Native, Python, MongoDB, Redis, Kafka, and Docker. Experienced in building scalable SaaS platforms, real-time communication systems, REST APIs, and Retrieval-Augmented Generation (RAG) based AI solutions. Strong foundation in software engineering principles, problem-solving, and modern web technologies.',
  stats: [
    { label: 'Months Experience', value: 8, suffix: '+' },
    { label: 'Projects Built', value: 10, suffix: '+' },
    { label: 'Technologies', value: 30, suffix: '+' },
    { label: 'CGPA (MCA)', value: 8.4, suffix: '' },
  ],
}

export const skills = {
  Languages: [
    { name: 'JavaScript (ES6+)', level: 90 },
    { name: 'TypeScript', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'SQL', level: 70 },
  ],
  Frontend: [
    { name: 'React.js', level: 92 },
    { name: 'Next.js', level: 85 },
    { name: 'Redux Toolkit', level: 82 },
    { name: 'Tailwind CSS', level: 88 },
    { name: 'HTML5', level: 90 },
    { name: 'CSS3', level: 88 },
  ],
  Backend: [
    { name: 'Node.js', level: 88 },
    { name: 'Express.js', level: 88 },
    { name: 'REST APIs', level: 90 },
    { name: 'GraphQL', level: 72 },
    { name: 'Socket.IO', level: 85 },
    { name: 'JWT Auth', level: 83 },
  ],
  'Databases & Cache': [
    { name: 'MongoDB', level: 88 },
    { name: 'MySQL', level: 72 },
    { name: 'Redis', level: 80 },
  ],
  'Cloud & DevOps': [
    { name: 'Docker', level: 78 },
    { name: 'AWS', level: 72 },
    { name: 'Apache Kafka', level: 75 },
    { name: 'Git / GitHub', level: 88 },
  ],
  'AI & Data': [
    { name: 'Gemini AI', level: 78 },
    { name: 'RAG / LangChain', level: 70 },
    { name: 'Pandas / NumPy', level: 72 },
    { name: 'Scikit-Learn', level: 68 },
  ],
}

export const allSkillTags = [
  'JavaScript','TypeScript','Python','React.js','Next.js','Node.js','Express.js',
  'MongoDB','Redis','Kafka','Socket.IO','REST APIs','Docker','AWS','React Native',
  'GraphQL','JWT','Tailwind CSS','Redux Toolkit','Gemini AI','RAG','LangChain',
  'MySQL','Git','Pandas','NumPy','Scikit-Learn','HTML5','CSS3','Microservices',
]

export const projects = [
  {
    id: 1,
    title: 'PawSign – AI-Powered Sign Language Pet Healthcare Booking',
    category: 'AI',
    description:
      'Accessibility-focused healthcare booking platform enabling speech-impaired users to schedule pet appointments using hand gestures. Integrated MediaPipe and computer vision models to convert gestures into system commands with high recognition accuracy.',
    tech: ['MERN Stack', 'Python', 'MediaPipe', 'Computer Vision', 'JWT', 'MongoDB'],
    github: 'https://github.com/Dhamotharan281/Action-Based-Pet-Service-Booking-System-MERN-Stack-AI-',
    live: 'https://github.com/Dhamotharan281/Action-Based-Pet-Service-Booking-System-MERN-Stack-AI-',
    color: '#00e5ff',
  },
  {
    id: 2,
    title: 'DataForge – AI-Powered Data Analytics Platform',
    category: 'AI',
    description:
      'Intelligent analytics platform enabling natural language interaction with structured datasets. Integrated Gemini AI and RAG for document-based question answering with interactive dashboards and forecasting modules for business intelligence.',
    tech: ['React.js', 'Python', 'Flask', 'Gemini AI', 'RAG', 'LangChain', 'Pandas', 'MongoDB'],
    github: 'https://github.com/Dhamotharan281/AI-Powered-Data-Analytics-Dashboard-MERN-Stack-',
    live: 'https://github.com/Dhamotharan281/AI-Powered-Data-Analytics-Dashboard-MERN-Stack-',
    color: '#aa44ff',
  },
  {
    id: 3,
    title: 'Spotify Clone',
    category: 'Web',
    description:
      'Responsive music streaming application with playlist management and playback controls. Implemented reusable React components and modern UI design principles with backend APIs for content management and user interactions.',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express.js'],
    github: 'https://github.com/Dhamotharan281/Clone-Spotify',
    live: 'https://github.com/Dhamotharan281/Clone-Spotify',
    color: '#00ff88',
  },
  {
    id: 4,
    title: 'Multi-Tenant No-Code SaaS Platform',
    category: 'Web',
    description:
      'Architected a multi-tenant no-code SaaS platform enabling businesses to build custom workspaces. Features tenant isolation, schema-per-tenant MongoDB strategy, real-time chat via Kafka + Socket.IO, and Redis caching.',
    tech: ['Next.js', 'Node.js', 'MongoDB', 'Redis', 'Kafka', 'Docker', 'Socket.IO', 'React Native'],
    github: 'https://github.com/Dhamotharan281',
    live: 'https://dhamotharan.netlify.app',
    color: '#aa44ff',
  },
  {
    id: 5,
    title: 'Real-Time Chat Platform',
    category: 'Web',
    description:
      'Full-stack real-time communication platform with persistent chat, WebRTC audio/video calling, and online presence tracking via Redis. JWT auth with RBAC and cross-platform React Native mobile app.',
    tech: ['React.js', 'Node.js', 'Socket.IO', 'WebRTC', 'Redis', 'React Native', 'JWT', 'MongoDB'],
    github: 'https://github.com/Dhamotharan281',
    live: 'https://splendorous-clafoutis-171e63.netlify.app/',
    color: '#00e5ff',
  },
  {
    id: 6,
    title: 'MediCare AI – Hospital Management',
    category: 'Web',
    description:
      'AI-powered hospital management system with Gemini AI appointment booking (voice + text), WebRTC video calls between doctors and patients, and a role-based admin dashboard.',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Gemini AI', 'WebRTC', 'Socket.IO', 'Express.js'],
    github: 'https://github.com/Dhamotharan281',
    live: 'https://dhamotharan.netlify.app',
    color: '#00ff88',
  },
]

export const experience = [
  {
    id: 1,
    role: 'Junior Full Stack Developer',
    company: 'HEPL',
    location: 'Tamil Nadu',
    period: 'Apr 2025 – Present',
    type: 'Full-time',
    color: '#00e5ff',
    points: [
      'Developing a multi-tenant SaaS platform using Next.js, Node.js, MongoDB, Redis, and Kafka.',
      'Built real-time workspace communication modules using Socket.IO and Apache Kafka.',
      'Implemented Redis caching and Pub/Sub mechanisms to optimize application scalability.',
      'Developing AI-powered RAG solutions for automated user assistance and knowledge retrieval.',
      'Containerized services using Docker for streamlined deployment and environment consistency.',
      'Contributed to React Native mobile applications with authentication and push notification features.',
    ],
  },
  {
    id: 2,
    role: 'MERN Stack Developer Intern',
    company: 'HEPL',
    location: 'Tamil Nadu',
    period: 'Dec 2024 – Mar 2025',
    type: 'Internship',
    color: '#aa44ff',
    points: [
      'Developed full-stack web applications using React.js, Node.js, Express.js, and MongoDB.',
      'Implemented secure authentication systems using JWT, Refresh Tokens, and RBAC.',
      'Optimized backend APIs and database queries to improve response times and efficiency.',
    ],
  },
  {
    id: 3,
    role: 'Python Developer Intern',
    company: 'Inmakes Info Tech',
    location: 'Remote',
    period: 'Sep 2024 – Nov 2024',
    type: 'Internship',
    color: '#00ff88',
    points: [
      'Automated data processing workflows using Python, Pandas, and NumPy.',
      'Built machine learning models for price prediction using Scikit-Learn.',
      'Performed data cleaning, feature engineering, and model evaluation.',
    ],
  },
]

export const education = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Rajiv Gandhi College of Engineering & Technology',
    location: 'Puducherry',
    period: '2022 – 2024',
    cgpa: '8.4 / 10',
    color: '#00e5ff',
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Achariya Arts & Science College',
    location: 'Puducherry',
    period: '2019 – 2022',
    cgpa: '7.5 / 10',
    color: '#aa44ff',
  },
]

export const certifications = [
  { name: 'AWS Solutions Architecture Virtual Experience', issuer: 'Forage', color: '#00e5ff' },
  { name: 'Deloitte Cyber Security Virtual Experience', issuer: 'Forage', color: '#aa44ff' },
  { name: 'Google Cloud Platform – Website Deployment', issuer: 'Google', color: '#00ff88' },
  { name: 'Python Data Science Program', issuer: '360DigiTMG', color: '#44ccff' },
  { name: 'Java Full Stack Development', issuer: 'Greens Technology', color: '#cc88ff' },
]
