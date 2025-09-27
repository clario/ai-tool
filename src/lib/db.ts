import { sql } from '@vercel/postgres';
import type { PlaceSchema, RouteSchema } from './ai/schemas';

export interface AIResponse {
	id: number;
	country: string;
	capital: string;
	created_at: Date;
}

export interface Trip {
	id: number;
	name: string;
	description?: string;
	created_at: Date;
	updated_at: Date;
}

export interface TripPlace {
	id: number;
	trip_id: number;
	place_id: string;
	name: string;
	lat: number;
	lng: number;
	created_at: Date;
}

export interface TripRoute {
	id: number;
	trip_id: number;
	from_id: string;
	to_id: string;
	distance: number;
	created_at: Date;
}

// Create the tables if they don't exist
export async function initDatabase() {
	try {
		// Create AI responses table
		await sql`
			CREATE TABLE IF NOT EXISTS ai_responses (
				id SERIAL PRIMARY KEY,
				country VARCHAR(255) NOT NULL,
				capital VARCHAR(255) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
		`;

		// Create trips table
		await sql`
			CREATE TABLE IF NOT EXISTS trips (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				description TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
		`;

		// Create trip_places table
		await sql`
			CREATE TABLE IF NOT EXISTS trip_places (
				id SERIAL PRIMARY KEY,
				trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
				place_id VARCHAR(255) NOT NULL,
				name VARCHAR(255) NOT NULL,
				lat DECIMAL(10, 8) NOT NULL,
				lng DECIMAL(11, 8) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				UNIQUE(trip_id, place_id)
			);
		`;

		// Create trip_routes table
		await sql`
			CREATE TABLE IF NOT EXISTS trip_routes (
				id SERIAL PRIMARY KEY,
				trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
				from_id VARCHAR(255) NOT NULL,
				to_id VARCHAR(255) NOT NULL,
				distance DECIMAL(10, 2) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
		`;

		console.log('Database tables initialized successfully');
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

// Trip management functions
export async function saveTrip(
	name: string,
	description: string | null,
	places: PlaceSchema[],
	routes: RouteSchema[]
): Promise<Trip> {
	try {
		// Insert the trip
		const tripResult = await sql`
			INSERT INTO trips (name, description)
			VALUES (${name}, ${description})
			RETURNING id, name, description, created_at, updated_at
		`;
		const trip = tripResult.rows[0] as Trip;

		// Insert places
		if (places.length > 0) {
			for (const place of places) {
				await sql`
					INSERT INTO trip_places (trip_id, place_id, name, lat, lng)
					VALUES (${trip.id}, ${place.id}, ${place.name}, ${place.coordinates.lat}, ${place.coordinates.lng})
				`;
			}
		}

		// Insert routes
		if (routes.length > 0) {
			for (const route of routes) {
				await sql`
					INSERT INTO trip_routes (trip_id, from_id, to_id, distance)
					VALUES (${trip.id}, ${route.fromId}, ${route.toId}, ${route.distance})
				`;
			}
		}

		return trip;
	} catch (error) {
		console.error('Error saving trip:', error);
		throw error;
	}
}

export async function getAllTrips(): Promise<Trip[]> {
	try {
		const result = await sql`
			SELECT id, name, description, created_at, updated_at
			FROM trips
			ORDER BY updated_at DESC
		`;
		return result.rows as Trip[];
	} catch (error) {
		console.error('Error fetching trips:', error);
		throw error;
	}
}

export async function getTripById(tripId: number): Promise<{
	trip: Trip;
	places: TripPlace[];
	routes: TripRoute[];
} | null> {
	try {
		// Get trip
		const tripResult = await sql`
			SELECT id, name, description, created_at, updated_at
			FROM trips
			WHERE id = ${tripId}
		`;
		
		if (tripResult.rows.length === 0) {
			return null;
		}

		const trip = tripResult.rows[0] as Trip;

		// Get places
		const placesResult = await sql`
			SELECT id, trip_id, place_id, name, lat, lng, created_at
			FROM trip_places
			WHERE trip_id = ${tripId}
			ORDER BY created_at
		`;

		// Get routes
		const routesResult = await sql`
			SELECT id, trip_id, from_id, to_id, distance, created_at
			FROM trip_routes
			WHERE trip_id = ${tripId}
			ORDER BY created_at
		`;

		return {
			trip,
			places: placesResult.rows as TripPlace[],
			routes: routesResult.rows as TripRoute[]
		};
	} catch (error) {
		console.error('Error fetching trip by ID:', error);
		throw error;
	}
}

export async function deleteTrip(tripId: number): Promise<boolean> {
	try {
		const result = await sql`
			DELETE FROM trips
			WHERE id = ${tripId}
		`;
		return (result.rowCount ?? 0) > 0;
	} catch (error) {
		console.error('Error deleting trip:', error);
		throw error;
	}
}
