# NIS - Passporter API

Welcome to Passporter. This is the documentation for the Passporter API, your one-stop-shop for all things Passport and Visa applications in Nigeria. This API is designed to be used by both staff and applicants and uses a seamless "QUEUE" system.

## Table of Contents

- [Getting Started](#getting-started)

  - [Installation](#installation)
  - [Technologies](#technologies)
  - [Usage](#usage)

- [API Documentation](#api-documentation)

  - [Authentication](#authentication)
  - [Application](#application)
  - [Queue](#queue)
  - [Staff](#staff)

- [FAQ](#faq)
- [License](#license)

## [Getting Started](#getting-started)

Prerequisites

If you would like to use this api, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB installed and running

### [Installation](#installation)

1. Clone the repository to your local machine:

```
git clone https://github.com/trillionclues/passporter-backend.git
```

2. Install dependencies:

```
cd passporter-backend
yarn install
```

3. Configure your environment variables by creating a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/passporter
PORT=5000
MONGODB_URL=mongodb://localhost/your-database
JWT_SECRET=your-jwt-secret
MAIL_ID=GMAIL_MAIL_ID
MP=GMAIL_MAIL_APP_PASSWORD
CLOUD_NAME=CLOUDINARY_NAME
API_KEY=CLOUDINARY_api_KEY
API_SECRET=CLOUDINARY_SECRET
```

4. Run the server:

```
yarn dev
```

Now, the backend server should be up and running.

### [Technologies](#technologies)

This project uses a number of open source projects:

- [NodeJS] - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express] - Fast, unopinionated, minimalist web framework for Node.js.
- [Yarn] - A package manager for the JavaScript platform.
- [MongoDB] - A cross-platform document-oriented database program.
- [Mongoose] - Mongoose ODM for MongoDB object modelling.
- [Bcrypt] - Secure password hashing for Node.js.
- [JSON Web Token] - A compact, URL-safe means of representing claims to be transferred between two parties.
- [nodemailer] - A simple Node.js module for sending email.
- [dotenv] - Load environment variables from .env files.
- [cloudinary] - Cloudinary API wrapper for Node.js.
- [Multer] - A Node.js middleware for handling multipart/form-data, used for uploading files.
- [Crypto] - A JavaScript library for encrypting and decrypting data.

### [Usage](#usage)

- Make HTTP requests to the respective API endpoints using your favorite API client (e.g., Postman, Insomnia) or integrate them into your frontend application.
- Refer to the API endpoints for more details on request payloads and response formats.

## [API Documentation](#api-documentation)

Access the API endpoints as described in the [API Endpoints](#api-documentation) section below.

### [Authentication](#authentication)

- POST /api/applicant/register: Register a new applicant.
- POST /api/applicant/auth/login: Login an applicant.
- POST /api/applicant/auth/forgot-password: Forgot password of an applicant.
- POST /api/applicant/auth/reset-password: Reset password of an applicant.
- POST /api/applicant/change-password: Change password of an applicant.

### [Application](#application)

- POST /api/application/create-application: Submit an application && Add to queue.
- GET /api/application/: && token: Get applicant applications.
- PUT /api/application/update-application: Update an application.
- DELETE /api/application/delete-application: Delete an application.

### [Queue](#queue)

- GET /api/queue: Get all applicationIID in queue.
- DELETE /api/queue && token && applicationIID: Remove an applicationIID from queue.

<!-- ### [Staff](#staff)
- POST /api/applicant/staff: Add an applicant to staff.
- GET /api/applicant/staff: Get all applicant in staff.
- DELETE /api/applicant/staff: Remove an applicant from staff.
- PUT /api/applicant/staff: Update an applicant in staff. -->

## [FAQ](#faq)

[null]

## [License](#license)

This project is licensed under the MIT License.

Feel free to create an issue if yout think there is a bug or an error.

##WAGMI
