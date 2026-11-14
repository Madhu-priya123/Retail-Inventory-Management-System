# 🧾 Retail Billing & Management System

A **modern, full-stack retail management solution** designed to streamline billing, inventory tracking, and customer management for small to medium businesses.

Built using **Spring Boot + React.js**, this system delivers a fast, secure, and scalable experience with a clean and responsive UI.

---

## 📸 Application Preview

### 📊 Dashboard Overview

* Business insights with revenue tracking
* Sales trend visualization
* Real-time analytics

### 📦 Inventory Management

* Product tracking with stock & GST
* Barcode integration
* Image-based product display

### 👥 Customer Management

* Customer directory with profile images
* Quick add/edit functionality

### 🧾 Billing System

* POS-style billing interface
* Auto GST calculation
* Multi-payment support (Cash / Card / UPI)

### 📄 Invoice & Reports

* Downloadable PDF invoices
* Invoice history tracking
* Search & filter invoices

---

## 🚀 Key Features

### 🔐 Authentication & Security

* JWT-based authentication
* Role-based access control (Admin / Staff)
* Secure REST APIs with Spring Security

### 📦 Inventory Module

* Add / Update / Delete products
* Barcode support for fast billing
* Low stock alerts

### 👥 Customer Module

* Manage customer details
* Profile image upload support

### 💳 Billing & Invoice

* Dynamic cart system
* Auto GST calculation (CGST + SGST)
* Invoice generation with a unique ID
* PDF download & print support

### 📊 Dashboard & Reports

* Total revenue tracking
* Sales analytics chart
* Recent transactions overview

### ⚙️ User Management

* Admin & staff roles
* Permission-based access control

### 🎨 UI/UX Features

* Modern responsive UI
* Dark mode & theme customization
* Clean sidebar navigation

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React.js (Vite)
* Bootstrap 5
* Axios
* React Router

### 🔹 Backend

* Java 17
* Spring Boot 3
* Spring Security + JWT
* Spring Data JPA (Hibernate)
* iText (PDF Generation)

### 🔹 Database

* MySQL

---

## 🏗️ System Architecture

Frontend (React) → REST API (Spring Boot) → MySQL Database

* MVC + Layered Architecture
* RESTful APIs
* DTO-based communication

---

## 📁 Project Structure

```
retail-billing-system/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── security/
│   └── config/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 1. Database Setup

```sql
CREATE DATABASE retail_billing_db;
```

---

### 🔹 2. Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

---

### 🔹 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Default Login

```
Username: admin
Password: admin123
```

---

## 📌 Advanced Features Implemented

* ✅ JWT Authentication
* ✅ Role-Based Authorization
* ✅ PDF Invoice Generation
* ✅ Barcode Scanning Integration
* ✅ Real-time Billing Calculation
* ✅ Theme Customization (Light/Dark)

---

## 🎯 Use Cases

* Retail Shops 🛒
* Supermarkets 🏬
* Small Businesses 📊
* POS Systems 💳

---

## 📈 Future Enhancements

* 📧 Email Invoice Automation
* 📱 Mobile App (Flutter)
* ☁️ Cloud Deployment (AWS / Docker)
* 📊 Advanced Analytics Dashboard

---

## 👨‍💻 Author

**Divyanshu Kumar**
💼 Full Stack Developer | Java + Spring Boot | React.js

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and support the work!
