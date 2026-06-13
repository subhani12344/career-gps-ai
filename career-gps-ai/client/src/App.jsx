import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Layers,
  FileText,
  Briefcase,
  Trello,
  Mic,
  MessageSquare,
  User,
  Settings as SettingsIcon,
  Bell,
  Award,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  BookOpen,
  Play,
  FileText as FileIcon,
  Globe,
  Loader2,
  ChevronDown,
  Check,
  Send,
  Upload,
  BarChart2,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Info,
  Menu,
  ChevronLeft
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

// Pre-seeded local data for standalone mode (if backend is offline)
const PRESEEDED_JOBS = [
  { _id: 'j1', title: 'Machine Learning Engineer', company: 'NeuralTech Inc', location: 'San Francisco, CA', description: 'Design and deploy core deep learning pipelines and neural network models.', skillsRequired: ['Python', 'PyTorch', 'Docker', 'Machine Learning'], salary: '$130,000 - $160,000' },
  { _id: 'j2', title: 'Full Stack Engineer (React/Node)', company: 'SaaSFlow Corp', location: 'Remote', description: 'Build premium landing pages and clean backends with optimized REST API design.', skillsRequired: ['React', 'Node.js', 'Express', 'TypeScript'], salary: '$115,000 - $140,000' },
  { _id: 'j3', title: 'AI Product Specialist', company: 'Cognitive Web Group', location: 'Boston, MA', description: 'Bridge LLM pipelines with beautiful UI experiences. Design system focus.', skillsRequired: ['Python', 'React', 'LangChain', 'Tailwind CSS'], salary: '$100,000 - $125,000' }
];

