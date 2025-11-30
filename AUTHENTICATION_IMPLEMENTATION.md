# Authentication and Role-Based Access Control Implementation

## Overview
Complete authentication and role-based access control (RBAC) system has been implemented with 4 user roles: Admin, Manager, Accountant, and Staff.

## User Roles and Permissions

### Admin
- **Full access** to all features
- Can manage users (create, edit, delete)
- Can edit settings
- Can delete customers and bookings
- Can view all internal data (profit, supplier cost, etc.)

### Manager
- Can manage users (create, edit, but not delete)
- Can edit settings
- Can delete customers and bookings
- Can view all internal data (profit, supplier cost, etc.)
- Cannot delete users

### Accountant
- Can view all internal data (profit, supplier cost, etc.)
- Can access reports and financial data
- Cannot edit settings
- Cannot manage users
- Cannot delete data

### Staff
- **Limited access** - customer-facing operations only
- Cannot view internal data (profit, supplier cost hidden)
- Cannot edit settings
- Cannot manage users
- Cannot delete data
- Can create/edit bookings, customers, payments, invoices

## Backend Implementation

### Models
- **User Model** (`backend/src/models/User.ts`)
  - Fields: username, email, password (hashed), role, name, isActive
  - Password hashing with bcrypt
  - Password comparison method

### Authentication
- **JWT-based authentication**
- Token expires in 7 days
- Middleware: `authenticate` - verifies JWT token
- Middleware: `authorize` - checks user role

### Routes
- **Auth Routes** (`/api/auth`)
  - `POST /api/auth/login` - Login
  - `GET /api/auth/me` - Get current user
  - `POST /api/auth/change-password` - Change password

- **User Management Routes** (`/api/users`)
  - `GET /api/users` - List all users (admin, manager only)
  - `GET /api/users/:id` - Get user details
  - `POST /api/users` - Create user (admin, manager only)
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user (admin only)

### Protected Routes
- **Settings**: Requires authentication, edit requires admin/manager
- **Customer Delete**: Requires admin/manager
- **Booking Delete**: Requires admin/manager
- **User Management**: Requires admin/manager

## Frontend Implementation

### Login Page
- Username/password login form
- Shows default user credentials
- Stores token and user in localStorage
- Redirects to main app after login

### App Component Updates
- Checks for stored token on load
- Shows login page if not authenticated
- Displays current user name and role in sidebar
- Role-based navigation (Settings and Users only for authorized roles)
- Logout button

### API Helpers
- All API calls automatically include Authorization header with JWT token
- Token retrieved from localStorage

### User Management Page
- List all users with role badges
- Create new users (admin/manager only)
- Edit users (with role restrictions)
- Delete users (admin only)
- Color-coded role badges

## Default Users

Run `npm run init-admin` in backend directory to create default users:

1. **admin** / admin123 (Admin role)
2. **manager** / manager123 (Manager role)
3. **accountant** / accountant123 (Accountant role)
4. **staff** / staff123 (Staff role)

⚠️ **Important**: Change default passwords after first login!

## Setup Instructions

1. **Initialize default users**:
   ```bash
   cd backend
   npm run init-admin
   ```

2. **Start backend**:
   ```bash
   npm run dev
   ```

3. **Start frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Login**:
   - Open http://localhost:5173
   - Use default credentials (e.g., admin/admin123)
   - Change password after first login

## Security Notes

- Passwords are hashed using bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days
- Tokens stored in localStorage (consider httpOnly cookies for production)
- Set `JWT_SECRET` in `.env` for production
- Change default passwords immediately

## Role-Based UI Restrictions

- **Settings page**: Only visible to Admin and Manager
- **Users page**: Only visible to Admin and Manager
- **Internal data** (profit, supplier cost): Hidden from Staff role
- **Delete buttons**: Only visible to Admin and Manager

## Future Enhancements

- Password reset functionality
- Session management
- Activity logging/audit trail
- Two-factor authentication
- Role-based data filtering in reports



