// Use environment variable or provide a placeholder during build
const META_PAGE_TOKEN = process.env.META_PAGE_TOKEN || 'placeholder-page-token';

export async function sendMessage(recipientId: string, text: string) {
	try {
		// Don't make actual API calls if using the placeholder token
		if (META_PAGE_TOKEN === 'placeholder-page-token') {
			console.log(`[Mock] Sending message to ${recipientId}: ${text}`);
			return;
		}
		
		const response = await fetch(
			`https://graph.facebook.com/v19.0/me/messages?access_token=${META_PAGE_TOKEN}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					recipient: { id: recipientId },
					message: { text }
				})
			}
		);
		
		if (!response.ok) {
			const errorData = await response.json();
			console.error('Error sending message:', errorData);
			throw new Error(`Failed to send message: ${response.status}`);
		}
		
		console.log(`Message sent successfully to ${recipientId}`);
	} catch (error) {
		console.error('Error in sendMessage:', error);
	}
}
