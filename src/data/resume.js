export const personalInfo = {
  name: 'M. Dhamotharan',
  firstName: 'Dhamotharan',
  title: 'Full Stack Web Developer — MERN Stack Developer',
  email: 'mddhamotharan281@gmail.com',
  phone: '+91-8072781252',
  location: 'Tamil Nadu, India',
  github: 'https://github.com/Dhamotharan281',
  linkedin: 'https://www.linkedin.com/in/dhamotharan-muthaiyan-3ba50b216/',
  resumeUrl: '/resume.pdf',
  jobTitles: [
    'Full Stack Web Developer',
    'MERN Stack Developer',
    'AI-Powered App Developer',
    'React Native Developer',
    'Cloud-Native Engineer',
  ],
  summary:
    'Full Stack Developer specializing in the MERN stack and AI-powered web applications, with expertise in building scalable, real-time SaaS platforms and modern web solutions. Skilled in developing responsive user interfaces with React.js and Next.js, and designing high-performance backend services with Node.js, Express.js, MongoDB, Redis, and event-driven architectures. Experienced in integrating Generative AI, LLMs, and Retrieval-Augmented Generation (RAG) into production applications. Strong foundation in data structures, system design, API development, database optimization, and cloud deployment, with a focus on performance, scalability, and user experience.',
  about:
    'Currently at HEPL architecting an enterprise multi-tenant collaboration SaaS platform. I thrive at the intersection of scalable backend systems, real-time features, and delightful UX — always shipping production-ready code. Passionate about AI integration, microservices architecture, and building tools that genuinely help people.',
  stats: [
    { label: 'Months Experience', value: 14, suffix: '+' },
    { label: 'Projects Built', value: 10, suffix: '+' },
    { label: 'Technologies', value: 30, suffix: '+' },
    { label: 'CGPA (MCA)', value: 8.4, suffix: '' },
  ],
}

export const skills = {
  Languages: [
    { name: 'JavaScript (ES6+)', level: 90 },
    { name: 'TypeScript',        level: 80 },
    { name: 'Python',            level: 75 },
    { name: 'SQL',               level: 70 },
  ],
  Frontend: [
    { name: 'React.js',       level: 92 },
    { name: 'Next.js',        level: 85 },
    { name: 'Redux Toolkit',  level: 82 },
    { name: 'Tailwind CSS',   level: 88 },
    { name: 'HTML5',          level: 90 },
    { name: 'CSS3',           level: 88 },
  ],
  Backend: [
    { name: 'Node.js',        level: 88 },
    { name: 'Express.js',     level: 88 },
    { name: 'REST APIs',      level: 90 },
    { name: 'GraphQL',        level: 72 },
    { name: 'Socket.IO',      level: 85 },
    { name: 'Microservices',  level: 78 },
  ],
  'Databases & Cache': [
    { name: 'MongoDB', level: 88 },
    { name: 'MySQL',   level: 72 },
    { name: 'Redis',   level: 82 },
  ],
  'Cloud & DevOps': [
    { name: 'Docker',        level: 78 },
    { name: 'AWS',           level: 72 },
    { name: 'Apache Kafka',  level: 78 },
    { name: 'Git / GitHub',  level: 88 },
    { name: 'CI/CD',         level: 70 },
  ],
  'AI & Data': [
    { name: 'Gemini AI',       level: 80 },
    { name: 'RAG / LangChain', level: 75 },
    { name: 'Pandas / NumPy',  level: 72 },
    { name: 'Scikit-Learn',    level: 68 },
  ],
}

export const allSkillTags = [
  'JavaScript','TypeScript','Python','SQL',
  'React.js','Next.js','Redux Toolkit','Tailwind CSS','HTML5','CSS3',
  'Node.js','Express.js','REST APIs','GraphQL','Socket.IO','Microservices',
  'MongoDB','MySQL','Redis',
  'Docker','AWS','Apache Kafka','Git','CI/CD',
  'Gemini AI','RAG','LangChain','Pandas','NumPy','Scikit-Learn',
  'React Native','JWT','WebRTC','Django',
]

