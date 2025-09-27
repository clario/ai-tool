import { streamText } from 'ai';

export const GET = async () => {
	const result = streamText({
		model: 'openai/gpt-5',
		prompt: 'Invent a new holiday and describe its traditions.'
	});

	return result.toTextStreamResponse();
};
