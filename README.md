# 📚 Bookstore App
A modern full-stack **Bookstore web application** built with React (Vite), Node.js, Express, MongoDB, and Firebase Authentication.  
Users can browse books, add them to the cart, securely check out, discount system, and inventory alerts. — with admin functionality for adding new books. Includes integration tests with Jest.

## Features

### 👥 User Features
- 🔐 **User Authentication** (Sign up, Login, Logout with Firebase)
- 🛒 **Cart Management** — Add, remove, and view cart items
- 💳 **Checkout Page** with summary total and apply coupon codes
- 📚 **Browse and Search Books**
- 🌙 **Modern UI** with pink-purple theme and responsive design

### ⚙️ Admin Features
- 📖 **Add New Books** (title, author, price, and stock)
- 💾 **Instant Database Update** via Express + MongoDB

### 🔥 Advanced Features
- Discount System: Apply coupon codes like SAVE10, SAVE20
- Inventory Alerts ⚠️: Notify when stock is low after purchase 

--- 

## 🧰 Tech Stack

### Frontend
- ⚛️ **React (Vite) + TypeScript**
- 🎨 **CSS / Inline Styles** (Hotpink and Deep Purple theme)
- 🔥 **Firebase Authentication**
- 🍞 **React Hot Toast** for notifications
- 🛍️ **Context API** for Cart and Auth management

### Backend
- 🧠 **Node.js + Express**
- 🗄️ **MongoDB (Mongoose ORM)**
- 🌐 **RESTful API** endpoints for books

### 🔐 Authentication

- Uses Firebase Authentication for user login/signup

- Stores display name and email for each user

- Supports logout and redirects using React Router

### 💡 Future Improvements

- 🖼️ Add Book Cover Upload (Firebase Storage)

- ⭐ Add Reviews and Ratings

- 🔍 Add Search and Filter Functionality

- 💰 Integrate Stripe for Real Payment

- 🧑‍💼 Admin Dashboard for managing inventory
  
---

- Login page
<img width="1198" height="941" alt="Screenshot 2025-11-12 at 09 36 26" src="https://github.com/user-attachments/assets/358491e2-d830-4a29-9085-46e4c2d16e4d" />

---

- Signup page
<img width="1132" height="930" alt="Screenshot 2025-11-12 at 09 36 05" src="https://github.com/user-attachments/assets/278b93f3-3033-41f5-a325-3d8c55dc2f83" />

--- 

- Home page
<img width="1191" height="729" alt="Screenshot 2025-11-12 at 09 28 24" src="https://github.com/user-attachments/assets/4ef625b1-ced5-4e9d-ad45-927f49da8afc" />

---

- Add Book
<img width="1084" height="919" alt="Screenshot 2025-11-12 at 09 25 43" src="https://github.com/user-attachments/assets/e5d4fa46-2317-4118-a024-8572e25ccc77" />


- Cart page
<img width="1135" height="929" alt="Screenshot 2025-11-12 at 09 25 57" src="https://github.com/user-attachments/assets/da900aed-f967-4dd6-bc5b-30af56468956" />


---

- Checkout page
<img width="1103" height="966" alt="Screenshot 2025-11-12 at 09 31 17" src="https://github.com/user-attachments/assets/5ba69987-61a7-400d-96c3-953ce9281d7d" />


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
