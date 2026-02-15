# API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## 1. Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

Request:
{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "message": "User registered successfully",
  "userId": "12345",
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Used in:** `RegisterComponent`

---

### Login User
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "message": "Login successful",
  "userId": "12345",
  "username": "john_doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Used in:** `LoginComponent` → Stores token in localStorage

---

## 2. Task Endpoints

### Get All Tasks
```
GET /tasks
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task management system",
    "status": "InProgress",
    "dueDate": "2026-02-28T23:59:59Z",
    "createdDate": "2026-02-10T10:00:00Z",
    "closedDate": null,
    "createdById": 123,
    "createdBy": {
      "id": "123",
      "userName": "admin",
      "email": "admin@example.com"
    },
    "assignedUsers": [
      {
        "id": "456",
        "userName": "john_doe"
      }
    ]
  },
  ...
]
```

**Used in:** `TaskListComponent`, `DashboardComponent`

---

### Get Task by ID
```
GET /tasks/{id}
Authorization: Bearer <token>

Example:
GET /tasks/1

Response (200):
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task management system",
  "status": "InProgress",
  ...
}
```

**Used in:** `TaskDetailComponent`

---

### Create Task
```
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "title": "New Task",
  "description": "Task description here",
  "status": "Pending",
  "dueDate": "2026-03-15T10:00:00Z"
}

Response (201):
{
  "id": 25,
  "title": "New Task",
  "description": "Task description here",
  "status": "Pending",
  "dueDate": "2026-03-15T10:00:00Z",
  "createdDate": "2026-02-15T12:00:00Z"
}
```

**Used in:** `CreateTaskComponent`

---

### Update Task
```
PUT /tasks/{id}
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "InProgress",
  "dueDate": "2026-03-20T10:00:00Z"
}

Response (200):
{
  "id": 1,
  "title": "Updated Task Title",
  ...
}
```

**Used in:** `TaskDetailComponent` (edit mode)

---

### Delete Task
```
DELETE /tasks/{id}
Authorization: Bearer <token>

Response (204): No Content

or

Response (200):
{
  "message": "Task deleted successfully"
}
```

**Used in:** `TaskListComponent`, `TaskDetailComponent`

---

### Mark Task as Complete
```
PUT /tasks/{id}/complete
Authorization: Bearer <token>

Response (200):
{
  "message": "Task marked as complete",
  "id": 1
}
```

**Used in:** `TaskDetailComponent`

---

### Search Tasks
```
POST /tasks/search
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "query": "project"
}

Response (200):
[
  {
    "id": 1,
    "title": "Complete project",
    ...
  }
]
```

**Used in:** `TaskListComponent` (search feature)

---

### Get My Tasks
```
GET /tasks/my-tasks
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 5,
    "title": "My assigned task",
    ...
  }
]
```

**Used in:** Could be used in a future "My Tasks" view

---

## 3. User Endpoints

### Get All Users
```
GET /users
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "123",
    "userName": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  ...
]
```

**Used in:** `TaskDetailComponent` (for showing assigned users)

---

### Get User by ID
```
GET /users/{id}
Authorization: Bearer <token>

Response (200):
{
  "id": "123",
  "userName": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe"
}
```

**Used in:** User profile features

---

### Search Users
```
POST /users/search
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "query": "john"
}

Response (200):
[
  {
    "id": "123",
    "userName": "john_doe",
    "email": "john@example.com"
  }
]
```

**Used in:** User search features

---

## Status Codes Reference

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Successful but no content to return |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Backend error |

## Error Response Format

```json
{
  "message": "Error description",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

## HTTP Interceptors Flow

### Request Flow
```
1. Service makes HTTP request
   ↓
2. JWT Interceptor
   - Reads token from localStorage
   - Adds to Authorization header
   ↓
3. Request sent to backend
   ↓
4. Backend validates token
```

### Response Flow
```
1. Backend returns response
   ↓
2. Error Interceptor checks status
   - 401: Redirect to login
   - 403: Show permission error
   - 404: Show not found error
   - 500: Show server error
   ↓
3. Service processes response
   ↓
4. Component handles data/error
```

## Example Service Implementation

### TaskService
```typescript
getAllTasks(): Observable<Task[]> {
  // GET /api/tasks
  return this.http.get<Task[]>(this.apiUrl);
}

createTask(task: CreateTaskDto): Observable<Task> {
  // POST /api/tasks
  return this.http.post<Task>(this.apiUrl, task);
}

updateTask(id: number, task: UpdateTaskDto): Observable<Task> {
  // PUT /api/tasks/{id}
  return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
}

deleteTask(id: number): Observable<any> {
  // DELETE /api/tasks/{id}
  return this.http.delete(`${this.apiUrl}/${id}`);
}
```

## Authentication Flow Diagram

```
User Login
   ↓
POST /auth/login
   ↓
Backend validates credentials
   ↓
Returns JWT token
   ↓
Token stored in localStorage
   ↓
Frontend receives and stores
   ↓
JWT Interceptor reads token
   ↓
Adds to Authorization header
   ↓
All future requests include token
}
Backend validates token
   ↓
404/500/etc → Error Interceptor handles
200 → Success response
```

## Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Test Get Tasks (with token)
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title":"Test Task",
    "description":"A test task",
    "status":"Pending",
    "dueDate":"2026-03-15T10:00:00Z"
  }'
```

## Rate Limiting (if implemented)

Check headers for:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Pagination (if implemented)

Query parameters:
- `?page=1`
- `?pageSize=10`
- `?skip=0`
- `?take=10`

## Environment-based URLs

**Development:**
```
Base URL: http://localhost:5000/api
```

**Production:**
```
Base URL: https://api.yourdomain.com/api
```

---

## Quick Reference Table

| Operation | Method | Endpoint | Auth | Component |
|-----------|--------|----------|------|-----------|
| Register | POST | /auth/register | ✗ | RegisterComponent |
| Login | POST | /auth/login | ✗ | LoginComponent |
| Get All Tasks | GET | /tasks | ✓ | DashboardComponent, TaskListComponent |
| Get Task | GET | /tasks/{id} | ✓ | TaskDetailComponent |
| Create Task | POST | /tasks | ✓ | CreateTaskComponent |
| Update Task | PUT | /tasks/{id} | ✓ | TaskDetailComponent |
| Delete Task | DELETE | /tasks/{id} | ✓ | TaskListComponent, TaskDetailComponent |
| Complete Task | PUT | /tasks/{id}/complete | ✓ | TaskDetailComponent |
| Get All Users | GET | /users | ✓ | UserService |
| Search Users | POST | /users/search | ✓ | UserService |

---

**Note:** All authenticated endpoints (✓) require a valid JWT token in the Authorization header.

For more details, refer to backend API documentation.
