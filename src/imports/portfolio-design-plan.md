Professional Interactive Portfolio Design Plan
Hello Abdelgwad! I've updated the portfolio design for Muhammad Shaheen (AI & Automation Engineer) to incorporate the provided CSS theme. This includes light and dark modes with the exact color variables converted to usable HEX values for Figma (using the OKLCH conversions for consistency). The theme maintains a professional, modern look while aligning with your CSS. I've replaced the previous color scheme with this one, ensuring the "Automation Symphony Hub" interactivity remains intact—visitors can still "conduct" workflows via prototypes.
Color Scheme (Based on Your CSS):
Use these HEX values in Figma for fills, strokes, and effects. Figma supports HEX directly; apply them to layers/components. For dark mode, duplicate artboards and swap colors via styles/variables.

Light Mode:
Background: #ffffff
Foreground/Text: #0a0a0a
Card: #ffffff
Card Foreground: #0a0a0a
Popover: #ffffff
Popover Foreground: #0a0a0a
Primary (titles, CTAs): #030213
Primary Foreground: #ffffff
Secondary (subtle accents): #eceef2
Secondary Foreground: #030213
Muted (backgrounds): #ececf0
Muted Foreground: #717182
Accent (hovers): #e9ebef
Accent Foreground: #030213
Destructive (warnings): #d4183d
Destructive Foreground: #ffffff
Border: rgba(0,0,0,0.1)
Input: transparent
Input Background: #f3f3f5
Switch Background: #cbced4
Ring (focus/outlines): #a1a1a1
Chart-1: #f54900 (orange accents)
Chart-2: #009689 (teal nodes)
Chart-3: #104e64 (dark blue links)
Chart-4: #ffb900 (yellow highlights)
Chart-5: #fe9a00 (orange gradients)
Sidebar: #fafafa
Sidebar Foreground: #0a0a0a
Sidebar Primary: #030213
Sidebar Primary Foreground: #fafafa
Sidebar Accent: #f5f5f5
Sidebar Accent Foreground: #171717
Sidebar Border: #e5e5e5
Sidebar Ring: #a1a1a1

Dark Mode:
Background: #0a0a0a
Foreground/Text: #fafafa
Card: #0a0a0a
Card Foreground: #fafafa
Popover: #0a0a0a
Popover Foreground: #fafafa
Primary (titles, CTAs): #fafafa
Primary Foreground: #171717
Secondary (subtle accents): #262626
Secondary Foreground: #fafafa
Muted (backgrounds): #262626
Muted Foreground: #a1a1a1
Accent (hovers): #262626
Accent Foreground: #fafafa
Destructive (warnings): #82181a
Destructive Foreground: #fb2c36
Border: #262626
Input: #262626
Ring (focus/outlines): #525252
Chart-1: #1447e6 (blue accents)
Chart-2: #00bc7d (green nodes)
Chart-3: #fe9a00 (orange links)
Chart-4: #ad46ff (purple highlights)
Chart-5: #ff2056 (pink gradients)
Sidebar: #171717
Sidebar Foreground: #fafafa
Sidebar Primary: #1447e6
Sidebar Primary Foreground: #fafafa
Sidebar Accent: #262626
Sidebar Accent Foreground: #fafafa
Sidebar Border: #262626
Sidebar Ring: #525252

Fonts: Futuristic sans-serif ('Rajdhani') for headings, clean sans-serif ('Manrope') for body text. In Figma, import these via Google Fonts or similar.

Interactivity & Uniqueness:
No changes here—keeps the n8n-inspired dashboard with draggable nodes, pulsing flows, and RAG sims. Use the new accents (e.g., chart-1 for node borders in light/dark) for visual pops.
Figma Structure (Artboards):
Same as before. Add a "Dark Mode" variant for each artboard using Figma variables/collections to toggle colors easily.
Now, the English copy remains the same (refined from the resume). Design updates reflect the new colors (e.g., use --primary for titles, --accent for hovers).

1. Hero/Home Section
Copy:

