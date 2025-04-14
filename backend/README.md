# AR Tracker Backend

This is the backend for the AR Tracker application, a system for managing overdue and disputed invoices.

## Features

- User authentication and role-based access control
- AR data import and processing
- Invoice assignment and tracking
- Comment and action logging
- Contact attempt tracking
- Promise-to-Pay (PTP) management

## User Roles

- **Billers**: Handle invoice accuracy, delivery issues, and PO mismatches
- **Collectors**: Contact customers for payment and manage payment disputes
- **Operations**: Oversee Billers/Collectors, assign tasks, and review actions
- **Directors**: Access high-level dashboards and reports

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL

### Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set up the PostgreSQL database and update the `.env` file with your database credentials
5. Initialize the database:
   ```
   python -m app.init_db
   ```

### Running the Application

```
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication

The API uses JWT tokens for authentication. To authenticate:

1. Obtain a token by sending a POST request to `/api/auth/token` with your username and password
2. Include the token in the Authorization header of subsequent requests:
   ```
   Authorization: Bearer <your_token>
   ```

## API Endpoints

### Authentication
- `POST /api/auth/token`: Login and obtain access token
- `GET /api/auth/me`: Get current user information

### Users
- `POST /api/users`: Create a new user (Operations/Directors only)
- `GET /api/users`: List users (Operations/Directors only)
- `GET /api/users/{user_id}`: Get user details
- `PUT /api/users/{user_id}`: Update user (Operations/Directors only)
- `DELETE /api/users/{user_id}`: Delete user (Operations/Directors only)

### AR Data
- `POST /api/import-ar-data`: Import AR data from Excel/CSV (Operations/Directors only)

## Database Schema

The application uses the following main tables:
- `users`: User accounts and authentication
- `roles`: User roles
- `ar_invoices`: Invoice data
- `invoice_comments`: Comments on invoices
- `contact_attempts`: Customer contact records
- `promise_to_pays`: Payment promises from customers 
