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
- User authentication and authorization with JWT tokens
- Campaign creation and discovery
- **Donation processing with Stripe Checkout (recommended) and other payment methods:**
  - Stripe Checkout (Card payments) - Recommended, PCI compliant
  - UPI (Google Pay, PhonePe, Paytm)
  - Card (Direct integration)
  - Net Banking (All major banks)
  - Wallet (Paytm, PhonePe, etc.)
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
- **2025-10-19**: Initial Replit setup and MVP implementation
  - Configured Vite to use port 5000 with 0.0.0.0 host
  - Enabled allowedHosts for Replit proxy compatibility
  - Configured HMR for Replit environment with WSS protocol
  - Removed local backend proxy (using external API)
  - Set up Frontend workflow on port 5000
  - Configured deployment for autoscale with Vite preview
  - Installed all npm dependencies
  - **Stripe Payment Integration (Production-Ready):**
    - Installed @stripe/stripe-js and @stripe/react-stripe-js packages
    - Created stripeService.js aligned with backend API contract
    - Payment flow properly handles sessionId from backend `/payments/initiate` endpoint
    - Uses `stripe.redirectToCheckout({sessionId})` for Stripe checkout redirect
    - Fallback support for direct redirectUrl if provided by backend
    - Stripe configuration validation with user-friendly error messages
    - Payment verification endpoint aligned with backend `/payments/verify/{paymentId}`
    - PaymentSuccess page handles both Stripe callbacks and backend verification gracefully
    - Created PaymentCancel page for cancellation handling
    - Added routes for /payment-success and /payment-cancel in App.jsx
  - **Create Features (Production-Ready):**
    - CreateCampaign: Fully functional with validation and API integration
    - CreatePost: Fully functional with media URLs and tags support
    - CreateReel: Fully functional with video upload support
    - All create pages use proper authentication guards with useEffect (no render-time side effects)
    - Proper loading states and fallback UI when redirecting unauthenticated users
    - All create features properly use authenticated API calls with JWT tokens from AuthContext

## User Preferences
None documented yet.
