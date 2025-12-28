# Server Manager - Backend API

Backend API server for Server Manager application.

## Prerequisites

- Node.js 18+
- PM2 installed globally (`npm install -g pm2`)
- Nginx installed
- Sudo access for system operations
- Database servers (PostgreSQL, MySQL, MongoDB, Redis) if using those features

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and set your values
nano .env
```

## Environment Variables

Create a `.env` file with:

```env
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-this
ENCRYPTION_KEY=your-32-byte-hex-encryption-key
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build
npm run build

# Start
npm start

# Or use PM2
pm2 start dist/index.js --name server-manager-api
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Applications
- `GET /api/applications` - List all applications
- `POST /api/applications` - Deploy new application
- `POST /api/applications/:id/start` - Start application
- `POST /api/applications/:id/stop` - Stop application
- `POST /api/applications/:id/restart` - Restart application
- `DELETE /api/applications/:id` - Remove application

### Processes
- `GET /api/processes` - List all PM2 processes

### Domains
- `POST /api/domains` - Add domain with nginx config
- `DELETE /api/domains/:domain` - Remove domain

### Databases
- `POST /api/databases` - Create database
- `GET /api/databases` - List databases

### Environment Variables
- `GET /api/env-vars?app=name` - List env vars for app
- `POST /api/env-vars` - Add/update env var

## Default User

For development, a default admin user is configured:
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change this in production!

## Security Notes

- All routes except `/api/auth/login` require JWT authentication
- Commands are executed through a whitelist system
- File operations are restricted to specific directories
- Input validation on all endpoints

## Permissions Setup

The backend needs sudo permissions for certain operations. Add to sudoers:

```bash
sudo visudo
```

Add:
```
servermanager ALL=(ALL) NOPASSWD: /usr/sbin/nginx, /usr/bin/systemctl, /usr/bin/certbot, /usr/bin/mysql, /usr/bin/psql
```

## Troubleshooting

### Permission Denied
- Check sudo permissions
- Verify file ownership in `/var/www`

### Cannot connect to database
- Ensure database services are running
- Check credentials

### Nginx errors
- Run `sudo nginx -t` to test config
- Check `/var/log/nginx/error.log`

## Development

File structure:
```
backend/
├── src/
│   ├── index.ts              # Main server file
│   ├── middleware/           # Auth middleware
│   ├── routes/               # API routes
│   └── utils/                # Safe exec, file operations
├── package.json
├── tsconfig.json
└── .env
```
