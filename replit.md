# Overview

Mithix AI is a modern full-stack AI image generation application built with React, Express, and TypeScript. The application allows users to generate AI images using Hugging Face models through an intuitive web interface. Users can customize generation parameters, manage credits, and view their generated images in a gallery format.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Components**: Shadcn/UI component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and a dark mode design system
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build Process**: esbuild for production bundling with external package handling
- **Storage**: In-memory storage implementation with interface for future database integration

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Shared schema definitions between client and server using Drizzle and Zod
- **Tables**: Users table for authentication and credits, GeneratedImages table for storing generation history
- **Migrations**: Drizzle Kit for schema migrations and database management

## API Structure
- **Architecture**: RESTful API with Express routes
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom request/response logging with duration tracking

## Authentication & Authorization
- **User Management**: Simple user system with username/password (demo implementation)
- **Credits System**: Credit-based usage tracking for image generation
- **Default User**: Pre-configured demo user for immediate testing

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection (configured for Neon)
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing
- **zod**: Schema validation for type safety

## UI/UX Dependencies
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library
- **embla-carousel-react**: Carousel component

## Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

## External APIs
- **Hugging Face Inference API**: AI model hosting and image generation
  - Supports 10 advanced models: FLUX.1 Schnell (2 credits), SDXL Base/Refiner (5 credits), SDXL Lightning (3 credits), AnimateDiff Lightning, ControlNet Union, Protogen x3.4 (4 credits), Limitless Vision XL (5 credits), AlbedoBase (4 credits), and SDXL Inpainting
  - Model status indicators: Online/offline status with real-time visual indicators
  - Configurable generation parameters: prompt, style presets (Auto, Dynamic, Photorealistic, Artistic, Anime, Sci-Fi), aspect ratios, number of images (1-4), steps (1-50), CFG scale (1-20)
  - Variable credit system: FLUX.1 Schnell (2 credits - low cost, fast), others (3-6 credits)
  - Low default settings optimized for FLUX.1 Schnell: 512x512, 4 steps, CFG scale 1
  - Requires HUGGING_FACE_API_KEY environment variable

## Recent Updates (August 2025)
- **UI/UX Redesign**: Changed from purple/pink theme to orange gradient color scheme (hsl(25, 95%, 53%) primary, hsl(35, 91%, 58%) secondary)
- **FLUX.1 Schnell Integration**: Added as default model for fast, low-cost generation
- **Enhanced Model Selection**: Added online/offline status indicators and credit cost display
- **Improved Controls**: Aspect ratio selection (1:1, 3:2, 2:3), number of images selector, optimized defaults for efficiency
- **Advanced Style System**: Expanded from 4 to 6 style presets including Auto and Dynamic options