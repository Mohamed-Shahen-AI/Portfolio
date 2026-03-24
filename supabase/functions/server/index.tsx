import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.47.10";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create a separate client for auth verification using anon key
const supabaseAuth = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

// Initialize storage bucket on startup
const initStorage = async () => {
  try {
    const bucketName = 'make-562b5286-projects';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log(`Created storage bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
};
initStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-562b5286/health", (c) => {
  return c.json({ status: "ok" });
});

// Database test endpoint
app.get("/make-server-562b5286/db-test", async (c) => {
  try {
    console.log('Testing database connection...');
    const testClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Test 1: Check if table exists
    const { data: tableData, error: tableError } = await testClient
      .from('kv_store_562b5286')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Table query error:', tableError);
      return c.json({ 
        success: false, 
        error: 'Table query failed',
        details: tableError,
        envCheck: {
          hasUrl: !!Deno.env.get('SUPABASE_URL'),
          hasKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        }
      });
    }
    
    return c.json({ 
      success: true, 
      message: 'Database connection successful',
      tableExists: true,
      rowCount: tableData?.length ?? 0,
      envCheck: {
        hasUrl: !!Deno.env.get('SUPABASE_URL'),
        hasKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      }
    });
  } catch (error) {
    console.error('DB test exception:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Auth middleware - verify user authentication
const authMiddleware = async (c: any, next: any) => {
  console.log('=== AUTH MIDDLEWARE START ===');
  const authHeader = c.req.header('Authorization');
  console.log('Authorization header:', authHeader ? 'EXISTS' : 'MISSING');
  
  const accessToken = authHeader?.split(' ')[1];
  console.log('Token extracted:', accessToken ? `YES (${accessToken.substring(0, 20)}...)` : 'NO');
  
  if (!accessToken) {
    console.log('No access token provided');
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }
  
  try {
    console.log('Attempting to verify token with SERVICE_ROLE client...');
    // Use the service role client to verify the user's JWT
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    console.log('Token verification result:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: error ? {
        message: error.message,
        status: error.status,
        name: error.name
      } : null
    });
    
    if (error || !user) {
      console.log('Token verification failed:', error);
      return c.json({ error: 'Unauthorized - Invalid token', details: error?.message }, 401);
    }
    
    console.log('Token verified successfully for user:', user.id);
    c.set('userId', user.id);
    await next();
  } catch (err) {
    console.error('Auth middleware exception:', err);
    return c.json({ error: 'Authentication failed', details: err.message }, 401);
  }
};

// Sign up endpoint
app.post("/make-server-562b5286/signup", async (c) => {
  console.log('=== SIGNUP REQUEST RECEIVED ===');
  try {
    const body = await c.req.json();
    console.log('Request body:', body);
    
    const { email, password, name } = body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    if (password.length < 6) {
      console.log('Password too short');
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }
    
    console.log('Creating user with email:', email, 'name:', name);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error('Supabase createUser error:', error);
      return c.json({ error: `Sign up failed: ${error.message}` }, 400);
    }
    
    if (!data || !data.user) {
      console.error('No user data returned from Supabase');
      return c.json({ error: 'Failed to create user - no data returned' }, 500);
    }
    
    console.log('User created successfully! ID:', data.user.id, 'Email:', data.user.email);
    
    const response = { 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    };
    
    console.log('Sending response:', response);
    return c.json(response);
  } catch (error) {
    console.error('Sign up exception:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: `Sign up failed: ${errorMessage}` }, 500);
  }
});

// Sign in endpoint (handled by Supabase client on frontend, but keeping for reference)
app.post("/make-server-562b5286/signin", async (c) => {
  return c.json({ message: "Use Supabase client for sign in" });
});

// Get all projects (public - no auth required)
app.get("/make-server-562b5286/projects", async (c) => {
  console.log('=== GET /projects REQUEST ===');
  console.log('Headers:', Object.fromEntries(c.req.raw.headers.entries()));
  
  try {
    console.log('Attempting to fetch projects with prefix: project:');
    const projects = await kv.getByPrefix('project:');
    console.log('Projects fetched successfully:', projects.length, 'projects found');
    return c.json({ projects, success: true });
  } catch (error) {
    console.error('Get projects error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    // Return empty array instead of error to keep portfolio working
    console.log('Returning empty projects array due to error');
    return c.json({ projects: [], success: true, warning: `Database error: ${errorMessage}` });
  }
});

// Initialize default projects (requires auth)
app.post("/make-server-562b5286/projects/init-defaults", authMiddleware, async (c) => {
  try {
    const defaultProjects = [
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
    ];

    console.log('Starting to initialize default projects...');
    for (const project of defaultProjects) {
      console.log(`Setting project: ${project.id}`);
      await kv.set(project.id, {
        ...project,
        createdAt: new Date().toISOString(),
      });
    }
    console.log('Successfully initialized all default projects');

    return c.json({ success: true, message: 'Default projects initialized' });
  } catch (error) {
    console.error('Initialize defaults error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: `Failed to initialize default projects: ${errorMessage}` }, 500);
  }
});

// Create project (requires auth)
app.post("/make-server-562b5286/projects", async (c) => {
  console.log('=== CREATE PROJECT REQUEST ===');
  console.log('Headers:', Object.fromEntries(c.req.raw.headers));
  
  // Manual auth check with detailed logging - read from custom header
  const userToken = c.req.header('X-User-Token');
  console.log('User token from X-User-Token header:', userToken ? 'EXISTS' : 'MISSING');
  
  if (!userToken) {
    console.log('No user token provided');
    return c.json({ error: 'Unauthorized - No user token provided' }, 401);
  }
  
  console.log('Extracted user token:', `YES (length: ${userToken.length})`);
  console.log('Token preview:', userToken.substring(0, 50) + '...');
  
  try {
    console.log('Verifying user token with Supabase...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(userToken);
    
    console.log('Auth result:', {
      hasUser: !!user,
      userId: user?.id,
      error: authError ? authError.message : null
    });
    
    if (authError || !user) {
      console.error('Token verification failed:', authError);
      return c.json({ error: 'Unauthorized - Invalid user token', details: authError?.message }, 401);
    }
    
    console.log('User authenticated successfully:', user.id);
    const userId = user.id;
    
    const projectData = await c.req.json();
    console.log('Project data received:', projectData);
    
    const projectId = `project:${crypto.randomUUID()}`;
    const fullProjectData = {
      id: projectId,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId
    };
    
    console.log('Saving project:', projectId);
    await kv.set(projectId, fullProjectData);
    console.log('Project saved successfully');
    
    return c.json({ 
      success: true, 
      project: fullProjectData 
    });
  } catch (error) {
    console.error('Create project exception:', error);
    return c.json({ error: 'Failed to create project', details: error.message }, 500);
  }
});

// Update project (requires auth)
app.put("/make-server-562b5286/projects/:id", authMiddleware, async (c) => {
  try {
    const projectId = c.req.param('id');
    const projectData = await c.req.json();
    
    await kv.set(projectId, {
      ...projectData,
      id: projectId,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Update project error:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Delete project (requires auth)
app.delete("/make-server-562b5286/projects/:id", authMiddleware, async (c) => {
  try {
    const projectId = c.req.param('id');
    await kv.del(projectId);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// Upload file to Supabase Storage (requires auth)
app.post("/make-server-562b5286/upload", authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    const fileName = `${Date.now()}_${file.name}`;
    const bucketName = 'make-562b5286-projects';
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }
    
    // Get signed URL for the uploaded file
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year
    
    return c.json({ 
      success: true, 
      path: data.path,
      url: signedUrlData?.signedUrl 
    });
  } catch (error) {
    console.error('Upload exception:', error);
    return c.json({ error: 'Upload failed due to server error' }, 500);
  }
});

Deno.serve(app.fetch);