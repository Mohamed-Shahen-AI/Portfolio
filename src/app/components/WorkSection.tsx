import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { Database, Zap, Send, type LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { API_BASE_URL, publicAnonKey } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  tech: string;
  description: string;
  iconType: 'lucide' | 'image';
  iconName?: string;
  imageUrl?: string;
  videoUrl?: string;
  jsonUrl?: string;
  githubLink?: string;
  color: string;
  actionLabel?: string;
}

export function WorkSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [ragModalOpen, setRagModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [ragQuery, setRagQuery] = useState('');
  const [ragResponse, setRagResponse] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from:', `${API_BASE_URL}/projects`);
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      const data = await response.json();
      console.log('Projects data:', data);
      
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      console.log('Loading default projects as fallback...');
      
      // Set default projects array as fallback
      setProjects([
        {
          id: 'project:default-1',
          title: 'RAG-Powered Knowledge Base',
          tech: 'n8n | LLMs | Retrieval System',
          description: 'Built query system for private docs via LLMs, integrated in n8n for efficient data/response gen.',
          iconType: 'lucide',
          iconName: 'Database',
          color: 'chart-1',
          actionLabel: 'Simulate Query',
        },
        {
          id: 'project:default-2',
          title: 'AI-Enhanced Business Automation',
          tech: 'LLM APIs | Categorization',
          description: 'System auto-categorizes/prioritizes inquiries, cutting manual time 60%+.',
          iconType: 'lucide',
          iconName: 'Zap',
          color: 'chart-2',
          actionLabel: 'Test Prioritization',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getLucideIcon = (name: string): LucideIcon => {
    return (LucideIcons as any)[name] || LucideIcons.Zap;
  };

  const handleRagQuery = () => {
    setRagResponse(`Based on your query "${ragQuery}", I found relevant information in the knowledge base. The RAG system has successfully retrieved context and generated a comprehensive response using LLM integration.`);
  };

  const handleAiTest = () => {
    const priority = Math.random() > 0.5 ? 'High' : 'Medium';
    const category = ['Technical Support', 'Sales Inquiry', 'General Question'][Math.floor(Math.random() * 3)];
    setAiResult(`Inquiry: "${aiInput}"\nCategory: ${category}\nPriority: ${priority}\nEstimated Response Time: ${priority === 'High' ? '15 min' : '1 hour'}`);
  };

  return (
    <>
      <section id="work" className="min-h-screen py-20 bg-background" ref={ref}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
              Work
            </h2>
            <div className="w-24 h-1 bg-chart-4 mx-auto"></div>
          </motion.div>

          {/* Projects Section */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                  className="group relative"
                >
                  <div className="bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div
                      className={`p-4 bg-${project.color}/10 rounded-xl w-fit mb-6`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      {project.iconType === 'lucide' && project.iconName ? (
                        (() => {
                          const Icon = getLucideIcon(project.iconName);
                          return <Icon className={`w-10 h-10 text-${project.color}`} />;
                        })()
                      ) : project.iconType === 'image' && project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : null}
                    </motion.div>

                    {/* Content */}
                    <h4 className="text-2xl font-bold text-primary mb-3">
                      {project.title}
                    </h4>
                    <div className={`text-sm text-${project.color} mb-4 font-medium`}>
                      {project.tech}
                    </div>
                    <p className="text-foreground mb-6 flex-grow">
                      {project.description}
                    </p>

                    {/* Node visualization */}
                    <div className="mb-6 relative h-16">
                      <svg className="w-full h-full" viewBox="0 0 300 60">
                        {[0, 1, 2].map((i) => (
                          <g key={i}>
                            {i < 2 && (
                              <motion.line
                                x1={50 + i * 100}
                                y1="30"
                                x2={100 + i * 100}
                                y2="30"
                                stroke={`var(--color-${project.color})`}
                                strokeWidth="2"
                                strokeDasharray="3,3"
                                initial={{ pathLength: 0 }}
                                animate={isInView ? { pathLength: 1 } : {}}
                                transition={{ duration: 1, delay: 0.5 + index * 0.2 + i * 0.2 }}
                              />
                            )}
                            <motion.circle
                              cx={50 + i * 100}
                              cy="30"
                              r="8"
                              fill={`var(--color-secondary)`}
                              stroke={`var(--color-${project.color})`}
                              strokeWidth="2"
                              initial={{ scale: 0 }}
                              animate={isInView ? { scale: 1 } : {}}
                              transition={{ duration: 0.3, delay: 0.5 + index * 0.2 + i * 0.15 }}
                            />
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Action button */}
                    <Button
                      onClick={() => {
                        if (project.actionLabel === 'Simulate Query') {
                          setRagModalOpen(true);
                        } else if (project.actionLabel === 'Test Prioritization') {
                          setAiModalOpen(true);
                        }
                      }}
                      className="w-full group-hover:shadow-lg transition-shadow"
                      variant="outline"
                    >
                      {project.actionLabel}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RAG Modal */}
      <Dialog open={ragModalOpen} onOpenChange={setRagModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>RAG-Powered Knowledge Base</DialogTitle>
            <DialogDescription>
              Interactive demonstration of the RAG system for intelligent document retrieval
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter your query..."
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              className="bg-input-background"
            />
            <Button onClick={handleRagQuery} className="w-full" disabled={!ragQuery}>
              <Database className="w-4 h-4 mr-2" />
              Query Knowledge Base
            </Button>
            {ragResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-muted rounded-lg"
              >
                <p className="text-sm">{ragResponse}</p>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Automation Modal */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI-Enhanced Business Automation</DialogTitle>
            <DialogDescription>
              Test the AI categorization and prioritization system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter a customer inquiry..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="bg-input-background"
            />
            <Button onClick={handleAiTest} className="w-full" disabled={!aiInput}>
              <Zap className="w-4 h-4 mr-2" />
              Analyze & Prioritize
            </Button>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-muted rounded-lg"
              >
                <pre className="text-sm whitespace-pre-wrap">{aiResult}</pre>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}