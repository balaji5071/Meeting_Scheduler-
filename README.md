# Meeting Scheduler

A secure and efficient backend-based meeting scheduling system built with Node.js and Express. It supports scheduling meetings, sending automated reminders, and notifying users via email.

---

## 🚀 Features

- 📅 Schedule and manage meetings
- 🔔 Automated meeting reminders with cron jobs
- 📧 Email notifications using Nodemailer
- 🛡️ Built-in security using Helmet, Rate Limiting, and MongoDB sanitization
- 🌐 RESTful API structure

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Email Service:** Nodemailer
- **Database:** MongoDB with Mongoose
- **Task Scheduling:** Node-cron
- **Security Middleware:**
  - `helmet`
  - `express-rate-limit`
  - `mongoose-sanitize`

---

## 🔐 Security Features

- **Helmet:** Sets secure HTTP headers
- **Rate Limiting:** Prevents brute-force attacks by limiting repeated requests
- **MongoDB Injection Protection:** Sanitizes data using `mongoose-sanitize`

---




## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/meeting-scheduler.git
   cd meeting-scheduler/backend

    Install dependencies

npm install

Set up environment variables

Create a .env file:

PORT=5000
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
MONGO_URI=your_mongodb_connection_string

Start the backend server

    node server.js

📬 API Endpoints

    Replace or update based on your actual routes

    POST /api/schedule – Schedule a meeting

    GET /api/meetings – Get all scheduled meetings

    DELETE /api/meeting/:id – Cancel a meeting

🧪 Testing

Use tools like Postman or Thunder Client to test the API endpoints.
📌 Future Improvements

    User authentication with JWT or sessions

    Frontend client (React or similar)

    Recurring meeting support

    Admin dashboard

👨‍💻 Author

Made with ❤️ by BALAJI