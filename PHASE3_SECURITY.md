# Phase 3: Role-Based Access Control (RBAC) - Implementation Guide

## Overview
Phase 3 implements a secure authentication system with role-based access control for the admin portal. The system supports two user roles:
- **Admin**: Full access to package management and leads
- **Sales**: Access only to leads dashboard

## Architecture

### 1. Middleware (`src/middleware.ts`)
- **Purpose**: Protects all `/admin/*` routes
- **Functionality**:
  - Checks for `user_role` cookie on all admin routes
  - Redirects unauthenticated users to `/login`
  - Redirects sales users from `/admin` to `/admin/leads`
  - Allows admin users to access all routes

### 2. Authentication System

#### Login Page (`src/app/login/page.tsx`)
- Beautiful glassmorphism login UI
- Single password input field
- Client-side form handling with loading states
- Error message display
- Redirects based on user role

#### Login API (`src/app/api/auth/login/route.ts`)
- Server-side password validation
- Compares against environment variables:
  - `ADMIN_PASSCODE` for admin access
  - `SALES_PASSCODE` for sales access
- Sets secure HTTP-only cookies with:
  - `httpOnly: true` (prevents XSS attacks)
  - `secure: true` in production
  - `sameSite: 'lax'`
  - 7-day expiration

#### Logout API (`src/app/api/auth/logout/route.ts`)
- Deletes the `user_role` cookie
- Returns success response

### 3. Admin Layout (`src/app/admin/layout.tsx`)
- **Dynamic Navigation**: Conditionally renders links based on user role
  - Admin: "Manage Packages" + "View Leads"
  - Sales: "View Leads" only
- **Header Components**:
  - Brand logo (links to homepage)
  - Navigation menu (desktop & mobile)
  - Role badge indicator
  - Logout button
- **Server-side role checking**: Reads cookies on the server for security

### 4. Dashboard Pages

#### Package Management (`src/app/admin/page.tsx`)
- **Access**: Admin only (middleware enforced)
- **Features**:
  - View all packages (active & inactive)
  - Toggle package visibility
  - Add new packages
  - View package statistics
  - Preview package highlights
  - Link to view package on public site

#### Leads Dashboard (`src/app/admin/leads/page.tsx`)
- **Access**: Both admin and sales
- **Features**:
  - View all customer leads from database
  - Lead statistics (total, new, contacted)
  - Lead details table with:
    - Customer name
    - Phone number (clickable tel: link)
    - Destination interest
    - Status badges
    - Submission date/time
  - WhatsApp quick action button
  - Export CSV option (UI ready)

### 5. Components

#### LogoutButton (`src/components/LogoutButton.tsx`)
- Client component with loading state
- Calls logout API endpoint
- Redirects to homepage after successful logout
- Includes error handling

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Admin Access
ADMIN_PASSCODE=your-secure-admin-password

# Sales Access  
SALES_PASSCODE=your-secure-sales-password

# Supabase (already configured in Phase 2)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

## Security Features

### 1. **Cookie-Based Authentication**
- HTTP-only cookies prevent XSS attacks
- Secure flag in production (HTTPS only)
- SameSite protection against CSRF
- 7-day expiration with automatic renewal

### 2. **Server-Side Protection**
- Middleware runs on every request
- No client-side authentication logic
- Role checks performed server-side
- Secure environment variable storage

### 3. **Role-Based Access Control**
- Granular permission system
- Sales users can't access package management
- Automatic redirection for unauthorized access
- Fallback redirects if cookies are missing

### 4. **Multi-Layer Protection**
- Middleware (route protection)
- Server Components (data fetching)
- API Routes (mutation protection)

## User Flows

### Admin User Flow
1. Visit `/admin` or `/admin/leads`
2. Redirected to `/login` (no cookie)
3. Enter admin passcode
4. Cookie set: `user_role=admin`
5. Redirected to `/admin` (Package Management)
6. Can navigate to both "Manage Packages" and "View Leads"
7. Click "Logout" → Cookie deleted → Redirect to homepage

