# LibManager - Library Management API

RESTful API for library management with user authentication and role-based authorization. Built with Node.js, Express.js, and MongoDB.

## 🚀 Features

### Authentication System
- User registration and login with JWT tokens
- Password hashing using bcryptjs
- Role-based authorization (staff/admin)
- Protected routes with middleware

### Core Entities
- **Users:** Registration, login, profile management. There are two types of user 'admin' and 'member'.
- **Books:** CRUD operations for book management to manage available books. 
- **Reservations:** book reservation requests linking Users to Books

### Database Schema
- **User Model:** name, email, tel, password, role, timestamps
- **Book Model:** title, author, ISBN, publisher, availableAmount, coverPicture
- **Reservation Model:** borrowDate, pickupDate, user reference, book reference

### API Structure
- **Auth Routes (/api/v1/auth):** register, login, logout, get profile
- **Book Routes (/api/v1/books):** CRUD operations for books
- **Reservation Routes (/api/v1/reservations):** CRUD operations for book reservation requests

### Access Control / Controllers 
- After login, registered admin user can add/update/delete/view any book
- After login, registered member user can issue reservation request to borrow any book. The book list is provided to the user. Book information is also available. Registered member user can have only 3 reservations in total at any time.
- Registered member user can view his/her own reservation requests
- Registered member user can edit his/her own reservation request 
- Registered member user can delete his/her own reservation request 
- Registered admin user can view any reservation request 
- Registered admin user can edit any reservation request 
- Registered admin user can delete any reservation request 

### Security Features
- JWT-based authentication
- Rate limiting (100 requests per 10 minutes)
- Helmet for security headers
- XSS protection
- MongoDB injection protection
- CORS enabled

### Documentation
- Swagger/OpenAPI documentation integrated
- Available at /api-docs endpoint

### Technology Stack
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose ODM
**Authentication:** JWT, bcryptjs
**Security:** helmet, xss-clean, express-rate-limit
**Documentation:** Swagger UI

### Development Setup
- Uses nodemon for development
- Environment variables in config/config.env
- MongoDB connection with mongoose

The project follows RESTful API conventions with proper middleware, error handling, and security measures. It's designed to handle book reservation management with user authentication and role-based access control.