const PRESEEDED_RESOURCES = [
  { title: 'Deep Learning Specialization (Andrew Ng)', type: 'course', url: 'https://www.coursera.org/specializations/deep-learning', mappedSkills: ['Machine Learning', 'Neural Networks', 'PyTorch'] },
  { title: 'Next.js App Router Documentation', type: 'documentation', url: 'https://nextjs.org/docs', mappedSkills: ['React', 'Next.js', 'TypeScript'] },
  { title: 'LangChain: Chat with your Data Course', type: 'course', url: 'https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/', mappedSkills: ['LangChain', 'Vector Databases', 'Python'] },
  { title: 'Docker Containers Crash Course', type: 'video', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', mappedSkills: ['Docker', 'DevOps'] }
];

const PRESEEDED_ACHIEVEMENTS = [
  { title: 'Compass Finder', description: 'Registered your account and initiated Career GPS.', badgeIcon: 'Compass', unlockedAt: new Date().toISOString() },
  { title: 'Profile Architect', description: 'Completed filling education, goals, and interests.', badgeIcon: 'UserCheck', locked: true },
  { title: 'Resume Explorer', description: 'Analyzed your CV using ATS intelligence.', badgeIcon: 'FileText', locked: true },
  { title: 'Speech Master', description: 'Completed a simulated mock interview with the AI.', badgeIcon: 'Mic', locked: true }
];

export default function App() {
  // Navigation & Auth
  const [activePage, setActivePage] = useState('landing');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Core Data State
  const [profile, setProfile] = useState({
    goal: 'AI Engineer',
    skills: ['Python', 'JavaScript', 'HTML/CSS', 'Git'],
    interests: ['Machine Learning', 'Web Development'],
    education: [{ school: 'Stanford University', degree: 'BS', fieldOfStudy: 'Computer Science', startYear: '2021', endYear: '2025' }],
    experience: [{ company: 'Tech Corp', position: 'Intern', duration: '3 months', description: 'Assisted in building Python REST APIs.' }],
    location: 'San Francisco, CA',
    xp: 250,
    level: 1
  });
  
  const [roadmaps, setRoadmaps] = useState([]);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [jobs, setJobs] = useState(PRESEEDED_JOBS);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([
    { _id: 'n1', title: '👋 Welcome to Career GPS AI!', message: 'Explore your dashboard, set your goal, and analyze your CV.', type: 'info', read: false }
  ]);
  const [achievements, setAchievements] = useState(PRESEEDED_ACHIEVEMENTS);
  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  // Settings
  const [darkMode, setDarkMode] = useState(true);
  const [settings, setSettings] = useState({ theme: 'dark', emailNotifications: true, pushNotifications: true, aiPreferences: { modelType: 'Gemini' } });

  // Notifications dropdown
  const [showNotifications, setShowNotifications] = useState(false);

  // Tasks Checklist
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Generate an AI Roadmap for your target goal', completed: false, xp: 100 },
    { id: 2, text: 'Perform your first ATS resume check', completed: false, xp: 150 },
    { id: 3, text: 'Start a Mock Interview practice session', completed: false, xp: 200 },
    { id: 4, text: 'Drag a Job application to the "Interview" stage', completed: false, xp: 100 }
  ]);

  // Chat page states
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Career Coach. Ask me anything about skills, roadmaps, resume optimizations, or interviews!' }
  ]);
  const chatEndRef = useRef(null);

  // Interview Page States
  const [interviewRole, setInterviewRole] = useState('AI Engineer');
  const [currentInterview, setCurrentInterview] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [interviewHistory, setInterviewHistory] = useState([]);

  // Resume Page States
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  // CRM Add Modal
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [crmTitle, setCrmTitle] = useState('');
  const [crmCompany, setCrmCompany] = useState('');
  const [crmNotes, setCrmNotes] = useState('');

  // Detect server status and initialize client
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(`${API_BASE.replace('/api', '')}/health`);
        if (res.ok) {
          setApiOnline(true);
          console.log('🔗 Connected to Express Server!');
        } else {
          setApiOnline(false);
        }
      } catch (err) {
        setApiOnline(false);
        console.log('⚠️ Server offline, operating in Standalone Mock Mode.');
      }
    };
    checkApi();
  }, [token]);

  // Fetch standard data on login
  useEffect(() => {
    if (user && token && apiOnline) {
      fetchDashboardData();
    } else if (user) {
      // Load mock roadmaps, applications, etc from localStorage if exists
      const savedApps = localStorage.getItem('applications');
      if (savedApps) setApplications(JSON.parse(savedApps));
      const savedRoadmaps = localStorage.getItem('roadmaps');
      if (savedRoadmaps) setRoadmaps(JSON.parse(savedRoadmaps));
    }
  }, [user, token, apiOnline]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const meRes = await fetch(`${API_BASE}/auth/me`, { headers });
      const meData = await meRes.json();
      if (meData.success) {
        setProfile(meData.profile);
        setSettings(meData.settings);
      }

      const rdRes = await fetch(`${API_BASE}/roadmap`, { headers });
      const rdData = await rdRes.json();
      if (rdData.success) setRoadmaps(rdData.roadmaps);

      const appRes = await fetch(`${API_BASE}/applications`, { headers });
      const appData = await appRes.json();
      if (appData.success) setApplications(appData.applications);

      const notifRes = await fetch(`${API_BASE}/notifications`, { headers });
      const notifData = await notifRes.json();
      if (notifData.success) setNotifications(notifData.notifications);

      const achRes = await fetch(`${API_BASE}/achievements`, { headers });
      const achData = await achRes.json();
      if (achData.success) setAchievements(achData.achievements);

      const skillRes = await fetch(`${API_BASE}/skills/gap`, { headers });
      const skillData = await skillRes.json();
      if (skillData.success) setGapAnalysis(skillData.analysis);

    } catch (err) {
      console.error('Error fetching API dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to handle actions in both modes
  const request = async (endpoint, method = 'GET', body = null) => {
    if (apiOnline && token) {
      try {
        const config = {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        if (body) config.body = JSON.stringify(body);
        const res = await fetch(`${API_BASE}${endpoint}`, config);
        return await res.json();
      } catch (err) {
        console.error(`API Request to ${endpoint} failed:`, err);
        return { success: false, error: err.message };
      }
    }
    return { success: false, mode: 'standalone' };
  };

  // Auth Operations
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (apiOnline) {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: regName, email: regEmail, password: regPassword })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          setActivePage('dashboard');
          addNotification('Welcome aboard!', 'You successfully registered your Career GPS profile.', 'success');
        } else {
          setErrorMsg(data.error || 'Registration failed');
        }
      } catch (err) {
        setErrorMsg('Could not contact authentication server.');
      } finally {
        setLoading(false);
      }
    } else {
      // Standalone Mock Auth
      const mockUser = { id: 'u_' + Math.random().toString(36).substr(2, 5), name: regName || 'Alex Mercer', email: regEmail };
      localStorage.setItem('token', 'mock_jwt_token_xyz');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setToken('mock_jwt_token_xyz');
      setUser(mockUser);
      setActivePage('dashboard');
      setLoading(false);
      addNotification('Welcome aboard (Standalone Mode)!', 'Your profile database has been seeded in local storage.', 'success');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (apiOnline) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          setActivePage('dashboard');
        } else {
          setErrorMsg(data.error || 'Invalid credentials');
        }
      } catch (err) {
        setErrorMsg('Authentication server is unreachable.');
      } finally {
        setLoading(false);
      }
    } else {
      // Standalone Login
      const mockUser = { id: 'u_123', name: 'Alex Mercer', email: loginEmail || 'alex@gmail.com' };
      localStorage.setItem('token', 'mock_jwt_token_xyz');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setToken('mock_jwt_token_xyz');
      setUser(mockUser);
      setActivePage('dashboard');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser = { id: 'u_goog', name: 'Alex Mercer', email: 'alex.mercer@gmail.com' };
      localStorage.setItem('token', 'google_mock_jwt');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setToken('google_mock_jwt');
      setUser(mockUser);
      setActivePage('dashboard');
      setLoading(false);
      addNotification('Logged in with Google', 'Authentication was parsed successfully.', 'success');
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setRoadmaps([]);
    setApplications([]);
    setActivePage('landing');
  };

  // Gamification helpers
  const awardXP = (amount, taskMessage = '') => {
    setProfile(prev => {
      let nextXP = prev.xp + amount;
      let nextLevel = prev.level;
      const xpNeeded = nextLevel * 1000;
      let leveledUp = false;

      if (nextXP >= xpNeeded) {
        nextXP = nextXP - xpNeeded;
        nextLevel += 1;
        leveledUp = true;
      }

      if (leveledUp) {
        addNotification('🎉 Level Up!', `Incredible job! You achieved Level ${nextLevel}!`, 'achievement');
      } else if (taskMessage) {
        addNotification('XP Earned!', `+${amount} XP: ${taskMessage}`, 'success');
      }

      return { ...prev, xp: nextXP, level: nextLevel };
    });
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      _id: 'n_' + Math.random().toString(36).substr(2, 5),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Tasks Checklist Handler
  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          awardXP(t.xp, t.text);
          // Unlock achievement check
          if (id === 1) unlockAchievement('AI Navigator');
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    }));
  };

  const unlockAchievement = (title) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.title === title && ach.locked) {
        addNotification('🏆 Achievement Unlocked!', `Unlocked Badge: ${title}`, 'achievement');
        return { ...ach, locked: false, unlockedAt: new Date().toISOString() };
      }
      return ach;
    }));
  };

  // 2. Career Roadmap Engine
  const generateMockRoadmap = async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(async () => {
      let steps = [];
      if (profile.goal.toLowerCase().includes('ai') || profile.goal.toLowerCase().includes('machine')) {
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

      const newRoadmap = {
        _id: 'r_' + Math.random().toString(36).substr(2, 5),
        goal: profile.goal,
        title: `GPS Guide: ${profile.goal} Career Roadmap`,
        steps
      };

      setRoadmaps([newRoadmap]);
      localStorage.setItem('roadmaps', JSON.stringify([newRoadmap]));
      setLoading(false);
      unlockAchievement('AI Navigator');
      addNotification('Roadmap Generated', `AI generated a 6-month roadmap for ${profile.goal}.`, 'success');
    }, 1200);
  };

  const handleGenerateRoadmap = async () => {
    if (apiOnline) {
      setLoading(true);
      try {
        const res = await request('/roadmap/generate', 'POST', { goal: profile.goal });
        if (res.success) {
          setRoadmaps([res.roadmap]);
          unlockAchievement('AI Navigator');
          addNotification('Roadmap Generated', `AI generated a 6-month roadmap for ${profile.goal}.`, 'success');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      generateMockRoadmap();
    }
  };

  const handleToggleRoadmapStep = async (roadmapId, stepIndex) => {
    const roadmap = roadmaps.find(r => r._id === roadmapId);
    if (!roadmap) return;

    const steps = [...roadmap.steps];
    const step = steps[stepIndex];
    const oldStatus = step.status;
    const nextStatus = oldStatus === 'completed' ? 'pending' : 'completed';
    step.status = nextStatus;

    if (apiOnline) {
      try {
        const res = await request(`/roadmap/${roadmapId}/step`, 'PUT', { stepId: step.month || step._id, status: nextStatus });
        if (res.success) {
          setRoadmaps([res.roadmap]);
          if (nextStatus === 'completed') {
            awardXP(150, `Completed roadmap milestone: ${step.title}`);
            // Update profile skills
            const updatedSkills = Array.from(new Set([...profile.skills, ...step.skills]));
            setProfile(p => ({ ...p, skills: updatedSkills }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Mock Roadmap update
      setRoadmaps([{ ...roadmap, steps }]);
      localStorage.setItem('roadmaps', JSON.stringify([{ ...roadmap, steps }]));
      if (nextStatus === 'completed') {
        awardXP(150, `Completed roadmap milestone: ${step.title}`);
        const updatedSkills = Array.from(new Set([...profile.skills, ...step.skills]));
        setProfile(p => ({ ...p, skills: updatedSkills }));
      }
    }
  };

  // 3. Resume ATS Analyzer
  const handleUploadResume = (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setLoading(true);
    setTimeout(() => {
      // Generate a mock ATS review score
      const goalLower = profile.goal.toLowerCase();
      const textLower = resumeText.toLowerCase();

      let matchedCount = 0;
      let targetKeywords = [];
      if (goalLower.includes('ai') || goalLower.includes('machine')) {
        targetKeywords = ['python', 'pytorch', 'machine learning', 'transformers', 'docker', 'langchain'];
      } else {
        targetKeywords = ['react', 'node.js', 'typescript', 'postgres', 'docker', 'nginx'];
      }

      targetKeywords.forEach(kw => {
        if (textLower.includes(kw)) matchedCount++;
      });

      const score = Math.min(92, 50 + (matchedCount * 8));
      const missing = targetKeywords.filter(kw => !textLower.includes(kw));

      const analysis = {
        atsScore: score,
        feedback: [
          'Add quantitative achievements to your CV bullets (e.g. "reduced latency by 20%").',
          'Make sure your tech stack is displayed at the top section under formatted tags.',
          'Summary paragraph should highlight specific frameworks matching the target role: ' + profile.goal
        ],
        missingSkills: missing.length > 0 ? missing : ['Docker', 'Git Pipelines', 'AWS Deployment']
      };

      setResumeAnalysis(analysis);
      setLoading(false);
      unlockAchievement('Resume Explorer');
      addNotification('Resume Evaluated', `ATS Score computed: ${score}%`, 'success');
    }, 1500);
  };

  // 4. Job Board & CRM Tracker
  const handleImportJobToCRM = (job) => {
    const newApp = {
      _id: 'a_' + Math.random().toString(36).substr(2, 5),
      title: job.title,
      company: job.company,
      status: 'applied',
      appliedDate: new Date().toISOString(),
      notes: job.description
    };
    setApplications(prev => {
      const next = [...prev, newApp];
      localStorage.setItem('applications', JSON.stringify(next));
      return next;
    });
    addNotification('Job Tracked', `Added "${job.title}" at ${job.company} to your Kanban CRM pipeline.`, 'success');
  };

  const handleUpdateCRMStatus = (appId, nextStatus) => {
    setApplications(prev => {
      const next = prev.map(app => {
        if (app._id === appId) {
          // If moving to interview, complete checklist task
          if (nextStatus === 'interview') {
            const task = tasks.find(t => t.id === 4);
            if (task && !task.completed) {
              toggleTask(4);
            }
          }
          if (nextStatus === 'selected') {
            unlockAchievement('Offer Getter');
            awardXP(500, 'Landed job offer!');
          }
          return { ...app, status: nextStatus };
        }
        return app;
      });
      localStorage.setItem('applications', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteCRMCard = (appId) => {
    setApplications(prev => {
      const next = prev.filter(app => app._id !== appId);
      localStorage.setItem('applications', JSON.stringify(next));
      return next;
    });
    addNotification('Application Removed', 'Job application CRM card deleted.', 'warning');
  };

  const handleCreateCRMApplication = (e) => {
    e.preventDefault();
    if (!crmTitle || !crmCompany) return;

    const newApp = {
      _id: 'a_' + Math.random().toString(36).substr(2, 5),
      title: crmTitle,
      company: crmCompany,
      status: 'applied',
      appliedDate: new Date().toISOString(),
      notes: crmNotes
    };

    setApplications(prev => {
      const next = [...prev, newApp];
      localStorage.setItem('applications', JSON.stringify(next));
      return next;
    });

    setCrmTitle('');
    setCrmCompany('');
    setCrmNotes('');
    setShowCRMModal(false);
    addNotification('Application Created', `Added ${crmTitle} to Applied column.`, 'success');
  };

  // 5. AI Technical Interview Coach
  const handleStartInterview = () => {
    setLoading(true);
    setTimeout(() => {
      let questions = [];
      if (interviewRole.toLowerCase().includes('ai') || interviewRole.toLowerCase().includes('machine')) {
        questions = [
          { question: 'What is the main advantage of the Self-Attention mechanism compared to recurrent structures (LSTMs)?', questionType: 'technical', answer: '', feedback: '', rating: 0 },
          { question: 'Explain the difference between L1 (Lasso) and L2 (Ridge) regularization and when you would select one over the other.', questionType: 'technical', answer: '', feedback: '', rating: 0 },
          { question: 'Write a Python function to compute the cosine similarity between two 1D NumPy arrays.', questionType: 'coding', answer: '', feedback: '', rating: 0 },
          { question: 'How would you explain a complex neural network prediction to a non-technical project stakeholder?', questionType: 'hr', answer: '', feedback: '', rating: 0 },
          { question: 'What steps do you take when a training accuracy is high but validation loss starts diverging upward?', questionType: 'technical', answer: '', feedback: '', rating: 0 }
        ];
      } else {
        questions = [
          { question: 'Explain what the Virtual DOM is and how React optimizes UI updates.', questionType: 'technical', answer: '', feedback: '', rating: 0 },
          { question: 'What is the N+1 query problem, and how do you resolve it in relational database integrations?', questionType: 'technical', answer: '', feedback: '', rating: 0 },
          { question: 'Write a JavaScript function to throttle an input callback routine.', questionType: 'coding', answer: '', feedback: '', rating: 0 },
          { question: 'Describe a challenging engineering bug you encountered and how you solved it.', questionType: 'hr', answer: '', feedback: '', rating: 0 },
          { question: 'What is CORS, and how does Nginx or Express configuration address browser header blocks?', questionType: 'technical', answer: '', feedback: '', rating: 0 }
        ];
      }

      setCurrentInterview({
        jobTitle: interviewRole,
        questions,
        overallScore: 0,
        status: 'pending'
      });
      setCurrentQuestionIdx(0);
      setAnswerInput('');
      setLoading(false);
      addNotification('Interview Loaded', 'Mock interview coach initialized with 5 questions.', 'success');
    }, 1000);
  };

  const handleSubmitInterviewAnswer = () => {
    if (!answerInput.trim() || !currentInterview) return;

    setLoading(true);
    setTimeout(() => {
      const length = answerInput.length;
      let rating = 2;
      let feedback = 'Your answer is brief. Include more technical keywords, frameworks, or code contexts to justify your point.';
      
      if (length > 150) {
        rating = 5;
        feedback = 'Exceptional answer! You demonstrated complete conceptual accuracy, discussed mechanics, and showed clear mastery.';
      } else if (length > 70) {
        rating = 4;
        feedback = 'Good answer. You hit the key conceptual terms. For a better rating, elaborate on a real-world scenario where you applied it.';
      } else if (length > 30) {
        rating = 3;
        feedback = 'Correct direction but lacks depth. Mention concrete APIs or architectural parameters to demonstrate experience.';
      }

      const updatedQuestions = currentInterview.questions.map((q, i) => {
        if (i === currentQuestionIdx) {
          return { ...q, answer: answerInput, rating, feedback };
        }
        return q;
      });

      const nextQuestionIdx = currentQuestionIdx + 1;
      const allDone = nextQuestionIdx >= currentInterview.questions.length;
      let overallScore = 0;
      let status = 'pending';

      if (allDone) {
        status = 'completed';
        const totalRating = updatedQuestions.reduce((acc, q) => acc + q.rating, 0);
        overallScore = Math.round((totalRating / (updatedQuestions.length * 5)) * 100);
        unlockAchievement('Speech Master');
        awardXP(300, 'Finished mock interview coaching session');
      }

      setCurrentInterview(prev => ({
        ...prev,
        questions: updatedQuestions,
        overallScore,
        status
      }));

      setCurrentQuestionIdx(nextQuestionIdx);
      setAnswerInput('');
      setLoading(false);
    }, 1200);
  };

  // 6. 24/7 AI Chatbot
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMsg = { role: 'user', text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    const input = chatMessage;
    setChatMessage('');

    setTimeout(() => {
      let reply = "I'm your 24/7 AI Career Coach. Ask me anything about skills, roadmaps, mock tests, or resumes.";
      const msg = input.toLowerCase();

      if (msg.includes('learn') || msg.includes('roadmap') || msg.includes('career')) {
        reply = `To become a professional ${profile.goal}, you should review the Roadmap tab! First learn core structures, then build projects, and map out your targets. I suggest studying ${profile.goal.includes('AI') ? 'Python and PyTorch' : 'React and Node.js'}.`;
      } else if (msg.includes('resume') || msg.includes('cv') || msg.includes('ats')) {
        reply = "A great resume needs to pass ATS algorithms. Upload your resume onto our ATS scan tool to calculate your optimization score, extract missing keywords, and get detailed critique layout logs.";
      } else if (msg.includes('interview') || msg.includes('mock')) {
        reply = "Practice makes perfect! Load the AI Interview Coach page, select your target role, and answer technical and HR questions to receive instant star scores and structured critique logs.";
      } else if (msg.includes('project') || msg.includes('portfolio')) {
        reply = `For a strong ${profile.goal} portfolio, build 3 functional systems. Example: ${profile.goal.includes('AI') ? 'a PDF RAG Chatbot, a PyTorch Neural Net from scratch, or an automated EDA Dashboard.' : 'a Real-time WebSocket Whiteboard, an e-commerce backend API, or a Kanban Board.'}`;
      }

      setChatHistory(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 1000);
  };

  // Profile Form Saver
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    addNotification('Profile Saved', 'Career profile configurations successfully updated.', 'success');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      
      {/* 1. LANDING PAGE VIEW */}
      {activePage === 'landing' && (
        <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
          {/* Neon background blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          {/* Header */}
          <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Compass className="h-6 w-6 text-white animate-spin-slow" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">Career GPS <span className="text-primaryCyan">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setActivePage('login')} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">Sign In</button>
              <button onClick={() => setActivePage('register')} className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-primary text-white shadow-lg shadow-purple-500/20 hover:opacity-90 hover:scale-105 transition duration-200">Get Started</button>
            </div>
          </header>

          {/* Hero */}
          <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs text-primaryCyan border border-cyan-500/30 animate-pulse">
                <ShieldCheck className="h-3.5 w-3.5" /> Next-Gen AI Career Steering Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
                Navigate Your Tech Journey with <span className="text-gradient">GPS AI</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl mx-auto lg:mx-0">
                Stop guessing your learning path. Create AI-powered personalized roadmaps, evaluate resumes, grade technical interviews, and track applications.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button onClick={() => setActivePage('register')} className="px-8 py-4 font-bold rounded-2xl bg-gradient-primary text-white shadow-xl shadow-purple-500/25 hover:scale-105 transition duration-200 glow-btn">
                  Start Your GPS Guide
                </button>
                <a href="#features" className="px-6 py-4 font-semibold text-gray-400 hover:text-white transition duration-200">
                  See How It Works
                </a>
              </div>

              {/* Stack items */}
              <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400" /> Roadmap Engine</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400" /> ATS Resume Scan</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400" /> Interview Speech Sandbox</div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center">
              {/* Decorative Hero Widget Card */}
              <div className="w-full max-w-[480px] rounded-3xl p-6 glass-panel shadow-2xl relative border-white/10 hover:border-purple-500/30 transition duration-300">
                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-purple-500 blur-md opacity-50 animate-pulse" />
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">GPS Assistant</div>
                      <div className="text-xs text-primaryCyan font-semibold">Generating Path...</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Lvl 1</span>
                </div>

                <div className="py-6 space-y-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">TARGET CAREER GOAL</div>
                    <div className="text-md font-extrabold text-white">AI Engineer / Full-Stack</div>
                  </div>
                  
                  {/* Skill loading bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-400">
                      <span>ATS Match Rate</span>
                      <span className="text-cyan-400">82%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4 border border-white/5 space-y-2">
                    <div className="text-xs text-purple-400 font-bold flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" /> Next Steps:
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      "Master PyTorch neural network builds in Month 3 to fill a crucial engineering knowledge gap."
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button onClick={() => setActivePage('register')} className="w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-2">
                    Access Dashboard <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-6 border-t border-white/5 text-center text-xs text-gray-600 z-10">
            © 2026 Career GPS AI platform. Google DeepMind pair programming sandbox.
          </footer>
        </div>
      )}

      {/* 2. AUTHENTICATION PAGES (LOGIN / REGISTER) */}
      {(activePage === 'login' || activePage === 'register') && (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />
          
          <div className="w-full max-w-md rounded-3xl p-8 glass-panel shadow-2xl relative border-white/10 space-y-6">
            <button onClick={() => setActivePage('landing')} className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1 text-xs">
              <ChevronLeft className="h-4 w-4" /> Home
            </button>
            <div className="text-center space-y-2 pt-4">
              <h2 className="text-3xl font-extrabold text-white">
                {activePage === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-xs text-gray-400">
                {activePage === 'login' ? 'Access your AI career guidance console' : 'Start tracking goals, gaps, and mock interview grades'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" /> {errorMsg}
              </div>
            )}

            <form onSubmit={activePage === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {activePage === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold">NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none text-sm text-white"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="alex@gmail.com"
                  value={activePage === 'login' ? loginEmail : regEmail}
                  onChange={(e) => activePage === 'login' ? setLoginEmail(e.target.value) : setRegEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold">PASSWORD</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={activePage === 'login' ? loginPassword : regPassword}
                  onChange={(e) => activePage === 'login' ? setLoginPassword(e.target.value) : setRegPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none text-sm text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-primary text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:opacity-90 transition duration-200 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : activePage === 'login' ? 'Sign In' : 'Register Account'}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-xs font-semibold">OR CONTINUOUS FLOW</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Mock Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <Globe className="h-4 w-4 text-cyan-400 animate-spin-slow" /> Sign In with Google (Instant Sync)
            </button>

            <div className="text-center pt-2">
              <button
                onClick={() => setActivePage(activePage === 'login' ? 'register' : 'login')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold underline"
              >
                {activePage === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CORE APPLICATION LAYOUT (DASHBOARD HUB, ROADMAPS, ETC) */}
      {user && (
        <div className="min-h-screen flex bg-darkBg overflow-hidden">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className={`glass-panel border-r border-white/5 transition-all duration-300 z-30 shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <Compass className="h-7 w-7 text-primaryCyan animate-spin-slow shrink-0" />
                {isSidebarOpen && <span className="font-extrabold text-white text-md tracking-tight">GPS Console</span>}
              </div>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400">
                <Menu className="h-4 w-4" />
              </button>
            </div>

            {/* User Profile Summary */}
            {isSidebarOpen && (
              <div className="p-6 border-b border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                    {user.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-white text-sm truncate">{user.name}</div>
                    <div className="text-xs text-cyan-400 font-semibold truncate">{profile.goal}</div>
                  </div>
                </div>
                {/* Level status */}
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
            )}

            {/* Sidebar navigation links */}
            <nav className="p-4 space-y-1">
              {[
                { name: 'Dashboard', icon: Layers, page: 'dashboard' },
                { name: 'Career Roadmap', icon: Compass, page: 'roadmap' },
                { name: 'Skill Intelligence', icon: BarChart2, page: 'skills' },
                { name: 'Resume Analyzer', icon: FileText, page: 'resume' },
                { name: 'Jobs Board', icon: Briefcase, page: 'jobs' },
                { name: 'Kanban CRM', icon: Trello, page: 'applications' },
                { name: 'Interview Coach', icon: Mic, page: 'interview' },
                { name: 'AI Career Chat', icon: MessageSquare, page: 'chatbot' },
                { name: 'Profile & CV', icon: User, page: 'profile' },
                { name: 'Settings', icon: SettingsIcon, page: 'settings' }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.page;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActivePage(item.page)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${isActive ? 'bg-gradient-primary text-white shadow-md shadow-purple-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </button>
                );
              })}
            </nav>

            {/* Logout bottom button */}
            <div className="p-4 border-t border-white/5 absolute bottom-0 left-0 right-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </aside>

          {/* MAIN CONTAINER */}
          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            
            {/* PLATFORM HEADER */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-darkBg/30 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-cyan-500/10 text-cyan-400 font-bold px-2 py-1 rounded border border-cyan-500/20">
                  {apiOnline ? '🔗 API CONNECTED' : '⚡ STANDALONE CLIENT'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Notifications dropdown */}
                <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 relative">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n=>!n.read).length > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl p-4 glass-panel shadow-2xl border-white/10 space-y-3 z-50">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="font-bold text-sm text-white">Notifications</span>
                        <button onClick={() => {
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                          setShowNotifications(false);
                        }} className="text-xs text-cyan-400 hover:underline">Mark all read</button>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {notifications.map(n => (
                          <div key={n._id} className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs ${!n.read ? 'border-l-2 border-l-cyan-400' : ''}`}>
                            <div className="font-bold text-white flex items-center justify-between">
                              <span>{n.title}</span>
                              {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                            </div>
                            <p className="text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-8 border-l border-white/10" />

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-gray-500">SIGNED IN AS</div>
                    <div className="text-sm font-bold text-white">{user.name}</div>
                  </div>
                </div>
              </div>
            </header>

            {/* DYNAMIC SCREEN RENDERS */}
            <main className="p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
              
              {/* SCREEN 1: DASHBOARD HUB */}
              {activePage === 'dashboard' && (
                <div className="space-y-8">
                  {/* Dashboard header card banner */}
                  <div className="rounded-3xl p-8 glass-panel relative overflow-hidden border-purple-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
                    <div className="space-y-2">
                      <h2 className="text-3xl font-extrabold text-white">Console Dashboard</h2>
                      <p className="text-gray-400 text-sm">
                        Welcome back, <span className="font-bold text-white">{user.name}</span>. Target track is configured to <span className="text-cyan-400 font-extrabold">{profile.goal}</span>.
                      </p>
                    </div>
                    {roadmaps.length === 0 ? (
                      <button onClick={handleGenerateRoadmap} className="px-6 py-3 bg-gradient-primary text-white font-bold rounded-2xl shadow-lg shadow-purple-500/25 hover:opacity-90 flex items-center gap-2">
                        <Compass className="h-5 w-5 animate-spin-slow" /> Generate AI Roadmap
                      </button>
                    ) : (
                      <button onClick={() => setActivePage('roadmap')} className="px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold rounded-2xl border border-purple-500/30 flex items-center gap-2 transition">
                        View Active Roadmap <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Core stats grid widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* 1. Level progress widget */}
                    <div className="rounded-2xl p-6 glass-panel space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold">XP PROGRESS</span>
                        <Award className="h-5 w-5 text-purple-400 animate-bounce" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-extrabold text-white">Level {profile.level}</div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{profile.xp} XP</span>
                          <span>{profile.level * 1000} XP needed</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${(profile.xp / (profile.level * 1000)) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Roadmap progress widget */}
                    <div className="rounded-2xl p-6 glass-panel space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold">ROADMAP STEPS</span>
                        <Compass className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="space-y-2">
                        {roadmaps.length > 0 ? (
                          <>
                            <div className="text-3xl font-extrabold text-white">
                              {roadmaps[0].steps.filter(s => s.status === 'completed').length} / {roadmaps[0].steps.length}
                            </div>
                            <p className="text-xs text-gray-400">Milestones completed. Keep pushing!</p>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-extrabold text-gray-500">Not Started</div>
                            <p className="text-xs text-gray-400">No active roadmap generated.</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 3. Job board tracking crm numbers */}
                    <div className="rounded-2xl p-6 glass-panel space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold">JOB APPLICATIONS</span>
                        <Trello className="h-5 w-5 text-pink-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-extrabold text-white">{applications.length} Active</div>
                        <div className="flex gap-3 text-xs text-gray-400">
                          <span>Applied: {applications.filter(a=>a.status === 'applied').length}</span>
                          <span>Interviews: {applications.filter(a=>a.status === 'interview').length}</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Latest ATS score card */}
                    <div className="rounded-2xl p-6 glass-panel space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold">LATEST ATS SCORE</span>
                        <FileText className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-extrabold text-white">
                          {resumeAnalysis ? `${resumeAnalysis.atsScore}%` : 'N/A'}
                        </div>
                        <p className="text-xs text-gray-400">
                          {resumeAnalysis ? 'Resume optimized & scored' : 'No CV analyzed yet'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Split checklist panel vs suggestion widgets */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Checklist Panel */}
                    <div className="lg:col-span-2 rounded-2xl p-6 glass-panel space-y-4">
                      <h3 className="font-bold text-lg text-white">Daily Learning Tasks</h3>
                      <div className="space-y-3">
                        {tasks.map(task => (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:border-purple-500/30 transition duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${task.completed ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-white/20'}`}>
                                {task.completed && <Check className="h-3.5 w-3.5" />}
                              </div>
                              <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>{task.text}</span>
                            </div>
                            <span className="text-xs bg-purple-500/10 text-purple-400 font-bold px-2 py-1 rounded">+{task.xp} XP</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggestions widget & achievements */}
                    <div className="space-y-6">
                      <div className="rounded-2xl p-6 glass-panel space-y-3 border-l-4 border-l-cyan-400">
                        <div className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
                          <Compass className="h-4 w-4 shrink-0" /> AI GPS ADVISOR
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          "Based on your track target of <span className="text-white font-bold">{profile.goal}</span>, you lack containerization knowledge. Practice writing Dockerfiles to pass initial ATS resume screenings."
                        </p>
                        <button onClick={() => setActivePage('skills')} className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1 pt-1">
                          Fix Skill Gap <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Achievements unlocked showcase list */}
                      <div className="rounded-2xl p-6 glass-panel space-y-4">
                        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Achievements</h3>
                        <div className="grid grid-cols-4 gap-3">
                          {achievements.map(ach => (
                            <div key={ach.title} title={`${ach.title}: ${ach.description}`} className={`flex flex-col items-center p-2 rounded-xl border border-white/5 text-center ${ach.locked ? 'opacity-30 bg-black/40' : 'bg-purple-500/5 border-purple-500/20'}`}>
                              <Award className={`h-6 w-6 ${ach.locked ? 'text-gray-600' : 'text-purple-400'}`} />
                              <span className="text-[9px] text-gray-400 mt-1 truncate w-full">{ach.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 2: CAREER ROADMAP GENERATOR */}
              {activePage === 'roadmap' && (
                <div className="space-y-6">
                  <div className="rounded-3xl p-8 glass-panel relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-extrabold text-white">AI Career Roadmap</h2>
                      <p className="text-gray-400 text-sm">Targeting: <span className="font-bold text-white">{profile.goal}</span></p>
                    </div>
                    <button onClick={handleGenerateRoadmap} className="px-6 py-3 bg-gradient-primary text-white font-bold rounded-2xl hover:opacity-90 flex items-center gap-2">
                      <Compass className="h-5 w-5 animate-spin-slow" /> Regenerate AI Roadmap
                    </button>
                  </div>

                  {roadmaps.length === 0 ? (
                    <div className="rounded-2xl p-12 glass-panel text-center space-y-4 max-w-xl mx-auto">
                      <Compass className="h-16 w-16 text-gray-600 mx-auto animate-pulse" />
                      <h3 className="text-xl font-bold text-white">No Roadmap Generated</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        To construct a customized path detailing skills, project templates, and study references month-by-month, trigger the generator.
                      </p>
                      <button onClick={handleGenerateRoadmap} className="px-6 py-3 bg-gradient-primary text-white font-bold rounded-2xl hover:opacity-90">
                        Generate Track Path Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8 relative pl-6">
                      {roadmaps[0].steps.map((step, idx) => (
                        <div key={idx} className="roadmap-line flex flex-col md:flex-row gap-6 relative">
                          {/* Connected timeline circle dot node */}
                          <div className={`absolute top-0 left-[-31px] h-6 w-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${step.status === 'completed' ? 'bg-cyan-400 border-cyan-400 text-black' : 'bg-darkBg border-white/20 text-gray-500'}`}>
                            {step.status === 'completed' && <Check className="h-3 w-3" />}
                          </div>

                          {/* Node container glass card */}
                          <div className={`flex-1 rounded-2xl p-6 glass-panel space-y-4 border ${step.status === 'completed' ? 'border-cyan-400/20 bg-cyan-500/5' : 'border-white/5'}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div>
                                <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{step.month}</span>
                                <h3 className="text-lg font-bold text-white mt-1">{step.title}</h3>
                              </div>
                              <button
                                onClick={() => handleToggleRoadmapStep(roadmaps[0]._id, idx)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${step.status === 'completed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-purple-500 text-white hover:opacity-90'}`}
                              >
                                {step.status === 'completed' ? 'Completed' : 'Mark Complete'}
                              </button>
                            </div>

                            <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>

                            {/* Skills Tag Pills */}
                            <div className="flex flex-wrap gap-2">
                              {step.skills.map(skill => (
                                <span key={skill} className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/5">
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Resources & Projects splits */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                              {/* Learning materials links list */}
                              <div className="rounded-xl bg-white/5 p-4 border border-white/5 space-y-2.5">
                                <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase">
                                  <BookOpen className="h-3.5 w-3.5" /> Study Materials
                                </div>
                                <div className="space-y-1.5">
                                  {step.resources?.map((res, rIdx) => (
                                    <a key={rIdx} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-xs text-gray-300 hover:text-white group">
                                      <span className="truncate group-hover:underline flex items-center gap-1">🧭 {res.title}</span>
                                      <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase">{res.type}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>

                              {/* Portfolio custom projects */}
                              <div className="rounded-xl bg-white/5 p-4 border border-white/5 space-y-2.5">
                                <div className="text-xs font-bold text-pink-400 flex items-center gap-1.5 uppercase">
                                  <Layers className="h-3.5 w-3.5" /> Portfolio Build
                                </div>
                                <div className="space-y-1.5">
                                  {step.projects?.map((proj, pIdx) => (
                                    <div key={pIdx}>
                                      <div className="font-bold text-xs text-white flex justify-between">
                                        <span>{proj.title}</span>
                                        <span className="text-[9px] text-pink-400 uppercase">{proj.difficulty}</span>
                                      </div>
                                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{proj.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 3: SKILL INTELLIGENCE */}
              {activePage === 'skills' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white">Skill Intelligence</h2>

                  {/* Skills Grid and radar mockup metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: current skills list */}
                    <div className="rounded-2xl p-6 glass-panel space-y-4 lg:col-span-2">
                      <h3 className="font-bold text-lg text-white">My Skill Core</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.skills.map((skill, sIdx) => {
                          const levelMock = sIdx % 2 === 0 ? 'Advanced' : 'Intermediate';
                          const percentMock = sIdx % 2 === 0 ? 85 : 60;
                          return (
                            <div key={skill} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-white">{skill}</span>
                                <span className="text-xs text-cyan-400 font-bold">{levelMock}</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${percentMock}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: skill gaps analytics suggestions */}
                    <div className="rounded-2xl p-6 glass-panel space-y-4 border-l-4 border-l-purple-500">
                      <h3 className="font-bold text-lg text-white">AI Gap Analyzer</h3>
                      <div className="space-y-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-xs text-gray-500 font-bold uppercase">Target Core Gaps</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {(profile.goal.toLowerCase().includes('ai') ? ['PyTorch', 'Transformers', 'LangChain', 'Docker'] : ['TypeScript', 'Docker', 'Prisma', 'Nginx']).map(item => (
                              <span key={item} className="text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full">
                                Missing: {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/5 p-4 border border-white/5 space-y-2 text-xs">
                          <div className="font-bold text-purple-400 flex items-center gap-1">
                            <Compass className="h-3.5 w-3.5" /> Core Roadmap Suggestion:
                          </div>
                          <p className="text-gray-400 leading-relaxed">
                            "Masters of PyTorch are highly sought after. Dedicate 2 weeks in your roadmap to complete basic convolutional structures and model checkpoint logic."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 4: RESUME ATS ANALYZER */}
              {activePage === 'resume' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white font-sans">AI Resume Analyzer</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Input upload form */}
                    <div className="rounded-2xl p-6 glass-panel space-y-4 lg:col-span-2">
                      <h3 className="font-bold text-lg text-white">Paste Resume / CV Markdown</h3>
                      <form onSubmit={handleUploadResume} className="space-y-4">
                        <textarea
                          rows="10"
                          required
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste the full text of your resume here to compute ATS keywords and formatting scores against your goal track..."
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 focus:outline-none text-sm text-white resize-y"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Accepts plain text, markdown, or copy-paste CV tokens.</span>
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 flex items-center gap-2"
                          >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Evaluate ATS Score'}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Right: ATS review metrics panel */}
                    <div className="rounded-2xl p-6 glass-panel space-y-6">
                      <h3 className="font-bold text-lg text-white">ATS Output</h3>

                      {!resumeAnalysis ? (
                        <div className="text-center py-12 space-y-3">
                          <Upload className="h-12 w-12 text-gray-600 mx-auto" />
                          <p className="text-xs text-gray-500">Submit your resume text to calculate the ATS alignment score.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Score Circle Gauge */}
                          <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                            <div className="h-28 w-28 rounded-full border-4 border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-400/10">
                              <span className="text-3xl font-extrabold text-white">{resumeAnalysis.atsScore}%</span>
                              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">ATS Score</span>
                            </div>
                            <span className="text-xs text-gray-400 mt-4 leading-relaxed">Compared to: {profile.goal}</span>
                          </div>

                          {/* Missing keywords */}
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 font-bold uppercase">Missing Keywords</span>
                            <div className="flex flex-wrap gap-2">
                              {resumeAnalysis.missingSkills.map(s => (
                                <span key={s} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-semibold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Critiques */}
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 font-bold uppercase">ATS Feedback Logs</span>
                            <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
                              {resumeAnalysis.feedback.map((f, fIdx) => (
                                <li key={fIdx} className="leading-relaxed">{f}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 5: JOBS BOARD */}
              {activePage === 'jobs' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-extrabold text-white font-sans">Jobs Board</h2>
                    <button onClick={() => setActivePage('applications')} className="px-5 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold rounded-xl border border-purple-500/20 text-xs transition flex items-center gap-2">
                      <Trello className="h-4 w-4" /> Open Kanban CRM Board
                    </button>
                  </div>

                  <p className="text-gray-400 text-sm">
                    Recommended jobs matching your targeted track <span className="font-bold text-white">{profile.goal}</span>:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                      <div key={job._id} className="rounded-2xl p-6 glass-panel space-y-4 border border-white/5 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-bold px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-wider">{job.salary}</span>
                          <h3 className="font-bold text-lg text-white">{job.title}</h3>
                          <p className="text-xs text-gray-400 font-bold">{job.company} — {job.location}</p>
                          <p className="text-xs text-gray-400 leading-relaxed pt-2">{job.description}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-1">
                            {job.skillsRequired.map(s => (
                              <span key={s} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/5">{s}</span>
                            ))}
                          </div>

                          <button
                            onClick={() => handleImportJobToCRM(job)}
                            className="w-full py-2.5 bg-gradient-primary text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                          >
                            <Plus className="h-4 w-4" /> Track in CRM Board
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCREEN 6: KANBAN APPLICATION CRM */}
              {activePage === 'applications' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-extrabold text-white">CRM Kanban Tracker</h2>
                    <button
                      onClick={() => setShowCRMModal(true)}
                      className="px-5 py-2.5 bg-gradient-primary text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20 hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" /> Add Application
                    </button>
                  </div>

                  {/* CRM add application modal dialog */}
                  {showCRMModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                      <div className="w-full max-w-md bg-darkBg rounded-3xl p-6 border border-white/10 space-y-4 relative">
                        <button onClick={() => setShowCRMModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                          <X className="h-5 w-5" />
                        </button>
                        <h3 className="text-lg font-bold text-white">Add Job Card</h3>
                        
                        <form onSubmit={handleCreateCRMApplication} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold">JOB TITLE</label>
                            <input
                              type="text"
                              required
                              value={crmTitle}
                              onChange={(e) => setCrmTitle(e.target.value)}
                              placeholder="Machine Learning Engineer"
                              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold">COMPANY</label>
                            <input
                              type="text"
                              required
                              value={crmCompany}
                              onChange={(e) => setCrmCompany(e.target.value)}
                              placeholder="Google"
                              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold">NOTES / DESCRIPTION</label>
                            <textarea
                              rows="3"
                              value={crmNotes}
                              onChange={(e) => setCrmNotes(e.target.value)}
                              placeholder="Key requirements: Python, TensorFlow..."
                              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-white resize-none"
                            />
                          </div>

                          <button type="submit" className="w-full py-2.5 bg-gradient-primary text-white font-bold rounded-xl text-sm transition">
                            Save Application Card
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Kanban grid columns */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {['applied', 'interview', 'selected', 'rejected'].map((colStatus) => {
                      const colApps = applications.filter(a => a.status === colStatus);
                      const colColors = {
                        applied: 'border-t-purple-500',
                        interview: 'border-t-cyan-400',
                        selected: 'border-t-green-400',
                        rejected: 'border-t-red-400'
                      };
                      return (
                        <div key={colStatus} className={`rounded-2xl p-4 glass-panel border-t-4 ${colColors[colStatus]} space-y-4 min-h-[300px]`}>
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">{colStatus}</h3>
                            <span className="text-xs font-bold bg-white/5 text-gray-300 px-2 py-0.5 rounded">{colApps.length}</span>
                          </div>

                          <div className="space-y-3">
                            {colApps.map(app => (
                              <div key={app._id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3 relative group">
                                <div>
                                  <div className="font-bold text-sm text-white truncate">{app.title}</div>
                                  <div className="text-[10px] text-gray-500 font-bold truncate mt-0.5">{app.company}</div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                  <div className="flex gap-1">
                                    {colStatus !== 'applied' && (
                                      <button onClick={() => handleUpdateCRMStatus(app._id, 'applied')} className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white" title="Move to Applied">🧭</button>
                                    )}
                                    {colStatus !== 'interview' && (
                                      <button onClick={() => handleUpdateCRMStatus(app._id, 'interview')} className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white" title="Move to Interview">💬</button>
                                    )}
                                    {colStatus !== 'selected' && (
                                      <button onClick={() => handleUpdateCRMStatus(app._id, 'selected')} className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white" title="Move to Selected">🏆</button>
                                    )}
                                    {colStatus !== 'rejected' && (
                                      <button onClick={() => handleUpdateCRMStatus(app._id, 'rejected')} className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white" title="Move to Rejected">❌</button>
                                    )}
                                  </div>
                                  <button onClick={() => handleDeleteCRMCard(app._id)} className="text-gray-600 hover:text-red-400 transition">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SCREEN 7: AI INTERVIEW COACH */}
              {activePage === 'interview' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white">AI Interview Coach</h2>

                  {!currentInterview ? (
                    <div className="rounded-2xl p-8 glass-panel space-y-6 max-w-lg mx-auto">
                      <h3 className="font-bold text-lg text-white">Start Interview Practice</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Configure your targeted job role. The AI technical interviewer will load 5 targeted technical, HR, and coding questions to evaluate.
                      </p>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 font-bold">TARGET JOB ROLE</label>
                        <select
                          value={interviewRole}
                          onChange={(e) => setInterviewRole(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-white"
                        >
                          <option value="AI Engineer">AI Engineer</option>
                          <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="Frontend Developer">Frontend Developer</option>
                        </select>
                      </div>

                      <button
                        onClick={handleStartInterview}
                        className="w-full py-3 bg-gradient-primary text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 hover:opacity-90"
                      >
                        <Mic className="h-4 w-4" /> Start Interview Coach Session
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: Chat console questions */}
                      <div className="lg:col-span-2 rounded-2xl p-6 glass-panel space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-xs text-gray-500 font-bold">MOCK INTERVIEW SESSION: {currentInterview.jobTitle}</span>
                          <span className="text-xs text-cyan-400 font-extrabold">Question {currentQuestionIdx + 1} of {currentInterview.questions.length}</span>
                        </div>

                        {currentQuestionIdx < currentInterview.questions.length ? (
                          <div className="space-y-6 py-4">
                            <div className="space-y-2">
                              <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2.5 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider">
                                {currentInterview.questions[currentQuestionIdx].questionType}
                              </span>
                              <h3 className="text-lg font-bold text-white leading-relaxed">
                                {currentInterview.questions[currentQuestionIdx].question}
                              </h3>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-xs text-gray-400 font-bold">YOUR DETAILED ANSWER</label>
                                <span className="text-[10px] text-gray-500">Minimum 50 characters recommended for high rating.</span>
                              </div>
                              <textarea
                                rows="6"
                                required
                                value={answerInput}
                                onChange={(e) => setAnswerInput(e.target.value)}
                                placeholder="Type your technical justification or HR response here..."
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 focus:outline-none text-sm text-white resize-none"
                              />
                            </div>

                            <button
                              onClick={handleSubmitInterviewAnswer}
                              disabled={loading || !answerInput.trim()}
                              className="w-full py-3 bg-gradient-primary text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                            >
                              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Answer for AI Grading'}
                            </button>
                          </div>
                        ) : (
                          // Complete View
                          <div className="text-center py-12 space-y-6">
                            <div className="h-24 w-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
                              <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-extrabold text-white">Interview Complete!</h3>
                              <p className="text-sm text-gray-400">Your answers were parsed and graded by the Career GPS model.</p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 inline-block min-w-[200px]">
                              <div className="text-4xl font-extrabold text-white">{currentInterview.overallScore}%</div>
                              <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider mt-1">Overall Interview Score</div>
                            </div>

                            <button
                              onClick={() => setCurrentInterview(null)}
                              className="px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 font-bold rounded-xl text-sm transition mx-auto block"
                            >
                              Start New Session
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Feedback review panel */}
                      <div className="rounded-2xl p-6 glass-panel space-y-4">
                        <h3 className="font-bold text-lg text-white">API Evaluation logs</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                          {currentInterview.questions.map((q, idx) => (
                            <div key={idx} className={`p-4 rounded-xl border border-white/5 text-xs space-y-2 bg-white/5 ${q.answer ? 'opacity-100' : 'opacity-30'}`}>
                              <div className="flex justify-between items-center font-bold">
                                <span className="text-white">Q{idx + 1} ({q.questionType})</span>
                                {q.rating > 0 && <span className="text-yellow-400">{'★'.repeat(q.rating)}</span>}
                              </div>
                              <p className="text-gray-400 leading-relaxed truncate">{q.question}</p>
                              {q.feedback && (
                                <p className="p-2.5 rounded bg-black/40 text-cyan-300 mt-2 font-mono leading-relaxed">{q.feedback}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 8: AI CAREER CHATBOT */}
              {activePage === 'chatbot' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white">AI Career Chatbot</h2>

                  <div className="rounded-2xl p-6 glass-panel h-[60vh] flex flex-col justify-between border-white/5">
                    {/* Chat Bubble container */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                      {chatHistory.map((msg, idx) => {
                        const isAi = msg.role === 'assistant';
                        return (
                          <div key={idx} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${isAi ? 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5' : 'bg-gradient-primary text-white rounded-tr-none shadow-md shadow-purple-500/10'}`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Pre-defined chips */}
                    <div className="flex flex-wrap gap-2 pb-4 pt-2 border-t border-white/5">
                      {[
                        'What should I learn next?',
                        'How do I build an AI Engineer portfolio?',
                        'Provide a standard Machine Learning roadmap.',
                        'What makes a resume ATS compliant?'
                      ].map(chip => (
                        <button
                          key={chip}
                          onClick={() => {
                            setChatMessage(chip);
                          }}
                          className="text-[11px] bg-white/5 hover:bg-white/10 text-cyan-400 border border-cyan-400/20 px-3 py-1.5 rounded-full transition"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Input message form */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask anything (e.g. 'explain self attention', 'suggest a database course')..."
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-sm text-white"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-5 py-3 bg-gradient-primary text-white rounded-xl font-bold flex items-center justify-center hover:opacity-90"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 9: PROFILE AND CV */}
              {activePage === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white">Profile & CV Configurations</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left form fields */}
                    <div className="lg:col-span-2 rounded-2xl p-6 glass-panel space-y-6">
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-bold">CAREER TARGET GOAL</label>
                            <input
                              type="text"
                              value={profile.goal}
                              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-bold">LOCATION</label>
                            <input
                              type="text"
                              value={profile.location}
                              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-bold">SKILLS (COMMA SEPARATED)</label>
                          <input
                            type="text"
                            value={profile.skills.join(', ')}
                            onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s=>s.trim()) })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-bold">EDUCATION (SCHOOL)</label>
                          <input
                            type="text"
                            value={profile.education[0]?.school || ''}
                            onChange={(e) => {
                              const edu = [...profile.education];
                              if (!edu[0]) edu[0] = {};
                              edu[0].school = e.target.value;
                              setProfile({ ...profile, education: edu });
                            }}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-bold">WORK EXPERIENCE (PREVIOUS ROLE)</label>
                          <input
                            type="text"
                            value={profile.experience[0]?.company || ''}
                            onChange={(e) => {
                              const exp = [...profile.experience];
                              if (!exp[0]) exp[0] = {};
                              exp[0].company = e.target.value;
                              setProfile({ ...profile, experience: exp });
                            }}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-white"
                          />
                        </div>

                        <button type="submit" className="px-6 py-2.5 bg-gradient-primary text-white font-bold rounded-xl text-xs hover:opacity-90">
                          Save Profile Changes
                        </button>
                      </form>
                    </div>

                    {/* Right side information summary card */}
                    <div className="rounded-2xl p-6 glass-panel space-y-4 border-l-4 border-l-cyan-400">
                      <h3 className="font-bold text-lg text-white">Target Summary</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Completing all education, goals, location, and experience criteria unlocks the <span className="text-purple-400 font-bold">Profile Architect</span> badge (+250 XP).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 10: SETTINGS */}
              {activePage === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-white">Settings</h2>

                  <div className="rounded-2xl p-6 glass-panel space-y-6 max-w-lg">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-white border-b border-white/5 pb-2">Interface Preferences</h3>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-semibold text-white">Theme Configuration</span>
                          <p className="text-xs text-gray-500">Toggle dark mode visuals</p>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                        >
                          {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-semibold text-white">Email alerts notifications</span>
                          <p className="text-xs text-gray-500">Receive weekly summaries from LLM advisor</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded bg-white/5 border border-white/10 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>

        </div>
      )}

    </div>
  );
}