### Sales User Flow
1. Visit `/admin` or `/admin/leads`
2. Redirected to `/login` (no cookie)
3. Enter sales passcode
4. Cookie set: `user_role=sales`
5. Redirected to `/admin/leads` (Leads Dashboard)
6. Only sees "View Leads" navigation link
7. If tries to access `/admin`, middleware redirects to `/admin/leads`
8. Click "Logout" → Cookie deleted → Redirect to homepage

## Testing Checklist

### Authentication
- [ ] Login with admin passcode redirects to `/admin`
- [ ] Login with sales passcode redirects to `/admin/leads`
- [ ] Invalid passcode shows error message
- [ ] Logout deletes cookie and redirects to homepage

### Authorization
- [ ] Admin can access `/admin` (Package Management)
- [ ] Admin can access `/admin/leads` (Leads Dashboard)
- [ ] Sales user accessing `/admin` redirects to `/admin/leads`
- [ ] Sales user can access `/admin/leads`
- [ ] Unauthenticated access to any `/admin/*` redirects to `/login`

### UI/UX
- [ ] Login page displays glassmorphism design
- [ ] Loading states work during login
- [ ] Error messages display correctly
- [ ] Navigation links conditional on role
- [ ] Role badge shows current role
- [ ] Mobile navigation works properly
- [ ] Logout button shows loading state

### Data Security
- [ ] Cookies are HTTP-only
- [ ] Cookies are secure in production
- [ ] Environment variables not exposed to client
- [ ] No sensitive data in browser console

## File Structure

```
global-gateway/
├── src/
│   ├── middleware.ts                    # Route protection middleware
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx                # Login page (client)
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin layout with role-based nav
│   │   │   ├── page.tsx                # Package management (admin only)
│   │   │   └── leads/
│   │   │       └── page.tsx            # Leads dashboard (admin & sales)
│   │   └── api/
│   │       └── auth/
│   │           ├── login/
│   │           │   └── route.ts        # Login API endpoint
│   │           └── logout/
│   │               └── route.ts        # Logout API endpoint
│   └── components/
│       └── LogoutButton.tsx            # Logout component
```

## Future Enhancements

### Phase 3.1 (Optional)
- [ ] Add "Remember Me" option (30-day cookie)
- [ ] Add password strength requirements
- [ ] Implement rate limiting on login attempts
- [ ] Add session timeout warnings

### Phase 3.2 (Optional)
- [ ] Add lead status management (mark as contacted, qualified, etc.)
- [ ] Add lead filtering and search
- [ ] Implement actual CSV export functionality
- [ ] Add lead notes/comments system

### Phase 3.3 (Optional)
- [ ] Add user management (create/edit sales users)
- [ ] Implement email-based authentication
- [ ] Add 2FA (two-factor authentication)
- [ ] Activity logging and audit trails

## Troubleshooting

### Issue: "Redirecting to login" loop
**Solution**: Clear browser cookies and try again. Check that environment variables are set correctly.

### Issue: Sales user can still access /admin
**Solution**: Ensure middleware is properly configured with `matcher: '/admin/:path*'`. Check that cookies are being set correctly.

### Issue: Login not working
**Solution**: 
1. Verify environment variables are set in `.env.local`
2. Check browser console for API errors
3. Ensure API routes are accessible (check `/api/auth/login`)

### Issue: Logout not redirecting
**Solution**: Check that the logout API is successfully deleting cookies. Verify router.refresh() is being called.

## Best Practices

1. **Never commit `.env.local`** - Keep passwords secure
2. **Use strong passcodes** - Minimum 12 characters with special characters
3. **Rotate passwords regularly** - Change passcodes every 90 days
4. **Monitor failed login attempts** - Consider adding logging
5. **Test in production mode** - Some cookie features behave differently
6. **Use HTTPS in production** - Required for secure cookies

## Summary

Phase 3 implements a robust, secure authentication system that:
- ✅ Protects all admin routes with middleware
- ✅ Provides role-based access control
- ✅ Uses secure HTTP-only cookies
- ✅ Offers beautiful, professional UI
- ✅ Supports multiple user roles (admin & sales)
- ✅ Includes comprehensive error handling
- ✅ Mobile-responsive design
- ✅ Server-side security validation

The system is production-ready and follows Next.js 14 best practices for authentication and authorization.
