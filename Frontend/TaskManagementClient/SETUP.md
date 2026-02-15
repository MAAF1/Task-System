# TaskPro - Frontend Application

A modern, responsive Angular application for managing tasks efficiently.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v21 or higher)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:4200`
   - Default port is 4200 (configurable in `angular.json`)

## 🔧 Configuration

### API Endpoint Configuration

The application is configured to communicate with your backend API. Update the API URL in the environment files:

#### Development Environment
- File: `src/environments/environment.ts`
- Default API URL: `http://localhost:5000/api`

#### Production Environment
- File: `src/environments/environment.prod.ts`
- Update with your production API URL

**Example configuration:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

## 📋 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Main dashboard view
│   │   ├── task-list/          # Task list view
│   │   ├── task-detail/        # Task detail view
│   │   ├── create-task/        # Create task form
│   │   ├── login-component/    # Login page
│   │   ├── register-component/ # Register page
│   │   ├── header/             # Header component
│   │   └── footer/             # Footer component
│   ├── services/
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── task.service.ts     # Task management service
│   │   └── user.service.ts     # User service
│   ├── helpers/
│   │   ├── jwt.interceptor.ts  # JWT token interceptor
│   │   ├── error.interceptor.ts # Error handling interceptor
│   │   └── auth.guard.ts       # Route guard
│   ├── environments/           # Environment configurations
│   ├── app.routes.ts           # Route definitions
│   ├── app.config.ts           # Application configuration
│   ├── app.ts                  # Root component
│   └── app.html                # Root template
├── styles.css                  # Global styles
└── main.ts                     # Application entry point
```

## 🔐 Authentication

### Login
- Navigate to `/login`
- Enter your email and password
- On successful login, JWT token is stored in localStorage
- Redirected to dashboard

### Register
- Navigate to `/register`
- Enter username, email, and password
- Account is created and redirected to login page

### Logout
- Click logout button in dashboard header
- Session is cleared and redirected to login page

## 🚢 Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Production
- Update API URL in `src/environments/environment.prod.ts`
- Run build command
- Deploy `dist/TaskManagementClient` folder to your hosting service

## 📦 Dependencies

Key dependencies:
- **@angular/core**: Angular framework
- **@angular/forms**: Form handling
- **@angular/router**: Routing
- **@angular/common**: Common utilities
- **bootstrap**: UI framework
- **rxjs**: Reactive programming

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Watch Mode
```bash
npm run watch
```

## 🎨 Styling

The application uses:
- Bootstrap 5 for responsive design
- Custom CSS for enhanced styling
- CSS variables for theming

Global styles are defined in `src/styles.css`

## 📱 Features

- **Dashboard**: View task statistics and recent tasks
- **Task Management**: Create, read, update, delete tasks
- **Task Filtering**: Filter by status and search by title/description
- **Task Sorting**: Sort by creation date, due date, or title
- **User ManagementAuthentication with JWT tokens
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Error Handling**: Comprehensive error messages and notifications

## 🔗 API Integration

### Available Endpoints

The application communicates with the following backend endpoints:

**Authentication**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

**Tasks**
- `GET /tasks` - Get all tasks
- `GET /tasks/{id}` - Get task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task
- `PUT /tasks/{id}/complete` - Mark task as complete
- `POST /tasks/search` - Search tasks

**Users**
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users/search` - Search users

## 🐛 Troubleshooting

### Cannot connect to API
- Ensure backend server is running on `http://localhost:5000`
- Check environment configuration in `src/environments/environment.ts`
- Verify CORS is enabled on backend

### Authentication errors
- Clear browser localStorage and try again
- Check token expiration
- Verify backend JWT configuration

### Build errors
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Clear Angular cache: `npm run ng -- cache clean`

## 📝 Environment Variables

Create a `.env` file in the root directory (optional):
```
NG_APP_API_URL=http://localhost:5000/api
NG_APP_ENV=development
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the Task Management System.

## 📞 Support

For issues or questions, please contact the development team.

---

**Happy Task Management! 🎯**
