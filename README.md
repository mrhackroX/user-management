# User Document Management

## Description

This project is a modular, scalable, and cloud-ready backend service built using the NestJS framework. It is designed to manage user authentication, role-based access control, document management, and document ingestion workflows. The system is engineered with a strong emphasis on code quality, testability, and maintainability, aligning with production-grade standards even if some features remain in a prototype state.

## Features

- User Authentication: Register, login, logout, and role-based access control (admin, editor, viewer).
- User Management: Admin-only functionality for managing user roles and permissions.
- Document Management: CRUD operations for user documents. AWS S3 integration for secure document storage.
- Ingestion Management: APIs to trigger and manage ingestion pipelines for document processing.

## Prerequisites

Before running this project, ensure the following services are properly configured:

### 1. AWS S3 Bucket Setup

This project uses AWS S3 for secure document storage.

#### Steps:

- Sign in to the [AWS Console](https://aws.amazon.com/console/).
- Go to **S3** and create a new bucket:
  - Bucket Name: (e.g., `user-documents`)
  - Region: `ap-south-1`
- Go to **IAM**, create a user with **Programmatic Access**:
  - Attach the `AmazonS3FullAccess` policy (or a custom policy with minimal permissions).
  - Save the **Access Key ID** and **Secret Access Key** for environment configuration.

### 2. PostgreSQL Database Setup

This project supports using **either a local PostgreSQL instance** or **AWS RDS**.

#### Option A: Local PostgreSQL

Install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/) if you haven't already.

Default configuration:

- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: _(set during installation)_

Create the database: user_document_management

#### Option B: AWS RDS (PostgreSQL)

If you prefer a managed cloud database, you can use **Amazon RDS** to host your PostgreSQL instance.

##### Steps to Set Up RDS:

##### 1. **Log in** to the [AWS Management Console](https://console.aws.amazon.com/).

##### 2. **Navigate** to the **RDS** service.

##### 3. **Create a new PostgreSQL database**:

- **Engine**: PostgreSQL
- **DB Identifier**: `user-document-management`
- **Master Username**: `postgres`
- **Master Password**: `<your-db-password>`
- **DB Name**: `user_document_management`

##### 4. **Enable Public Access**:

- During setup, enable public accessibility **if you plan to connect from your local machine**.

##### 5. **Configure Security Group**:

- Go to **VPC > Security Groups**.
- Find the security group associated with your RDS instance.
- Add an **Inbound Rule**:
  - **Type**: PostgreSQL
  - **Port**: `5432`
  - **Source**: Your IP (e.g., `203.0.113.0/32`)

##### 6. **Note down your RDS connection details**:

- **Endpoint** (used as `DB_HOST` in your `.env.stage.dev`)
- **Port** (typically `5432`)

## Project Setup

### 1. **Clone the Repository**

```bash
git clone https://github.com/mrhackroX/user-management.git
```

### 2. **Navigate to the Project Directory**

```bash
cd user-management
```

### 3. **Install Dependencies**

```bash
yarn install
```

### 4. **Configure Environment Variables**

- Create a `.env` file in the root directory of the project.
- Update the `.env` file with your AWS RDS, AWS S3 bucket and application configuration:

  ```env
   AWS_ACCESS_KEY_ID='<your-aws-access-key>'
   AWS_SECRET='<your-aws-secret-key>'
   AWS_REGION='ap-south-1'
   AWS_BUCKET_NAME='user-documents'
   DB_HOST='<your-db-host>'
   DB_PORT='5432'
   DB_USERNAME='postgres'
   DB_PASSWORD='<your-db-password>'
   DB_DATABASE='user_document_management'
   JWT_SECRET='<your-jwt-secret>'
   PORT=3000

  ```

## Running the Application

- **Install packages**:

  ```bash
  yarn install
  ```

- **Development Mode** (with live reload):

  ```bash
  npm run start:dev
  ```

- **Production Mode**:

  ```bash
  npm run build
  npm run start:prod
  ```

## Running Tests

- **Unit Tests**:

  ```bash
  npm run test
  ```

- **Coverage**:
  ```bash
  npm run test:cov
  ```

## Accessing the Application

The application runs on `http://localhost:3000` by default. Use tools like Postman or cURL to interact with the APIs.

## Authentication & Authorization

This application uses **JWT (JSON Web Tokens)** for secure authentication and **role-based authorization** using custom guards in the NestJS framework.

### Authorization & Role Management

#### 1. **Roles and Access Control:**

- The app uses a custom guard to control access to routes based on user roles.
- Roles include: `admin`, `editor`, and `viewer`.
- Admins have full access to manage users and documents.
- Editors can create and update content.
- Viewers can only read data.

#### 2. **Role Assignment:**

- When a user signs up, they are saved with the `viewer` role by default.
- **Only an admin** can update a user's role in the system (e.g., promote to `editor` or `admin`).
- There is no public API to change user roles; it's a protected admin-only operation.

#### 3. **Route-Level Authorization:**

- Protected routes are decorated using the `@Roles()` decorator.
- The `RolesGuard` checks the user’s role from the JWT payload and grants/denies access accordingly.

### 4. Post-Deployment Checklist

#### i) Database connectivity is verified

#### ii) S3 upload credentials work

#### iii) Application is reachable via EC2 public IP or domain

#### iv) pm2 ensures application restarts on reboot

#### v) Logs available via pm2 logs
