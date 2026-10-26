# SafeCommunity API integration contract

This document is the hand-off between the frontend and backend developer. The frontend is plain HTML/CSS/JavaScript and does not dictate a backend language or framework. Agree the exact paths, response shapes, authorization rules and error codes before implementation.

## Frontend integration point

`js/api-client.js` exposes `window.SafeCommunityAPI`. It centralizes `fetch`, JSON encoding, bearer-token attachment and API errors. Configure the backend URL before loading `js/api-client.js` by adding this script to the HTML pages (or setting it in a shared config file):

```html
<script>window.SC_API_CONFIG = { baseUrl: "http://localhost:3000/api/v1" };</script>
<script src="js/api-client.js"></script>
```

Then update the page-specific JavaScript to call `SafeCommunityAPI` instead of reading/writing account or shared application records in `localStorage`. The current local browser persistence is only for using the frontend before the server exists; it is not a production data layer. Do not silently mix local records with API records.

## Proposed endpoints

All JSON API endpoints use the `/api/v1` prefix. Use HTTPS in deployed environments.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create account; validate fields server-side |
| POST | `/auth/login` | Authenticate; return user and access token/session |
| POST | `/auth/logout` | Revoke session/token where supported |
| GET | `/auth/me` | Return authenticated user |
| POST | `/auth/forgot-password` | Start email recovery without disclosing whether an account exists |
| POST | `/auth/reset-password` | Change password using a server-issued single-use token |
| GET/PATCH | `/profile` | Read/update current user's profile |
| GET/POST | `/reports` | List/create incident reports; support `q`, `status`, `category`, `page`, `limit` query parameters |
| GET/PATCH | `/reports/:id` | Read/update a report, with role-based status updates |
| GET/POST | `/community/posts` | List/create moderated community posts |
| GET | `/alerts` | List published community safety alerts |
| GET | `/notifications` | List notifications for the authenticated user |
| PATCH | `/notifications/:id/read` | Mark one notification as read |
| PATCH | `/notifications/read-all` | Mark all notifications as read |
| GET | `/tracker/current` | Get current user's active journey |
| POST | `/tracker/start` | Start a journey with destination/trusted-contact details |
| POST | `/tracker/check-ins` | Record a check-in for an active journey |
| POST | `/tracker/stop` | Stop an active journey |
| POST | `/emergency/alerts` | Optional emergency workflow; only after the real response process is implemented and tested |

## Suggested request shapes

### Register
```json
{ "name": "Full Name", "phone": "+27...", "email": "person@example.com", "password": "user-supplied password" }
```

### Login
```json
{ "email": "person@example.com", "password": "user-supplied password" }
```

Suggested response: `{ "data": { "user": { "id": "...", "name": "...", "email": "..." }, "accessToken": "..." }`. Prefer secure, HttpOnly cookies when the deployment architecture supports them. Never return password hashes to the frontend.

### Create report
```json
{ "title": "Street lighting concern", "category": "Infrastructure", "location": "Area or address", "description": "Details", "anonymous": true }
```

The server assigns the report ID, timestamps, initial status and reporter identity. Users must not be able to set their own review/resolution status through the create form. Apply authorization and access controls to private or sensitive reports, especially GBV-related reports.

### Create community post
```json
{ "text": "A helpful community safety update", "anonymous": false }
```

The server should assign author, timestamps and moderation state; validate length and apply rate limiting/moderation rules.

### Start journey
```json
{ "destination": "Destination", "trustedContact": "Contact details", "shareLocation": false }
```

Explicit consent is required before collecting or sharing location. If a journey-sharing or escalation workflow is added, explain who receives data, how long it is retained, and what happens if check-ins are missed.

## Standard responses and errors

Suggested success envelope: `{ "data": ..., "message": "..." }`. Suggested validation error: HTTP 422 with `{ "message": "Please check the submitted fields.", "errors": { "fieldName": "Reason" } }`. Use 401 for unauthenticated, 403 for unauthorized, 404 for missing records, 409 for conflicts, and 429 for rate limits. The client displays a useful message and must not assume a request succeeded until the server confirms it.

## Security and safety requirements

- Enforce authentication, authorization, validation and rate limiting on the server; frontend checks are not security controls.
- Do not use browser storage as the production source of truth for accounts, incident reports, GBV records, trusted contacts or live locations.
- Do not include real personal/sensitive information in public community posts or logs.
- Store emergency workflow events in an auditable backend and define who receives them, service availability, escalation, abuse prevention and failure handling.
- The current SOS/emergency-guidance UI does **not** dispatch help. Do not connect it to an untested endpoint or present it as an emergency service until the operational workflow has been verified end-to-end.
- Password reset requires server-issued, expiring, single-use tokens and email delivery. The frontend reset page does not change a password by itself.
