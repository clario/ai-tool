import { streamText } from 'ai';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Optionally get the country from query params to prefill input
	const country = url.searchParams.get('country') ?? '';
	
	// If no country is provided, return empty data
	if (!country) {
		return { country, capital: '' };
	}
	console.log("yeeeeee2222")
	try {
		const prompt = `What is the capital city of ${country}?`;

		const result = streamText({
			model: 'openai/gpt-5',
			prompt,
			system: 'Max 2 words in response'
		});

		let capital = '';
		for await (const chunk of result.textStream) {
			capital += chunk;
		}

		return { country, capital };
	} catch (e) {
		console.error(e);
		return { country, capital: '', error: 'Failed to get capital from AI.' };
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const country = data.get('country')?.toString().trim() || '';

		if (!country) {
			return { success: false, error: 'Country is required.', capital: '' };
		}

		console.log("yeeeeee")
		try {
			const prompt = `What is the capital city of ${country}?`;

			const result = streamText({
				model: 'openai/gpt-5',
				prompt,
				system: 'Max 2 words in response'
			});

			let capital = '';
			for await (const chunk of result.textStream) {
				capital += chunk;
			}

			return { success: true, country, capital };
		} catch (e) {
			console.error(e);
			return { success: false, error: 'Failed to get capital from AI.', capital: '' };
		}
	}
};
