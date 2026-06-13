import React, { useState, useEffect, useRef } from 'react';
import {
  Compass, Layers, FileText, Briefcase, Trello, Mic, MessageSquare,
  User, Settings as SettingsIcon, Bell, Award, ChevronRight, Plus,
  Trash2, CheckCircle2, X, BookOpen, Play, FileText as FileIcon, Globe,
  Loader2, ChevronDown, Check, Send, Upload, BarChart2, LogOut,
  Moon, Sun, ShieldCheck, Info, Menu, ChevronLeft
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const PRESEEDED_JOBS = [
  { _id: 'j1', title: 'Machine Learning Engineer', company: 'NeuralTech Inc', location: 'San Francisco, CA', description: 'Design and deploy core deep learning pipelines and neural network models.', skillsRequired: ['Python', 'PyTorch', 'Docker', 'Machine Learning'], salary: '$130,000 - $160,000' },
  { _id: 'j2', title: 'Full Stack Engineer (React/Node)', company: 'SaaSFlow Corp', location: 'Remote', description: 'Build premium landing pages and clean backends with optimized REST API design.', skillsRequired: ['React', 'Node.js', 'Express', 'TypeScript'], salary: '$115,000 - $140,000' },
  { _id: 'j3', title: 'AI Product Specialist', company: 'Cognitive Web Group', location: 'Boston, MA', description: 'Bridge LLM pipelines with beautiful UI experiences. Design system focus.', skillsRequired: ['Python', 'React', 'LangChain', 'Tailwind CSS'], salary: '$100,000 - $125,000' }
];

export default function App() {
  // Navigation & Auth
  const [activePage, setActivePage] = useState('landing'); // landing, auth, onboarding, platform
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('register'); // register, login
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Onboarding step
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardGoal, setOnboardGoal] = useState('AI Engineer');
  const [onboardLevel, setOnboardLevel] = useState('beginner');
  const [onboardLocation, setOnboardLocation] = useState('San Francisco, CA');
  const [onboardExtSkills, setOnboardExtSkills] = useState('');
  const [onboardExtEdu, setOnboardExtEdu] = useState('');
  const [onboardExtExp, setOnboardExtExp] = useState('');

  // Profile
  const [profile, setProfile] = useState({
    goal: 'AI Engineer',
    skills: ['Python', 'JavaScript', 'HTML/CSS', 'Git'],
    interests: ['Machine Learning', 'Web Development'],
    education: [{ school: 'Stanford University', degree: 'BS', fieldOfStudy: 'Computer Science', startYear: '2021', endYear: '2025' }],
    experience: [{ company: 'Tech Corp', position: 'Intern', duration: '3 months', description: 'Assisted in building Python REST APIs.' }],
    location: 'San Francisco, CA',
    xp: 250,
    level: 1,
    avatar: null,
    verifiedSkills: [],
    portfolioLink: '',
    linkedinLink: '',
    githubLink: ''
  });

  const [roadmaps, setRoadmaps] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([
    { _id: 'n1', title: '👋 Welcome to Career GPS AI!', message: 'Explore your dashboard, set your goal, and analyze your CV.', read: false }
  ]);
  const [achievements, setAchievements] = useState([
    { title: 'Compass Finder', description: 'Registered your account and initiated Career GPS.', badgeIcon: 'compass', locked: false },
    { title: 'Profile Architect', description: 'Completed filling education, goals, and interests.', badgeIcon: 'user-check', locked: true },
    { title: 'Resume Explorer', description: 'Analyzed your CV using ATS intelligence.', badgeIcon: 'file-text', locked: true },
    { title: 'Speech Master', description: 'Completed a simulated mock interview.', badgeIcon: 'mic', locked: true }
  ]);

  // Tasks
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Generate an AI Roadmap for your target goal', completed: false, xp: 100 },
    { id: 2, text: 'Perform your first ATS resume check', completed: false, xp: 150 },
    { id: 3, text: 'Start a Mock Interview practice session', completed: false, xp: 200 },
    { id: 4, text: 'Drag a Job application to the "Interview" stage', completed: false, xp: 100 }
  ]);

  // Modals state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingRoadmapStepIdx, setPendingRoadmapStepIdx] = useState(null);
  const [verificationFileName, setVerificationFileName] = useState('');
  
  const [showAtsCertModal, setShowAtsCertModal] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [atsFeedback, setAtsFeedback] = useState([]);
  const [atsMissing, setAtsMissing] = useState([]);
  
  const [showInterviewCertModal, setShowInterviewCertModal] = useState(false);
  const [interviewCertScore, setInterviewCertScore] = useState(0);
  const [interviewCertGoal, setInterviewCertGoal] = useState('');

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Resume Analyzer
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');

  // Chat settings
  const [activeChatModel, setActiveChatModel] = useState('gemini');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Career Coach. Ask me anything about skills, roadmaps, resume optimizations, or interviews!' }
  ]);

  // Interview settings
  const [interviewDomain, setInterviewDomain] = useState('ai');
  const [interviewLevel, setInterviewLevel] = useState('beginner');
  const [currentInterview, setCurrentInterview] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answerInput, setAnswerInput] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('react_careergps_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.user) {
        setUser(parsed.user);
        setProfile(parsed.profile);
        setRoadmaps(parsed.roadmaps);
        setApplications(parsed.applications);
        setNotifications(parsed.notifications);
        setAchievements(parsed.achievements);
        setTasks(parsed.tasks);
        setActivePage('platform');
      }
    }
  }, []);

  const saveState = (updatedState) => {
    localStorage.setItem('react_careergps_state', JSON.stringify({
      user, profile, roadmaps, applications, notifications, achievements, tasks, ...updatedState
    }));
  };

  // Auth Submit Handlers
  const handleRegister = (e) => {
    e.preventDefault();
    const mockUser = { name: regName || 'Alex Mercer', email: regEmail };
    setUser(mockUser);
    setToken('mock_token_jwt');
    setActivePage('onboarding');
    setOnboardStep(1);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const mockUser = { name: 'Alex Mercer', email: loginEmail || 'alex@gmail.com' };
    setUser(mockUser);
    setToken('mock_token_jwt');
    setActivePage('platform');
    setActiveTab('dashboard');
  };

  const handleGoogleLogin = () => {
    const mockUser = { name: 'Alex Mercer', email: 'alex.mercer@gmail.com' };
    setUser(mockUser);
    setToken('mock_token_jwt');
    setActivePage('onboarding');
    setOnboardStep(1);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setActivePage('landing');
    localStorage.removeItem('react_careergps_state');
  };

  // Onboarding Resume auto-fill simulation
  const handleOnboardResumeUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setTimeout(() => {
      const name = file.name.toLowerCase();
      let skills = 'Python, PyTorch, NumPy, Pandas, Git';
      let education = 'Bachelor of Science in Computer Science';
      let experience = 'Junior ML Research Assistant';

      if (name.includes('web') || name.includes('full')) {
        skills = 'JavaScript, React, Node.js, Express, Tailwind CSS, PostgreSQL';
        education = 'Full Stack Bootcamp Certification';
        experience = 'Freelance Web Developer';
      }

      setOnboardExtSkills(skills);
      setOnboardExtEdu(education);
      setOnboardExtExp(experience);
      setLoading(false);
      setOnboardStep(3);
    }, 1500);
  };

  const finalizeOnboarding = () => {
    const skillsList = onboardExtSkills ? onboardExtSkills.split(',').map(s=>s.trim()) : ['Python', 'JavaScript', 'Git'];
    const updatedProfile = {
      ...profile,
      goal: onboardGoal,
      location: onboardLocation,
      skills: skillsList,
      school: onboardExtEdu || 'Stanford University',
      company: onboardExtExp || 'Tech Corp'
    };

    setProfile(updatedProfile);
    
    // Seed Roadmap
    let steps = [];
    if (onboardGoal.toLowerCase().includes('ai')) {
      steps = [
        { month: 'Month 1: Fundamentals', title: 'Python & Math Foundations', description: 'Master vector math, numpy, pandas, and calculus.', skills: ['Python', 'Linear Algebra', 'EDA'], resources: [{ title: 'Python Data Basics', type: 'course', url: 'https://kaggle.com' }], status: 'pending' },
        { month: 'Month 2: Core ML', title: 'Supervised Learning & Scikit', description: 'Train decision trees, linear regression, and classifiers.', skills: ['Scikit-Learn', 'Feature Engineering'], resources: [{ title: 'Scikit User Guide', type: 'documentation', url: 'https://scikit-learn.org' }], status: 'pending' },
        { month: 'Month 3: Deep Learning', title: 'Neural Networks & PyTorch', description: 'Build backpropagation algorithms and CNN models.', skills: ['PyTorch', 'CNNs'], resources: [{ title: 'PyTorch Tutorials', type: 'course', url: 'https://pytorch.org' }], status: 'pending' },
        { month: 'Month 4: LLMs', title: 'Transformers & NLP', description: 'Learn attention modules, BERT, and generative systems.', skills: ['Transformers', 'HuggingFace'], resources: [{ title: 'HuggingFace NLP', type: 'course', url: 'https://huggingface.co' }], status: 'pending' },
        { month: 'Month 5: RAG', title: 'Vector DBs & Orchestration', description: 'Store vector embeddings in Pinecone and orchestrate with LangChain.', skills: ['LangChain', 'Pinecone', 'ChromaDB'], resources: [{ title: 'LangChain Tutorial', type: 'video', url: 'https://youtube.com' }], status: 'pending' },
        { month: 'Month 6: MLOps', title: 'Containerization & Cloud APIs', description: 'Package models into FastAPI endpoints and deploy with Docker.', skills: ['Docker', 'FastAPI', 'MLOps'], resources: [{ title: 'Docker Crash Course', type: 'video', url: 'https://youtube.com' }], status: 'pending' }
      ];
    } else {
      steps = [
        { month: 'Month 1: Frontend', title: 'React & Tailwind Mastery', description: 'Build componentized responsive layouts with custom style systems.', skills: ['React', 'Tailwind CSS', 'TypeScript'], resources: [{ title: 'React Dev Docs', type: 'documentation', url: 'https://react.dev' }], status: 'pending' },
        { month: 'Month 2: Backend REST', title: 'Express & Node Server Architecture', description: 'Write secure, structured API controllers with middleware.', skills: ['Node.js', 'Express.js', 'JWT Auth'], resources: [{ title: 'REST Guide', type: 'documentation', url: 'https://restfulapi.net' }], status: 'pending' },
        { month: 'Month 3: DB Integration', title: 'SQL & ORM Engines', description: 'Model relational schemas, index files, and manage migrations.', skills: ['PostgreSQL', 'Prisma ORM'], resources: [{ title: 'Prisma Intro', type: 'course', url: 'https://prisma.io' }], status: 'pending' },
        { month: 'Month 4: Real-time', title: 'WebSockets & Socket.io', description: 'Establish dynamic bidirection channels for live collaborations.', skills: ['WebSockets', 'Redis'], resources: [{ title: 'Socket.io Docs', type: 'documentation', url: 'https://socket.io' }], status: 'pending' },
        { month: 'Month 5: DevOps Deploy', title: 'Docker Containers & CI/CD', description: 'Script GitHub Actions workflow builds and launch onto host boxes.', skills: ['Docker', 'GitHub Actions'], resources: [{ title: 'Docker Video', type: 'video', url: 'https://youtube.com' }], status: 'pending' },
        { month: 'Month 6: System Scale', title: 'Caching & Nginx CDN', description: 'Load balance traffic, optimize N+1 queries, configure Nginx paths.', skills: ['Nginx', 'System Design'], resources: [{ title: 'System Primer', type: 'documentation', url: 'https://github.com' }], status: 'pending' }
      ];
    }

    const initialRoadmap = {
      goal: onboardGoal,
      title: `GPS Guide: ${onboardGoal} Career Roadmap`,
      steps
    };

    setRoadmaps([initialRoadmap]);
    setActivePage('platform');
    setActiveTab('dashboard');

    // Trigger profile achievement
    const updatedAchievements = achievements.map(ach => {
      if (ach.title === 'Profile Architect') return { ...ach, locked: false };
      return ach;
    });
    setAchievements(updatedAchievements);

    // Save
    localStorage.setItem('react_careergps_state', JSON.stringify({
      user, profile: updatedProfile, roadmaps: [initialRoadmap], applications, notifications, achievements: updatedAchievements, tasks
    }));
  };

  // Gamification helpers
  const awardXP = (amount, taskMessage = '') => {
    let nextXP = profile.xp + amount;
    let nextLevel = profile.level;
    const xpNeeded = nextLevel * 1000;
    let leveledUp = false;

    if (nextXP >= xpNeeded) {
      nextXP = nextXP - xpNeeded;
      nextLevel += 1;
      leveledUp = true;
    }

    const updatedProfile = { ...profile, xp: nextXP, level: nextLevel };
    setProfile(updatedProfile);

    if (leveledUp) {
      addNotification('🎉 Level Up!', `Incredible job! You achieved Level ${nextLevel}!`);
    } else if (taskMessage) {
      addNotification('XP Earned!', `+${amount} XP: ${taskMessage}`);
    }
  };

  const addNotification = (title, message) => {
    const newNotif = {
      _id: 'n_' + Math.random().toString(36).substr(2, 5),
      title,
      message,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Toggle tasks
  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          awardXP(t.xp, t.text);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  // Milestone Complete Certificate Gate
  const handleToggleRoadmapStep = (idx) => {
    const r = roadmaps[0];
    if (!r) return;

    const step = r.steps[idx];
    if (step.status === 'completed') {
      step.status = 'pending';
      const updatedVerified = profile.verifiedSkills.filter(v => !step.skills.includes(v));
      setProfile({ ...profile, verifiedSkills: updatedVerified });
      setRoadmaps([...roadmaps]);
    } else {
      setPendingRoadmapStepIdx(idx);
      setVerificationFileName('');
      setShowVerificationModal(true);
    }
  };

  const confirmMilestoneVerification = () => {
    const r = roadmaps[0];
    if (pendingRoadmapStepIdx !== null && r) {
      const step = r.steps[pendingRoadmapStepIdx];
      step.status = 'completed';
      
      const newVerified = Array.from(new Set([...profile.verifiedSkills, ...step.skills]));
      setProfile({ ...profile, verifiedSkills: newVerified });
      setRoadmaps([...roadmaps]);
      awardXP(500, `Verified milestone: ${step.title}`);
      setShowVerificationModal(false);
      
      // Complete checklist task
      const task = tasks.find(t => t.id === 1);
      if (task && !task.completed) {
        toggleTask(1);
      }
    }
  };

  // Resume Loop evaluate parser
  const handleAnalyzeResume = (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const txtLower = resumeText.toLowerCase();
      const goalLower = profile.goal.toLowerCase();

      let matched = 0;
      let target = goalLower.includes('full') 
        ? ['react', 'node.js', 'typescript', 'postgres', 'docker', 'nginx']
        : ['python', 'pytorch', 'transformers', 'docker', 'langchain', 'mlops'];

      target.forEach(kw => {
        if (txtLower.includes(kw)) matched++;
      });

      let bonus = 0;
      if (txtLower.includes('latency') || txtLower.includes('speed') || txtLower.includes('%') || txtLower.includes('improved')) {
        bonus += 15;
      }
      if (txtLower.includes('education') || txtLower.includes('stanford') || txtLower.includes('university')) {
        bonus += 10;
      }

      const score = Math.min(100, 45 + (matched * 8) + bonus);
      const missing = target.filter(kw => !txtLower.includes(kw));

      setAtsScore(score);
      setAtsMissing(missing);

      const drawbacks = [];
      if (score < 90) {
        if (bonus < 15) drawbacks.push("Missing quantitative achievements (e.g. 'reduced processing latency by 15%').");
        if (bonus < 10) drawbacks.push("Ensure your degree, school and university credentials are listed.");
        if (missing.length > 0) drawbacks.push(`Missing critical target keywords: ${missing.slice(0,2).join(', ')}.`);
      } else {
        drawbacks.push("ATS structure satisfies best practice guidelines. Download your certification of CV excellence!");
        setShowAtsCertModal(true);
      }
      setAtsFeedback(drawbacks);
      setLoading(false);
      localStorage.setItem('latest_ats_score', score);

      // Complete task
      const task = tasks.find(t => t.id === 2);
      if (task && !task.completed) {
        toggleTask(2);
      }
    }, 1200);
  };

  // Jobs Board CRM import
  const handleImportJobToCRM = (job) => {
    const newApp = {
      _id: 'a_' + Math.random().toString(36).substr(2, 5),
      title: job.title,
      company: job.company,
      status: 'applied',
      appliedDate: new Date().toISOString(),
      notes: job.description
    };
    setApplications([...applications, newApp]);
    addNotification('Job Tracked', `Added "${job.title}" at ${job.company} to Kanban board.`);
  };

  const handleUpdateCRMStatus = (appId, nextStatus) => {
    const updated = applications.map(app => {
      if (app._id === appId) {
        if (nextStatus === 'interview') {
          const task = tasks.find(t => t.id === 4);
          if (task && !task.completed) {
            toggleTask(4);
          }
        }
        return { ...app, status: nextStatus };
      }
      return app;
    });
    setApplications(updated);
  };

  // Technical Mock Interview Coach
  const mockInterviewsDb = {
    ai: {
      beginner: [
        { question: "What is Python and why is it preferred for ML?", questionType: "technical" },
        { question: "What is the difference between supervised and unsupervised learning?", questionType: "technical" },
        { question: "Write a function to compute average value of a list.", questionType: "coding" },
        { question: "Why are you interested in becoming an AI Engineer?", questionType: "hr" },
        { question: "Explain the role of Pandas in data preprocessing.", questionType: "technical" }
      ],
      advanced: [
        { question: "Explain the self-attention mechanism matrix math in Transformers.", questionType: "technical" },
        { question: "How do you debug exploding gradients in deep networks?", questionType: "technical" },
        { question: "Write a numpy/PyTorch routine to run cosine similarity.", questionType: "coding" },
        { question: "How would you design a scalable MLOps pipeline on AWS?", questionType: "technical" },
        { question: "How do you explain neural network classifications to business owners?", questionType: "hr" }
      ]
    }
  };

  const handleStartInterview = () => {
    setLoading(true);
    setTimeout(() => {
      const qSource = mockInterviewsDb.ai[interviewLevel] || mockInterviewsDb.ai.beginner;
      setCurrentInterview({
        domain: interviewDomain,
        level: interviewLevel,
        questions: qSource.map(q => ({ ...q, userAnswer: '', rating: 0, feedback: '' }))
      });
      setCurrentQuestionIdx(0);
      setAnswerInput('');
      setLoading(false);
    }, 1000);
  };

  const handleSubmitInterviewAnswer = () => {
    if (!answerInput.trim() || !currentInterview) return;

    setLoading(true);
    setTimeout(() => {
      const len = answerInput.length;
      let rating = 2;
      let feedback = 'Your answer is brief. Include more technical keywords, frameworks, or code contexts to justify your point.';
      
      if (len > 150) {
        rating = 5;
        feedback = 'Exceptional answer! You demonstrated complete conceptual accuracy, discussed mechanics, and showed clear mastery.';
      } else if (len > 70) {
        rating = 4;
        feedback = 'Good answer. You hit the key conceptual terms. For a better rating, elaborate on a real-world scenario where you applied it.';
      } else if (len > 30) {
        rating = 3;
        feedback = 'Correct direction but lacks depth. Mention concrete APIs or architectural parameters to demonstrate experience.';
      }

      const updatedQuestions = currentInterview.questions.map((q, i) => {
        if (i === currentQuestionIdx) {
          return { ...q, userAnswer: answerInput, rating, feedback };
        }
        return q;
      });

      const nextQuestionIdx = currentQuestionIdx + 1;
      const allDone = nextQuestionIdx >= currentInterview.questions.length;
      
      if (allDone) {
        const totalRating = updatedQuestions.reduce((acc, q) => acc + q.rating, 0);
        const overall = Math.round((totalRating / 25) * 100);
        
        setCurrentInterview(prev => ({
          ...prev,
          questions: updatedQuestions,
          overallScore: overall,
          status: 'completed'
        }));

        if (overall >= 85) {
          setInterviewCertScore(overall);
          setInterviewCertGoal(`${interviewDomain.toUpperCase()} (${interviewLevel.toUpperCase()})`);
          setShowInterviewCertModal(true);
        }

        const task = tasks.find(t => t.id === 3);
        if (task && !task.completed) {
          toggleTask(3);
        }
      } else {
        setCurrentInterview(prev => ({ ...prev, questions: updatedQuestions }));
        setCurrentQuestionIdx(nextQuestionIdx);
        setAnswerInput('');
      }
      setLoading(false);
    }, 1000);
  };

  // Multi-Model Career Chatbot
  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const userMsg = { role: 'user', text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    const input = chatMessage;
    setChatMessage('');

    setTimeout(() => {
      let reply = "";
      const msg = input.toLowerCase();

      if (activeChatModel === 'gemini') {
        reply = "Gemini Response: Focus on active roadmaps! I recommend starting with basic Python and data parsing libraries to lay a solid career foundation.";
        if (msg.includes('resume')) reply = "Gemini Response: Tailoring CV keywords increases ATS scores. Verify that you include Docker or PyTorch explicitly under your skills header.";
      } else if (activeChatModel === 'gpt4') {
        reply = "GPT-4: Set up a FastAPI microservice. Implement CORS headers, rate limiters, and connect to a dockerized PostgreSQL instance.";
        if (msg.includes('resume')) reply = "GPT-4: Focus on quantitative metrics (e.g. 'Optimized query latency by 42% through indexing').";
      } else {
        reply = "Claude 3.5: A comprehensive career path involves systematic study of computational theory, database indexing mechanisms, and continuous practice of behavioral prompts.";
      }

      setChatHistory(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 800);
  };

  // Profile Save
  const handleProfileSave = (e) => {
    e.preventDefault();
    addNotification('Profile Saved', 'Details updated successfully.');
  };

  return (
    <div className="min-h-screen text-gray-100 bg-darkBg">
      
      {/* LANDING PAGE VIEW */}
      {activePage === 'landing' && (
        <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Compass className="h-8 w-8 text-primaryCyan animate-spin-slow" />
              <span className="font-extrabold text-xl tracking-tight text-white">Career GPS <span className="text-primaryCyan">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => { setAuthMode('login'); setActivePage('auth'); }} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">Sign In</button>
              <button onClick={() => { setAuthMode('register'); setActivePage('auth'); }} className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-primary text-white shadow-lg hover:scale-105 transition">Get Started</button>
            </div>
          </header>

          <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs text-primaryCyan border border-cyan-500/30">
                <ShieldCheck className="h-3.5 w-3.5" /> Next-Gen AI Career Steering Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white font-sans">
                Navigate Your Tech Journey with <span className="text-gradient">GPS AI</span>
              </h1>
              <p class="text-gray-400 text-lg max-w-xl mx-auto lg:mx-0">
                Stop guessing your learning path. Create AI-powered personalized roadmaps, verify certificate milestones, evaluate real resume scores, and track jobs.
              </p>
              <button onClick={() => { setAuthMode('register'); setActivePage('auth'); }} className="px-8 py-4 font-bold rounded-2xl bg-gradient-primary text-white shadow-xl hover:scale-105 transition">
                Start Your GPS Guide
              </button>
            </div>

            <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center">
              <div className="w-full max-w-[440px] rounded-3xl p-6 glass-panel shadow-2xl relative border-white/10">
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Award className="text-purple-400 h-5 w-5" />
                    <div>
                      <div className="font-bold text-white text-sm">GPS Assistant</div>
                      <div className="text-xs text-cyan-400">Interactive Web Client</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Lvl 1</span>
                </div>

                <div className="py-6 space-y-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 font-bold">TARGET GOAL</div>
                    <div className="text-md font-extrabold text-white">AI Engineer / Full-Stack</div>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <button onClick={() => { setAuthMode('register'); setActivePage('auth'); }} className="w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-2">
                  Access Dashboard <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* AUTH VIEW */}
      {activePage === 'auth' && (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />
          <div className="w-full max-w-md rounded-3xl p-8 glass-panel shadow-2xl relative border-white/10 space-y-6">
            <button onClick={() => setActivePage('landing')} className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1 text-xs">
              <ChevronLeft className="h-4 w-4" /> Home
            </button>

            <h2 className="text-3xl font-extrabold text-white text-center">
              {authMode === 'register' ? 'Create Account' : 'Welcome Back'}
            </h2>

            <form onSubmit={authMode === 'register' ? handleRegister : handleLogin} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold">NAME</label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Alex Mercer" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-sm text-white" />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold">EMAIL</label>
                <input type="email" value={authMode === 'register' ? regEmail : loginEmail} onChange={(e) => authMode === 'register' ? setRegEmail(e.target.value) : setLoginEmail(e.target.value)} required placeholder="alex@gmail.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-sm text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold">PASSWORD</label>
                <input type="password" value={authMode === 'register' ? regPassword : loginPassword} onChange={(e) => authMode === 'register' ? setRegPassword(e.target.value) : setLoginPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-sm text-white" />
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2">
                {authMode === 'register' ? 'Register Account' : 'Sign In'}
              </button>
            </form>

            <button onClick={handleGoogleLogin} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" /> Sign In with Google
            </button>
          </div>
        </div>
      )}

      {/* MULTI-STEP ONBOARDING VIEW */}
      {activePage === 'onboarding' && (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
          <div className="w-full max-w-xl rounded-3xl p-8 glass-panel shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="font-extrabold text-sm text-purple-400">Onboarding Wizard</span>
              <span className="text-xs text-gray-400 font-bold">Step {onboardStep} of 3</span>
            </div>

            {onboardStep === 1 && (
              <div className="space-y-4">
                <h3 class="text-2xl font-bold text-white">Configure Your Target Track</h3>
                <div class="space-y-3 pt-2">
                  <div class="space-y-1">
                    <label class="text-xs text-gray-400 font-bold">TARGET CAREER GOAL</label>
                    <select value={onboardGoal} onChange={(e)=>setOnboardGoal(e.target.value)} class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500">
                      <option value="AI Engineer">AI Engineer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                    </select>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-gray-400 font-bold">LOCATION</label>
                    <input type="text" value={onboardLocation} onChange={(e)=>setOnboardLocation(e.target.value)} class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none" />
                  </div>
                </div>
                <button onClick={()=>setOnboardStep(2)} class="w-full py-3 bg-gradient-primary text-white font-bold rounded-xl flex items-center justify-center gap-1">
                  Next Step <ChevronRight class="h-4 w-4" />
                </button>
              </div>
            )}

            {onboardStep === 2 && (
              <div className="space-y-4">
                <h3 class="text-2xl font-bold text-white">Upload Resume to Auto-Fill</h3>
                <div class="border-2 border-dashed border-white/10 hover:border-purple-500/35 rounded-2xl p-8 text-center cursor-pointer space-y-3 relative">
                  <input type="file" onChange={handleOnboardResumeUpload} class="absolute inset-0 opacity-0 cursor-pointer" />
                  <Upload class="h-10 w-10 text-purple-400 mx-auto animate-bounce" />
                  <span class="text-sm font-semibold text-white block">Select Resume File</span>
                </div>
                <div class="flex gap-4">
                  <button onClick={()=>setOnboardStep(1)} class="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl">Back</button>
                  <button onClick={()=>setOnboardStep(3)} class="flex-1 py-3 bg-gradient-primary text-white font-bold rounded-xl">Skip & Auto-Fill Default</button>
                </div>
              </div>
            )}

            {onboardStep === 3 && (
              <div className="space-y-4">
                <h3 class="text-2xl font-bold text-white">Confirm Extracted Details</h3>
                <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <div class="space-y-1">
                    <label class="text-xs text-gray-400 font-bold">EXTRACTED EDUCATION</label>
                    <input type="text" value={onboardExtEdu} onChange={(e)=>setOnboardExtEdu(e.target.value)} class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-gray-400 font-bold">EXTRACTED SKILLS</label>
                    <input type="text" value={onboardExtSkills} onChange={(e)=>setOnboardExtSkills(e.target.value)} class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white" />
                  </div>
                </div>
                <button onClick={finalizeOnboarding} class="w-full py-3 bg-gradient-primary text-white font-bold rounded-xl flex items-center justify-center gap-1.5">
                  <CheckCircle2 class="h-4 w-4" /> Complete Onboarding
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLATFORM LAYOUT */}
      {activePage === 'platform' && (
        <div className="min-h-screen flex bg-darkBg overflow-hidden">
          
          {/* SIDEBAR */}
          <aside className="glass-panel border-r border-white/5 w-64 shrink-0 flex flex-col justify-between">
            <div>
              <div className="h-16 border-b border-white/5 flex items-center px-6 gap-3">
                <Compass className="h-7 w-7 text-primaryCyan shrink-0" />
                <span className="font-extrabold text-white text-md tracking-tight">GPS Console</span>
              </div>

              <div className="p-6 border-b border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold overflow-hidden">
                    {profile.avatar ? <img src={profile.avatar} class="h-full w-full object-cover" /> : 'AM'}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm truncate">{user?.name}</div>
                    <div className="text-xs text-cyan-400 font-semibold truncate">{profile.goal}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500 font-bold">
                    <span>Lvl {profile.level}</span>
                    <span>{profile.xp} / {profile.level * 1000} XP</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${(profile.xp / (profile.level * 1000)) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <nav className="p-4 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Layers },
                  { id: 'roadmap', label: 'Career Roadmap', icon: Compass },
                  { id: 'skills', label: 'Skill Intelligence', icon: BarChart2 },
                  { id: 'resume', label: 'Resume Analyzer', icon: FileText },
                  { id: 'jobs', label: 'Jobs Board', icon: Briefcase },
                  { id: 'crm', label: 'Kanban CRM', icon: Trello },
                  { id: 'interview', label: 'Interview Coach', icon: Mic },
                  { id: 'chat', label: 'AI Career Chat', icon: MessageSquare },
                  { id: 'profile', label: 'Profile & CV', icon: User },
                  { id: 'settings', label: 'Settings', icon: SettingsIcon }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${isActive ? 'bg-gradient-primary text-white shadow-md shadow-purple-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <Icon className="h-5 w-5" /> {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-white/5">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition">
                <LogOut className="h-5 w-5" /> Logout
              </button>
            </div>
          </aside>

          {/* CONTENT BODY */}
          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-darkBg/30 backdrop-blur-md sticky top-0 z-20">
              <span className="text-xs bg-cyan-500/10 text-cyan-400 font-bold px-2.5 py-1 rounded border border-cyan-500/20">
                ⚡ LOCAL BROWSER SANDBOX ACTIVE
              </span>
              <div className="text-right">
                <div className="text-xs text-gray-500">SIGNED IN AS</div>
                <div className="text-sm font-bold text-white">{user?.name}</div>
              </div>
            </header>

            <main className="p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
              
              {/* DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="rounded-3xl p-8 glass-panel relative overflow-hidden border-purple-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-extrabold text-white">Console Dashboard</h2>
                      <p className="text-gray-400 text-sm">Target track: <span className="text-cyan-400 font-bold">{profile.goal}</span>.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="rounded-2xl p-6 glass-panel space-y-2">
                      <span className="text-xs text-gray-500 font-bold uppercase block">Level</span>
                      <div className="text-3xl font-extrabold text-white">Level {profile.level}</div>
                    </div>
                    <div className="rounded-2xl p-6 glass-panel space-y-2">
                      <span className="text-xs text-gray-500 font-bold uppercase block">CRM applications</span>
                      <div className="text-3xl font-extrabold text-white">{applications.length} Active</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ROADMAP TAB */}
              {activeTab === 'roadmap' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white">Career Roadmap</h2>
                  <div className="space-y-8 pl-6 relative">
                    {roadmaps[0]?.steps.map((step, idx) => {
                      const isCompleted = step.status === 'completed';
                      return (
                        <div key={idx} className="roadmap-line flex flex-col md:flex-row gap-6 relative">
                          <div onClick={()=>handleToggleRoadmapStep(idx)} className={`absolute top-0 left-[-31px] h-6 w-6 rounded-full border-2 flex items-center justify-center z-10 cursor-pointer ${isCompleted ? 'bg-cyan-400 border-cyan-400' : 'bg-darkBg border-white/20'}`}>
                            {isCompleted && <Check className="h-3 w-3 text-black" />}
                          </div>
                          <div className={`flex-1 rounded-2xl p-6 glass-panel space-y-2 border ${isCompleted ? 'border-cyan-400/20 bg-cyan-500/5' : 'border-white/5'}`}>
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold text-white text-lg">{step.title}</h3>
                              <button onClick={()=>handleToggleRoadmapStep(idx)} className="text-xs bg-purple-500 text-white px-3 py-1.5 rounded-xl font-bold">
                                {isCompleted ? 'Completed' : 'Verify Certificate'}
                              </button>
                            </div>
                            <p className="text-sm text-gray-400">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RESUME TAB */}
              {activeTab === 'resume' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white">AI Resume Analyzer</h2>
                  <form onSubmit={handleAnalyzeResume} className="space-y-4 max-w-xl">
                    <textarea rows="6" value={resumeText} onChange={(e)=>setResumeText(e.target.value)} required placeholder="Paste CV markdown here..." class="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500" />
                    <button type="submit" className="px-6 py-3 bg-gradient-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90">
                      Evaluate ATS Score
                    </button>
                  </form>
                </div>
              )}

              {/* INTERVIEW TAB */}
              {activeTab === 'interview' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white">AI Interview Coach</h2>
                  {!currentInterview ? (
                    <div className="rounded-2xl p-8 glass-panel space-y-4 max-w-md">
                      <div className="space-y-1">
                        <label class="text-xs text-gray-400 font-bold block">LEVEL</label>
                        <select value={interviewLevel} onChange={(e)=>setInterviewLevel(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none">
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <button onClick={handleStartInterview} className="w-full py-3 bg-gradient-primary text-white font-bold rounded-xl">
                        Start Mock Session
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl p-6 glass-panel space-y-4 max-w-xl">
                      <div className="text-sm font-bold text-purple-400">Q: {currentInterview.questions[currentQuestionIdx]?.question}</div>
                      <textarea rows="4" value={answerInput} onChange={(e)=>setAnswerInput(e.target.value)} placeholder="Type answer..." class="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
                      <button onClick={handleSubmitInterviewAnswer} className="px-6 py-2.5 bg-gradient-primary text-white font-bold rounded-xl">
                        Submit Answer
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CHAT TAB */}
              {activeTab === 'chat' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-extrabold text-white">AI Chatbot</h2>
                    <select value={activeChatModel} onChange={(e)=>setActiveChatModel(e.target.value)} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-cyan-400 focus:outline-none">
                      <option value="gemini">Gemini 1.5</option>
                      <option value="gpt4">GPT-4</option>
                    </select>
                  </div>
                  <div className="rounded-2xl p-6 glass-panel h-[50vh] flex flex-col justify-between">
                    <div className="flex-1 overflow-y-auto space-y-4">
                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`p-4 rounded-xl text-sm ${msg.role === 'assistant' ? 'bg-white/5 text-gray-300' : 'bg-gradient-primary text-white'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-4">
                      <input type="text" value={chatMessage} onChange={(e)=>setChatMessage(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleSendChatMessage()} placeholder="Ask..." class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
                      <button onClick={handleSendChatMessage} className="px-5 py-3 bg-gradient-primary text-white rounded-xl"><Send className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      )}

      {/* ROADMAP VERIFICATION MODAL */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-darkBg rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">Verify Learning Step</h3>
            <div className="border-2 border-dashed border-white/10 p-6 text-center cursor-pointer relative rounded-xl">
              <input type="file" onChange={(e)=>setVerificationFileName(e.target.files[0]?.name||'')} class="absolute inset-0 opacity-0 cursor-pointer" />
              <span class="text-xs text-gray-400 block">Select Certification File</span>
              {verificationFileName && <span class="text-xs text-cyan-400 font-bold block mt-2">{verificationFileName}</span>}
            </div>
            <button onClick={confirmMilestoneVerification} className="w-full py-2.5 bg-gradient-primary text-white font-bold rounded-xl text-sm">
              Confirm Verification
            </button>
          </div>
        </div>
      )}

      {/* ATS CERTIFICATE SUCCESS MODAL */}
      {showAtsCertModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-purple-950/20 border border-yellow-500/30 rounded-3xl p-8 text-center space-y-4 backdrop-blur-md">
            <h3 className="text-2xl font-bold text-yellow-400">ATS Optimization Excellence</h3>
            <p className="text-xs text-gray-300">Awarded for achieving an ATS compatibility rating of {atsScore}% on the {profile.goal} track.</p>
            <button onClick={()=>setShowAtsCertModal(false)} className="px-6 py-2.5 bg-yellow-500 text-black font-bold rounded-xl text-xs">Close</button>
          </div>
        </div>
      )}

      {/* INTERVIEW CERTIFICATE SUCCESS MODAL */}
      {showInterviewCertModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-purple-950/20 border border-cyan-500/30 rounded-3xl p-8 text-center space-y-4 backdrop-blur-md">
            <h3 className="text-2xl font-bold text-cyan-400">Mock Interview Certification</h3>
            <p className="text-xs text-gray-300">Awarded for scoring an overall {interviewCertScore}% on the {interviewCertGoal} mock assessment.</p>
            <button onClick={()=>setShowInterviewCertModal(false)} className="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs">Close</button>
          </div>
        </div>
      )}

    </div>
  );
}
