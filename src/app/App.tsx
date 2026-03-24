import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WorkSection } from './components/WorkSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('App.tsx - Auth state changed:', _event, 'Has session:', !!session);
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const handleDashboardAccess = () => {
    console.log('Dashboard access requested. Authenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Opening dashboard...');
      setShowDashboard(true);
    } else {
      console.log('Not authenticated, showing login...');
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = async () => {
    console.log('Login successful! Updating auth state...');
    
    // Wait a moment for Supabase to update the session
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Force session check
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session after login:', !!session, 'Has token:', !!session?.access_token);
    
    setIsAuthenticated(!!session);
    setShowLogin(false);
    setShowDashboard(true);
  };

  const handleCloseDashboard = () => {
    setShowDashboard(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'dashboard') {
      handleDashboardAccess();
      return;
    }
    
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
      <Navigation onNavigate={scrollToSection} onDashboardClick={handleDashboardAccess} />
      
      <main>
        <div id="hero">
          <HeroSection onNavigate={scrollToSection} onDashboardClick={handleDashboardAccess} />
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

      {showLogin && <Login onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />}
      {showDashboard && <Dashboard onClose={handleCloseDashboard} />}
      
      <Toaster />
    </div>
  );
}

export default App;