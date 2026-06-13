import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// A collection of rich simulated content tailored to specific career goals
const SIMULATED_DATA = {
  ai_engineer: {
    roadmap: [
      {
        month: "Month 1: Programming & Math Foundation",
        title: "Python Mastery & Math Foundations",
        description: "Master Python programming and the essential mathematics needed for machine learning.",
        skills: ["Python", "Linear Algebra", "Calculus", "Probability & Statistics"],
        resources: [
          { title: "Python for Data Science (Kaggle Course)", type: "course", url: "https://www.kaggle.com/learn/python" },
          { title: "Mathematics for Machine Learning (YouTube Series)", type: "video", url: "https://www.youtube.com/playlist?list=PLJHszsWbBip0kn_gmrA4GspP2T04a19X5" }
        ],
        projects: [{ title: "Data Explorer Dashboard", description: "Build an interactive EDA dashboard using NumPy, Pandas, and Streamlit.", difficulty: "beginner" }],
        status: "pending"
      },
      {
        month: "Month 2: Machine Learning Foundations",
        title: "Supervised & Unsupervised Learning",
        description: "Learn classic ML algorithms, feature engineering, and model validation techniques.",
        skills: ["Scikit-Learn", "Regression Models", "Random Forests", "Clustering (K-Means)"],
        resources: [
          { title: "Introduction to Machine Learning (Scikit-Learn Docs)", type: "documentation", url: "https://scikit-learn.org/stable/user_guide.html" },
          { title: "Hands-On Machine Learning with Scikit-Learn (Book)", type: "book", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/" }
        ],
        projects: [{ title: "Predictive House Price Engine", description: "Train and deploy a regression model to predict housing prices.", difficulty: "beginner" }],
        status: "pending"
      },
      {
        month: "Month 3: Deep Learning Fundamentals",
        title: "Neural Networks & PyTorch",
        description: "Build neural network architectures from scratch and train models in PyTorch.",
        skills: ["PyTorch", "Artificial Neural Networks", "Backpropagation", "CNNs"],
        resources: [
          { title: "PyTorch for Beginners (Official Course)", type: "course", url: "https://pytorch.org/tutorials/" },
          { title: "Neural Networks from Scratch (YouTube)", type: "video", url: "https://www.youtube.com/playlist?list=PLQVvvaa0QuDcjD5BAw2DxE6OF2tius3V3" }
        ],
        projects: [{ title: "Image Classifier App", description: "Design a CNN model to classify image datasets using PyTorch.", difficulty: "intermediate" }],
        status: "pending"
      },
      {
        month: "Month 4: NLP & Large Language Models",
        title: "Transformers & LLM Foundations",
        description: "Deep dive into NLP, attention mechanism, and building interfaces around Large Language Models.",
        skills: ["Transformers", "Hugging Face", "LLM Fine-tuning", "Prompt Engineering"],
        resources: [
          { title: "Hugging Face NLP Course", type: "course", url: "https://huggingface.co/learn/nlp-course" },
          { title: "Attention Is All You Need (Paper)", type: "documentation", url: "https://arxiv.org/abs/1706.03762" }
        ],
        projects: [{ title: "Custom GPT Agent", description: "Build a chat application integrated with Hugging Face models.", difficulty: "intermediate" }],
        status: "pending"
      },
      {
        month: "Month 5: RAG & Vector Databases",
        title: "Retrieval Augmented Generation",
        description: "Build semantic search applications using vector databases and LLM frameworks.",
        skills: ["LangChain", "Pinecone/ChromaDB", "Semantic Search", "LlamaIndex"],
        resources: [
          { title: "LangChain Documentation", type: "documentation", url: "https://js.langchain.com/docs/" },
          { title: "Pinecone Vector DB Masterclass", type: "course", url: "https://www.pinecone.io/learn/" }
        ],
        projects: [{ title: "Chat with PDF Assistant", description: "Construct a complete RAG system allowing users to upload documents and query them.", difficulty: "advanced" }],
        status: "pending"
      },
      {
        month: "Month 6: AI Deployment & MLOps",
        title: "Deploying AI Systems",
        description: "Scale your models, build reliable APIs, and maintain performance metrics in production.",
        skills: ["Docker", "FastAPI", "MLflow", "Cloud Deployment (AWS/GCP)"],
        resources: [
          { title: "Docker for Data Science", type: "book", url: "https://www.docker.com/resources/what-container/" },
          { title: "MLOps Zoomcamp (DataTalks.Club)", type: "course", url: "https://github.com/DataTalksClub/mlops-zoomcamp" }
        ],
        projects: [{ title: "Production Grade AI API", description: "Deploy a PyTorch or LLM service as a dockerized FastAPI application on GCP/AWS.", difficulty: "advanced" }],
        status: "pending"
      }
    ],
    gapAnalysis: {
      score: 42,
      missingSkills: ["PyTorch", "Transformers", "LangChain", "Vector Databases", "Docker"],
      weakAreas: [
        "No deep learning models or Neural Networks mentioned in resume/skills.",
        "Missing experience in API development or orchestrating AI workflows (e.g. LangChain)."
      ],
      recommendations: [
        "Start PyTorch for Beginners on PyTorch's website.",
        "Add a basic neural network project to your portfolio.",
        "Practice API routing using FastAPI."
      ]
    },
    interview: [
      {
        question: "Explain the difference between L1 and L2 regularization. When would you prefer one over the other?",
        questionType: "technical"
      },
      {
        question: "Describe how the self-attention mechanism works in the Transformer architecture.",
        questionType: "technical"
      },
      {
        question: "Write a function in Python to compute the cosine similarity between two PyTorch tensors.",
        questionType: "coding"
      },
      {
        question: "How do you explain the predictions of a complex machine learning model to business partners who don't have a technical background?",
        questionType: "hr"
      },
      {
        question: "What are some strategies to handle overfitting in neural networks, and how do they work?",
        questionType: "technical"
      }
    ]
  },
  fullstack_developer: {
    roadmap: [
      {
        month: "Month 1: Frontend Mastery",
        title: "Modern React & Tailwind CSS",
        description: "Advance your frontend abilities. Build fast, fully responsive UIs with modern state management.",
        skills: ["React (Hooks, Context)", "Tailwind CSS", "TypeScript", "Next.js Basics"],
        resources: [
          { title: "React Dev Official Docs", type: "documentation", url: "https://react.dev/" },
          { title: "Tailwind CSS Complete Guide (YouTube)", type: "video", url: "https://www.youtube.com/watch?v=lCxcTsOHr5I" }
        ],
        projects: [{ title: "Interactive Analytics Portal", description: "Build a dashboard with Tailwind CSS, Recharts, and custom hooks.", difficulty: "beginner" }],
        status: "pending"
      },
      {
        month: "Month 2: Backend Architecture",
        title: "REST APIs with Node.js & Express",
        description: "Create scalable, robust HTTP APIs using Express and Node.js with solid error handling.",
        skills: ["Node.js", "Express.js", "RESTful Design", "Security Headers (Helmet)"],
        resources: [
          { title: "Node.js Design Patterns (Book)", type: "book", url: "https://www.packtpub.com/product/node-js-design-patterns-third-edition/9781839214110" },
          { title: "REST API Best Practices", type: "documentation", url: "https://restfulapi.net/" }
        ],
        projects: [{ title: "Task Manager REST API", description: "Write an API supporting JWT Auth, rate limiting, and sorting/filtering.", difficulty: "beginner" }],
        status: "pending"
      },
      {
        month: "Month 3: Database & ORM Mastery",
        title: "Relational & Document Databases",
        description: "Learn database optimization, indexes, aggregation pipelines, and transactions.",
        skills: ["PostgreSQL", "MongoDB", "Prisma ORM", "Mongoose"],
        resources: [
          { title: "MongoDB University", type: "course", url: "https://university.mongodb.com/" },
          { title: "Intro to SQL & Databases (YouTube)", type: "video", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" }
        ],
        projects: [{ title: "E-Commerce Database Schema", description: "Design an optimized schema representing complex orders, payments, and users.", difficulty: "intermediate" }],
        status: "pending"
      },
      {
        month: "Month 4: System Integration & Auth",
        title: "Advanced Auth & Real-Time Data",
        description: "Secure applications with OAuth, refresh tokens, and build real-time layers.",
        skills: ["OAuth 2.0", "JWT Refresh Tokens", "WebSockets / Socket.io", "Redis Caching"],
        resources: [
          { title: "OAuth 2.0 Simplified", type: "book", url: "https://oauth2simplified.com/" },
          { title: "WebSockets with Socket.io Docs", type: "documentation", url: "https://socket.io/docs/v4/" }
        ],
        projects: [{ title: "Real-time Collaborative Whiteboard", description: "Create a web app where users draw together on a canvas using WebSockets.", difficulty: "intermediate" }],
        status: "pending"
      },
      {
        month: "Month 5: DevOps & Cloud Basics",
        title: "Dockerizing & CI/CD Pipelines",
        description: "Package applications with Docker and set up automated workflows to build and test code.",
        skills: ["Docker", "GitHub Actions", "AWS (S3, EC2)", "Nginx Configuration"],
        resources: [
          { title: "Docker Containerization Course", type: "course", url: "https://www.docker.com/play-with-docker/" },
          { title: "GitHub Actions Tutorial (YouTube)", type: "video", url: "https://www.youtube.com/watch?v=R8_veQiYt6M" }
        ],
        projects: [{ title: "Automated Deploy Pipeline", description: "Configure a CI/CD script that builds, runs tests, and deploys to an EC2 instance.", difficulty: "advanced" }],
        status: "pending"
      },
      {
        month: "Month 6: System Design & Scaling",
        title: "Advanced Scaling & Performance",
        description: "Optimize page speed, configure CDNs, load balancers, and learn system design principles.",
        skills: ["System Design", "N+1 Queries Optimization", "CDNs (Cloudflare)", "Load Balancing"],
        resources: [
          { title: "System Design Primer (GitHub)", type: "documentation", url: "https://github.com/donnemartin/system-design-primer" },
          { title: "Next.js Performance Optimization", type: "documentation", url: "https://nextjs.org/docs/app/building-your-application/optimizing" }
        ],
        projects: [{ title: "High-Traffic Blog Platform", description: "Optimize a blog engine to handle thousands of concurrent requests with caching.", difficulty: "advanced" }],
        status: "pending"
      }
    ],
    gapAnalysis: {
      score: 55,
      missingSkills: ["TypeScript", "Docker", "Prisma ORM", "Redis", "Nginx"],
      weakAreas: [
        "Resume lacks modern testing frameworks (Jest, Playwright).",
        "No experience in containerization or deploy configurations."
      ],
      recommendations: [
        "Learn TypeScript and refactor a small React app to TS.",
        "Add a Dockerfile to your current backend repository."
      ]
    },
    interview: [
      {
        question: "Explain what the Virtual DOM is and how React updates the UI.",
        questionType: "technical"
      },
      {
        question: "What is the N+1 query problem, and how do you solve it in SQL/ORM?",
        questionType: "technical"
      },
      {
        question: "Write a function in JavaScript to debounce a search input API handler.",
        questionType: "coding"
      },
      {
        question: "Explain the differences between Cookies, SessionStorage, and LocalStorage for authentication tokens.",
        questionType: "technical"
      },
      {
        question: "Describe a time when you had to debug a difficult performance issue in production.",
        questionType: "hr"
      }
    ]
  }
};

const getSimulatedTarget = (goal = '') => {
  const norm = goal.toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (norm.includes('ai') || norm.includes('ml') || norm.includes('machine') || norm.includes('data')) {
    return SIMULATED_DATA.ai_engineer;
  }
  return SIMULATED_DATA.fullstack_developer;
};

// General AI HTTP request using built-in fetch (no SDK dependency)
const callGeminiAPI = async (prompt, systemPrompt = '') => {
  if (!GEMINI_API_KEY) {
    throw new Error('No API key configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser Input:\n${prompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || 'Error communicating with Gemini');
    }

    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || '';
  } catch (err) {
    console.error('Gemini API fetch error:', err);
    throw err;
  }
};

export const generateRoadmap = async (goal) => {
  if (GEMINI_API_KEY) {
    const systemPrompt = `You are a Career Roadmap Architect. Generate a comprehensive 6-month career roadmap for a user who wants to become a ${goal}. You must return output EXACTLY in JSON format following this schema, with no markdown codeblocks (no \`\`\`json etc):
    [
      {
        "month": "Month 1: [Focus Area]",
        "title": "[Short title]",
        "description": "[Detail what they will learn]",
        "skills": ["Skill1", "Skill2"],
        "resources": [{"title": "[Title]", "type": "course|video|documentation|book", "url": "[URL]"}],
        "projects": [{"title": "[Project Title]", "description": "[Short description]", "difficulty": "beginner|intermediate|advanced"}],
        "status": "pending"
      }
    ]`;

    try {
      const response = await callGeminiAPI(`Goal: ${goal}`, systemPrompt);
      // Clean possible markdown wrapper
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
      return JSON.parse(cleaned.trim());
    } catch (err) {
      console.warn('API Roadmap generation failed, using simulator:', err.message);
    }
  }

  // Fallback simulator
  const sim = getSimulatedTarget(goal);
  return sim.roadmap;
};

export const analyzeSkillGap = async (goal, userSkills) => {
  if (GEMINI_API_KEY) {
    const systemPrompt = `You are an AI Skill Gap Analyzer. Analyze the user's current skills against their goal of becoming a ${goal}. Compare and calculate an overall score (0-100), identify missing key technologies, specific weak areas, and actionable recommendations.
    Return output EXACTLY in JSON format following this schema with no codeblocks:
    {
      "score": 45,
      "missingSkills": ["React", "TypeScript"],
      "weakAreas": ["Limited frontend frameworks experience", "No type checking understanding"],
      "recommendations": ["Learn TypeScript generics", "Build a small portfolio in React"]
    }`;

    try {
      const prompt = `Goal: ${goal}\nUser Skills: ${JSON.stringify(userSkills)}`;
      const response = await callGeminiAPI(prompt, systemPrompt);
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
      return JSON.parse(cleaned.trim());
    } catch (err) {
      console.warn('API Skill gap failed, using simulator:', err.message);
    }
  }

  const sim = getSimulatedTarget(goal);
  // Customize score dynamically based on how many target skills are matching
  let matched = 0;
  const simRoadmapSkills = sim.roadmap.flatMap(s => s.skills);
  userSkills.forEach(skill => {
    if (simRoadmapSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase()))) {
      matched += 1;
    }
  });

  const baseScore = Math.min(25 + matched * 12, 95);
  return {
    ...sim.gapAnalysis,
    score: baseScore
  };
};

