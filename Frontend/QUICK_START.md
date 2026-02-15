# 🚀 TaskPro Frontend - Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- Backend API running on `http://localhost:5000`
- npm v9+ installed

## Installation & Setup (5 minutes)

### 1. Navigate to Frontend Directory
```bash
cd Frontend/TaskManagementClient
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Backend Connection
Make sure your backend API is running and accessible at `http://localhost:5000/api`

### 4. Start Development Server
```bash
npm start
```

The application automatically opens at `http://localhost:4200`

## 🔐 First Time Login

### Option A: Register New Account
1. Click "Sign Up" link on login page
2. Enter username, email, and password
3. Click "Create Account"
4. Redirected to login page
5. Enter credentials to login

### Option B: Use Existing Account
1. Enter email and password
2. Click "Sign In"

## 🎯 Main Features to Try

### Dashboard (`/dashboard`)
- View task statistics
- See your recent tasks
- Quick overview of task status

### Task List (`/tasks`)
- View all tasks
- Search tasks by title/description
- Filter by status
- Sort by date or title
- Create new task
- Edit or delete tasks

### Create Task (`/tasks/create`)
- Enter task title (required)
- Add description
- Set due date
- Select status
- Click "Create Task"

### Task Details (`/tasks/:id`)
- View full task information
- Edit task details
- Mark as complete
- Delete task

## 🔧 API Configuration

### Default Configuration
```
Backend URL: http://localhost:5000
API Endpoint: http://localhost:5000/api
Frontend URL: http://localhost:4200
```

### Change API URL (if needed)
Edit: `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-api-url:port/api'  // ← Update this
};
```

## 📧 HTTP Interceptors

The application automatically:
- ✅ Adds JWT token to all requests
- ✅ Handles authentication errors
- ✅ Displays error messages
- ✅ Redirects to login on 401

No additional setup needed!

## 🐛 Troubleshooting

### "Cannot connect to server"
```bash
# Check if backend is running
# Backend should be on http://localhost:5000
# Check your appsettings.json for correct port
```

### "CORS error"
```
Ensure backend has CORS enabled for http://localhost:4200
Check Program.cs in backend
```

### "Clear old login"
```bash
# Open browser DevTools (F12)
# Go to Application → LocalStorage
# Clear all entries
# Refresh the page
```

### Port 4200 already in use
```bash
# Specify different port
ng serve --port 4300
```

## 📝 Available Commands

```bash
npm start              # Start development server
npm run build          # Build for production
npm test              # Run tests
npm run watch         # Watch mode development
ng serve --port 4300  # Custom port
```

## 💾 Environment Files

**Development:**
- File: `src/environments/environment.ts`
- API: `http://localhost:5000/api`

**Production:**
- File: `src/environments/environment.prod.ts`
- Update before deployment

## 🔐 Security Notes

- JWT token stored in localStorage
- Token automatically added to requests
- Expired sessions redirect to login
- No sensitive data in localStorage except token

## 📱 Responsive Design

Works perfectly on:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## 🎨 Dark Mode (Future)

Currently using light theme. Configuration ready in `styles.css` for dark mode.

## 📚 Documentation Files

- `SETUP.md` - Detailed installation guide
- `HTTP_CLIENT_CONFIG.md` - API integration details
- `FRONTEND_SETUP_COMPLETE.md` - Complete feature overview

## 🆘 Need Help?

1. Check the documentation files above
2. Review browser console for error messages (F12)
3. Verify backend API is running
4. Check network tab to see API responses

## ✅ Verification Checklist

- [ ] Node.js installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] Backend running on `http://localhost:5000`
- [ ] Dependencies installed (`npm install`)
- [ ] Development server started (`npm start`)
- [ ] Can access `http://localhost:4200`
- [ ] Can see login page
- [ ] Can register/login successfully

## 🎉 You're All Set!

Enjoy managing your tasks with TaskPro! 🚀

---

**Questions?** Refer to the detailed documentation files in the project.
