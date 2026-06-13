import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { 
  User, Profile, Skill, Roadmap, Resource, 
  Project, Job, Application, Resume, 
  Interview, Achievement, Notification, Settings 
} from '../models/schemas.js';
import { 
  generateRoadmap, analyzeSkillGap, analyzeResume, 
  generateInterviewQuestions, evaluateInterviewAnswer, chatResponse 
} from '../services/aiService.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const JWT_SECRET = process.env.JWT_SECRET || 'career_gps_super_secret_jwt_key_12345';

// Helper to award XP and check Level Up
const addXP = async (userId, amount) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) return null;

  let currentXP = (profile.xp || 0) + amount;
  let currentLevel = profile.level || 1;
  const xpNeeded = currentLevel * 1000;
  let leveledUp = false;

  if (currentXP >= xpNeeded) {
    currentXP = currentXP - xpNeeded;
    currentLevel += 1;
    leveledUp = true;

    // Create Notification
    await Notification.create({
      userId,
      title: '🎉 Level Up!',
      message: `Congratulations! You reached Level ${currentLevel}. Keep learning!`,
      type: 'achievement'
    });
  }

  const updatedProfile = await Profile.findByIdAndUpdate(profile._id, {
    xp: currentXP,
    level: currentLevel
  });

  return { xp: currentXP, level: currentLevel, leveledUp };
};

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

router.post('/auth/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Create default profile
    await Profile.create({
      userId: user._id,
      goal: 'AI Engineer',
      skills: [],
      interests: [],
      education: [],
      experience: [],
      xp: 100,
      level: 1
    });

    // Create default settings
    await Settings.create({
      userId: user._id,
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true
    });

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: '👋 Welcome to Career GPS AI!',
      message: 'Explore your dashboard, set your target goal in your Profile, and build your roadmap!',
      type: 'info'
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/auth/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ userId: req.user.id });
    const settings = await Settings.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      profile,
      settings
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 2. PROFILE & SETTINGS ROUTES
// ==========================================

router.get('/profile', protect, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
});

router.put('/profile', protect, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const updated = await Profile.findByIdAndUpdate(profile._id, req.body, { new: true });
    
    // Check for "Profile Master" achievement
    if (updated.skills.length >= 3 && updated.education.length >= 1 && updated.experience.length >= 1) {
      const achExists = await Achievement.findOne({ userId: req.user.id, title: 'Profile Architect' });
      if (!achExists) {
        await Achievement.create({
          userId: req.user.id,
          title: 'Profile Architect',
          description: 'Fully filled out education, skills, and experience parameters.',
          badgeIcon: 'UserCheck'
        });
        await addXP(req.user.id, 250);
      }
    }

    res.status(200).json({ success: true, profile: updated });
  } catch (err) {
    next(err);
  }
});

router.get('/settings', protect, async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });
    if (!settings) {
      settings = await Settings.create({ userId: req.user.id });
    }
    res.status(200).json({ success: true, settings });
  } catch (err) {
    next(err);
  }
});

router.put('/settings', protect, async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });
    if (!settings) {
      settings = await Settings.create({ userId: req.user.id });
    }
    const updated = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    res.status(200).json({ success: true, settings: updated });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 3. ROADMAP & SKILL INTELLIGENCE ROUTES
// ==========================================

router.get('/roadmap', protect, async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id });
    res.status(200).json({ success: true, roadmaps });
  } catch (err) {
    next(err);
  }
});

router.post('/roadmap/generate', protect, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const goal = req.body.goal || profile?.goal || 'AI Engineer';

    // Call service to generate roadmap steps
    const steps = await generateRoadmap(goal);

    // Save roadmap
    const roadmap = await Roadmap.create({
      userId: req.user.id,
      goal,
      title: `GPS Guide: ${goal} Career Roadmap`,
      steps
    });

    // Check achievement
    const achExists = await Achievement.findOne({ userId: req.user.id, title: 'AI Navigator' });
    if (!achExists) {
      await Achievement.create({
        userId: req.user.id,
        title: 'AI Navigator',
        description: 'Generated your first AI personalized career roadmap.',
        badgeIcon: 'Compass'
      });
      await addXP(req.user.id, 200);
    }

    res.status(201).json({ success: true, roadmap });
  } catch (err) {
    next(err);
  }
});

