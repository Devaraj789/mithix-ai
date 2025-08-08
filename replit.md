# AI Image Generator Application

## Overview

This is a comprehensive full-stack AI image generation platform that provides professional-grade tools for creating, customizing, and collaborating on AI-generated artwork. Built with React, TypeScript, and Express, the application features advanced UI components including smooth zoom/pan image previews, real-time AI prompt enhancement, interactive variation generators, and collaborative team workspaces. The platform integrates with Hugging Face's Inference API and uses only free AI models (FLUX, Stable Diffusion variants) while providing a Leonardo AI-inspired interface with extensive customization controls.

## User Preferences

Preferred communication style: Simple, everyday language.
UI Design: Mithix.AI interface with dark theme, left sidebar controls, and grid-based image display (originally inspired by Leonardo AI).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Integration**: Hugging Face Inference API for AI model access
- **Data Storage**: In-memory storage with planned PostgreSQL integration
- **Schema Validation**: Zod for request/response validation
- **Database ORM**: Drizzle ORM configured for PostgreSQL

### Development Setup
- **Hot Reload**: Vite dev server with HMR for frontend
- **Process Management**: tsx for TypeScript execution in development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation

## Key Components

### AI Model Integration
The application supports multiple AI image generation models:
- **FLUX-Schnell**: Fast generation model from Black Forest Labs
- **Stable Diffusion 1.5**: Classic SD model from RunwayML
- **Stable Diffusion 2.1**: Improved version from Stability AI
- **SDXL**: High-resolution model from Stability AI
- **SD 3.5**: Latest model from Stability AI
- **SDXL-Lightning**: Fast generation variant from ByteDance

### User Interface Components
- **Mithix.AI Interface**: Dark theme (#0a0a0b) with left sidebar and main content area
- **Left Sidebar Controls**: Model selection, aspect ratios, style presets, batch count, and advanced settings
- **Top Navigation**: Brand header with upgrade badges, legacy mode toggle, and workspace access
- **Enhanced Image Gallery**: 2x4 responsive grid with smooth zoom/pan effects and advanced interactions
- **Real-time AI Suggestions**: Contextual prompt enhancement with live feedback and one-click application
- **Interactive Variation Generator**: Advanced parameter controls for creating style, color, composition, and lighting variations
- **Collaborative Workspaces**: Team management with role-based permissions, shared galleries, and invitation system
- **Enhanced Image Preview**: Smooth zoom/pan functionality with interactive overlays and action buttons
- **Advanced Features**: Seed control, batch generation (1-8 images), style presets, private mode, variation generation

### API Endpoints
- `GET /api/models`: Retrieve available AI models and their configurations
- `POST /api/generate`: Generate images from text prompts with batch support
- `GET /api/history`: Fetch generation history with filtering options
- `GET /api/images/:id`: Retrieve specific generated image details
- `POST /api/images/:id/variations`: Generate variations from existing images
- `GET /api/workspaces`: Retrieve user's collaborative workspaces
- `POST /api/workspaces`: Create new collaborative workspace
- `POST /api/workspaces/:id/invite`: Send workspace invitations
- `GET /api/suggestions`: Get real-time AI prompt enhancement suggestions

## Data Flow

1. **User Input**: User enters prompt and selects generation parameters through the UI
2. **Form Validation**: Zod schemas validate input on both client and server
3. **API Request**: Frontend sends generation request to Express backend
4. **External API Call**: Backend forwards request to Hugging Face Inference API
5. **Image Processing**: Generated image data is processed and stored
6. **Response**: Image URL and metadata returned to frontend
7. **UI Update**: Generated image displayed with option to view in gallery

## External Dependencies

### Production Dependencies
- **Hugging Face API**: External service for AI model inference
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Radix UI**: Headless component primitives for accessibility
- **TanStack Query**: Server state synchronization and caching

### Development Dependencies
- **Replit Integration**: Development environment with live preview
- **TypeScript**: Type safety across the entire application
- **ESLint/Prettier**: Code quality and formatting tools

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle generates and applies schema changes
4. **Environment Setup**: Production environment variables loaded

### Production Configuration
- **Database**: PostgreSQL connection via environment variable `DATABASE_URL`
- **API Keys**: Hugging Face API key via `HUGGING_FACE_API_KEY` or `HF_API_KEY`
- **Static Serving**: Express serves built frontend assets
- **Error Handling**: Global error middleware for API endpoints

### Development vs Production
- **Development**: Uses in-memory storage and Vite dev server
- **Production**: Switches to PostgreSQL database and serves static files
- **Environment Detection**: `NODE_ENV` variable controls behavior switching

The application is designed to be easily deployable on platforms like Replit, with automatic database provisioning and API key configuration through environment variables.