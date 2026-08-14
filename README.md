# 🎨 CharGen AI

> A full-stack AI-powered image generation platform designed to turn natural-language prompts into creative visuals while providing users with a complete workspace to generate, manage, organize, revisit, and download their creations.

<p align="center">
  <strong>Generate • Organize • Manage • Download • Create</strong>
</p>

---

## 🌐 Live Application

🔗 **Live Demo:** https://chargenai.netlify.app/

🔗 **Portfolio:https://yogi-charan-sharma-portfolio.netlify.app/

---

## 📌 Overview

CharGen AI is a full-stack AI image generation application built as a production-style web platform rather than a simple image-generation demo.

The application allows authenticated users to generate AI images from natural-language prompts and provides a complete creative workspace around those generations.

Users can:

- Generate AI images
- Enhance prompts before generation
- View generated images in a responsive gallery
- Download individual images
- Download multiple images
- Revisit previous generations through History
- Organize generated images into Projects
- View personal generation statistics
- Manage account preferences
- Use the application across desktop, tablet, and mobile devices

The project was designed with an emphasis on **real-world application architecture, responsive UX, authentication, persistent data, API integration, production deployment, and cross-device compatibility.**

---

# ✨ Features

## 🤖 AI Image Generation

Generate images using natural-language prompts through the AI generation backend.

Users can enter a description such as:

> "A futuristic city floating above the clouds at sunset"

and generate an image based on the prompt.

---

## ✍️ AI Prompt Enhancement

CharGen AI includes a prompt enhancement workflow that improves a basic prompt with additional visual instructions such as:

- Ultra-realistic rendering
- 8K quality
- Cinematic lighting
- Highly detailed visuals
- Professional photography
- Award-winning composition

This allows users to transform a simple idea into a more detailed generation prompt.

---

## 🖼️ Image Gallery

Generated images are displayed in a dedicated gallery with:

- Responsive grid layout
- Image previews
- Hover interactions
- Image actions
- Download functionality
- Clear-all functionality
- Loading/skeleton states

The gallery automatically adapts to different screen sizes.

---

## 📥 Image Download System

Users can download generated images directly from the application.

Supported download locations include:

- Dashboard
- AI Studio
- History
- Projects

The application also supports downloading multiple generated images.

The download system was specifically tested on both desktop and mobile production environments.

---

## 📚 Generation History

The History section allows users to revisit previously generated images.

Each history item can display:

- Generated image
- Original prompt
- Generation information
- Download action

This provides users with a persistent record of their previous generations.

---

## 📁 Projects

Users can organize generated images into individual projects.

Project functionality includes:

- Creating projects
- Viewing projects
- Opening project details
- Viewing project images
- Downloading project images
- Removing images from projects
- Editing project information
- Deleting projects

This transforms CharGen AI from a simple generator into a creative workspace.

---

## 👤 User Profile

The Profile section provides a personalized overview of the user's activity.

It includes:

- User information
- Account membership information
- Images generated
- Favorites
- Projects
- Member-since information
- Recent images
- Recent projects

---

## ⚙️ Settings

The Settings page provides a centralized location for application preferences.

Current settings include:

### Appearance

- Dark Mode
- Light Mode
- System Default

### Preferences

- Notifications
- Language

### Account

- Edit Profile
- Change Password
- Logout

### About

- Application information
- Version information
- Project information

---

## 🔐 Authentication

CharGen AI provides authenticated user workflows so generated content can be associated with individual users.

Authentication is integrated into the application so that users can access their own:

- Generations
- History
- Projects
- Profile information
- Saved content

---

# 📱 Responsive Design

Responsive design was treated as a core part of the application rather than an afterthought.

The application was tested across:

- Desktop
- Tablet
- Small mobile devices
- Modern mobile devices

Responsive improvements were implemented across:

- Navbar
- Sidebar
- AI Studio
- Prompt cards
- Prompt tips
- Image galleries
- History
- Projects
- Profile
- Settings
- Buttons
- Grid layouts
- Spacing
- Touch-friendly controls

The final production build was also tested directly on a physical mobile device.

---

# 🏗️ Application Architecture

