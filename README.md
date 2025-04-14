# Project Radius

A comprehensive invoice management and tracking system.

## Database Setup

1. Install PostgreSQL on your system if not already installed
2. Create a new database named `radius_db` (or your preferred name)
3. Copy `.env.example` to `.env` and update the following variables:
   - `DB_NAME`: Your database name
   - `DB_USER`: PostgreSQL username
   - `DB_PASSWORD`: PostgreSQL password
   - `DB_HOST`: Database host (default: localhost)
   - `DB_PORT`: Database port (default: 5432)

## Environment Variables

The following environment variables are required:

### Database Configuration
- `DB_NAME`: Name of the PostgreSQL database
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port

### JWT Configuration
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time

### Server Configuration
- `PORT`: Server port number
- `NODE_ENV`: Environment (development/production)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run database migrations:
   ```bash
   npm run migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User Authentication
- Invoice Management
- Aging Reports
- Action Tracking
- Promise-to-Pay (PTP) Management
- Audit Trail
- Role-based Access Control

## API Documentation

API documentation is available at `/api-docs` when running the server. 
