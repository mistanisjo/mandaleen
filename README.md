# OrangeChat - ChatGPT-style App with Webhook Integration

A modern chat application built with React, TypeScript, and Supabase that communicates with a custom N8N webhook.

## Features

- Chat interface similar to ChatGPT with user and AI messages
- Integration with a custom N8N webhook endpoint
- Authentication and data storage with Supabase
- Conversation history with the ability to create new conversations
- Error handling and retry logic for webhook communication
- Clean, minimal interface with modern orange gradient brand colors
- Responsive design that works on all devices

## Technical Stack

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Supabase for authentication and database
- React Router for navigation
- React Markdown for rendering markdown in chat messages

## Project Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file with your Supabase project credentials

4. Create the required tables in your Supabase project using the SQL migrations

5. Start the development server:
   ```bash
   npm run dev
   ```

## Webhook Integration

The application communicates with an N8N webhook endpoint:
```
https://ribtrnwb.rpcld.net/webhook-test/markless
```

The webhook expects a POST request with the following JSON payload:
```json
{
  "message": "User input goes here",
  "sessionId": "unique-session-id"
}
```

## Database Schema

The application uses two main tables:

1. `conversations` - Stores conversation metadata
2. `messages` - Stores all messages in conversations

Row-level security policies ensure users can only access their own data.

## Deployment

Build the production-ready application:
```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.# mandaleen
