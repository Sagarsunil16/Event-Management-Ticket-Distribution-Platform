# 🎫 Event Management & Ticketing Platform

A production-ready full-stack MERN (MongoDB, Express, React, Node.js, TypeScript) application for managing events, organizers, attendees, and online ticket bookings.

**[Live Demo »](https://event-management-ticket-distributio.vercel.app/)**

---

## ⭐ Features

- **User Registration/Login** (Organizer & Attendee roles) with JWT authentication and role-based route protection.
- **Profile Management**: View and edit organizer/attendee profiles.
- **Organizer Panel**: Create, edit, delete, and list own events.
- **Attendee Portal**:
  - Browse/search events, view event details.
  - Book tickets (free & paid), secure Stripe payment for paid events.
  - View/cancel all booked tickets.
- **Event Details Page**: Rich event info, statistics, descriptive hero/banner, and conditional “Book Now” (free or paid) action.
- **Backend Patterns**: Repository pattern, services, controllers—SOLID principles.
- **Modern Frontend**: React + TypeScript + Vite, validated forms with Formik & Yup, protected routes, responsive UI.
- **Profile, Login, Register, and Event forms**: Robust Formik + Yup object validation.
- **Error Handling**: Centralized responses in both frontend and backend.
- **Easy Deployment**: Simple `.env` config, ready for Vercel/Netlify (frontend) and Render/Railway/Heroku (backend).

---

## 🧑‍💻 Tech Stack & Best Practices

- **Backend**: Node.js, Express, MongoDB, Mongoose, TypeScript
- **Frontend**: React, TypeScript, Vite, Axios, Formik, Yup
- **Authentication**: JWT with role-based access (attendee/organizer)
- **Repository Pattern** for all core models: Clean separation of DB logic, easy to extend.
- **SOLID Principles** throughout service & controller logic for maintainability.
- **Validation**: All user input validated with Formik+Yup (frontend) and Mongoose (backend).
- **Payment**: Stripe integration for secure paid ticket booking.
- **Cloning & Setup**: Repository designed for simple cloning and config.

---

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/Sagarsunil16/Event-Management-Ticket-Distribution-Platform.git
cd event-management-platform



### 2. Set Up the Backend

- `cd api`
- Create `.env` file:

PORT=5000
MONGO=your_mongodb_connection
MONGODB_PASS=your_mongodb_password
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret



- Install & run:
npm install
npm run dev



### 3. Set Up the Frontend

- `cd clinet`
- Create `.env` file:

VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_API_URI=your_backend_url


- Install & run:
npm install
npm run dev




### 4. Open in browser:

- Backend default: [http://localhost:3000](http://localhost:3000)
- Frontend default: [http://localhost:5173](http://localhost:5173)

---


---

## 📲 Example Flow

**Organizer:**  
Register/login → create/manage events → edit details anytime → view all personal events.

**Attendee:**  
Register/login → browse or search events → view event details → book tickets (pay if required) → view/cancel own tickets.

---

## 🛠️ Patterns & Principles Used

- **Repository Pattern** for all entity data access
- **Service Layer** encapsulates business logic
- **Controller Layer**: Handles request/response
- **SOLID Principles** for flexible, robust codebase
- **Formik & Yup** for all forms on frontend (login, register, profile, create/edit event)
- **Strict TypeScript** usage throughout

---

## 🌱 Future Enhancements

- **QR Code Generation** for tickets (downloadable, scannable at event entrance/online check-in)
- **Ticket Downloading** (PDF/PNG: can show at venue, email confirmation with QR)
- **Refund to Wallet** (cancelled/unused tickets refund management)
- **In-app Chat** (attendees ↔️ organizers, real-time Q&A)
- **Online Events/Video Calling** (integrate video SDK for online events, virtual rooms)
- **Admin Panel** for superuser event/transaction/user management
- **Analytics Dashboard** for organizers
- **Multi-language support**

---

## 📁 Project Structure

api/
├── src/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── repositories/
│ ├── routes/
│ └── services/
client/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── context/



---


## ℹ️ Author

Built by Sagar Sunil, 2025

---

## ⚠️ License

[MIT](LICENSE)

---

**Live Preview:**  
[https://event-management-ticket-distributio.vercel.app/](https://event-management-ticket-distributio.vercel.app/)

---
