import { streamText } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { initDatabase, insertAIResponse, getAllAIResponses, getAIResponseByCountry } from '$lib/db';

export const load: PageServerLoad = async ({ url }) => {
	// Initialize database
	await initDatabase();

	// Get all AI responses for display
	const allResponses = await getAllAIResponses();

	// Optionally get the country from query params to prefill input
	const country = url.searchParams.get('country') ?? '';

	// If no country is provided, return empty data with all responses
	if (!country) {
		return { country, capital: '', allResponses };
	}

	// Check if we already have a response for this country in the database
	const existingResponse = await getAIResponseByCountry(country);
	if (existingResponse) {
		return {
			country: existingResponse.country,
			capital: existingResponse.capital,
			allResponses
		};
	}

	// If not in database, get from AI
	try {
		return { allResponses };
	} catch (e) {
		console.error(e);
		return { country, capital: '', error: 'Failed to get capital from AI.', allResponses };
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
		const country = data.get('country')?.toString().trim() || '';

		console.log('Form submitted with country:', country);
		console.log('All form data:', Object.fromEntries(data.entries()));

		if (!country) {
			return { success: false, error: 'Country is required.', capital: '' };
		}

		// Check if we already have a response for this country in the database
		const existingResponse = await getAIResponseByCountry(country);
		if (existingResponse) {
			return {
				success: true,
				country: existingResponse.country,
				capital: existingResponse.capital
			};
		}

		// If not in database, get from AI
		try {
			const prompt = `What is the capital city of ${country}?`;

			const result = streamText({
				model: 'xai/grok-4',
				prompt,
				system: 'Max 1 words in response'
			});

			let capital = '';
			for await (const chunk of result.textStream) {
				capital += chunk;
			}

			// Store in database
			await insertAIResponse(country, capital);

			return { success: true, country, capital };
		} catch (e) {
			console.error(e);
			return { success: false, error: 'Failed to get capital from AI.', capital: '' };
		}
	}
};
