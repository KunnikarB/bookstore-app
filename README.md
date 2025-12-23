# 📚 Bookstore App
A modern full-stack **Bookstore web application** built with React (Vite), Node.js, Express, MongoDB, and Firebase Authentication.  
Users can browse books, add them to the cart, securely check out, discount system, and inventory alerts. — with admin functionality for adding new books. Includes integration tests with Jest.

## Live Demo
https://bookstore-app-1-uhqx.onrender.com

## Preview

- Login page
<img width="1198" height="941" alt="Screenshot 2025-11-12 at 09 36 26" src="https://github.com/user-attachments/assets/358491e2-d830-4a29-9085-46e4c2d16e4d" />

---

- Signup page
<img width="1132" height="930" alt="Screenshot 2025-11-12 at 09 36 05" src="https://github.com/user-attachments/assets/278b93f3-3033-41f5-a325-3d8c55dc2f83" />

--- 

- Home page
<img width="1082" height="669" alt="Screenshot 2025-12-23 at 10 57 32" src="https://github.com/user-attachments/assets/2a45f29a-df43-4032-b2a1-ec1d74b5cdb7" />

<img width="1079" height="692" alt="Screenshot 2025-12-23 at 10 57 53" src="https://github.com/user-attachments/assets/1881ad9c-4a9c-4099-b11a-620674dacb93" />

---

- Add Book

<img width="1101" height="705" alt="Screenshot 2025-12-23 at 11 18 14" src="https://github.com/user-attachments/assets/d357ac54-8fa9-4f40-8561-2ac904c4c855" />

---

- Cart page
<img width="1107" height="664" alt="Screenshot 2025-12-23 at 11 13 56" src="https://github.com/user-attachments/assets/d20d52ce-67c5-47f7-95c4-d8d4ac386221" />

---

- Checkout page
<img width="1088" height="723" alt="Screenshot 2025-12-23 at 11 00 04" src="https://github.com/user-attachments/assets/0571e236-ce4c-4b31-9e6b-3d0827c99ec2" />

---

- Order Completed
  
<img width="1113" height="300" alt="Screenshot 2025-12-23 at 11 00 30" src="https://github.com/user-attachments/assets/dc17f411-46f8-4001-a4e0-7e78a791932e" />

---

## Features

###  User Features
-  **User Authentication** (Sign up, Login, Logout with Firebase)
- **Cart Management** — Add, remove, and view cart items
- **Checkout Page** with summary total and apply coupon codes
-  **Browse and Search Books**
-  **Modern UI** with pink-purple theme and responsive design

### Admin Features
-  **Add New Books** (title, author, price, and stock)
-  **Instant Database Update** via Express + MongoDB

### Advanced Features
- Discount System: Apply coupon codes like SAVE10, SAVE20
- Inventory Alerts : Notify when stock is low after purchase 

--- 

## Tech Stack

### Frontend
-  **React (Vite) + TypeScript**
-  **CSS / Inline Styles** (Hotpink and Deep Purple theme)
-  **Firebase Authentication**
-  **React Hot Toast** for notifications
- **Context API** for Cart and Auth management

### Backend
-  **Node.js + Express**
-  **MongoDB (Mongoose ORM)**
- **RESTful API** endpoints for books

###  Authentication

- Uses Firebase Authentication for user login/signup

- Stores display name and email for each user

- Supports logout and redirects using React Router

###  Future Improvements

- Add Book Cover Upload

-  Add Reviews and Ratings

-  Add Search and Filter Functionality

-  Integrate Stripe for Real Payment

-  Admin Dashboard for managing inventory
  
---

### Entity-Relationship (ER) Diagram
- This ER diagram represents a bookstore database consisting of five entities: Book, Cart, CartItem, Order, and OrderItem.
  - Each Book can appear in many CartItems and OrderItems.
  - Each Order contains multiple OrderItems.
  - Each Cart contains multiple CartItems.
  - CartItem and OrderItem are associative entities that resolve many-to-many relationships.
    

<img width="724" height="851" alt="bookstore drawio" src="https://github.com/user-attachments/assets/77f76d37-7c8e-4052-9cd2-a40270242d71" />


---


## ⚙️ Installation
Clone the repository
- git clone https://github.com/KunnikarB/bookstore-app

### Setup backend
- cd backend
- npm install
- npm run dev
The backend will start at http://localhost:3000

### Setup Frontedn
- cd frontend
- npm install
- npm run dev

### Setup Environment Variables
In /server/.env
- .env
  <pre>
  MONGO_URI=your_mongodb_connection_string
  PORT=3000
  </pre>
  
In /client/src/firebase.ts
- Replace with your Firebase config
  <pre>
  const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  };
</pre>

---

### Testing
- Run all integration tests using Jest: npm test

<img width="539" height="161" alt="Screenshot 2025-12-02 at 04 40 34" src="https://github.com/user-attachments/assets/8bc41e27-82ee-44a6-8d0c-488aeba757f8" />

  
## 💖 Credits
<pre>
Created with ❤️ by Kunnikar — Full Stack Developer
📧 Contact: bcreative@gmai.com
🌐 Portfolio: https://kunnikar-b.netlify.app
</pre>
