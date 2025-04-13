import { scholisticoKnowledge } from './scholisticoKnowledge';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function getGPTReply(userMessage: string): Promise<string> {
	const prompt = `
You are Scholistico's friendly AI assistant. Answer client questions clearly and warmly, using the information provided:

${scholisticoKnowledge}

Question: ${userMessage}
Answer:
`;

	const response = await anthropic.messages.create({
		model: 'claude-3-haiku-20240307',
		max_tokens: 250,
		temperature: 0.7,
		messages: [{ role: 'user', content: prompt }]
	});

	return response.content[0].text;
}
