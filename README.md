# AI Logistics Route Optimizer

A complete, production-ready full-stack AI Logistics Route Optimizer web application built from scratch using **Java 21**, **Spring Boot 3**, **MySQL**, **React (Vite)**, **JWT Authentication**, and **Docker**. The application utilizes the **Google Gemini API** (with a parameter-driven Mock AI fallback) to dynamically analyze and optimize logistics routes, calculate costs, estimate travel time, fuel consumption, carbon emissions, and evaluate delay risks/weather impacts.

---

## 🚀 Features

- **JWT Authentication & Role-Based Access Control**: Secure login/registration with separate views and permissions for **Admin** and **User** roles.
- **AI-Powered Route Optimization**: Analyzes shipments (weight, vehicle type, cargo classification, priority, and deadlines) using Gemini AI to recommend optimal paths, alternative routes, fuel consumption, carbon footprint, and suggestions.
- **Interactive Analytics Dashboard**: Polished dashboard visualizing operation metrics (total shipments, average score, total distances, costs, emissions) using **Chart.js** (Doughnut & Bar charts).
- **Shipment Management**: Complete CRUD operations, tracking number generation, status lifecycle transitions, and live search/filtering.
- **Reporting & Data Export**: Generate and download on-demand reports in **PDF**, **Excel (XLSX)**, **CSV**, and **JSON** formats.
- **Real-time Notifications**: Alert system informing users about route optimizations, status updates, or system events.
- **Dark/Light Theme**: Sleek, modern interface using **Material UI (MUI)**.
- **Dockerized Architecture**: Containers for MySQL, Spring Boot, and Nginx (React) preconfigured for instant deployment.

---

## 🛠️ Tech Stack

- **Backend**: Java 21, Spring Boot 3.3.0, Spring Security, Spring Data JPA, WebFlux, openpdf (PDF), Apache POI (Excel), Swagger/OpenAPI.
- **Frontend**: React 18, Vite, Axios, React Router v6, Material UI (MUI v5), Chart.js.
- **Database**: MySQL 8 (H2 in-memory configured for local dev).
- **AI Engine**: Google Gemini API.

---

## 📦 Project Structure

```
AI Logistics Route Optimizer/
├── backend/
│   ├── src/main/java/com/logistics/optimizer/      # Java Source Code
│   ├── src/main/resources/                         # application.yml Configuration
│   ├── pom.xml                                     # Maven Dependencies
│   └── Dockerfile                                  # Backend Multi-Stage Container Setup
├── frontend/
│   ├── src/                                        # React Components & Pages
│   ├── package.json                                # Node Dependencies
│   ├── vite.config.js                              # Dev Proxy Configurations
│   ├── nginx.conf                                  # SPA Routing & Proxy Configurations
│   └── Dockerfile                                  # Nginx Container Setup
├── docker-compose.yml                              # Services Orchestration
└── README.md                                       # Documentation (This file)
```

---

## 🚦 Getting Started

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/)

---

### Run with Docker Compose (Recommended)

1. Clone or navigate to the workspace directory.
2. Setup your Gemini API Key in your shell (optional; if not set, the app runs in realistic Mock AI fallback mode):
   - **Windows PowerShell**: `$env:GEMINI_API_KEY="your_api_key_here"`
   - **Linux/macOS**: `export GEMINI_API_KEY="your_api_key_here"`
3. Start all services:
   ```bash
   docker-compose up --build
   ```
4. Access the applications:
   - **Frontend UI**: [http://localhost](http://localhost)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)
   - **Swagger documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### Run Locally (Without Docker)

#### 1. Backend
- Change directory to backend:
  ```bash
  cd backend
  ```
- Run the application using the Maven wrapper (uses in-memory H2 database by default):
  ```bash
  ./mvnw spring-boot:run
  ```
- The backend will start on port `8080`.

#### 2. Frontend
- Change directory to frontend:
  ```bash
  cd ../frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Run the Vite development server:
  ```bash
  npm run dev
  ```
- The frontend will start on [http://localhost:5173](http://localhost:5173) and proxy all `/api/*` calls to the local Spring Boot backend.

---

## 🔑 Demo Credentials

On startup, the database is seeded automatically with the following accounts:
- **Administrator**:
  - Email: `admin@logistics.com`
  - Password: `admin123`
- **Standard User**:
  - Email: `user@logistics.com`
  - Password: `user123`
