# Push Notification Service

Minimal web-push server for sending notifications.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

3. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Add your VAPID keys to `.env`:

```
VAPID_PUBLIC_KEY=your_generated_public_key
VAPID_PRIVATE_KEY=your_generated_private_key
```

5. Run locally:

```bash
npm start
```

## Endpoints

- `POST /register` - Register a push subscription
- `POST /notify` - Send notification to all subscriptions
  - Body: `{ "title": "Your Title", "body": "Your message" }`
- `GET /health` - Check server status