router.put('/roadmap/:id/step', protect, async (req, res, next) => {
  try {
    const { stepId, status } = req.body;
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ success: false, error: 'Roadmap not found' });
    }

    // Update steps array
    const step = roadmap.steps.find(s => s._id === stepId || s.month === stepId);
    if (!step) {
      return res.status(404).json({ success: false, error: 'Step not found in roadmap' });
    }

    const oldStatus = step.status;
    step.status = status;
    await Roadmap.findByIdAndUpdate(roadmap._id, { steps: roadmap.steps });

    // Award XP on complete
    let xpAwarded = 0;
    let xpInfo = null;
    if (status === 'completed' && oldStatus !== 'completed') {
      xpAwarded = 150;
      xpInfo = await addXP(req.user.id, xpAwarded);
      
      // Seed newly learned skills into user skills
      const profile = await Profile.findOne({ userId: req.user.id });
      if (profile) {
        const uniqueSkills = Array.from(new Set([...profile.skills, ...step.skills]));
        await Profile.findByIdAndUpdate(profile._id, { skills: uniqueSkills });
      }
    }

    res.status(200).json({ success: true, roadmap, xpAwarded, xpInfo });
  } catch (err) {
    next(err);
  }
});

router.get('/skills/gap', protect, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const analysis = await analyzeSkillGap(profile.goal, profile.skills);
    res.status(200).json({ success: true, analysis });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 4. RESUME ANALYZER ROUTES
// ==========================================

router.post('/resume/analyze', protect, upload.single('resume'), async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const targetGoal = profile?.goal || 'AI Engineer';

    let textContent = '';
    let fileName = 'Unknown_Resume.txt';

    if (req.file) {
      fileName = req.file.originalname;
      textContent = req.file.buffer.toString('utf8');
      
      // Simple mock parser: if it's a binary file, just scan printable ASCII chars
      if (req.file.mimetype === 'application/pdf') {
        textContent = textContent.replace(/[^\x20-\x7E\n\r]/g, ' ');
      }
    } else {
      textContent = req.body.text || '';
      fileName = 'Text_Clipboard.txt';
    }

    if (!textContent) {
      return res.status(400).json({ success: false, error: 'Please upload a file or submit text' });
    }

    // Call service to analyze ATS Score
    const analysis = await analyzeResume(textContent, targetGoal);

    // Save Resume Analysis
    const resume = await Resume.create({
      userId: req.user.id,
      fileName,
      parsedText: textContent.substring(0, 1000), // Store preview
      atsScore: analysis.atsScore,
      feedback: analysis.feedback,
      missingSkills: analysis.missingSkills
    });

    // Check achievement
    const achExists = await Achievement.findOne({ userId: req.user.id, title: 'Resume Explorer' });
    if (!achExists) {
      await Achievement.create({
        userId: req.user.id,
        title: 'Resume Explorer',
        description: 'Analyzed your CV using ATS intelligence.',
        badgeIcon: 'FileText'
      });
      await addXP(req.user.id, 200);
    }

    res.status(201).json({ success: true, resume });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 5. JOB & CRM TRACKER ROUTES
// ==========================================

router.get('/jobs/recommendations', protect, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const goal = profile?.goal || 'AI Engineer';

    // Return custom preseeded jobs matching user goal
    const matches = [
      {
        title: `Associate ${goal}`,
        company: 'Innovate AI Labs',
        location: 'San Francisco, CA (Hybrid)',
        salary: '$110,000 - $130,000',
        skillsRequired: ['Python', 'SQL', 'React', 'Machine Learning'].slice(0, 3),
        description: 'Great entry level role for someone who wants to develop products in this domain.'
      },
      {
        title: `Senior ${goal}`,
        company: 'Vanguard Tech Solutions',
        location: 'Remote (US/Canada)',
        salary: '$140,000 - $170,000',
        skillsRequired: ['Docker', 'AWS', 'TensorFlow', 'TypeScript', 'Node.js'],
        description: 'Lead engineering decisions on state-of-the-art production environments.'
      },
      {
        title: `Junior ${goal} Specialist`,
        company: 'Nova Interactive',
        location: 'Austin, TX',
        salary: '$90,000 - $105,000',
        skillsRequired: ['Python', 'Git', 'Data Structures', 'TypeScript'],
        description: 'Assist Senior Developers in designing schemas and compiling robust features.'
      }
    ];

    res.status(200).json({ success: true, jobs: matches });
  } catch (err) {
    next(err);
  }
});

router.get('/applications', protect, async (req, res, next) => {
  try {
    const list = await Application.find({ userId: req.user.id });
    res.status(200).json({ success: true, applications: list });
  } catch (err) {
    next(err);
  }
});

