# Pehrawa

Pehrawa is a modern full-stack fashion e-commerce web application built using the MERN stack. It provides a complete online shopping experience with secure authentication, product management, role-based access, online payments, and a dedicated seller dashboard.

The project was built to gain hands-on experience in developing scalable full-stack applications and implementing real-world e-commerce functionalities.

---

## Features

### Authentication

* User Registration & Login
* Continue with Google (Google OAuth)
* JWT Authentication
* HTTP-only Cookie Based Sessions
* Protected Routes
* Role-Based Access (Buyer & Seller)

### Shopping Experience

* Browse Products
* Search & Filter Products
* Category-Based Navigation
* Product Details Page
* Product Variants (Size & Color)
* Stock Management
* Shopping Cart
* Wishlist
* Responsive Design

### Seller Dashboard

* Seller Registration
* Add Products
* Edit Products
* Delete Products
* Manage Product Variants
* Inventory Management
* Sales Analytics Dashboard
* Order Management

### Orders & Payments

* Razorpay Payment Gateway
* Secure Checkout
* Order Placement
* Order History
* Payment Verification

### Reviews

* Add Reviews
* Update Reviews
* Delete Reviews
* Product Ratings

---

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google OAuth
* Cookie Parser
* Multer

### Tools

* Git
* GitHub
* Postman
* Vercel
* Render
* 
---

## Installation

### Clone the repository

```bash
git clone https://github.com/komalkhokale/pehrawa.git
```

```bash
cd pehrawa
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=

MONGO_URI=

JWT_SECRET=

CLIENT_URL=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

SESSION_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

IMAGEKIT_PUBLIC_KEY=

IMAGEKIT_PRIVATE_KEY=

IMAGEKIT_URL_ENDPOINT=
```

---

## Project Structure

```
Pehrawa
│
├── frontend
│   ├── components
│   ├── pages
│   ├── redux
│   ├── hooks
│   ├── services
│   └── assets
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middlewares
│   ├── utils
│   ├── config
│   └── public
│
└── README.md
```

---

## Live Demo

**Live Website**

https://pehrawa.onrender.com/

```
https://your-live-link.com
```

---

## GitHub Repository

```
https://github.com/komalkhokale/pehrawa
```

---

## Future Improvements

* Coupon & Discount System
* Email Notifications
* Product Recommendations
* Recently Viewed Products
* Admin Dashboard
* Multiple Payment Methods
* Return & Refund Management
* Dark Mode

---

## Author

**Komal Khokale**

LinkedIn: https://www.linkedin.com/in/komal-khokale-4a3ba7278

GitHub: https://github.com/komalkhokale

Portfolio: https://komalkhokale.vercel.app/

---

If you found this project useful, consider giving it a ⭐ on GitHub.