'
                         ┌─────────────────────────┐
                         │       CharGen AI        │
                         │      React Frontend     │
                         └────────────┬────────────┘
                                      │
                                      │ REST API
                                      ▼
                         ┌─────────────────────────┐
                         │      Backend API        │
                         │      Python / FastAPI   │
                         └────────────┬────────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
                 ▼                    ▼                    ▼
        ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
        │ AI Generation  │   │ Authentication │   │   Database     │
        │    Service     │   │    Service     │   │   / Storage    │
        └────────────────┘   └────────────────┘   └────────────────┘
                 │                    │                    │
                 └────────────────────┼────────────────────┘
                                      ▼
                              Generated Images

                            
🔄 Application Flow
 ▼
Authentication
 │
 ▼
AI Studio
 │
 ▼
Enter Prompt
 │
 ├──────────────► Enhance Prompt
 │
 ▼
Generate Image
 │
 ▼
Backend API
 │
 ▼
AI Image Generation Service
 │
 ▼
Generated Image
 │
 ├──────────────► Gallery
 │
 ├──────────────► History
 │
 ├──────────────► Project
 │
 └──────────────► Download
                              🛠️ Tech Stack
Frontend
React
JavaScript
HTML5
CSS3
Vite
React Router
Backend
Python
FastAPI
REST API architecture
Database
PostgreSQL
Supabase
Authentication
Supabase Authentication
AI
AI-powered image generation API
Prompt enhancement workflow
Development
VS Code
Git
GitHub
npm
Python virtual environments
Deployment
Netlify — Frontend
Render — Backend
Supabase — PostgreSQL Database


📂 Project Structure
CharGenAI/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── auth/
│   │   │
│   │   ├── components/
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── PromptCard/
│   │   │   ├── PromptTips/
│   │   │   ├── ImageGallery/
│   │   │   ├── RecentPrompts/
│   │   │   ├── Profile/
│   │   │   ├── Settings/
│   │   │   ├── Projects/
│   │   │   └── common/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AIStudio.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── downloadImage.js
│   │   │   └── downloadAllImages.js
│   │   │
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── requirements.txt
│   └── ...
│
└── README.md
🚀 Local Development
Prerequisites

Make sure you have installed:

Node.js
npm
Python 3.x
PostgreSQL
Git

You will also need the required API and authentication credentials.

1. Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd CharGenAI
💻 Frontend Setup

Move into the frontend directory:

cd frontend

Install dependencies:

npm install

Create a .env file containing the required frontend environment variables.

Example:

VITE_API_URL=your_backend_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
🐍 Backend Setup

Open a new terminal and move into the backend directory:

cd backend

Create a virtual environment:

python -m venv venv

Activate it.

Windows
venv\Scripts\activate
macOS / Linux
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Create the required .env configuration.

Example:

DATABASE_URL=your_postgresql_connection_string

Start the FastAPI server:

uvicorn app.main:app --reload

The backend will normally run at:

http://127.0.0.1:8000
🔐 Environment Variables

Environment variables are required for local development and production deployment.

Typical frontend variables include:

VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

Backend configuration may include:

DATABASE_URL=

Additional AI provider credentials should be configured according to the image-generation service used by the backend.

Security

Never commit:

API keys
Database passwords
Authentication secrets
Access tokens
Private credentials

to GitHub.

Use .env files locally and configure production secrets through the hosting provider's environment-variable settings.

🌍 Deployment
Frontend

The frontend is deployed through Netlify.

Production build:

npm run build

The generated production files are located inside:

dist/

Netlify serves the production frontend from this build output.

Backend

The backend is deployed separately as a FastAPI service.

The frontend communicates with the deployed backend through the configured API URL.

Database

The application uses PostgreSQL for persistent application data.

The database connection is supplied through:

DATABASE_URL

This allows the backend to use different PostgreSQL providers without changing the application architecture.

🧩 Important Engineering Decisions
Separation of Frontend and Backend

The frontend and backend are independently deployable applications.

This provides:

Easier maintenance
Independent deployments
Clear API boundaries
Better scalability
Easier debugging
Environment-Based Configuration

