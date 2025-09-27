import { createSetTravelPlanTool } from '$lib/ai/tools';
import type { Actions } from './$types';
import { streamText } from 'ai';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const message = data.get('message')?.toString().trim() || '';

		if (!message) {
			return { success: false, error: 'Message is required.' };
		}

		console.log('Received message:', message);

		try {
			// Process the message with AI
			const result = streamText({
				model: 'openai/gpt-4o-mini',
				prompt: `You are a helpful travel planning assistant. The user asked: "${message}". Provide a helpful response about travel planning.`,
				tools: {
					setTravelPlan: createSetTravelPlanTool((e) => {
						console.log('hello!', e);
					})
				},
				system:
					'You are a knowledgeable travel planning assistant. Provide helpful, concise responses about travel destinations, planning tips, and recommendations. Always return max 10 words'
			});

			let aiResponse = '';
			for await (const chunk of result.textStream) {
				console.log('AI response chunk:', chunk);
				aiResponse += chunk;
			}
			console.log('AI response:', aiResponse);
			return {
				success: true,
				message,
				aiResponse: aiResponse.trim()
			};
		} catch (error) {
			console.error('AI processing error:', error);
			return {
				success: false,
				error: 'Failed to process your message. Please try again.'
			};
		}
	}
};
