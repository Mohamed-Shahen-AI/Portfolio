import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Home, User, Briefcase, GraduationCap, Wrench, Mail } from 'lucide-react';
import profilePhoto from 'figma:asset/9fe7a28b88c92371b8946691d4fcc9b3a04c3469.png';

interface NavigationProps {
  onNavigate: (section: string) => void;
  onDashboardClick: () => void;
}

export function Navigation({ onNavigate, onDashboardClick }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);

      // Update active section based on scroll position
      const sections = ['home', 'about', 'work', 'skills', 'education', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={onDashboardClick}
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src={profilePhoto} 
              alt="Muhammad Shaheen" 
              className="w-10 h-10 rounded-full object-cover border-2 border-primary"
            />
            <span className="text-lg font-bold text-primary hidden sm:block">
              Muhammad Shaheen
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Mobile menu - simplified */}
          <div className="md:hidden flex items-center gap-2">
            {navItems.slice(0, 3).map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`p-2 rounded-lg ${
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}