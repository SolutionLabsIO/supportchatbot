# Scholistico AI Chatbot

A SvelteKit application that integrates with Claude AI to respond to Meta (Facebook/Instagram) messages.

## Features

- Webhook endpoint for receiving messages from Meta platforms
- Integration with Claude AI to generate intelligent responses
- Built with SvelteKit and TypeScript

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file with the following variables:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
META_VERIFY_TOKEN=your_meta_verify_token
META_PAGE_TOKEN=your_meta_page_token
```

## Deployment on Vercel

This application is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the required environment variables in Vercel's dashboard
4. Deploy the application

Your webhook URL will be: `https://your-app-name.vercel.app/api/meta/webhook`

## Meta Webhook Setup

1. Go to the Meta Developer Portal
2. Navigate to your app settings
3. Go to "Webhooks" → "Add Webhook"
4. Enter your webhook URL
5. For the "Verify Token", use the value from your META_VERIFY_TOKEN
6. Select the events you want to subscribe to (usually "messages")
