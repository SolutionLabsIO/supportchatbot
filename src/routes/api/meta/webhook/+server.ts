import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getGPTReply } from '$lib/ai/respond';
import { sendMessage } from '../sendMessage';
import { addMessage } from '$lib/store/conversations';
import { log } from '$lib/utils/logger';

// Use environment variable or provide a placeholder during build
const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'placeholder-verify-token';

// Helper function to log to server
async function logToServer(data: any) {
	try {
		const response = await fetch('/api/logs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error('Error logging to server:', error);
		return { success: false };
	}
}

export async function GET({ url }: RequestEvent) {
	const mode = url.searchParams.get('hub.mode');
	const token = url.searchParams.get('hub.verify_token');
	const challenge = url.searchParams.get('hub.challenge');

	if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
		console.log('Webhook verified successfully');
		return new Response(challenge);
	}

	console.log('Webhook verification failed');
	return new Response('Forbidden', { status: 403 });
}

export async function POST({ request }: RequestEvent) {
	try {
		const body = await request.json();
		const messaging = body.entry?.[0]?.messaging?.[0];

		if (messaging?.sender?.id && messaging?.message?.text) {
			const senderId = messaging.sender.id;
			const userMessage = messaging.message.text;
			console.log(`Received message from ${senderId}: ${userMessage}`);
			
			// Log incoming message to browser store
			if (typeof addMessage === 'function') {
				addMessage(senderId, userMessage, true);
			}
			
			// Log incoming message to server-side logs
			await log({
				type: 'incoming',
				senderId,
				message: userMessage,
				platform: 'facebook',
				rawEvent: messaging
			});
			
			// Generate AI response
			const reply = await getGPTReply(userMessage);
			console.log(`Generated reply: ${reply}`);
			
			// Log outgoing message to browser store
			if (typeof addMessage === 'function') {
				addMessage(senderId, reply, false);
			}
			
			// Log outgoing message to server-side logs
			await log({
				type: 'outgoing',
				senderId,
				message: reply,
				platform: 'facebook',
				aiResponse: true
			});
			
			// Send message back to user
			await sendMessage(senderId, reply);
			console.log('Reply sent successfully');
		}

		return json({ status: 'ok' });
	} catch (error: any) {
		console.error('Error processing webhook:', error);
		
		// Log error to server-side logs
		try {
			await log({
				type: 'error',
				error: String(error),
				stack: error.stack || 'No stack trace available',
				timestamp: new Date().toISOString()
			});
		} catch (logError) {
			console.error('Error writing error to log:', logError);
		}
		
		return json({ status: 'error', message: 'Internal server error' }, { status: 500 });
	}
}
