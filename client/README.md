# User Manager – GraphQL CRUD Application

A simple **full-stack CRUD application** built using **React, GraphQL, and Apollo**.
The application allows users to **create, read, update, and delete users** with basic details like name, age, and marital status.

It demonstrates how **React interacts with a GraphQL API** using **Apollo Client**.

---

## 🚀 Features

* ➕ Create a new user
* 📋 View all users
* 🔍 Search users by name
* 🆔 Fetch a user by ID
* ✏️ Update user marital status
* ❌ Delete users
* 🎨 Clean card-based UI

---

## 🛠 Tech Stack

### Frontend

* React
* Apollo Client
* JavaScript
* CSS

### Backend

* Node.js
* Apollo Server
* GraphQL

---

## 📂 Project Structure

```
project-root
│
├── server.js          # GraphQL server
├── src
│   ├── App.jsx        # Main React component
│   ├── App.css
│   └── main.jsx
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone <your-repo-link>
cd project-folder
```

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Start GraphQL Server

```bash
node server.js
```

Server runs at:

```
http://localhost:4000
```

---

### 4️⃣ Start React Frontend

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔗 GraphQL Operations

### Queries

```
getUsers
getUserById(id)
```

### Mutations

```
createUser(name, age, isMarried)
updateUser(id, isMarried)
deleteUser(id)
```

---

## 🧠 How It Works

1. React frontend sends **GraphQL queries and mutations** using **Apollo Client**.
2. Apollo Server processes the request.
3. Resolver functions modify or fetch user data.
4. Updated data is returned and displayed instantly in the UI.

---

## 📌 Example User Object

```
{
  id: "1",
  name: "John Doe",
  age: 30,
  isMarried: true
}
```

---

## 🎯 Learning Objectives

This project demonstrates:

* GraphQL schema and resolvers
* Apollo Client integration
* Full-stack React + GraphQL workflow
* CRUD operations using GraphQL

---

## 🔮 Future Improvements

* Add database (MongoDB / PostgreSQL)
* User authentication
* Better UI components
* Edit user form
* Pagination and filtering

---
<img width="1012" height="874" alt="{BA8014FB-2F6F-4D15-8DAC-502A7E5C301F}" src="https://github.com/user-attachments/assets/d9197c28-6556-44d4-8f41-772268ee63af" />



