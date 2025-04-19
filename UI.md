# Project Radius - User Interface Documentation

## Table of Contents
1. [Authentication Pages](#authentication-pages)
2. [Dashboard](#dashboard)
3. [Invoice Management](#invoice-management)
4. [User Management](#user-management)
5. [Reports](#reports)
6. [Settings](#settings)

## Authentication Pages

### Login Page (`/login`)
- **Email Input Field**
  - Placeholder: "Enter your email"
  - Validation: Must be a valid email format
  - Error message: "Please enter a valid email address"

- **Password Input Field**
  - Placeholder: "Enter your password"
  - Type: password (masked)
  - Minimum length: 8 characters
  - Error message: "Password must be at least 8 characters"

- **Login Button**
  - Text: "Login"
  - Action: Authenticate user with Firebase Auth
  - Loading state: Show spinner while authenticating
  - Error handling: Display error message if authentication fails

- **Forgot Password Link**
  - Text: "Forgot Password?"
  - Action: Navigate to password reset page
  - Functionality: Send password reset email

- **Sign Up Link**
  - Text: "Don't have an account? Sign Up"
  - Action: Navigate to registration page

### Registration Page (`/register`)
- **First Name Input**
  - Required field
  - Validation: Alphabetic characters only
  - Error message: "Please enter your first name"

- **Last Name Input**
  - Required field
  - Validation: Alphabetic characters only
  - Error message: "Please enter your last name"

- **Email Input**
  - Required field
  - Validation: Valid email format
  - Error message: "Please enter a valid email"

- **Password Input**
  - Required field
  - Minimum length: 8 characters
  - Must contain: uppercase, lowercase, number, special character
  - Error message: "Password must meet requirements"

- **Confirm Password Input**
  - Required field
  - Must match password field
  - Error message: "Passwords do not match"

- **Role Selection**
  - Dropdown with options: Admin, Manager, Collector, Biller
  - Default: Collector
  - Required field

- **Register Button**
  - Text: "Create Account"
  - Action: Create user in Firebase Auth and Firestore
  - Loading state: Show spinner while processing

## Dashboard (`/dashboard`)

### Overview Section
- **Total Invoices Card**
  - Display total number of invoices
  - Color-coded by status
  - Click to view all invoices

- **Aging Report Card**
  - Pie chart showing invoice aging
  - Categories: Current, 1-30 days, 31-60 days, 61-90 days, 90+ days
  - Click to view detailed aging report

- **Collection Performance Card**
  - Bar chart showing collection performance
  - Monthly comparison
  - Target vs Actual collection

### Recent Activity Feed
- **Activity Items**
  - Show latest 10 activities
  - Include: Invoice updates, payments, comments
  - Timestamp for each activity
  - User who performed the action

### Quick Actions
- **Create New Invoice Button**
  - Icon: Plus sign
  - Text: "New Invoice"
  - Action: Open invoice creation modal

- **View Reports Button**
  - Icon: Chart
  - Text: "View Reports"
  - Action: Navigate to reports page

## Invoice Management

### Invoice List Page (`/invoices`)
- **Search Bar**
  - Search by: Invoice number, customer name, amount
  - Real-time filtering
  - Clear search button

- **Filters**
  - Status filter (dropdown)
  - Date range filter
  - Priority filter
  - Region filter

- **Sort Options**
  - Sort by: Due date, amount, status
  - Ascending/descending toggle

- **Invoice Table**
  - Columns:
    - Invoice Number
    - Customer Name
    - Amount
    - Due Date
    - Status
    - Priority
    - Actions
  - Pagination controls
  - Items per page selector

### Invoice Details Page (`/invoices/:id`)
- **Invoice Information Section**
  - Display all invoice details
  - Edit button for authorized users
  - Status update dropdown

- **Payment History**
  - List of all payments
  - Date, amount, payment method
  - Add payment button

- **Comments Section**
  - List of all comments
  - Add comment form
  - Comment type selector (General, Dispute, Resolution)

- **Actions Section**
  - Add new action button
  - Action type selector
  - Due date picker
  - Priority selector

### Create/Edit Invoice Modal
- **Customer Information**
  - Customer name (required)
  - Contact information
  - Billing address

- **Invoice Details**
  - Invoice number (auto-generated)
  - Issue date (default: today)
  - Due date (required)
  - Amount (required)
  - Description

- **Additional Information**
  - Priority selection
  - Region selection
  - Notes field

## User Management (`/users`)

### User List
- **User Table**
  - Columns:
    - Name
    - Email
    - Role
    - Status
    - Last Login
    - Actions
  - Edit and delete buttons for admins

### User Profile Page (`/users/:id`)
- **Personal Information**
  - Name
  - Email
  - Role
  - Status toggle

- **Activity Log**
  - User's recent activities
  - Date and time stamps
  - Action descriptions

## Reports (`/reports`)

### Aging Report
- **Aging Summary**
  - Total outstanding amount
  - Breakdown by aging buckets
  - Export to PDF/Excel option

- **Detailed Aging Table**
  - Filter by region/collector
  - Sort by amount/aging
  - Export functionality

### Collection Performance
- **Performance Metrics**
  - Collection rate
  - Average days to collect
  - Success rate

- **Performance Charts**
  - Monthly collection trend
  - Collector performance comparison
  - Region-wise performance

## Settings (`/settings`)

### Profile Settings
- **Personal Information**
  - Update name
  - Change email
  - Update password

### System Settings (Admin Only)
- **User Roles**
  - Add/remove roles
  - Set permissions

- **Region Management**
  - Add/edit regions
  - Assign collectors

- **Email Templates**
  - Edit system emails
  - Preview templates

## Common UI Elements

### Navigation Bar
- **Logo/Brand**
  - Click to return to dashboard
  - Responsive design

- **Main Menu**
  - Dashboard
  - Invoices
  - Reports
  - Users (admin only)
  - Settings

- **User Menu**
  - Profile
  - Settings
  - Logout

### Notifications
- **Notification Bell**
  - Unread count badge
  - Dropdown list of notifications
  - Mark as read option

### Search Bar
- **Global Search**
  - Search across all modules
  - Real-time results
  - Keyboard shortcut (Ctrl/Cmd + K)

### Modals
- **Common Modal Structure**
  - Header with title
  - Close button
  - Content area
  - Footer with action buttons
  - Loading state
  - Error messages

### Forms
- **Form Validation**
  - Real-time validation
  - Error messages
  - Required field indicators
  - Success messages

### Tables
- **Common Table Features**
  - Sortable columns
  - Filterable data
  - Pagination
  - Row selection
  - Export options
  - Responsive design

### Loading States
- **Loading Indicators**
  - Spinner for short operations
  - Skeleton loading for content
  - Progress bar for long operations

### Error Handling
- **Error Messages**
  - Clear error messages
  - Retry options
  - Contact support link
  - Error logging

## Responsive Design
- **Mobile View**
  - Collapsible navigation
  - Stacked tables
  - Touch-friendly buttons
  - Optimized forms

- **Tablet View**
  - Adjusted layouts
  - Responsive tables
  - Optimized spacing

- **Desktop View**
  - Full feature access
  - Multi-column layouts
  - Advanced filtering 
