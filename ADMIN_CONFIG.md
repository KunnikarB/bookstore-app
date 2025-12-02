# Admin Access Configuration

## Overview

Only users with admin privileges can add, update, or delete books in the bookstore.

## Admin Email Configuration

### Backend

Edit: `backend/server/config/admins.ts`
typescript
export const ADMIN_EMAILS = [
  'admin@bookstore.com',
  
];

### Frontend

Edit: `frontend/src/config/admins.ts`

```typescript
export const ADMIN_EMAILS = [
  'admin@bookstore.com',
  'your-email@example.com', // Must match backend
];
```

**Important**: Keep both lists synchronized!

## Adding a New Admin

1. Add the email to `backend/server/config/admins.ts`
2. Add the same email to `frontend/src/config/admins.ts`
3. Rebuild and restart both backend and frontend

## Protected Routes

### Backend Routes (Admin Only)

- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Frontend Pages (Admin Only)

- `/add-book` - Add Book Page

## How It Works

1. User logs in with Firebase Authentication
2. Frontend checks if user's email is in ADMIN_EMAILS list
3. If not admin, shows "Access Denied" message
4. Backend verifies JWT token AND checks if email is in ADMIN_EMAILS
5. If not admin, returns 403 Forbidden error

## Security Features

✅ Double verification (frontend + backend)  
✅ JWT token validation via Firebase Admin SDK  
✅ Admin email whitelist  
✅ Protected routes with middleware  
✅ Clear error messages for unauthorized access

## Testing Admin Access

1. Create a Firebase user with an email in ADMIN_EMAILS list
2. Login with that account
3. Navigate to `/add-book`
4. You should be able to add books
5. Try with a non-admin email - should see "Access Denied"

## Production Recommendations

For production deployments:

- Store admin emails in environment variables
- Or use a database table for roles/permissions
- Implement more granular role-based access control (RBAC)
- Add audit logging for admin actions
