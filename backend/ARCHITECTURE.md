# Backend Architecture

This backend follows a modular, layered architecture for better code organization and maintainability.

## Structure

```
backend/src/
├── types/              # TypeScript type definitions
│   ├── application.types.ts
│   ├── auth.types.ts
│   ├── database.types.ts
│   ├── domain.types.ts
│   ├── env-var.types.ts
│   └── process.types.ts
├── controllers/        # HTTP request handlers
│   ├── application.controller.ts
│   ├── auth.controller.ts
│   ├── database.controller.ts
│   ├── domain.controller.ts
│   ├── env-var.controller.ts
│   └── process.controller.ts
├── services/          # Business logic layer
│   ├── application.service.ts
│   ├── auth.service.ts
│   ├── database.service.ts
│   ├── domain.service.ts
│   ├── env-var.service.ts
│   └── process.service.ts
├── routes/            # Express route definitions
│   ├── application.routes.ts
│   ├── auth.routes.ts
│   ├── database.routes.ts
│   ├── domain.routes.ts
│   ├── env-var.routes.ts
│   └── process.routes.ts
├── middleware/        # Express middleware
│   └── auth.middleware.ts
├── utils/             # Utility functions
│   ├── safe-exec.ts
│   └── safe-file.ts
└── index.ts           # Application entry point
```

## Architectural Layers

### 1. Types (`/types`)
Contains TypeScript interfaces and types for data models and DTOs (Data Transfer Objects).

**Responsibilities:**
- Define data structures
- Ensure type safety across the application
- Document expected data formats

**Example:**
```typescript
// types/application.types.ts
export interface Application {
  id: number;
  name: string;
  status: 'online' | 'stopped' | 'error';
  // ...
}

export interface DeployApplicationDto {
  name: string;
  repository: string;
  branch?: string;
  port?: number;
}
```

### 2. Services (`/services`)
Contains the business logic and interacts with system resources (PM2, Nginx, databases, file system).

**Responsibilities:**
- Implement core business logic
- Execute system commands via safe wrappers
- Handle data transformations
- Throw errors for exception handling

**Example:**
```typescript
// services/application.service.ts
export class ApplicationService {
  async deployApplication(data: DeployApplicationDto): Promise<any> {
    // Clone repository
    // Install dependencies
    // Configure PM2
    // Start application
  }
}
```

**Benefits:**
- Business logic is reusable
- Easy to test in isolation
- Can be called from multiple controllers

### 3. Controllers (`/controllers`)
Handle HTTP requests and responses. Bridge between routes and services.

**Responsibilities:**
- Validate request data
- Call appropriate service methods
- Format responses
- Handle HTTP status codes and error responses

**Example:**
```typescript
// controllers/application.controller.ts
export class ApplicationController {
  async deployApplication(req: Request, res: Response): Promise<void> {
    try {
      const { name, repository } = req.body;

      // Validation
      if (!name || !repository) {
        res.status(400).json({ error: 'Name and repository required' });
        return;
      }

      // Call service
      const result = await applicationService.deployApplication(req.body);

      // Send response
      res.json({ message: 'Success', application: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

**Benefits:**
- Separation of HTTP concerns from business logic
- Consistent error handling
- Easy to test HTTP layer

### 4. Routes (`/routes`)
Define Express routes and apply middleware.

**Responsibilities:**
- Map HTTP methods and paths to controller methods
- Apply authentication/authorization middleware
- Keep routes clean and declarative

**Example:**
```typescript
// routes/application.routes.ts
import { Router } from 'express';
import { requireAuth, requireDeveloper } from '../middleware/auth.middleware';
import { applicationController } from '../controllers/application.controller';

const router = Router();

router.get('/', requireAuth, (req, res) =>
  applicationController.listApplications(req, res)
);

router.post('/', requireDeveloper, (req, res) =>
  applicationController.deployApplication(req, res)
);

export default router;
```

**Benefits:**
- Routes are easy to read and understand
- Middleware application is clear
- Easy to document API endpoints

### 5. Middleware (`/middleware`)
Express middleware for cross-cutting concerns.

**Responsibilities:**
- Authentication/Authorization
- Request logging
- Error handling
- Input validation

### 6. Utils (`/utils`)
Reusable utility functions.

**Responsibilities:**
- Safe command execution
- Safe file operations
- Common helper functions

## Data Flow

```
HTTP Request
    ↓
Route (with middleware)
    ↓
Controller
    ↓
Service (business logic)
    ↓
System Resources (PM2, Nginx, File System, etc.)
    ↓
Service (transforms data)
    ↓
Controller (formats response)
    ↓
HTTP Response
```

## Key Principles

### 1. Separation of Concerns
Each layer has a single responsibility:
- **Routes**: HTTP routing
- **Controllers**: Request/response handling
- **Services**: Business logic
- **Types**: Data contracts

### 2. Dependency Direction
Dependencies flow downward:
- Routes → Controllers → Services → Utils
- Controllers never import from Routes
- Services never import from Controllers

### 3. Error Handling
- Services **throw errors** for exceptional cases
- Controllers **catch errors** and convert to HTTP responses
- Use descriptive error messages

### 4. Type Safety
- All data structures are typed
- Use DTOs for request/response data
- Leverage TypeScript for compile-time safety

## Benefits of This Architecture

1. **Maintainability**
   - Code is organized logically
   - Easy to find and update functionality
   - Clear separation of concerns

2. **Testability**
   - Services can be tested independently
   - Controllers can be tested with mocked services
   - Routes can be tested with supertest

3. **Scalability**
   - Easy to add new features
   - Services can be extracted to microservices
   - Clear patterns to follow

4. **Readability**
   - Code is self-documenting
   - Easy for new developers to understand
   - Consistent structure across modules

## Example: Adding a New Feature

To add a new feature (e.g., "logs management"):

1. **Create types** (`types/log.types.ts`)
   ```typescript
   export interface Log {
     timestamp: string;
     level: string;
     message: string;
   }
   ```

2. **Create service** (`services/log.service.ts`)
   ```typescript
   export class LogService {
     async getLogs(appName: string): Promise<Log[]> {
       // Implementation
     }
   }
   ```

3. **Create controller** (`controllers/log.controller.ts`)
   ```typescript
   export class LogController {
     async getLogs(req: Request, res: Response) {
       // Handle request/response
     }
   }
   ```

4. **Create routes** (`routes/log.routes.ts`)
   ```typescript
   router.get('/:app', requireAuth, (req, res) =>
     logController.getLogs(req, res)
   );
   ```

5. **Register routes** (in `index.ts`)
   ```typescript
   app.use('/api/logs', logRoutes);
   ```

## Testing Strategy

### Unit Tests
- Test services with mocked dependencies
- Test business logic in isolation

### Integration Tests
- Test controllers with real services
- Test API endpoints end-to-end

### Example Service Test
```typescript
describe('ApplicationService', () => {
  it('should list applications', async () => {
    const apps = await applicationService.listApplications();
    expect(apps).toBeInstanceOf(Array);
  });
});
```

## Migration Notes

The codebase has been refactored from a monolithic routes structure to this modular architecture. All existing functionality has been preserved while improving code organization.

**Before:**
- All logic in route files (200+ lines per file)
- Difficult to test
- Hard to maintain

**After:**
- Clean separation of concerns
- Easy to test each layer
- Scalable and maintainable

---

**Last Updated:** December 2024
