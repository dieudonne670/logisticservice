<img width="1287" height="611" alt="image" src="https://github.com/user-attachments/assets/657810b2-05d9-4b55-aec7-72bdb350dc01" /># Logisticservice — Real-Time Freight Tracking Platform

A production-grade logistics platform that lets a freight company manage shipments and lets clients track their cargo live on an interactive map, with real-time chat between client and operations.

**🔗 Live Demo:** [https://getlogisticservice.com](https://getlogisticservice.com)
**👤 Admin Demo:** [https://getlogisticservice.com/login](https://getlogisticservice.com/login) — `admin` / `DemoPass2026!`


## 📌 Overview

Logisticservice is a freight-forwarding platform built for small-to-mid logistics operators. It handles three freight types — land, air, and sea — with a public tracking portal for clients and a separate authenticated admin console for operations staff.

The core engineering problem was **real-time visibility**: every shipment needs a live GPS-traced map, and every client needs to reach the operations team instantly. This repo is the full implementation, deployed and running.

### Who uses it

| Role | What they do | Auth |
|------|--------------|------|
| **Client (public)** | Enter a tracking number → see shipment summary + live map + chat with ops | None — tracking number is the credential |
| **Operations admin** | Create shipments, assign tracking numbers, update status, view all live maps, chat with clients | JWT |


---

## 🏗️ Architecture



┌────────────────────────┐
│ Browser (React SPA) │
└────────────┬───────────┘
│ HTTPS / WSS
▼
┌────────────────────────┐
│ Nginx (reverse proxy)│
└───┬─────────────────┬──┘
│ │
/api /admin │ │ /ws (WebSocket upgrade)
▼ ▼
┌──────────────────┐ ┌──────────────────┐
│ Gunicorn (WSGI) │ │ Daphne (ASGI) │
│ Django REST API │ │ Channels │
└────────┬─────────┘ └────────┬─────────┘
│ │
▼ ▼
┌──────────────┐ ┌──────────────┐
│ PostgreSQL │ │ Redis │
│ + PostGIS │ │ pub/sub │
└──────────────┘ └──────────────┘


### Why two application servers?

Gunicorn is battle-tested for synchronous HTTP, but it can't hold long-lived WebSocket connections. Daphne is an ASGI server that handles WebSockets natively. Both run as `systemd` services, both read from the same Django codebase, and Nginx routes to whichever one matches the incoming URL — `/api/` and `/admin/` go to Gunicorn, `/ws/` goes to Daphne.

---

## 🧰 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Language | Python 3.12 | Async support, mature ecosystem |
| Web framework | Django 6.1 + DRF | Batteries-included; DRF for clean API serialization |
| Auth | SimpleJWT | Stateless auth for the SPA; no session cookie needed |
| Real-time | Django Channels 4 | WebSocket consumers, native integration with Django ORM |
| Channel layer | Redis 7 + `channels_redis` (pub/sub backend) | Broadcast to all subscribers of a shipment group |
| Database | PostgreSQL 16 + PostGIS | Spatial columns (`GEOMETRY`) for storing GPS pings |
| Web server | Nginx 1.24 | Reverse proxy + static file server + TLS termination |
| App servers | Gunicorn (HTTP) + Daphne (ASGI) | Split responsibility — sync vs. async workloads |
| Process manager | `systemd` | Auto-start on boot, auto-restart on crash |
| TLS | Let's Encrypt + Certbot | Free, auto-renewing HTTPS |
| Frontend | React 18 + Vite + Leaflet | SPA with map integration |
| Server OS | Ubuntu 24.04 LTS (Hetzner-class VPS, 4 GB RAM, 3 vCPU) | |

---

## 🔍 Backend Deep Dive

### Django apps

| App | Responsibility |
|-----|----------------|
| `core` | Custom user model (`CustomUser`) with role field |
| `shipments` | `Shipment` model, DRF serializers, admin + public tracking endpoints |
| `locations` | `LocationPoint` model (PostGIS `PointField`), ingestion endpoint, latest-location query |
| `tracking` | `TrackingConsumer` (WebSocket broadcast of GPS updates), ASGI routing |
| `chat` | `Message` model, `ChatConsumer` (client↔admin), conversation list endpoint |

### Data model highlights

**`Shipment`** — holds tracking number (auto-generated: `CEL<11 hex>-CARGO`), origin, destination, dimensions, freight type, status, and full shipper/receiver details. Related to `LocationPoint` (many) and `Message` (many).

**`LocationPoint`** — a PostGIS `PointField` at SRID 4326 (WGS84). Every GPS ping from the driver's device is stored as a single row. Querying the latest position for a shipment is a single indexed query.

**`Message`** — flexible sender field: can be either a `CustomUser` (admin) or `NULL` with a `sender_label='Client'` for anonymous visitors. Enables chat with unauthenticated clients without polluting the user table.

### Real-time flow

1. Driver's device (or admin test tool) POSTs `{shipment_id, latitude, longitude}` to `/api/locations/`
2. Django saves the point to PostGIS
3. The view calls `channel_layer.group_send('shipment_<id>', {...})`
4. Redis pub/sub delivers the message to every WebSocket subscribed to that group
5. `TrackingConsumer` in each connected browser receives it and updates the Leaflet marker

### WebSocket authentication

Browsers can't send custom headers on WebSocket connections, so JWT is passed as a query parameter:



A custom `JWTAuthMiddleware` reads the token, decodes it via SimpleJWT, and sets `scope['user']`. Anonymous WebSocket 
connections are allowed for tracking (public) but rejected for chat unless a valid tracking number is supplied:


The `ChatConsumer` verifies the tracking number matches the shipment ID in the room name — the tracking number *is* the access credential for that shipment.

---

## 🚀 Deployment

The app runs in production on a budget NAT VPS. Full deployment chain:

- **VPS:** Ubuntu 24.04, 3 vCPU / 4 GB RAM / 60 GB NVMe
- **PostgreSQL 16 + PostGIS** — listens on localhost only
- **Redis 7** — channel layer for Channels
- **Gunicorn** — bound to a Unix socket at `/run/gunicorn/gunicorn.sock`, 3 workers
- **Daphne** — bound to `127.0.0.1:8002`
- **Nginx** — proxies `/api/` and `/admin/` to Gunicorn, upgrades `/ws/` to Daphne, serves React static bundle directly from `/var/www/logisticservice/frontend/dist/`
- **Certbot** — Let's Encrypt certificate, auto-renewed via systemd timer
- **`systemd` units** for both Gunicorn and Daphne — auto-start and auto-restart
- **Nightly database backups** — `pg_dump | gzip` on a cron schedule, rotated every 30 days

Secrets (DB password, Django `SECRET_KEY`, JWT signing key, Redis host) live in a `.env` file with `chmod 600`, never committed.

---

## 🧠 Engineering Challenges Solved

### 1. Async/sync boundary in Django Channels

Django's ORM is synchronous, but Channels consumers are async. Every ORM call inside a consumer needs `@database_sync_to_async`. Handling auth, saving messages, and fetching chat history all required careful wrapping to avoid blocking the event loop.

### 2. WebSocket auth without cookies

Standard Django auth relies on session cookies, which don't travel well over WebSocket handshakes from an SPA. The solution was a custom `JWTAuthMiddleware` that reads the token from the query string — plus a fallback for public tracking connections that don't carry a token at all.

### 3. Public vs. authenticated resource access

Clients don't have accounts — only tracking numbers. But the shipment detail API also needs to serve admin requests with JWT. Rather than write two endpoints with duplicated logic, the same view serves both and gates access via `permission_classes` and `get_queryset`.

### 4. NAT VPS + Let's Encrypt

The server sits behind a shared IPv4 gateway (NAT). Traditional Certbot HTTP-01 challenges failed with 503 errors because the host couldn't route traffic to port 80 on the VPS. The fix: register the domain in the host's control panel so it forwards ports 80/443, then run Certbot — which then succeeds and auto-configures Nginx.

### 5. Real-time map at low bandwidth

Naive implementations send a WebSocket message on every GPS ping, which saturates mobile data. This project decouples REST ingestion (device → server) from WebSocket broadcast (server → browsers): the driver's phone POSTs over HTTP on a slow interval, and only browsers subscribed to that shipment receive the broadcast. That's a one-to-many fanout rather than the phone holding dozens of WebSocket connections.

---



### Public tracking page
<img width="1287" height="611" alt="Screenshot from 2026-09-24 15-26-05" src="https://github.com/user-attachments/assets/0b526802-ed6d-4b66-925c-76ff68d419b7" />

<img width="1287" height="611" alt="Screenshot from 2026-09-24 15-25-47" src="https://github.com/user-attachments/assets/9cb2d679-0063-4b15-a05b-3bc0b47f08d8" />

*Client enters a tracking number → gets shipment summary + live map + chat.*

### Admin console
<img width="1287" height="611" alt="Screenshot from 2026-09-24 15-32-30" src="https://github.com/user-attachments/assets/e1537cc0-9c6c-40df-8c08-fdbd6e2a2299" />
<img width="1287" height="611" alt="Screenshot from 2026-09-24 15-30-23" src="https://github.com/user-attachments/assets/050a2e64-5541-4b21-b29f-852e0089de3c" />

*Authenticated operations view with all shipments, filters, and status controls.*

### Live map with admin pause/resume
<img width="1287" height="611" alt="Screenshot from 2026-09-24 15-31-08" src="https://github.com/user-attachments/assets/f5d38189-b21d-4620-9501-a394d4b85d1a" />

*Real-time marker with pause/continue for the admin — the client version is read-only.*

### Client ↔ admin chat
<img width="1287" height="611" alt="Screenshot from 2026-09-24 15-36-45" src="https://github.com/user-attachments/assets/55c38d03-844f-4363-9d9d-685d002fdb3b" />
<img width="1287" height="611" alt="Screenshot from 2026-09-24 15-32-30" src="https://github.com/user-attachments/assets/46d8be2e-d2bb-4b9c-b519-734c25910ef4" />

*WebSocket chat with persisted history, delivered in real time.*

*(Add these screenshots to a `docs/screenshots/` folder in the repo.)*

---

## 🖥️ Running Locally

### Prerequisites
- Python 3.12
- PostgreSQL 16 with PostGIS
- Redis 7
- Node.js 20

### Backend

```bash
git clone https://github.com/dieudonne670/logisticservice.git
cd logisticservice

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env with your local Postgres and Redis credentials

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


The API is now at http://127.0.0.1:8000.

Frontend
bash
cd frontend
npm install
npm run dev
Visit http://localhost:5173.

Running the WebSocket server locally
runserver (via Daphne) already serves WebSockets in development if daphne is first in INSTALLED_APPS. For closer-to-production testing:

bash
daphne -b 0.0.0.0 -p 8001 config.asgi:application


📁 Repository Structure

logisticservice/
├── config/                 # Django project settings, ASGI, URLs
│   ├── asgi.py             # ProtocolTypeRouter (HTTP + WebSocket)
│   ├── settings.py         # Env-driven config
│   ├── urls.py
│   └── ws_auth.py          # JWT middleware for WebSockets
├── core/                   # CustomUser model
├── shipments/              # Shipment model, DRF views, serializers
├── locations/              # LocationPoint model (PostGIS), ingestion
├── tracking/               # Channels consumers, routing
│   ├── consumers.py        # TrackingConsumer, ChatConsumer
│   └── routing.py
├── chat/                   # Message model, conversation list view
├── frontend/               # React SPA (Vite)
│   ├── src/
│   │   ├── admin/          # Admin console components
│   │   ├── auth/           # Login + JWT context
│   │   ├── chat/           # Chat panel + floating widget
│   │   ├── map/            # Leaflet components
│   │   ├── shipments/      # Track + receipt pages
│   │   └── pages/          # Public marketing pages
│   └── public/
├── requirements.txt
├── .env.example
└── README.md


🛣️ Roadmap
□ Shipment document uploads (BOL, customs paperwork)
□ Multi-tenant support (multiple logistics companies on one instance)
□ Driver mobile app (React Native) with native GPS background tracking
□ Webhook notifications for shipment milestones
□ Route optimization using OSRM + VROOM
□ Docker + docker-compose for one-command local setup
□ CI/CD via GitHub Actions

👤 About Me
I'm a backend engineer specializing in Python, Django, and FastAPI with a strong DevOps bent. I like problems that force me to own the full stack — from the database query to the Nginx rule to the systemd service that keeps it running at 3 AM.

🐙 GitHub: @dieudonne670

💼 Open to: backend roles (Django / FastAPI / Python), platform engineering