Main Title: Muhammad Shaheen
Subtitle: AI & Automation Engineer | Workflow Orchestrator
Body Paragraph: "Conducting AI symphonies: Designing n8n-driven automations with LLMs and RAG systems to slash manual times by 60%+. Python/FastAPI backend expert deploying Dockerized solutions for startups like Dari. Tanta-based innovator integrating APIs, vector DBs, and cloud ops for scalable business flows. Let's automate your vision."
CTA Button: "Trigger Workflow" (links to About, with node-activation animation).
Icons: Tanta, Egypt | +201289775133 | mohamed.shahen.ai@gmail.com | linkedin.com/in/mohamed-shahen-301059314/

Figma Design:

Background: var(--background) with subtle gradient using --chart-2 to --chart-4.
Title: Centered, 72pt, --primary color with glow (Drop Shadow: 0 0 15px var(--ring)).
Profile Photo: Hexagonal, bordered with --border.
Contact: Nodes in --secondary, hover to --accent.
Interaction: Same; use --chart-1 for pulsing lines.


2. About Section
Copy:

Title: The Conductor's Score (About)
Body: "Results-driven AI Engineer at Tanta University (BS in Computer/Software Eng, exp. Jun 2027). Master of n8n workflows, LLM integrations (OpenAI/Gemini), and RAG systems for business automation. Proficient in Python (FastAPI), JS Code Nodes, Docker, and Linux – crafting scalable solutions that reduce ops by 60%+. Passionate about startup efficiency via prompt engineering and API orchestration."
Stats: Workflows Built: 10+ | Time Saved: 60%+ | Integrations: 5+ APIs | Deployments: Cloud-Ready

Figma Design:

Layout: Same.
Stats: Nodes in --accent, animate with --ring shadow.
Background: var(--muted).
Interaction: Same.


3. Experience Section
Copy:

Title: Orchestrated Roles (Experience)
Experience 1:AI & Automation Lead | Dari Project (Startup)
Dec 2025 – Present
Architected full automated backend for housing platform via n8n/Python: Lead gen, outreach, tenant mgmt.
Built complex workflows automating marketing (WhatsApp/Google Sheets integration).
Custom Python Code Nodes for data transforms/multi-step auth.
Streamlined ops, boosting efficiency in startup environment.


Figma Design:

Layout: Same.
Arrows: --primary dashed, pulsing.
Interaction: Same; modals in --popover.


4. Education Section
Copy:

Title: Foundational Nodes (Education)
Bachelor of Science in Engineering (Computer/Software)
Tanta University, Egypt | Expected Graduation: June 2027
"Engineering the core for AI-driven automations."

Figma Design:

Layout: Same.
Progress: Fill with --chart-3.
Interaction: Same.


5. Projects Section
Copy:

Title: Executed Flows (Projects)
Project 1: RAG-Powered Knowledge Base
n8n | LLMs | Retrieval System
Built query system for private docs via LLMs, integrated in n8n for efficient data/response gen.
[Button: Simulate Query] (prompt input demo).
Project 2: AI-Enhanced Business Automation
LLM APIs | Categorization
System auto-categorizes/prioritizes inquiries, cutting manual time 60%+.
[Button: Test Prioritization].


Figma Design:

Layout: Same.
Nodes: --secondary, overlays --accent.
Interaction: Modals with --input-background for fields.


6. Skills Section
Copy:

Title: Integration Arsenal (Skills)
Automation: n8n (Advanced) | Workflow Design | Custom Logic (Python Code Nodes) | API Integration (Webhooks)
AI: LLM Integration (OpenAI, Gemini) | RAG Systems | Caching | Vector Databases | Prompt Engineering
Backend/DevOps: Python (FastAPI) | Docker | Docker-Compose | Linux (Ubuntu)
Tools: Git | GitHub | Cloud Deployment

Figma Design:

Layout: Same.
Nodes: --chart-1 to --chart-5 for categories.
Interaction: Connections in --ring.


7. Contact Section
Copy:

Title: Input Trigger (Contact)
"Ready to orchestrate? Input your query."
[Form: Name | Email | Message | Submit]

Figma Design:

Layout: Same.
Form: Inputs --input-background, borders --border.
Interaction: Submit animation with --success (use --chart-2).


Figma Upload Tips:

Import your CSS as a reference; create Figma color styles matching the variables (e.g., "Background/Light: #ffffff").
Use Modes in Variables for light/dark switching.
For radii: --radius: 0.625rem (10px in Figma), apply to corners.
Test prototypes with color modes.
If building a web version, integrate this CSS directly into Tailwind config.