Sensitive configuration is kept outside the source code through environment variables.

This makes it possible to use different configurations for:

Local development
Testing
Production

without changing application logic.

Reusable Components

The frontend is divided into reusable components rather than implementing the entire UI inside individual pages.

Examples include:

Header
Sidebar
Prompt Card
Prompt Tips
Image Gallery
Settings Row
Settings Section
Profile components
Project components
Toast notifications
Confirmation modals
🐛 Production Debugging

One of the important engineering challenges encountered during deployment was cross-platform filename casing.

Windows development environments can treat filenames such as:

Profile.css
profile.css

as equivalent.

Linux-based deployment environments are case-sensitive and treat them as different files.

This required ensuring that Git-tracked filenames and imports matched exactly.

This is an example of a production issue that may not appear during local development but becomes visible during CI/CD deployment.

📥 Download Architecture

The download system was implemented separately from the image-generation workflow.

It supports individual and bulk downloads.

The application extracts the image filename from the stored image URL and requests the appropriate download endpoint.

Download functionality was verified from:

Dashboard
AI Studio
History
Projects

The system was also tested on:

Desktop
Mobile
Production deployment
📱 Mobile Optimization

The initial application was primarily developed and tested on desktop.

A dedicated responsive pass was later performed to improve the mobile experience.

Major responsive improvements included:

Navbar
   ↓
Sidebar
   ↓
AI Studio
   ↓
Prompt Card
   ↓
Prompt Tips
   ↓
Image Gallery
   ↓
History
   ↓
Projects
   ↓
Profile
   ↓
Settings

The application was then tested on a real mobile device after production deployment.

🧪 Testing Checklist

The production application was tested for:

Authentication
Navigation
Image generation
Prompt enhancement
Image gallery
History
Projects
Profile
Settings
Individual downloads
Bulk downloads
Mobile responsiveness
Desktop responsiveness
Backend API communication
Database persistence
Production deployment
🎯 Project Goals

CharGen AI was created to demonstrate the ability to build and deploy a complete AI-powered web application rather than only an isolated AI feature.

The project focuses on:

AI Integration
+
Full-Stack Development
+
Authentication
+
Database Persistence
+
API Development
+
Responsive UI
+
Production Deployment
+
Real-World Debugging
💡 Key Learning Outcomes

Building CharGen AI provided practical experience with:

React application architecture
Component-based UI development
REST API integration
FastAPI backend development
Authentication flows
PostgreSQL databases
Supabase integration
AI API integration
Image handling
File downloading
Responsive CSS
Mobile-first debugging
Environment variables
Git/GitHub workflows
Netlify deployment
Backend deployment
Production debugging
Cross-platform filesystem differences
🔮 Future Improvements

Potential future improvements include:

Multiple AI image-generation models
Advanced image editing
Image-to-image generation
Negative prompts
Custom generation parameters
Image upscaling
Advanced search and filtering
Project sharing
Collaborative projects
Public image galleries
Usage analytics
Generation queues
Advanced user preferences
Additional authentication providers
🏆 Project Highlights

CharGen AI demonstrates a complete application lifecycle:

Idea
 ↓
UI Design
 ↓
Frontend Development
 ↓
Backend Development
 ↓
AI Integration
 ↓
Authentication
 ↓
Database Integration
 ↓
Feature Development
 ↓
Responsive Optimization
 ↓
Git/GitHub
 ↓
Deployment
 ↓
Production Debugging
 ↓
Mobile Testing
 ↓
Production Release
👨‍💻 Author
Yogi Charan Sharma

Computer Science Engineering Student & Full-Stack / AI Developer

I build practical applications combining modern frontend development, backend APIs, databases, and AI technologies.

Connect With Me

🌐 Portfolio:https://yogi-charan-sharma-portfolio.netlify.app/


💼 LinkedIn:(https://www.linkedin.com/in/yogi-charan-sharma-235b62282/)


🐙 GitHub: https://github.com/yogicharan2828-coder/

                                       ⭐ Support

If you found CharGen AI interesting, consider giving the repository a ⭐ on GitHub.

📄 License

This project was created as a personal portfolio project for educational and demonstration purposes.
