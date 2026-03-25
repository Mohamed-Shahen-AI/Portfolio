import { motion } from 'motion/react';
import { useState } from 'react';
import { MapPin, Phone, Mail, Linkedin, ArrowRight, Calendar, Github, X } from 'lucide-react';
import { Button } from './ui/button';
import profilePhoto from 'figma:asset/7fc38f9fcda856c88a478fcf12cca01fd21c6642.png';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [photoOpen, setPhotoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-chart-2/10">
      {/* Animated background nodes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-chart-1 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Profile Photo */}
          <motion.div
            className="mb-8 inline-block cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => setPhotoOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-48 h-48 mx-auto">
              <div
                className="w-full h-full rounded-full bg-gradient-to-br from-chart-1 to-chart-2 p-1 overflow-hidden"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              >
                <div 
                  className="w-full h-full overflow-hidden"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                >
                  <img 
                    src={profilePhoto} 
                    alt="Muhammad Shaheen" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-chart-1"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.div>

          {/* Photo Lightbox */}
          {photoOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPhotoOpen(false)}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rounded-2xl overflow-hidden border-2 border-chart-1/50 shadow-2xl shadow-chart-1/20">
                  <img
                    src={profilePhoto}
                    alt="Muhammad Shaheen"
                    className="w-72 h-72 sm:w-96 sm:h-96 object-cover"
                  />
                </div>
                <button
                  onClick={() => setPhotoOpen(false)}
                  className="absolute -top-3 -right-3 bg-card border border-border rounded-full p-1.5 text-muted-foreground hover:text-foreground transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-center text-white/70 text-sm mt-3">Muhammad Shaheen</p>
              </motion.div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-4 text-primary"
            style={{
              textShadow: '0 0 20px rgba(161, 161, 161, 0.3)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Muhammad Shaheen
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl mb-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            AI Automation Engineer | n8n Specialist
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Manual data entry, disconnected apps, and the constant fear of human error – these are the silent killers of scaling businesses. I've seen how much energy is wasted when experts are stuck doing 'robot work'. My mission is to fix that. By architecting custom n8n workflows and AI agents, I bridge the gaps in your systems. I'm here to turn your operational headaches into automated assets, ensuring your data flows where it needs to be, exactly when it needs to be there. Let's stop the leaks and start building your intelligent infrastructure.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Book Consultation Button - Primary CTA */}
            <motion.a
              href={`mailto:mohamed.shahen.ai@gmail.com?subject=${encodeURIComponent('Free Consultation')}&body=${encodeURIComponent(`Hi Mohamed,

I'm reaching out after seeing your portfolio. I'm interested in exploring how automation can help my business.

My business type is [e.g., Lead management, Sales ]

Preferred time for a call: [e.g., Monday afternoon]

Looking forward to connecting!

Best regards,
[Your Name]`)}`}
              className="group relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="relative overflow-hidden text-lg px-10 py-7 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/50"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <span className="relative flex items-center gap-2 font-semibold">
                  <Calendar className="w-5 h-5" />
                  Book a Free Consultation
                </span>
              </Button>
            </motion.a>

            {/* More Button - Secondary CTA */}
            <Button
              size="lg"
              variant="outline"
              className="group relative overflow-hidden text-lg px-8 py-6"
              onClick={() => onNavigate('about')}
            >
              <motion.span
                className="absolute inset-0 bg-chart-1"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="flex flex-nowrap justify-center gap-3 text-sm max-w-7xl mx-auto overflow-x-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.a
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="w-4 h-4 text-chart-1" />
              <span>Tanta, Egypt</span>
            </motion.a>
            <motion.a
              href="tel:+201289775133"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <Phone className="w-4 h-4 text-chart-2" />
              <span>+201289775133</span>
            </motion.a>
            <motion.a
              href="mailto:mohamed.shahen.ai@gmail.com"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <Mail className="w-4 h-4 text-chart-3" />
              <span>mohamed.shahen.ai@gmail.com</span>
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/mohamed-shahen-301059314/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <Linkedin className="w-4 h-4 text-chart-4" />
              <span>LinkedIn Profile</span>
            </motion.a>
            <motion.a
              href="https://github.com/Mohamed-Shahen-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <Github className="w-4 h-4 text-chart-1" />
              <span>GitHub Profile</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}