export const analyzeResume = async (resumeText, targetGoal = 'AI Engineer') => {
  if (GEMINI_API_KEY) {
    const systemPrompt = `You are an ATS Resume Analyzer. Analyze the provided resume text against the target role of ${targetGoal}. Calculate an ATS Score (0-100), critique weak sections, list missing keywords, and suggest improvements.
    Return output EXACTLY in JSON format following this schema with no codeblocks:
    {
      "atsScore": 72,
      "feedback": ["Quantify accomplishments with numbers", "Summary section is too long"],
      "missingSkills": ["Docker", "Kubernetes", "GraphQL"]
    }`;

    try {
      const response = await callGeminiAPI(`Target: ${targetGoal}\nResume Content:\n${resumeText}`, systemPrompt);
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
      return JSON.parse(cleaned.trim());
    } catch (err) {
      console.warn('API Resume analyze failed, using simulator:', err.message);
    }
  }

  // Simulator
  const sim = getSimulatedTarget(targetGoal);
  const words = resumeText.toLowerCase();
  
  let matchCount = 0;
  sim.gapAnalysis.missingSkills.forEach(s => {
    if (words.includes(s.toLowerCase())) {
      matchCount += 1;
    }
  });

  const score = Math.max(50, Math.min(88, 55 + (matchCount * 8)));
  const missing = sim.gapAnalysis.missingSkills.filter(s => !words.includes(s.toLowerCase()));

  return {
    atsScore: score,
    feedback: [
      "Add metrics and business impact to your experience bullet points (e.g. 'Increased accuracy by 15%').",
      "Ensure your skills section explicitly lists key tools in separate headings.",
      "The profile description should be more tailored to the target role: " + targetGoal
    ],
    missingSkills: missing.length > 0 ? missing : ["Docker", "CI/CD Protocols", "GitHub Actions"]
  };
};

