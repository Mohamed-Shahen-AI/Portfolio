import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Workflow, Zap, Database, Cloud } from 'lucide-react';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: Workflow, label: 'Workflows Built', value: '10+', color: 'text-chart-1' },
    { icon: Zap, label: 'Time Saved', value: '60%+', color: 'text-chart-2' },
    { icon: Database, label: 'Integrations', value: '5+ APIs', color: 'text-chart-3' },
    { icon: Cloud, label: 'Deployments', value: 'Cloud-Ready', color: 'text-chart-4' },
  ];

  return (
    <section id="about" className="min-h-screen py-20 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
            About
          </h2>
          <div className="w-24 h-1 bg-chart-3 mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mb-12"
          >
            <p className="text-lg leading-relaxed">
              Results-driven AI Automation Engineer and n8n Specialist with extensive experience in architecting complex, production-ready workflows. Expert in integrating Large Language Models (LLMs) and building RAG systems to automate business processes. Proficient in Python, JavaScript, and API Security (OAuth2/JWT) to develop scalable, self-healing AI-driven solutions. Experienced in CRM integration and optimization to streamline customer relationship management and drive business growth.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="relative group"
              >
                <div className="bg-accent rounded-xl p-6 text-center h-full border border-border hover:border-ring transition-all duration-300">
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      boxShadow: '0 0 20px rgba(161, 161, 161, 0.3)',
                    }}
                  />
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  </motion.div>
                  <div className="text-3xl font-bold mb-2 text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Node Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 relative h-32 flex items-center justify-center"
          >
            <svg className="w-full h-full" viewBox="0 0 800 150">
              {/* Connecting lines */}
              {[0, 1, 2].map((i) => (
                <motion.line
                  key={i}
                  x1={100 + i * 200}
                  y1="75"
                  x2={200 + i * 200}
                  y2="75"
                  stroke="var(--color-chart-1)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
                  transition={{ duration: 1, delay: 1 + i * 0.2 }}
                />
              ))}
              
              {/* Nodes */}
              {stats.map((stat, i) => (
                <motion.g key={i}>
                  <motion.circle
                    cx={100 + i * 200}
                    cy="75"
                    r="20"
                    fill="var(--color-secondary)"
                    stroke={`var(--color-chart-${(i % 5) + 1})`}
                    strokeWidth="3"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  />
                  <motion.circle
                    cx={100 + i * 200}
                    cy="75"
                    r="20"
                    fill="none"
                    stroke={`var(--color-chart-${(i % 5) + 1})`}
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? {
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1.5 + i * 0.2,
                    }}
                  />
                </motion.g>
              ))}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}