import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getGPTReply } from '$lib/ai/respond';
import { sendMessage } from '../sendMessage';

// Use environment variable or provide a placeholder during build
const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'placeholder-verify-token';

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
			const userMessage = messaging.message.text;
			console.log(`Received message: ${userMessage}`);
			
			const reply = await getGPTReply(userMessage);
			console.log(`Generated reply: ${reply}`);
			
			await sendMessage(messaging.sender.id, reply);
			console.log('Reply sent successfully');
		}

		return json({ status: 'ok' });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return json({ status: 'error', message: 'Internal server error' }, { status: 500 });
	}
}
