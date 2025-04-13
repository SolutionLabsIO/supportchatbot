# Scholistico AI Chatbot

A SvelteKit application that integrates with Claude AI to respond to Meta (Facebook/Instagram) messages.

## Features

- Webhook endpoint for receiving messages from Meta platforms
- Integration with Claude AI to generate intelligent responses
- Authentication system to protect admin pages
- Conversation logging and monitoring
- Privacy policy and data deletion mechanisms for Facebook compliance
- Built with SvelteKit and TypeScript

## Environment Variables

Create a `.env` file with the following variables:

```
# Anthropic API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Meta Webhook Configuration
META_VERIFY_TOKEN=your_meta_verify_token_here
META_PAGE_TOKEN=your_meta_page_token_here

# Authentication credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
SESSION_SECRET=your_long_random_string_here
```

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

## Authentication System

The application includes a simple authentication system to protect the admin dashboard and conversation logs:

1. Protected routes: `/conversations` and `/logs` require authentication
2. Login page: `/login` for admin access
3. Logout: `/logout` to end your session

Default credentials (change in `.env`):
- Username: `admin`
- Password: `your_secure_password_here`

## Facebook App Approval

To get your app approved by Facebook:

1. **Privacy Policy**:
   - The application includes a privacy policy at `/privacy`
   - Make sure this URL is publicly accessible
   - Update the contact email in `src/routes/privacy/+page.svelte`

2. **Data Deletion Callback**:
   - The application includes a data deletion API at `/api/meta/data-deletion`
   - Configure this URL in your Facebook App Dashboard under "Advanced > Data Deletion Callback URL"
   - This allows users to request deletion of their data

3. **Permissions**:
   - Request only the minimum necessary permissions for your app
   - For a basic chatbot, you need `pages_messaging`

4. **App Review Submission**:
   - Provide clear instructions for the reviewer
   - Include test user credentials
   - Record a screencast showing your app's functionality
   - Explain how you handle user data

5. **Webhook Configuration**:
   - Verify Token: Use the value from your META_VERIFY_TOKEN
   - Callback URL: Your deployed URL + `/api/meta/webhook`
   - Subscribe to messaging events (`messages`, `messaging_postbacks`)

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
