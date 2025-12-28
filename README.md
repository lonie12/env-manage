# SSH Managed - Server Manager

A modern server management application with React frontend and Node.js backend.

## Project Structure

```
ssh-managed/
├── src/                    # Frontend source code (React + TypeScript)
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities and routes
│   ├── mocks/            # Mock data for demo
│   └── context/          # React context
├── backend/               # Backend source code (Node.js + Express)
│   ├── src/
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── types/        # TypeScript types
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Utility functions
│   └── package.json
├── package.json          # Root package orchestrator
└── README.md
```

## Quick Start

### Installation

Install all dependencies (frontend + backend):

```bash
npm run install:all
```

Or install separately:

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- **Frontend** on `http://localhost:5173` (Vite dev server)
- **Backend** on `http://localhost:4000` (Express server)

Run separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Production Build

Build both frontend and backend:

```bash
npm run build
```

This will:
1. Build the frontend (TypeScript + Vite)
2. Build the backend (TypeScript)

Build separately:

```bash
# Frontend only
npm run build:frontend

# Backend only
npm run build:backend
```

### Production Start

Start both in production mode:

```bash
npm start
```

This will:
- Serve the built frontend on `http://localhost:3000`
- Start the backend API on `http://localhost:4000`

## Available Scripts

### Root Scripts

| Script | Description |
|--------|-------------|
| `npm run install:all` | Install all dependencies (frontend + backend) |
| `npm run dev` | Start both frontend and backend in dev mode |
| `npm run dev:frontend` | Start only frontend dev server |
| `npm run dev:backend` | Start only backend dev server |
| `npm run build` | Build both frontend and backend |
| `npm run build:frontend` | Build only frontend |
| `npm run build:backend` | Build only backend |
| `npm start` | Start both in production mode |
| `npm run start:frontend` | Serve built frontend |
| `npm run start:backend` | Start built backend |
| `npm run lint` | Run ESLint on frontend |
| `npm run preview` | Preview production build |

### Backend Scripts

```bash
cd backend

# Development
npm run dev          # Start dev server with nodemon

# Production
npm run build        # Compile TypeScript
npm start            # Run compiled code

# Utilities
npm run generate-password  # Generate bcrypt password hash
```

## Features

### Frontend
- ⚛️ React 19 with TypeScript
- 🎨 Tailwind CSS 4 with dark mode
- 🧭 React Router 7
- 📦 Component-based architecture
- 🎭 Mock data for demo mode

### Backend
- 🚀 Node.js + Express
- 🔒 JWT Authentication
- 🏗️ Modular architecture (Controllers → Services)
- ✅ TypeScript with strict mode
- 🔐 Safe command execution
- 📁 Safe file operations

## Architecture

### Frontend Architecture
- **Atoms**: Basic UI components (Button, Badge, Input)
- **Molecules**: Composite components (AppCard, Modal)
- **Organisms**: Complex components (Sidebar, Header)
- **Pages**: Full page components
- **Context**: Global state management

### Backend Architecture
See [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) for detailed documentation.

- **Routes**: Express route definitions
- **Controllers**: HTTP request/response handlers
- **Services**: Business logic layer
- **Types**: TypeScript type definitions
- **Middleware**: Authentication, validation
- **Utils**: Safe execution wrappers

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Applications
- `GET /api/applications` - List all applications
- `POST /api/applications` - Deploy new application
- `POST /api/applications/:id/start` - Start application
- `POST /api/applications/:id/stop` - Stop application
- `POST /api/applications/:id/restart` - Restart application
- `DELETE /api/applications/:id` - Remove application

### Processes
- `GET /api/processes` - List PM2 processes

### Domains
- `POST /api/domains` - Configure domain with Nginx
- `DELETE /api/domains/:domain` - Remove domain

### Databases
- `GET /api/databases` - List databases
- `POST /api/databases` - Create database

### Environment Variables
- `GET /api/env-vars?app=:app` - Get env vars for app
- `POST /api/env-vars` - Set env variable

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
```

### Backend (backend/.env)
```env
PORT=4000
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-byte-hex-encryption-key
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Demo Mode

The application includes mock data for demonstration purposes. The `demo` branch contains:
- Mock applications, domains, and databases
- Full UI functionality without backend
- Perfect for showcasing features

```bash
git checkout demo
npm install
npm run dev:frontend
```

## Development Tips

### Concurrent Development
Use `npm run dev` to run both servers simultaneously with color-coded output:
- **FRONTEND** (cyan) - Vite dev server
- **BACKEND** (magenta) - Express server

### Hot Reload
- Frontend: Vite provides instant HMR
- Backend: Nodemon watches for file changes

### Type Safety
Both frontend and backend use TypeScript. Run type checks:

```bash
# Frontend
npm run build:frontend

# Backend
cd backend && npm run build
```

## Deployment

### Frontend Deployment
Build the frontend and deploy the `dist/` folder to any static hosting:

```bash
npm run build:frontend
# Deploy dist/ to Vercel, Netlify, etc.
```

### Backend Deployment
See [backend/README.md](backend/README.md) for deployment instructions.

## Contributing

1. Create a feature branch from `demo` or `master`
2. Make your changes
3. Ensure all builds pass: `npm run build`
4. Create a pull request

## License

Private project

---

**Last Updated:** December 2024
