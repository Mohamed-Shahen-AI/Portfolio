import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import { Progress } from './ui/progress';

export function EducationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Calculate progress (assuming started in 2023, ending in 2027)
  const startYear = 2023;
  const endYear = 2027;
  const currentDate = new Date('2026-03-10'); // Today's date from instructions
  const progressPercentage = Math.min(
    100,
    ((currentDate.getFullYear() - startYear) / (endYear - startYear)) * 100
  );

  return (
    <section id="education" className="min-h-screen py-20 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
            Education
          </h2>
          <div className="w-24 h-1 bg-chart-5 mx-auto"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-lg"
          >
            <div className="flex items-start gap-6 mb-8">
              <motion.div
                className="p-4 bg-chart-3/10 rounded-xl"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              >
                <GraduationCap className="w-12 h-12 text-chart-3" />
              </motion.div>

              <div className="flex-1">
                <h3 className="text-3xl font-bold text-primary mb-2">
                  Bachelor of Science in Engineering
                </h3>
                <div className="text-xl text-chart-3 mb-2">
                  Computer/Software Engineering
                </div>
                <div className="text-lg text-muted-foreground mb-1">
                  Tanta University, Egypt
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Expected Graduation: June 2027</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8 p-6 bg-muted/50 rounded-xl border border-border"
            >
              <p className="text-lg text-center italic">
                "Engineering the core for AI-driven automations."
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-3"
            >
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Degree Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="relative">
                <Progress 
                  value={0}
                  className="h-3 bg-muted"
                />
                <motion.div
                  className="absolute top-0 left-0 h-3 rounded-full bg-chart-3"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${progressPercentage}%` } : {}}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2023</span>
                <span>2027</span>
              </div>
            </motion.div>

            {/* Key Areas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 pt-8 border-t border-border"
            >
              <h4 className="text-lg font-semibold mb-4 text-primary">Key Focus Areas</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Software Engineering',
                  'AI & Machine Learning',
                  'Automation Systems',
                  'Backend Development',
                  'Cloud Computing',
                  'System Architecture',
                ].map((area, index) => (
                  <motion.div
                    key={area}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1.1 + index * 0.05 }}
                    className="px-3 py-2 bg-accent rounded-lg text-sm text-center hover:bg-chart-3/20 transition-colors"
                  >
                    {area}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}