export const generateInterviewQuestions = async (jobTitle) => {
  if (GEMINI_API_KEY) {
    const systemPrompt = `You are an AI Technical Interview Coach. Generate a list of 5 interview questions (technical, HR, and coding questions) for a candidate applying to a ${jobTitle} position. 
    Return output EXACTLY in JSON format following this schema with no codeblocks:
    [
      {
        "question": "The question text",
        "questionType": "technical|hr|coding"
      }
    ]`;

    try {
      const response = await callGeminiAPI(`Role: ${jobTitle}`, systemPrompt);
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
      return JSON.parse(cleaned.trim());
    } catch (err) {
      console.warn('API Interview questions failed, using simulator:', err.message);
    }
  }

  const sim = getSimulatedTarget(jobTitle);
  return sim.interview;
};

export const evaluateInterviewAnswer = async (question, answer) => {
  if (GEMINI_API_KEY) {
    const systemPrompt = `You are a Technical Interviewer. Evaluate the user's answer to the interview question: "${question}". Provide a rating from 1 to 5 (5 is perfect, 1 is poor) and constructive feedback pointing out strengths and missing points.
    Return output EXACTLY in JSON format following this schema with no codeblocks:
    {
      "rating": 4,
      "feedback": "Great explanation. You could have also mentioned the computational overhead."
    }`;

    try {
      const response = await callGeminiAPI(`Question: ${question}\nUser Answer: ${answer}`, systemPrompt);
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
      return JSON.parse(cleaned.trim());
    } catch (err) {
      console.warn('API Answer evaluation failed, using simulator:', err.message);
    }
  }

  // Mock answer rating
  const len = answer.trim().length;
  let rating = 1;
  let feedback = "The response is too brief. Please provide a more complete explanation detailing technical terms.";

  if (len > 120) {
    rating = 4;
    feedback = "Strong answer! You demonstrated solid theoretical understanding and mentioned core terms. To make it even better, you could illustrate with a real-world scenario you encountered.";
  } else if (len > 50) {
    rating = 3;
    feedback = "Good start, but missing key depth. Try to elaborate on how the technology operates or provide code examples to support your description.";
  } else if (len > 0) {
    rating = 2;
    feedback = "Very short response. Please cover the fundamental mechanics and details of the question.";
  }

  return { rating, feedback };
};

