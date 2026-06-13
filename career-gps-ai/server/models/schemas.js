import mongoose from 'mongoose';
import { getModel } from '../config/db.js';

const Schema = mongoose.Schema;

// 1. User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 2. Profile Schema
const ProfileSchema = new Schema({
  userId: { type: String, required: true },
  education: [
    {
      school: String,
      degree: String,
      fieldOfStudy: String,
      startYear: String,
      endYear: String
    }
  ],
  skills: [String],
  interests: [String],
  goal: { type: String, default: 'AI Engineer' },
  experience: [
    {
      company: String,
      position: String,
      duration: String,
      description: String
    }
  ],
  location: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

// 3. Skill Schema (Skill Intelligence)
const SkillSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, default: 'beginner', enum: ['beginner', 'intermediate', 'advanced'] },
  progress: { type: Number, default: 0 }, // 0 to 100
  history: [
    {
      date: { type: Date, default: Date.now },
      progress: Number
    }
  ]
});

// 4. Roadmap Schema
const RoadmapSchema = new Schema({
  userId: { type: String, required: true },
  goal: { type: String, required: true },
  title: { type: String, required: true },
  steps: [
    {
      month: String,
      title: String,
      description: String,
      skills: [String],
      resources: [{ title: String, type: String, url: String }],
      projects: [{ title: String, description: String, difficulty: String }],
      status: { type: String, default: 'pending', enum: ['pending', 'completed'] }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// 5. Resource Schema (Learning Resources)
const ResourceSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['course', 'video', 'documentation', 'book'] },
  url: { type: String, required: true },
  mappedSkills: [String]
});

// 6. Project Schema (Project Recommendation)
const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
  techStack: [String],
  githubLink: { type: String, default: '' }
});

// 7. Job Schema
const JobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [String],
  salary: { type: String, default: '' },
  url: { type: String, default: '' }
});

// 8. Application Schema (CRM Tracker)
const ApplicationSchema = new Schema({
  userId: { type: String, required: true },
  jobId: { type: String },
  title: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, default: 'applied', enum: ['applied', 'interview', 'rejected', 'selected'] },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  contactPerson: { type: String, default: '' }
});

// 9. Resume Schema
const ResumeSchema = new Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  parsedText: { type: String, default: '' },
  atsScore: { type: Number, default: 0 },
  feedback: [String],
  missingSkills: [String],
  createdAt: { type: Date, default: Date.now }
});

// 10. Interview Schema (Interview Coach)
const InterviewSchema = new Schema({
  userId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  questions: [
    {
      question: String,
      questionType: { type: String, enum: ['technical', 'hr', 'coding'] },
      userAnswer: { type: String, default: '' },
      rating: { type: Number, default: 0 }, // 1 to 5
      feedback: { type: String, default: '' }
    }
  ],
  overallScore: { type: Number, default: 0 },
  status: { type: String, default: 'pending', enum: ['pending', 'completed'] },
  createdAt: { type: Date, default: Date.now }
});

// 11. Achievement Schema
const AchievementSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  badgeIcon: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now }
});

// 12. Notification Schema
const NotificationSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info', enum: ['info', 'success', 'warning', 'achievement'] },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 13. Settings Schema
const SettingsSchema = new Schema({
  userId: { type: String, required: true },
  theme: { type: String, default: 'dark', enum: ['dark', 'light'] },
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  aiPreferences: {
    modelType: { type: String, default: 'Gemini' },
    frequency: { type: String, default: 'daily' }
  }
});

// 14. AdminLog Schema
const AdminLogSchema = new Schema({
  adminId: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Export all models registered through getModel helper
export const User = getModel('User', UserSchema);
export const Profile = getModel('Profile', ProfileSchema);
export const Skill = getModel('Skill', SkillSchema);
export const Roadmap = getModel('Roadmap', RoadmapSchema);
export const Resource = getModel('Resource', ResourceSchema);
export const Project = getModel('Project', ProjectSchema);
export const Job = getModel('Job', JobSchema);
export const Application = getModel('Application', ApplicationSchema);
export const Resume = getModel('Resume', ResumeSchema);
export const Interview = getModel('Interview', InterviewSchema);
export const Achievement = getModel('Achievement', AchievementSchema);
export const Notification = getModel('Notification', NotificationSchema);
export const Settings = getModel('Settings', SettingsSchema);
export const AdminLog = getModel('AdminLog', AdminLogSchema);
