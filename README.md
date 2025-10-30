# 📚 Library Management System

A **full-stack Library Management System** built using **Node.js, Express, EJS, and MongoDB**, designed for the **library clerk** to manage books, members, issue/return operations, and fines.  
This project showcases **DBMS principles**, **data modeling**, and **backend integration** through a professional, dashboard-style interface.

---

## 🚀 Features

### 🧩 Core Functionalities

- **Book Management**
  - Add, update, and delete books.
  - Track total and available copies.
  - Search and filter by title, author, or category.

- **Member Management**
  - Register and manage library members.
  - Track borrowed books and outstanding fines.

- **Issue & Return System**
  - Issue books to members with automatic due-date calculation.
  - Return books and auto-calculate fines for overdue returns.

- **Fine Management**
  - Automatically compute fines based on overdue days.
  - Record fine payments and update balances.
  - View total fines collected.

- **Transaction History**
  - Complete record of all issue/return transactions.
  - Filter by member, book, or date.

---

## 🧠 DBMS Concepts Demonstrated

| **Concept** | **Implementation Example** |
|--------------|-----------------------------|
| **Data Modeling & Relationships** | `books`, `members`, and `transactions` collections with `ObjectId` references |
| **Normalization** | Separate collections for logical entities |
| **Aggregation Pipelines** | Used for dashboard stats, fine reports, and top borrowers |
| **Atomic Updates / Transactions** | Book issue-return and fine updates performed atomically |
| **Indexing & Query Optimization** | Indexes on book titles and member IDs for faster lookups |
| **Data Validation** | Mongoose schema validation and backend constraints |
| **Triggers-like Logic** | Middleware to auto-update book availability or member fines |

---

## 🧱 Tech Stack

**Frontend**
- EJS (Embedded JavaScript Templates)
- Bootstrap 5 (Responsive UI)
- Chart.js (Dashboard visualizations)
- AJAX for live search and updates

**Backend**
- Node.js
- Express.js
- Mongoose (ODM for MongoDB)

**Database**
- MongoDB (NoSQL database)
- MongoDB Aggregation Framework


## 📊 Dashboard Features

**Aggregated MongoDB queries to display:**

- Total books
- Total Available
- Members
- Overdue

**Charts and Tables for:**

- Recent Transactions
- Borrowing Trends
- Genre Distribution
- Recent Fines
- Top borrowed books
- Recent Memeber Activity

---