export const projects = [
  {
    id: 1,
    title: 'AI Incident Management Platform',
    subtitle: 'Intelligent DevOps Monitoring & Resolution System',
    category: 'AI',
    description:
      'AI-powered incident management platform that analyzes production failures, application logs, and system alerts to identify root causes and recommend remediation actions. Features intelligent triage workflows using LLMs and RAG, enabling DevOps teams to quickly diagnose outages and generate actionable resolution suggestions. Built real-time event ingestion pipelines with Kafka and Redis.',
    tech: ['Next.js', 'Node.js', 'MongoDB', 'Redis', 'Kafka', 'Python', 'Gemini AI', 'RAG'],
    github: 'https://github.com/Dhamotharan281',
    live:   'https://github.com/Dhamotharan281',
    color:  '#00e5ff',
  },
  {
    id: 2,
    title: 'PawSign – AI-Powered Accessibility & Healthcare Booking',
    subtitle: 'Sign Language Pet Healthcare Platform',
    category: 'AI',
    description:
      'Inclusive healthcare booking platform enabling speech-impaired users to schedule appointments through real-time hand-gesture recognition. Integrated MediaPipe computer vision models to translate gestures into structured application commands. Implemented secure authentication, appointment scheduling, RBAC, and multi-role workflow management.',
    tech: ['MERN Stack', 'Python', 'MediaPipe', 'Computer Vision', 'JWT', 'MongoDB'],
    github: 'https://github.com/Dhamotharan281/Action-Based-Pet-Service-Booking-System-MERN-Stack-AI-',
    live:   'https://github.com/Dhamotharan281/Action-Based-Pet-Service-Booking-System-MERN-Stack-AI-',
    color:  '#aa44ff',
  },
  {
    id: 3,
    title: 'Enterprise Multi-Tenant Collaboration SaaS',
    subtitle: 'No-Code Workspace Platform',
    category: 'Web',
    description:
      'Multi-tenant no-code SaaS platform with secure tenant isolation, workflow automation, and real-time collaboration. Features real-time chat, group messaging, broadcasts, screen sharing, multilingual translation, Wiki docs, file sharing, shared notes, to-do lists, planners, polls, and approval workflows via Kafka and Socket.IO.',
    tech: ['Next.js', 'Node.js', 'MongoDB', 'Redis', 'Kafka', 'Socket.IO', 'React Native', 'RAG'],
    github: 'https://github.com/Dhamotharan281',
    live:   'https://dhamotharan.netlify.app',
    color:  '#00ff88',
  },
  {
    id: 4,
    title: 'DataForge – AI-Powered Data Analytics Platform',
    subtitle: 'Natural Language Data Interaction',
    category: 'AI',
    description:
      'Intelligent analytics platform enabling natural language interaction with structured datasets. Integrated Gemini AI and RAG for document-based question answering with interactive dashboards and forecasting modules for business intelligence.',
    tech: ['React.js', 'Python', 'Flask', 'Gemini AI', 'RAG', 'LangChain', 'Pandas', 'MongoDB'],
    github: 'https://github.com/Dhamotharan281/AI-Powered-Data-Analytics-Dashboard-MERN-Stack-',
    live:   'https://github.com/Dhamotharan281/AI-Powered-Data-Analytics-Dashboard-MERN-Stack-',
    color:  '#aa44ff',
  },
  {
    id: 5,
    title: 'Real-Time Chat Platform',
    subtitle: 'WebRTC Video + Socket.IO Messaging',
    category: 'Web',
    description:
      'Full-stack real-time communication platform with persistent chat, WebRTC audio/video calling, and online presence tracking via Redis. JWT auth with RBAC and cross-platform React Native mobile app.',
    tech: ['React.js', 'Node.js', 'Socket.IO', 'WebRTC', 'Redis', 'React Native', 'JWT', 'MongoDB'],
    github: 'https://github.com/Dhamotharan281',
    live:   'https://splendorous-clafoutis-171e63.netlify.app/',
    color:  '#00e5ff',
  },
  {
    id: 6,
    title: 'MediCare AI – Hospital Management',
    subtitle: 'AI Appointment + WebRTC Doctor Consults',
    category: 'Web',
    description:
      'AI-powered hospital management system with Gemini AI appointment booking (voice + text), WebRTC video calls between doctors and patients, and a role-based admin dashboard.',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Gemini AI', 'WebRTC', 'Socket.IO', 'Express.js'],
    github: 'https://github.com/Dhamotharan281',
    live:   'https://dhamotharan.netlify.app',
    color:  '#00ff88',
  },
  {
    id: 7,
    title: 'Spotify Clone',
    subtitle: 'Music Streaming App',
    category: 'Web',
    description:
      'Responsive music streaming application with playlist management and playback controls. Implemented reusable React components and modern UI design principles with backend APIs for content management and user interactions.',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express.js'],
    github: 'https://github.com/Dhamotharan281/Clone-Spotify',
    live:   'https://github.com/Dhamotharan281/Clone-Spotify',
    color:  '#44ccff',
  },
]

