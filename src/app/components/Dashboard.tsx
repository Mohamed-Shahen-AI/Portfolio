import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Upload, Image as ImageIcon, 
  Video, FileJson, Github, LogOut, Save, X, LucideIcon, Download 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { supabase, API_BASE_URL, publicAnonKey } from '../lib/supabase';
import { toast } from 'sonner';

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
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardProps {
  onClose: () => void;
}

const CHART_COLORS = ['chart-1', 'chart-2', 'chart-3', 'chart-4'];

export function Dashboard({ onClose }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    tech: '',
    description: '',
    iconType: 'lucide',
    iconName: 'Zap',
    color: 'chart-1',
    githubLink: '',
    actionLabel: 'View Demo',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchProjects();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('=== AUTH STATE CHANGE ===');
      console.log('Event:', _event);
      console.log('Session exists:', !!session);
      console.log('Access token exists:', !!session?.access_token);
      console.log('User:', session?.user?.email);
      console.log('Expires at:', session?.expires_at);
      console.log('========================');
      
      if (session?.access_token) {
        console.log('Setting access token from auth state change');
        setAccessToken(session.access_token);
      } else {
        console.log('No session or access token available');
        setAccessToken(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    console.log('=== CHECKING AUTHENTICATION ===');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Session check result:', {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        error: error,
        user: session?.user?.email,
        expiresAt: session?.expires_at,
        currentTime: Math.floor(Date.now() / 1000)
      });
      
      if (error) {
        console.error('Session check error:', error);
      }
      
      if (session?.access_token) {
        console.log('Access token found! Setting it...');
        setAccessToken(session.access_token);
      } else {
        console.log('No access token in session');
        setAccessToken(null);
      }
    } catch (err) {
      console.error('checkAuth exception:', err);
    }
    
    console.log('==============================');
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects. Please check your connection.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, type: string): Promise<string | null> => {
    if (!accessToken) {
      toast.error('Not authenticated');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.url;
      } else {
        toast.error(data.error || 'Upload failed');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  const handleSaveProject = async () => {
    console.log('handleSaveProject called. Access token:', accessToken ? 'EXISTS' : 'NULL');
    
    if (!formData.title || !formData.tech || !formData.description) {
      toast.error('Please fill in all required fields (Title, Tech Stack, Description)');
      return;
    }

    setUploading(true);
    
    try {
      // Get current session
      console.log('Getting current session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error('Authentication error. Please sign in again.');
        setUploading(false);
        return;
      }
      
      if (!session?.access_token) {
        console.error('No access token in session');
        toast.error('Not authenticated. Please sign in again.');
        setUploading(false);
        return;
      }
      
      // Use the current session token
      const currentToken = session.access_token;
      console.log('===== TOKEN DEBUG =====');
      console.log('Token length:', currentToken.length);
      console.log('Token preview (first 50 chars):', currentToken.substring(0, 50));
      console.log('Token preview (last 50 chars):', currentToken.substring(currentToken.length - 50));
      console.log('Session expires at:', session.expires_at);
      console.log('Current timestamp:', Math.floor(Date.now() / 1000));
      console.log('Token expired?', session.expires_at ? session.expires_at < Math.floor(Date.now() / 1000) : 'unknown');
      console.log('=====================');
      
      // Upload files if provided
      let imageUrl = formData.imageUrl;
      let videoUrl = formData.videoUrl;
      let jsonUrl = formData.jsonUrl;

      if (imageFile) {
        const url = await uploadFile(imageFile, 'image');
        if (url) imageUrl = url;
      }

      if (videoFile) {
        const url = await uploadFile(videoFile, 'video');
        if (url) videoUrl = url;
      }

      if (jsonFile) {
        const url = await uploadFile(jsonFile, 'json');
        if (url) jsonUrl = url;
      }

      const projectData = {
        ...formData,
        imageUrl,
        videoUrl,
        jsonUrl,
      };

      const url = editingProject
        ? `${API_BASE_URL}/projects/${editingProject.id}`
        : `${API_BASE_URL}/projects`;

      console.log('Sending project request to:', url);
      console.log('Project data:', projectData);
      console.log('Using user token:', currentToken.substring(0, 30) + '...');
      console.log('Using anon key for auth:', publicAnonKey.substring(0, 30) + '...');

      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // Use anon key for Supabase Edge Functions
          'X-User-Token': currentToken, // Pass user token in custom header
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();
      console.log('Server response status:', response.status);
      console.log('Server response data:', data);
      
      // Handle 401 - Token expired or invalid
      if (response.status === 401) {
        console.error('401 Unauthorized:', data);
        toast.error('Authentication failed. Please sign out and sign in again.');
        
        // Sign out the user
        console.log('Signing out due to auth failure...');
        await supabase.auth.signOut();
        setUploading(false);
        return;
      }
      
      if (data.success) {
        toast.success(editingProject ? 'Project updated!' : 'Project created!');
        fetchProjects();
        handleCloseModal();
      } else {
        console.error('Project save failed:', data);
        toast.error(data.error || data.message || 'Failed to save project');
      }
    } catch (error) {
      console.error('Save project error:', error);
      toast.error(`Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!accessToken) {
      toast.error('Not authenticated');
      return;
    }

    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Project deleted!');
        fetchProjects();
      } else {
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Delete project error:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      tech: '',
      description: '',
      iconType: 'lucide',
      iconName: 'Zap',
      color: 'chart-1',
      githubLink: '',
      actionLabel: 'View Demo',
    });
    setImageFile(null);
    setVideoFile(null);
    setJsonFile(null);
  };

  const handleSignOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    onClose();
  };

  const handleInitDefaults = async () => {
    if (!accessToken) {
      toast.error('Not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/init-defaults`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Default projects added!');
        fetchProjects();
      } else {
        toast.error(data.error || 'Failed to initialize defaults');
      }
    } catch (error) {
      console.error('Initialize defaults error:', error);
      toast.error('Failed to initialize default projects');
    }
  };

  const getLucideIcon = (name: string): LucideIcon => {
    return (LucideIcons as any)[name] || LucideIcons.Zap;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Project Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your portfolio projects 
                {accessToken && <span className="ml-2 text-xs text-green-500">● Authenticated</span>}
                {!accessToken && <span className="ml-2 text-xs text-red-500">● Not Authenticated</span>}
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
              <Button variant="secondary" onClick={handleInitDefaults}>
                <Download className="w-4 h-4 mr-2" />
                Load Sample Projects
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="ghost" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No projects yet</p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const Icon = project.iconType === 'lucide' && project.iconName 
                ? getLucideIcon(project.iconName) 
                : null;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Icon/Image */}
                  <div className="mb-4">
                    {project.iconType === 'image' && project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : Icon ? (
                      <div className={`p-3 bg-${project.color}/10 rounded-lg w-fit`}>
                        <Icon className={`w-8 h-8 text-${project.color}`} />
                      </div>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
                  <p className={`text-sm text-${project.color} mb-3`}>{project.tech}</p>
                  <p className="text-foreground text-sm mb-4">{project.description}</p>

                  {/* Links */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.videoUrl && (
                      <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-chart-2 hover:underline flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video
                      </a>
                    )}
                    {project.jsonUrl && (
                      <a href={project.jsonUrl} target="_blank" rel="noopener noreferrer"
                         className="text-xs text-chart-3 hover:underline flex items-center gap-1">
                        <FileJson className="w-3 h-3" /> JSON
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                         className="text-xs text-chart-4 hover:underline flex items-center gap-1">
                        <Github className="w-3 h-3" /> GitHub
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditProject(project)}
                      className="flex-1"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Project Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 'Update project details and media files.' : 'Create a new project with custom icons, images, videos, and more.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., RAG-Powered Knowledge Base"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <Label htmlFor="tech">Tech Stack *</Label>
              <Input
                id="tech"
                value={formData.tech}
                onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                placeholder="e.g., n8n | LLMs | Vector DB"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project..."
                rows={3}
              />
            </div>

            {/* Icon Type Selection */}
            <div>
              <Label>Icon Type</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="iconType"
                    checked={formData.iconType === 'lucide'}
                    onChange={() => setFormData({ ...formData, iconType: 'lucide' })}
                  />
                  <span>Lucide Icon</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="iconType"
                    checked={formData.iconType === 'image'}
                    onChange={() => setFormData({ ...formData, iconType: 'image' })}
                  />
                  <span>Image</span>
                </label>
              </div>
            </div>

            {/* Lucide Icon Name */}
            {formData.iconType === 'lucide' && (
              <div>
                <Label htmlFor="iconName">Lucide Icon Name</Label>
                <Input
                  id="iconName"
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  placeholder="e.g., Zap, Database, Send"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Browse icons at <a href="https://lucide.dev" target="_blank" className="text-primary hover:underline">lucide.dev</a>
                </p>
              </div>
            )}

            {/* Image Upload */}
            {formData.iconType === 'image' && (
              <div>
                <Label htmlFor="image">Project Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
            )}

            {/* Color */}
            <div>
              <Label htmlFor="color">Color Theme</Label>
              <select
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full p-2 rounded-md border border-border bg-background"
              >
                {CHART_COLORS.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            {/* Video Upload */}
            <div>
              <Label htmlFor="video">Demo Video (Optional)</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* JSON Upload */}
            <div>
              <Label htmlFor="json">JSON File (Optional)</Label>
              <Input
                id="json"
                type="file"
                accept=".json"
                onChange={(e) => setJsonFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* GitHub Link */}
            <div>
              <Label htmlFor="github">GitHub Link (Optional)</Label>
              <Input
                id="github"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>

            {/* Action Label */}
            <div>
              <Label htmlFor="actionLabel">Button Label</Label>
              <Input
                id="actionLabel"
                value={formData.actionLabel}
                onChange={(e) => setFormData({ ...formData, actionLabel: e.target.value })}
                placeholder="e.g., View Demo, Test Now"
              />
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSaveProject} 
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}