router.post('/applications', protect, async (req, res, next) => {
  try {
    const app = await Application.create({
      userId: req.user.id,
      ...req.body
    });

    // Check achievement
    const count = (await Application.find({ userId: req.user.id })).length;
    if (count === 1) {
      await Achievement.create({
        userId: req.user.id,
        title: 'Active Hunter',
        description: 'Tracked your first job application.',
        badgeIcon: 'Briefcase'
      });
      await addXP(req.user.id, 100);
    }

    res.status(201).json({ success: true, application: app });
  } catch (err) {
    next(err);
  }
});

router.put('/applications/:id', protect, async (req, res, next) => {
  try {
    const updated = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Check if status changed to 'selected'
    if (req.body.status === 'selected') {
      const achExists = await Achievement.findOne({ userId: req.user.id, title: 'Offer Getter' });
      if (!achExists) {
        await Achievement.create({
          userId: req.user.id,
          title: 'Offer Getter',
          description: 'Landed a job offer and marked it on your Kanban CRM board!',
          badgeIcon: 'Award'
        });
        await addXP(req.user.id, 500);
      }
    }

    res.status(200).json({ success: true, application: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/applications/:id', protect, async (req, res, next) => {
  try {
    await Application.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 6. AI INTERVIEW COACH & CHATBOT ROUTES
// ==========================================

router.post('/interview/start', protect, async (req, res, next) => {
  try {
    const { jobTitle } = req.body;
    if (!jobTitle) {
      return res.status(400).json({ success: false, error: 'Job title is required' });
    }

    const rawQuestions = await generateInterviewQuestions(jobTitle);
    const questions = rawQuestions.map(q => ({
      question: q.question,
      questionType: q.questionType,
      userAnswer: '',
      rating: 0,
      feedback: ''
    }));

    const interview = await Interview.create({
      userId: req.user.id,
      jobTitle,
      questions,
      overallScore: 0,
      status: 'pending'
    });

    res.status(201).json({ success: true, interview });
  } catch (err) {
    next(err);
  }
});

router.post('/interview/:id/submit-answer', protect, async (req, res, next) => {
  try {
    const { questionIndex, answer } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview session not found' });
    }

    const q = interview.questions[questionIndex];
    if (!q) {
      return res.status(400).json({ success: false, error: 'Question index invalid' });
    }

    // Evaluate answer with AI
    const evaluation = await evaluateInterviewAnswer(q.question, answer);
    q.userAnswer = answer;
    q.rating = evaluation.rating;
    q.feedback = evaluation.feedback;

    // Check if interview is completed
    const allAnswered = interview.questions.every((qIdx, i) => i === questionIndex ? true : qIdx.userAnswer !== '');
    if (allAnswered) {
      interview.status = 'completed';
      const sum = interview.questions.reduce((acc, qVal) => acc + (qVal.rating || 0), 0);
      interview.overallScore = Math.round((sum / (interview.questions.length * 5)) * 100);

      // Check achievement
      const achExists = await Achievement.findOne({ userId: req.user.id, title: 'Speech Master' });
      if (!achExists) {
        await Achievement.create({
          userId: req.user.id,
          title: 'Speech Master',
          description: 'Completed your first full simulated interview.',
          badgeIcon: 'Mic'
        });
        await addXP(req.user.id, 300);
      }
    }

    await Interview.findByIdAndUpdate(interview._id, {
      questions: interview.questions,
      status: interview.status,
      overallScore: interview.overallScore
    });

    res.status(200).json({ success: true, interview, evaluation });
  } catch (err) {
    next(err);
  }
});

router.post('/chat', protect, async (req, res, next) => {
  try {
    const { history, message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Please enter a message' });
    }

    const reply = await chatResponse(history || [], message);
    res.status(200).json({ success: true, reply });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 7. GAMIFICATION & ACHIEVEMENTS & NOTIFICATIONS
// ==========================================

router.get('/achievements', protect, async (req, res, next) => {
  try {
    const list = await Achievement.find({ userId: req.user.id });
    res.status(200).json({ success: true, achievements: list });
  } catch (err) {
    next(err);
  }
});

router.get('/notifications', protect, async (req, res, next) => {
  try {
    const list = await Notification.find({ userId: req.user.id });
    res.status(200).json({ success: true, notifications: list });
  } catch (err) {
    next(err);
  }
});

router.put('/notifications/:id/read', protect, async (req, res, next) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.status(200).json({ success: true, notification: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
