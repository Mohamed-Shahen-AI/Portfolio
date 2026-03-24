import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, User, LogIn, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase, API_BASE_URL, publicAnonKey } from '../lib/supabase';
import { toast } from 'sonner';

interface LoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function Login({ onSuccess, onClose }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Test server connection
  const testServer = async () => {
    try {
      console.log('Testing server at:', `${API_BASE_URL}/health`);
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      console.log('Server health check:', data);
      if (data.status === 'ok') {
        toast.success('Server is online!');
      }
    } catch (error) {
      console.error('Server health check failed:', error);
      toast.error('Cannot connect to server');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);

    try {
      console.log('API URL:', `${API_BASE_URL}/signup`);
      console.log('Attempting signup with:', { email: formData.email, name: formData.name });
      
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Full response data:', JSON.stringify(data, null, 2));

      // Check if there's an error
      if (data.error) {
        console.error('Sign up error from server:', data.error);
        toast.error(data.error || 'Sign up failed - unknown error');
        setLoading(false);
        return;
      }

      // Check if signup was successful
      if (data.success && data.user) {
        console.log('Signup successful! User:', data.user);
        toast.success('Account created successfully! Signing you in...');
        
        // Automatically sign in after successful signup
        setTimeout(async () => {
          console.log('Attempting auto sign-in...');
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (signInError) {
            console.error('Auto sign-in error:', signInError);
            toast.error('Account created but auto sign-in failed. Please sign in manually.');
            setIsSignUp(false);
            setLoading(false);
          } else if (signInData.session) {
            console.log('Auto sign-in successful!');
            toast.success('Signed in successfully!');
            onSuccess();
          }
        }, 1000);
      } else {
        // Unexpected response format
        console.error('Unexpected response format:', data);
        toast.error('Signup completed but received unexpected response. Please try signing in.');
        setIsSignUp(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Sign up exception:', error);
      toast.error(`Sign up failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('=== SIGNING IN ===');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      console.log('Sign in response:', {
        hasSession: !!data.session,
        hasAccessToken: !!data.session?.access_token,
        error: error
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
      } else if (data.session) {
        console.log('Session created successfully!');
        console.log('Access token:', data.session.access_token.substring(0, 30) + '...');
        
        // Wait a bit for the session to be persisted to localStorage
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify the session was saved
        const { data: { session: savedSession } } = await supabase.auth.getSession();
        console.log('Verified saved session:', {
          hasSession: !!savedSession,
          hasAccessToken: !!savedSession?.access_token
        });
        
        if (savedSession?.access_token) {
          console.log('Session verified! Calling onSuccess()');
          toast.success('Signed in successfully!');
          onSuccess();
        } else {
          console.error('Session was not saved properly!');
          toast.error('Sign in failed - session not saved. Please try again.');
        }
      }
    } catch (error) {
      console.error('Sign in exception:', error);
      toast.error('Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-2xl border border-border max-w-md w-full p-8 relative"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            {isSignUp ? 'Create Account' : 'Dashboard Login'}
          </h2>
          <p className="text-muted-foreground">
            {isSignUp ? 'Sign up to manage your projects' : 'Sign in to access the dashboard'}
          </p>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  placeholder="Muhammad Shaheen"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}