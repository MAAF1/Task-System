# HTTP Client Configuration Guide

## Overview

The frontend application uses Angular's HttpClient to communicate with the backend API. The HTTP layer is configured with interceptors to handle authentication and error handling.

## Architecture

```
HTTP Request
    ↓
JWT Interceptor (adds token)
    ↓
Error Interceptor (handles errors)
    ↓
Backend API Server
    ↓
Response
    ↓
Error Interceptor (processes errors)
    ↓
Service (handles response)
    ↓
Component (displays data)
```

## Configuration Files

### 1. Environment Configuration
**Location:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### 2. App Configuration
**Location:** `src/app/app.config.ts`

Packages HttpClient with interceptors:
- JwtInterceptor: Adds JWT token to requests
- ErrorInterceptor: Handles API errors

### 3. JWT Interceptor
**Location:** `src/app/helpers/jwt.interceptor.ts`

Automatically adds Bearer token to all requests:
```typescript
Authorization: Bearer <token>
```

### 4. Error Interceptor
**Location:** `src/app/helpers/error.interceptor.ts`

Handles errors:
- 401: Unauthorized (redirects to login)
- 403: Forbidden
- 404: Not found
- 500: Server error
- Network errors

## Service Implementation

All services use the environment configuration:

```typescript
import { environment } from '../../environments/environment';

private apiUrl = `${environment.apiUrl}/tasks`;
```

## Making API Requests

### Example: Task Service

```typescript
// Get all tasks
getAllTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(this.apiUrl);
}

// Create task
createTask(task: CreateTaskDto): Observable<Task> {
  return this.http.post<Task>(this.apiUrl, task);
}

// Update task
updateTask(id: number, task: UpdateTaskDto): Observable<Task> {
  return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
}

// Delete task
deleteTask(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
```

## Authentication Flow

1. **Register**
   ```
   User enters credentials → POST /auth/register → Token received → Stored in localStorage
   ```

2. **Login**
   ```
   User enters credentials → POST /auth/login → Token received → Stored in localStorage
   ```

3. **Authenticated Requests**
   ```
   JWT Interceptor reads token → Adds to Authorization header → Request sent
   ```

4. **Token Refresh**
   - Current implementation stores token in localStorage
   - Token persists across sessions
   - Logout removes token

## Error Handling

### Automatic Error Handling
The Error Interceptor automatically handles:
- Network failures
- Server errors
- Unauthorized access
- Validation errors

### Component Error Handling
```typescript
this.taskService.getAllTasks().subscribe({
  next: (tasks) => {
    // Handle success
    this.tasks = tasks;
  },
  error: (err) => {
    // Handle error
    console.error('Error:', err);
    this.error = err.message;
  }
});
```

## CORS Configuration

Ensure backend has CORS enabled for `http://localhost:4200`:

```csharp
// Backend (C# example)
builder.Services.AddCors(options => {
  options.AddPolicy("AllowFrontend", policy => {
    policy
      .WithOrigins("http://localhost:4200")
      .AllowAnyHeader()
      .AllowAnyMethod();
  });
});
```

## Testing API Connection

### Quick Test
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform any action (login, create task, etc.)
4. Verify requests show correct endpoint
5. Check response status (should be 200 for success)

### Using cURL
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"

# Test get tasks (requires token)
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <your_token>"
```

## Debugging

### Enable Request/Response Logging

Add this to your auth service:

```typescript
login(data: LoginDto): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
    tap({
      next: (response) => {
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    })
  );
}
```

### Check Stored Token

In browser console:
```javascript
localStorage.getItem('token')
localStorage.getItem('user')
```

## Production Deployment

Before deploying to production:

1. **Update API URL**
   ```typescript
   // environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://api.yourdomain.com/api'
   };
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Deploy to hosting**
   - Upload `dist/TaskManagementClient` to your web server
   - Configure web server for SPA routing

4. **Verify CORS on production**
   - Update backend CORS to accept production frontend URL

## Troubleshooting

### "Cannot GET /api/tasks"
- Verify backend API is running
- Check API URL in environment configuration
- Ensure endpoint exists on backend

### "401 Unauthorized"
- Token may have expired
- User not authenticated
- JWT token format invalid

### "CORS error"
- Backend CORS not properly configured
- Check Origin header matches
- Verify HTTP method is allowed

### Requests timing out
- Check backend server status
- Verify network connectivity
- Check firewall/proxy settings

## References

- [Angular HttpClient](https://angular.io/guide/http)
- [Angular Interceptors](https://angular.io/guide/http#intercepting-requests-and-responses)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

For additional help, refer to the main README.md or contact support.
