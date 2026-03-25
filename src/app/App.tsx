import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WorkSection } from './components/WorkSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from 'sonner';

// Portfolio app - no backend dependencies
function App() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId === 'home' ? 'hero' : sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: sectionId === 'home' ? 0 : elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <Navigation onNavigate={scrollToSection} />
      
      <main>
        <div id="hero">
          <HeroSection onNavigate={scrollToSection} />
        </div>
        <AboutSection />
        <WorkSection />
        <SkillsSection />
        <EducationSection />
        <ContactSection />
      </main>

      <footer className="bg-muted/30 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Muhammad Shaheen. AI & Automation Engineer.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Built with React, Motion, and Tailwind CSS
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;