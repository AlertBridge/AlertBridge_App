# SafeCommunity — Frontend Source

Responsive, multi-page SafeCommunity frontend built with plain HTML, CSS and JavaScript. Each page has separate HTML and CSS files, with page-specific JavaScript modules and shared helpers. No backend is included.

## Run locally
1. Extract the project folder.
2. Open `SafeCommunity` in VS Code.
3. Start `index.html` with the Live Server extension.
4. Create a local account to access protected pages.

Use localhost/HTTPS rather than opening files directly because browser geolocation and Web Crypto require a secure context in modern browsers.

## Included frontend screens
- Landing page and responsive navigation
- Registration and login UI with local browser account handling
- Dashboard, profile and settings
- Incident submission, report list, search and status filtering
- Community posts, alerts and notifications
- Browser geolocation and copyable location text
- Journey tracker and check-ins
- Emergency guidance interface
- Forgot/reset password screens prepared for backend integration

## Data and security boundaries
The frontend can store account and feature data in the current browser while backend development is pending. No example reports, alerts or community posts are preloaded. Browser storage is not a production authentication or sensitive-data store. Local passwords are hashed for this browser-only workflow, but that does not make browser authentication secure. Replace local account handling and sensitive persistence with server-side authentication, authorization, validation and database storage when the backend is ready.

The emergency guidance button does not dispatch an SOS, send location to trusted contacts or contact emergency services. Password recovery screens do not send email or change passwords until a backend reset-token service is connected. These are explicit integration boundaries, not completed external services.

## Backend integration
See `API-INTEGRATION.md` and `js/api-client.js` for the suggested API boundary, request patterns and endpoint contract. Agree the final endpoint names and payloads with the backend developer before integration.