export const chatResponse = async (history, message) => {
  if (GEMINI_API_KEY) {
    const systemPrompt = `You are an AI Career Assistant. Guide the user in their career, suggest what skills to learn, how to prepare for interviews, project ideas, and address questions about the tech sector. Maintain a encouraging, professional tone. Keep responses under 3-4 paragraphs.`;

    try {
      const formattedPrompt = `Chat History:\n${JSON.stringify(history)}\n\nNew Message: ${message}`;
      return await callGeminiAPI(formattedPrompt, systemPrompt);
    } catch (err) {
      console.warn('API Chat failed, using simulator:', err.message);
    }
  }

  // Simulator chat
  const msg = message.toLowerCase();
  if (msg.includes('learn') || msg.includes('skill') || msg.includes('roadmap')) {
    return "To advance your career, I recommend first finalizing your target goal on the Profile page. Once set, generate a Roadmap. It will map out exactly which technologies to master month-by-month. Start with foundational languages (like Python or JavaScript), then build projects to secure those skills, and track your growth on your dashboard.";
  }
  if (msg.includes('resume') || msg.includes('ats')) {
    return "Resumes are crucial for passing initial screening loops. Go to the Resume Analyzer, upload your CV, and let the AI compute an ATS Score. I will give you detailed suggestions on formatting, missing keywords, and sections you need to expand to get noticed by automated tracking systems.";
  }
  if (msg.includes('interview') || msg.includes('practice')) {
    return "Mock interviews are the best way to gain confidence. Head to the AI Interview Coach page, enter your target role, and the coach will generate HR, coding, and technical questions. Answer them in detail, and I'll immediately analyze and grade your response with concrete tips.";
  }
  if (msg.includes('job') || msg.includes('apply')) {
    return "Apply to jobs that match your skillset! You can track your submissions in real time using our CRM Board. Organize your applications into Columns (Applied, Interview, Selected, Rejected). Keeping details organized ensures you never miss a follow-up.";
  }

  return "I'm your 24/7 AI Career Coach. You can ask me anything about building projects, learning plans, resume formatting, or technical topics. Try asking me: 'What should I learn to become an AI Engineer?' or 'How do I optimize my resume?'";
};
