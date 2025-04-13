import { scholisticoKnowledge } from './scholisticoKnowledge';
import Anthropic from '@anthropic-ai/sdk';

// Use environment variable or provide a placeholder during build
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'placeholder-key-for-build';

// Initialize Anthropic client
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

export async function getGPTReply(userMessage: string): Promise<string> {
	try {
		// Don't make actual API calls if using the placeholder key
		if (ANTHROPIC_API_KEY === 'placeholder-key-for-build') {
			console.log('Using placeholder API key - not making actual API calls');
			return "This is a placeholder response. Please configure your ANTHROPIC_API_KEY in the environment variables.";
		}
		
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
	} catch (error) {
		console.error('Error calling Claude API:', error);
		return "I'm sorry, I encountered an error while processing your request. Please try again later.";
	}
}
