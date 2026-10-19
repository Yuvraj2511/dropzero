# DropZero — Temporary File Sharing

**Share files. Leave no trace.**

DropZero is a cloud-based temporary file-sharing application that lets users upload files and share them through unique links. It uses a React frontend, a serverless backend, cloud object storage, and a managed SQL database to handle file transfers and their metadata.

**Live Demo:** [DropZero](https://dropzero-amber.vercel.app/)  
**GitHub Repository:** [Yuvraj2511/dropzero](https://github.com/Yuvraj2511/dropzero)

---

## Overview

Traditional file-sharing solutions can involve unnecessary accounts, persistent storage, or complicated sharing workflows. DropZero aims to make sharing files simple by providing a lightweight web application with configurable expiry and download limits.

Users can upload a file, generate a shareable link, and allow recipients to download the file while the transfer remains valid.

## Features

- **Temporary File Sharing:** Upload files and generate unique share links.
- **Cloud File Storage:** Store uploaded files using Cloudflare R2.
- **Download Limits:** Configure the maximum number of downloads for a transfer.
- **Expiry Configuration:** Set an expiry duration for shared transfers.
- **Unique Share Links:** Give each transfer its own identifier.
- **Cloud-Based Backend:** Process uploads and downloads using Cloudflare Workers.
- **Transfer Metadata:** Store file information, timestamps, expiry, and download counts in Cloudflare D1.
- **Responsive Web Interface:** Access the application through a browser on desktop or mobile.
- **Public Deployment:** Host the frontend on Vercel and expose backend APIs through Cloudflare Workers.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, JavaScript, CSS |
| Frontend Hosting | Vercel |
| Backend | Cloudflare Workers |
| Object Storage | Cloudflare R2 |
| Database | Cloudflare D1, SQL |
| API Communication | HTTP and REST-style endpoints |
| Version Control | Git and GitHub |

## Architecture

```text
                  User / Browser
                        |
                        v
                React + Vite App
                   (Vercel)
                        |
                        v
              Cloudflare Workers
                  Backend API
                   /        \
                  v          v
          Cloudflare R2   Cloudflare D1
          Actual Files    Transfer Metadata
```

### How It Works

1. **Upload:** The user selects a file and configures its download limit and expiry.
2. **API Request:** The React frontend sends the file to the Cloudflare Workers backend.
3. **File Storage:** The backend stores the file in Cloudflare R2.
4. **Metadata Storage:** Transfer details are recorded in Cloudflare D1.
5. **Link Generation:** The application creates a unique share link.
6. **File Access:** A recipient opens the link and requests the file through the backend.
7. **Download Tracking:** The backend tracks downloads and applies the configured transfer rules.

## Cloud Services Used

### Vercel
Hosts the React frontend and provides a public URL for accessing the application.

### Cloudflare Workers
Runs the backend API without requiring the developer to manage a traditional application server.

### Cloudflare R2
Stores uploaded file contents as objects, separate from the application and database.

### Cloudflare D1
Provides SQL-based storage for transfer metadata, including file names, sizes, object keys, download limits, download counts, and timestamps.

## API Endpoints

The backend exposes the following endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend availability |
| POST | `/api/transfers/upload` | Upload a file and create a transfer |
| GET | `/api/transfers/:id` | Retrieve transfer metadata |
| GET | `/api/transfers/:id?download=1` | Download a shared file |
| DELETE | `/api/transfers/:id` | Delete a transfer |

## Getting Started

### Prerequisites

- Node.js and npm
- Git
- A Cloudflare account for backend development
- Wrangler CLI for working with Cloudflare Workers

### 1. Clone the Repository

```bash
git clone https://github.com/Yuvraj2511/dropzero.git
cd dropzero
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

### 4. Run the Backend Locally

The backend is configured separately from the frontend. From your backend project directory, install its dependencies and start the local Worker:

```bash
npm install
npx wrangler dev --local
```

Apply the database schema to the local D1 database if it has not already been initialized:

```bash
npx wrangler d1 execute dropzero-db --local --file=./schema.sql
```

Ensure the backend has the required R2 and D1 bindings configured in `wrangler.jsonc`, and configure the frontend API URL to point to the local Worker during local development.

> The frontend and backend must both be running for the complete local file-sharing flow to work.

## Deployment

- **Frontend:** Deployed on Vercel.
- **Backend:** Deployed on Cloudflare Workers.
- **File Storage:** Cloudflare R2.
- **Database:** Cloudflare D1.

The production frontend communicates with the deployed Worker API. The share links use the frontend's current origin so that recipients access the application through its public domain.

## Engineering Highlights

This project demonstrates practical experience with:

- Full-stack web application development.
- Serverless backend architecture.
- Cloud object storage and managed SQL databases.
- API design and HTTP request handling.
- File upload and download workflows.
- Metadata management and transfer tracking.
- Production deployment and version control.

## Future Improvements

- Automated cleanup of expired files and their stored objects.
- Stronger validation and abuse prevention.
- Improved handling of large and resumable uploads.
- More comprehensive automated testing.
- Enhanced observability and error reporting.

## Author

**Yuvraj Singh**

- GitHub: [@Yuvraj2511](https://github.com/Yuvraj2511)
- Project: [DropZero Live Demo](https://dropzero-amber.vercel.app/)

---

*Built with React, Vite, Cloudflare Workers, R2, D1, and Vercel.*
