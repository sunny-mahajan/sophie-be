# Sophie Backend

This is the backend API for **Sophie**, built with **Node.js**, **TypeScript**, **Sequelize**, and **PostgreSQL**.  
It follows a clean, modular architecture designed for scalability and maintainability.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.12.2 or higher
  - Download from [Node.js official website](https://nodejs.org/en/)
- **Yarn**: v1.22 or higher
  - Install with npm: `npm install -g yarn`
- **PostgreSQL**: v13 or higher
  - Download and install from [PostgreSQL official website](https://www.postgresql.org/download/)

## 🛠 Technologies

- Node.js
- TypeScript
- Sequelize ORM
- PostgreSQL
- Joi for validation
- Swagger for API documentation
- Sentry for error monitoring

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Sophieapp/Sophie-BackEnd.git
cd Sophie-BackEnd
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Setup environment

Copy .env.example to .env and configure your variables:

#### Linux:

```bash
cp .env.example .env
```

#### Windows:

```
copy .env.example .env
```

### 4. Setup database

```bash
yarn db:setup
```

### 5. Run the app

```bash
yarn dev
```

### 6. API Documentation

```bash
http://localhost:PORT
```

## ✅ Best Practices Followed

- Controller → Service → Repository pattern
- Validation using Joi schemas
- Centralized error handling
- Clean token authentication logic
- Logging with IP address & user-agent
- Activity logs for auditing
- Role & permission-based access control

## 🔐 Authentication

- JWT-based auth with access and refresh tokens
- Secure hashing of passwords using bcrypt
