import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../server/config/db.js';
import { Job, Resource, Project } from '../server/models/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    
    try {
      await Job.deleteOne({}); // Delete all mock entries (clears local db list)
      await Resource.deleteOne({});
      await Project.deleteOne({});
    } catch (err) {
      // Ignored
    }

    console.log('🌱 Seeding Jobs...');
    const jobs = [
      {
        title: 'Machine Learning Engineer',
        company: 'NeuralTech Inc',
        location: 'San Francisco, CA',
        description: 'Design and deploy core deep learning pipelines and neural network models.',
        skillsRequired: ['Python', 'PyTorch', 'Docker', 'Machine Learning'],
        salary: '$130,000 - $160,000'
      },
      {
        title: 'Full Stack Engineer (React/Node)',
        company: 'SaaSFlow Corp',
        location: 'Remote',
        description: 'Build premium landing pages and clean backends with optimized REST API design.',
        skillsRequired: ['React', 'Node.js', 'Express', 'TypeScript'],
        salary: '$115,000 - $140,000'
      },
      {
        title: 'AI Product Specialist',
        company: 'Cognitive Web Group',
        location: 'Boston, MA (Hybrid)',
        description: 'Bridge LLM pipelines with beautiful UI experiences. Design system focus.',
        skillsRequired: ['Python', 'React', 'LangChain', 'Tailwind CSS'],
        salary: '$100,000 - $125,000'
      }
    ];

    for (const job of jobs) {
      await Job.create(job);
    }

    console.log('🌱 Seeding Resources...');
    const resources = [
      {
        title: 'Deep Learning Specialization (Andrew Ng)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/deep-learning',
        mappedSkills: ['Machine Learning', 'Neural Networks', 'PyTorch']
      },
      {
        title: 'Next.js App Router Documentation',
        type: 'documentation',
        url: 'https://nextjs.org/docs',
        mappedSkills: ['React', 'Next.js', 'TypeScript']
      },
      {
        title: 'LangChain: Chat with your Data Course',
        type: 'course',
        url: 'https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/',
        mappedSkills: ['LangChain', 'Vector Databases', 'Python']
      },
      {
        title: 'Docker Containers Crash Course',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
        mappedSkills: ['Docker', 'DevOps']
      }
    ];

    for (const res of resources) {
      await Resource.create(res);
    }

    console.log('🌱 Seeding Projects...');
    const projects = [
      {
        title: 'Mini PyTorch NN from Scratch',
        description: 'Implement backpropagation, SGD, and basic dense layers with matrix math without using standard layers.',
        difficulty: 'intermediate',
        techStack: ['Python', 'NumPy', 'Math'],
        githubLink: 'https://github.com/example/pytorch-nn'
      },
      {
        title: 'Interactive Kanban CRM Board',
        description: 'A modern Kanban project featuring drag-and-drop actions, local storage sync, and custom theme layouts.',
        difficulty: 'beginner',
        techStack: ['React', 'Tailwind CSS', 'Drag-and-Drop API'],
        githubLink: 'https://github.com/example/kanban-crm'
      },
      {
        title: 'Document QA AI RAG Assistant',
        description: 'Upload PDFs, compute embeddings via OpenAI/Gemini, load into ChromaDB, and query with history tracking.',
        difficulty: 'advanced',
        techStack: ['Python', 'LangChain', 'Vector Databases', 'FastAPI'],
        githubLink: 'https://github.com/example/qa-rag-assistant'
      }
    ];

    for (const proj of projects) {
      await Project.create(proj);
    }

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
