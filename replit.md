# Catalyster - Crowdfunding Platform Frontend

## Overview
Catalyster is a modern crowdfunding platform built with React and Vite. It allows users to create campaigns, browse projects, make donations, and engage with content through posts and reels.

**Current State**: Configured for Replit environment (October 19, 2025)

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.0.1
- **HTTP Client**: Axios 1.7.7
- **Styling**: Tailwind CSS 3.4.14
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/        # Reusable UI components
│   ├── Common/       # Generic components (Button, Input, Modal, etc.)
│   ├── Layout/       # Layout components (Header, Footer, Container)
│   ├── payment/      # Payment-related components
│   └── Sections/     # Landing page sections
├── context/          # React context (AuthContext)
├── hooks/            # Custom hooks (useFetch)
├── pages/            # Route pages
├── services/         # API service layer
├── styles/           # Global styles
└── utils/            # Helper functions and constants
```

### Key Features
- User authentication and authorization
- Campaign creation and discovery
- Donation processing with multiple payment methods (UPI, Card, Net Banking, Wallet)
- Social features (Posts, Reels, Comments)
- User profiles and notifications
- Campaign filtering and sorting

### Backend Integration
- **API Base URL**: `https://catalyster.onrender.com/api/v1`
- Uses environment variable `VITE_API_URL` (defaults to above URL)
- Token-based authentication stored in localStorage

## Replit Configuration

### Development Server
- **Port**: 5000
- **Host**: 0.0.0.0 (allows Replit proxy)
- **Allowed Hosts**: All (`['*']`)
- **HMR**: Configured for Replit environment (clientPort: 443)

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## Recent Changes
- **2025-10-19**: Initial Replit setup
  - Configured Vite to use port 5000 with 0.0.0.0 host
  - Enabled allowedHosts for Replit proxy compatibility
  - Configured HMR for Replit environment with WSS protocol
  - Removed local backend proxy (using external API)
  - Set up Frontend workflow on port 5000
  - Configured deployment for autoscale with Vite preview
  - Installed all npm dependencies

## User Preferences
None documented yet.
