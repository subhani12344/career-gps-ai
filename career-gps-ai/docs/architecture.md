# Career GPS AI — Architecture Document

This document describes the design principles, directory structures, and dual-mode database failover systems.

## System Topology

```mermaid
graph TD
    User([Browser Client]) -->|Port 3000| Frontend[Vite + React SPA]
    
    subgraph API Gateway Proxy
        Frontend -->|/api| ExpressBackend[Express.js Server]
        Frontend -->|/api/py| FastApiBackend[FastAPI Microservice]
    end
    
    subgraph Express Services
        ExpressBackend -->|Port 5000| ExpressAPI[API Router]
        ExpressAPI --> Auth[JWT & Auth Middleware]
        ExpressAPI --> AIService[AI Adaptive Service]
        ExpressAPI --> DBConn[Database Adapter]
    end

    subgraph FastAPI Services
        FastApiBackend -->|Port 8000| FastApiAPI[API Router]
        FastApiAPI --> Slowapi[Slowapi Rate Limiter]
        FastApiAPI --> SQLAlchemy[SQLAlchemy Connector]
    end

    subgraph Data Layer
        DBConn -->|Attempts| MongoDB[(MongoDB Server)]
        DBConn -->|Fallback if offline| JSONDB[(Local JSON file DB)]
        SQLAlchemy --> PostgreSQL[(PostgreSQL Database)]
    end

    subgraph LLM Providers
        AIService -->|If GEMINI_API_KEY present| Gemini[Gemini API]
        AIService -->|If blank| AI_Sim[Rule-based AI Simulator]
    end
```

## Relational Database (PostgreSQL) Entity Relationships

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password
        string role
        datetime created_at
    }
    PROFILES {
        int id PK
        int user_id FK
        string goal
        json skills
        string location
        int xp
        int level
    }
    APPLICATIONS {
        int id PK
        int user_id FK
        string title
        string company
        string status
        string notes
        datetime applied_date
    }
    USERS ||--|| PROFILES : has
    USERS ||--o{ APPLICATIONS : tracks
```

## Directory Structure

- `client/`: React client using Tailwind CSS. Consumes backend endpoints. If backend is offline, runs in a client-side sandbox storing state in `localStorage`.
- `server/`: Express API server providing registration, career profile stores, interview coach grading, resume parses, and CRM application lists.
- `fastapi-server/`: Python microservice using SQLAlchemy connection pooling to store auth states in PostgreSQL.
- `database/`: Contains default seeding data and the local file-based database fallback `local_db.json`.
- `docs/`: Technical manuals, Postman collections, and architecture assets.
- `mobile/`: Future Native app wrappers.
- `deployment/`: Production deployments and docker environment scripts.

## Database Fallback Implementation (Express)

To ease development onboarding, `server/config/db.js` wraps database operations.
1. When starting, the server attempts to connect to MongoDB.
2. If connection times out or fails (2000ms), it activates **JSON Database Mode**.
3. In JSON mode, files are parsed and saved to `database/local_db.json`. It supports basic operations: `.find()`, `.findOne()`, `.create()`, `.findByIdAndUpdate()`, and `.deleteOne()`, mirroring Mongoose.
