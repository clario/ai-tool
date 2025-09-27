import { streamText } from 'ai';
import type { Actions, PageServerLoad } from './$types';


export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		console.log(data)
		const country = data.get('country')?.toString().trim() || '';
		
		console.log('Form submitted with country:', country);
		console.log('All form data:', Object.fromEntries(data.entries()));

		if (!country) {
			return { success: false, error: 'Country is required.', capital: '' };
		}

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

			return { success: true, country, capital };
		} catch (e) {
			console.error(e);
			return { success: false, error: 'Failed to get capital from AI.', capital: '' };
		}
	}
};
