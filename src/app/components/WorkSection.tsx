import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ExternalLink, X, Github, Download } from 'lucide-react';
import { Button } from './ui/button';
import workflowImage from 'figma:asset/dc602d4a00ad980a0454c3d7a4f54f098d386021.png';
import daryImage from 'figma:asset/e52568d8da3ef9289e341f3b64637548e0968769.png';
import masrofatyImage from 'figma:asset/f53f539aab41512050c5d256636c56d17a78fe3c.png';

const projects = [
  {
    id: 'linkedin-jobs',
    title: 'LinkedIn Jobs Auto-Apply',
    tech: ['n8n', 'Apify', 'OpenRouter', 'Google Sheets', 'Telegram'],
    description:
      'Scrapes LinkedIn jobs, scores relevance with AI, and generates personalized cover letters on a weekly schedule.',
    image: workflowImage,
    steps: [
      { title: 'Get & Deduplicate Jobs', detail: 'Weekly scraping of LinkedIn via Apify, deduplication by Company+Title, and appending new jobs to Google Sheets.' },
      { title: 'Check Job Relevance', detail: 'AI Agent scores each job against your resume using OpenRouter. Irrelevant jobs are removed; relevant matches trigger Telegram notifications.' },
      { title: 'Prepare Cover Letter', detail: 'A second AI Agent generates a tailored cover letter (<250 words), saves it as a Google Doc, and links it in the tracking sheet.' },
    ],
    githubLink: 'https://github.com/Mohamed-Shahen-AI/LinkedIn-Job-Automation-and-AI-Matcher',
    jsonFile: '/src/imports/LinkedIn_Jobs.json',
  },
  {
    id: 'dary',
    title: 'Dary: Property Outreach',
    tech: ['n8n', 'Telegram', 'Evolution API', 'Google Sheets', 'WhatsApp'],
    description:
      'Monitors leads via Telegram, prevents duplicate outreach with Google Sheets, and dispatches WhatsApp messages automatically.',
    image: daryImage,
    steps: [
      { title: 'Trigger & Validate', detail: 'Receives phone numbers via Telegram Bot and queries Google Sheets to check for duplicate contacts.' },
      { title: 'Message via WhatsApp', detail: 'Dispatches a predefined Arabic outreach template via Evolution API with built-in error handling.' },
      { title: 'Log & Report', detail: 'Appends results to Google Sheets for tracking and sends a status confirmation back to Telegram.' },
    ],
    githubLink: 'https://github.com/Mohamed-Shahen-AI/Dary',
    jsonFile: '/src/imports/Dary.json',
  },
  {
    id: 'masrofaty',
    title: 'Masrofaty: Finance Assistant',
    tech: ['n8n', 'Telegram', 'OpenRouter', 'Google Sheets', 'LangChain'],
    description:
      'AI expense tracker that parses Egyptian Arabic slang to categorize and log transactions into Google Sheets via Telegram.',
    image: masrofatyImage,
    steps: [
      { title: 'Ingest & Authenticate', detail: 'Receives text input via Telegram Bot and verifies user identity before processing.' },
      { title: 'AI Processing', detail: 'An AI Agent with Nemotron LLM parses Egyptian Arabic slang to extract item, price, and category.' },
      { title: 'Log & Report', detail: 'Appends transactions to Google Sheets with timestamps and sends structured confirmations via Telegram.' },
    ],
    githubLink: 'https://github.com/Mohamed-Shahen-AI/Masrofaty',
    jsonFile: '/src/imports/Masrofaty.json',
  },
];

function ProjectCard({
  project,
  index,
  isInView,
  onOpenDetail,
}: {
  project: (typeof projects)[0];
  index: number;
  isInView: boolean;
  onOpenDetail: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15 * index, ease: 'easeOut' }}
      className="group flex flex-col"
    >
      <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-lg hover:shadow-xl hover:-translate-y-1.5 hover:border-border/80 transition-all duration-300 overflow-hidden">
        {/* Image */}
        <div
          className="relative overflow-hidden cursor-pointer aspect-[16/10]"
          onClick={onOpenDetail}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-chart-4 bg-chart-4/10 px-2 py-0.5 rounded-full backdrop-blur-sm border border-chart-4/10">
              n8n Workflow
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h4
            className="text-lg font-bold text-primary mb-2 cursor-pointer hover:text-chart-4 transition-colors line-clamp-1"
            onClick={onOpenDetail}
          >
            {project.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-[11px] font-medium text-foreground bg-muted rounded-md border border-border"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-auto">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full border-border text-foreground hover:bg-muted hover:text-primary text-xs"
              >
                <Github className="w-3.5 h-3.5 mr-1.5" />
                GitHub
              </Button>
            </a>
            <a href={project.jsonFile} download className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-border text-foreground hover:bg-muted hover:text-primary text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                JSON
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function WorkSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [detailOpen, setDetailOpen] = useState<string | null>(null);

  return (
    <>
      <section
        id="work"
        className="min-h-screen py-24 bg-muted/30"
        ref={ref}
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-chart-4 text-sm font-medium tracking-widest uppercase mb-3">
              Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Projects
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base">
              Automation workflows and AI-powered systems built with n8n, LLMs, and modern integrations.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isInView={isInView}
                onOpenDetail={() => setDetailOpen(project.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {detailOpen &&
        (() => {
          const project = projects.find((p) => p.id === detailOpen);
          if (!project) return null;
          return (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setDetailOpen(null)}
            >
              <motion.div
                className="bg-[#1e1e24] rounded-2xl border border-white/[0.08] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header image */}
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto rounded-t-2xl"
                  />
                  <button
                    onClick={() => setDetailOpen(null)}
                    className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full p-1.5 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-emerald-400 font-medium mb-4">
                    {project.tech.join(' · ')}
                  </p>
                  <p className="text-zinc-400 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <h4 className="text-base font-semibold text-white mb-3">
                    Workflow Steps
                  </h4>
                  <div className="space-y-3 mb-6">
                    {project.steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {step.title}
                          </p>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-base font-semibold text-white mb-3">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-white/[0.05] rounded-md text-xs font-medium text-zinc-300 border border-white/[0.06]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-white text-black hover:bg-zinc-200 font-medium">
                        <Github className="w-4 h-4 mr-2" />
                        View on GitHub
                      </Button>
                    </a>
                    <a href={project.jsonFile} download className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-white/10 text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download JSON
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
    </>
  );
}