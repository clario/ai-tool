import { placeSchema, routeSchema } from '$lib/ai/schemas';
import { streamText, tool, generateText, type ModelMessage } from 'ai';
import z from 'zod';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const message = data.get('message')?.toString().trim() || '';

		const previousMessages = JSON.parse(data.get('messages')?.toString() ?? '[]');
		const tripPlaces = JSON.parse(data.get('tripPlaces')?.toString() ?? '[]');
		const tripRoutes = JSON.parse(data.get('tripRoutes')?.toString() ?? '[]');

		if (!message) {
			return { success: false, error: 'Message is required.' };
		}

		console.log('Received message:', message);

		const messages: ModelMessage[] = [
			...previousMessages,
			{
				role: 'system',
				content:
					tripPlaces.length === 0 && tripRoutes.length === 0
						? 'The user has not set their travel plan yet.'
						: `
					The user currently has a travel plan that looks like this:
					
					<places>
					${JSON.stringify(tripPlaces)}
					</places>
					
					<routes>
					${JSON.stringify(tripRoutes)}
					</routes>
					
					If the user asks you to change it in any way, you MUST provide the entire travel plan, including existing places and routes.`
			},
			{
				role: 'user',
				content: message
			}
		];

		console.log(tripPlaces, tripRoutes);

		try {
			// Process the message with AI
			const result = getTravelPlan(messages);

			const toolCallResults = await result.toolCalls;

			return {
				success: true,
				message,
				aiResponse: toolCallResults
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

const getEmoji = async (city: string) => {
	// give a city as input and get an emoji for the city
	return generateText({
		model: 'openai/gpt-4o-mini',
		prompt: `Get an emoji for the city: ${city}`,
		system: 'Only return one emoji, nothing more ever'
	});
};

function getTravelPlan(messages: ModelMessage[]) {
	return streamText({
		model: 'openai/gpt-4o-mini',
		toolChoice: 'required',
		messages,
		tools: {
			setTravelPlan: tool({
				description: `Set the travel plan. Provide the entire travel plan in one call. 
								This tool does not update travel plans partially, but will replace the entire travel plan.
								Create "Place" objects to add a new place to the travel plan.
								Create "Route" objects to describe the travel between two places.
								`,
				inputSchema: z.object({
					places: z.array(placeSchema).describe('The places in the travel plan'),
					routes: z.array(routeSchema).describe('The routes in the travel plan'),
					response: z
						.string()
						.describe('A message to the user after the travel plan has been set/changed/updated.')
				})
			}),
			response: tool({
				name: 'response',
				description: 'Plain response to the user',
				inputSchema: z.object({
					response: z.string().describe('Max length 25 words')
				})
			})
		},
		system: `
					You are a helpful travel planning assistant. 
					Provide a helpful response about travel planning. 
					If they ask you to set/update/change their travel plan, you MUST use the setTravelPlan tool to create a travel plan with places and routes.
					`
	});
}
