import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Workflow, Brain, Code, Wrench, Shield, Activity, Lightbulb } from 'lucide-react';

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      title: 'Automation',
      icon: Workflow,
      color: 'chart-1',
      bgColor: 'bg-chart-1',
      textColor: 'text-chart-1',
      skills: [
        'n8n (Advanced)', 
        'Workflow Orchestration', 
        'Global Error Handling', 
        'Custom Logic (Python/JS Nodes)', 
        'Webhooks',
        'API Integration'
      ],
    },
    {
      title: 'Artificial Intelligence',
      icon: Brain,
      color: 'chart-2',
      bgColor: 'bg-chart-2',
      textColor: 'text-chart-2',
      skills: [
        'LLM Integration (OpenAI, Gemini)', 
        'Agentic Workflows', 
        'RAG Systems', 
        'Prompt Engineering', 
        'Structured Output Parsing',
        'Vector Databases'
      ],
    },
    {
      title: 'API & Security',
      icon: Shield,
      color: 'chart-5',
      bgColor: 'bg-chart-5',
      textColor: 'text-chart-5',
      skills: [
        'Advanced OAuth2 Flows', 
        'JWT Authentication', 
        'Manual API Integration (Evolution API)', 
        'Refresh Token Logic',
        'REST API Design'
      ],
    },
    {
      title: 'Backend & DevOps',
      icon: Code,
      color: 'chart-3',
      bgColor: 'bg-chart-3',
      textColor: 'text-chart-3',
      skills: [
        'Docker', 
        'Docker-Compose', 
        'Linux (Ubuntu)', 
        'Git/GitHub',
        'Python (FastAPI)',
        'Cloud Deployment'
      ],
    },
    {
      title: 'Monitoring & Tools',
      icon: Activity,
      color: 'chart-4',
      bgColor: 'bg-chart-4',
      textColor: 'text-chart-4',
      skills: [
        'Sentry (Error Tracking)', 
        'Better Stack (Logging)', 
        'Postman', 
        'Google Sheets/Docs API',
        'Performance Monitoring'
      ],
    },
    {
      title: 'Soft Skills',
      icon: Lightbulb,
      color: 'chart-6',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-500',
      skills: [
        'Problem Decomposition (Analytical Thinking)', 
        'Adaptability & Continuous Learning', 
        'Systems Thinking', 
        'Technical Communication', 
        'Ethical Judgment'
      ],
    },
  ];

  return (
    <section id="skills" className="min-h-screen py-20 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
            Skills
          </h2>
          <div className="w-24 h-1 bg-chart-5 mx-auto"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + catIndex * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className={`p-3 ${category.bgColor}/10 rounded-xl`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <category.icon className={`w-8 h-8 ${category.textColor}`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-primary">{category.title}</h3>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.3 + catIndex * 0.1 + skillIndex * 0.05 }}
                      className="flex items-center gap-3 group"
                    >
                      <div className={`w-2 h-2 rounded-full ${category.bgColor}`} />
                      <span className="text-foreground group-hover:text-primary transition-colors">
                        {skill}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}