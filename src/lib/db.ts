import { sql } from '@vercel/postgres';

export interface AIResponse {
	id: number;
	country: string;
	capital: string;
	created_at: Date;
}

// Create the table if it doesn't exist
export async function initDatabase() {
	try {
		await sql`
			CREATE TABLE IF NOT EXISTS ai_responses (
				id SERIAL PRIMARY KEY,
				country VARCHAR(255) NOT NULL,
				capital VARCHAR(255) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
		`;
		console.log('Database table initialized successfully');
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
}

// Insert a new AI response
export async function insertAIResponse(country: string, capital: string): Promise<AIResponse> {
	try {
		const result = await sql`
			INSERT INTO ai_responses (country, capital)
			VALUES (${country}, ${capital})
			RETURNING id, country, capital, created_at
		`;
		return result.rows[0] as AIResponse;
	} catch (error) {
		console.error('Error inserting AI response:', error);
		throw error;
	}
}

// Get all AI responses
export async function getAllAIResponses(): Promise<AIResponse[]> {
	try {
		const result = await sql`
			SELECT id, country, capital, created_at
			FROM ai_responses
			ORDER BY created_at DESC
		`;
		return result.rows as AIResponse[];
	} catch (error) {
		console.error('Error fetching AI responses:', error);
		throw error;
	}
}

// Get AI responses by country
export async function getAIResponseByCountry(country: string): Promise<AIResponse | null> {
	try {
		const result = await sql`
			SELECT id, country, capital, created_at
			FROM ai_responses
			WHERE LOWER(country) = LOWER(${country})
			ORDER BY created_at DESC
			LIMIT 1
		`;
		return (result.rows[0] as AIResponse) || null;
	} catch (error) {
		console.error('Error fetching AI response by country:', error);
		throw error;
	}
}
