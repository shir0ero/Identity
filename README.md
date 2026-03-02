# Identity Reconciliation Service

### Bitespeed Backend Task Submission

---

## 🔍 Overview

This project implements an **Identity Reconciliation Service** that links customer contact details across multiple purchases.

Customers may place orders using different emails or phone numbers. This service identifies related contacts and consolidates them into a unified customer identity using a primary–secondary relationship model.

The system exposes a REST API endpoint that:

* Detects existing contacts using email or phone number
* Links related contacts
* Maintains the oldest contact as primary
* Converts newer linked contacts to secondary
* Returns a consolidated identity response

---

## 🌐 Hosted API

**Production Endpoint:**

```
POST https://identity-service-yymq.onrender.com/identify
```

---

## 📌 API Specification

### Endpoint

```
POST /identify
```

### Request Body (JSON)

At least one of `email` or `phoneNumber` must be provided.

```json
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}
```

---

### Successful Response (200 OK)

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["test@gmail.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}
```

---

## 🧠 How It Works

1. The service receives contact details.
2. It searches for existing records with matching email or phone number.
3. If no match is found:

   * A new primary contact is created.
4. If matches are found:

   * All related contacts are grouped.
   * The oldest contact remains primary.
   * Other contacts are marked as secondary.
   * New information is stored as a secondary contact if needed.
5. A consolidated identity response is returned.

---

## 🧪 Example Test Cases

### Case 1: New Contact

**Request**

```json
{
  "email": "test@gmail.com",
  "phoneNumber": "123456"
}
```

**Response**

```json
{
  "contact": {
    "primaryContactId": 2,
    "emails": ["test@gmail.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

---

### Case 2: Same Phone, Different Email

**Request**

```json
{
  "email": "second@gmail.com",
  "phoneNumber": "123456"
}
```

**Response**

```json
{
  "contact": {
    "primaryContactId": 2,
    "emails": ["test@gmail.com", "second@gmail.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [3]
  }
}
```

---

### Case 3: Linking Two Primary Contacts

If two previously separate identities become linked via shared email/phone:

* The oldest remains primary
* The newer becomes secondary
* All emails and phone numbers are merged

---

## 🏗 Architecture

```
Client Request
      ↓
Express API (/identify)
      ↓
Identity Reconciliation Logic
      ↓
PostgreSQL Database (Render)
```

---

## 🛠 Tech Stack

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL (Render)
* Render (Cloud Deployment)

---

## 🚀 Deployment Details

* Backend hosted on Render
* PostgreSQL database hosted on Render
* Internal database networking used for production
* Prisma ORM for schema management and queries

---

## 👨‍💻 Author

Ayush Raj
GitHub: https://github.com/shir0ero/Identity
