import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getGPTReply } from '$lib/ai/respond';
import { sendMessage } from '../sendMessage';

export async function GET({ url }: RequestEvent) {
	const mode = url.searchParams.get('hub.mode');
	const token = url.searchParams.get('hub.verify_token');
	const challenge = url.searchParams.get('hub.challenge');

	if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
		return new Response(challenge);
	}

	return new Response('Forbidden', { status: 403 });
}

export async function POST({ request }: RequestEvent) {
	const body = await request.json();
	const messaging = body.entry?.[0]?.messaging?.[0];

	if (messaging?.sender?.id && messaging?.message?.text) {
		const userMessage = messaging.message.text;
		const reply = await getGPTReply(userMessage);
		await sendMessage(messaging.sender.id, reply);
	}

	return json({ status: 'ok' });
}