export const experience = [
  {
    id: 1,
    role: 'Software Developer',
    company: 'HEPL',
    location: 'Tamil Nadu',
    period: 'Apr 2025 – Present',
    type: 'Full-time',
    color: '#00e5ff',
    subtitle: 'Enterprise Multi-Tenant Collaboration & No-Code SaaS Platform',
    points: [
      'Contributed to a multi-tenant SaaS platform enabling secure tenant isolation, workflow automation, and real-time collaboration across enterprise organizations.',
      'Built real-time chat, group messaging, broadcasts, screen sharing, and multilingual translation features using Socket.IO and Kafka.',
      'Developed collaboration modules including Wiki documentation, file sharing, shared notes, bookmarks, to-do lists, planners, polls, and approval workflows.',
      'Implemented event-driven backend services with Redis and Kafka to support scalable, low-latency communication and data synchronization.',
      'Contributed to the React Native application by developing chat, notifications, location sharing, and product-view functionalities.',
      'Integrated a RAG-based AI assistant that provides contextual answers about platform features, workflows, and organizational knowledge.',
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
      'Built full-stack web applications end-to-end using React.js, Node.js, Express.js, and MongoDB.',
      'Implemented secure authentication with JWT, refresh tokens, and Role-Based Access Control (RBAC).',
      'Optimized backend APIs and MongoDB queries, improving average response times for key endpoints.',
    ],
  },
  {
    id: 3,
    role: 'Python Full Stack Developer Intern',
    company: 'Inmakes Info Tech',
    location: 'Tamil Nadu',
    period: 'Sep 2024 – Nov 2024',
    type: 'Internship',
    color: '#00ff88',
    points: [
      'Developed full-stack web application features using Django, React.js, HTML, CSS, and JavaScript.',
      'Contributed to e-commerce platform development, including product management, user authentication, and order processing functionalities.',
      'Designed and integrated RESTful APIs for seamless communication between frontend and backend systems.',
      'Worked with relational databases for data modeling, CRUD operations, and query optimization.',
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
  { name: 'AWS Solutions Architecture Virtual Experience', issuer: 'Forage',        color: '#00e5ff' },
  { name: 'Deloitte Cyber Security Virtual Experience',   issuer: 'Forage',         color: '#aa44ff' },
  { name: 'Google Cloud Platform – Website Deployment',  issuer: 'Google',          color: '#00ff88' },
  { name: 'Python Data Science Program',                  issuer: '360DigiTMG',     color: '#44ccff' },
  { name: 'Java Full Stack Development',                  issuer: 'Greens Technology', color: '#cc88ff' },
]
