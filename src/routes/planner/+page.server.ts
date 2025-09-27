import { createSetTravelPlanTool } from '$lib/ai/tools';
import z from 'zod';
import type { Actions } from './$types';
import { streamText, tool } from 'ai';

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
				prompt: `You are a helpful travel planning assistant. The user asked: "${message}". Provide a helpful response about travel planning. If they ask you to set their travel plan, you MUST use the setTravelPlan tool to create a travel plan with places and routes.`,
				toolChoice: 'required',
                tools: {
					setTravelPlan: createSetTravelPlanTool,
					response: tool({
						name: 'response',
						description: 'Respond to the user',
						inputSchema: z.object({
							response: z.string()
						})
					})
				},
				system:
					'You are a knowledgeable travel planning assistant. Provide helpful, concise responses about travel destinations, planning tips, and recommendations. Always return max 10 words'
			});

			return {
				success: true,
				message,
				aiResponse: await result.toolCalls
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
