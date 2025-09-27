import { getAllTrips, getTripById, deleteTrip, initDatabase } from '$lib/db';
import { sql } from '@vercel/postgres';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	try {
		await initDatabase();
		const trips = await getAllTrips();
		
		// Get additional trip details for each trip
		const tripsWithDetails = await Promise.all(
			trips.map(async (trip) => {
				try {
					const tripData = await getTripById(trip.id);
					return {
						...trip,
						placesCount: tripData?.places.length || 0,
						routesCount: tripData?.routes.length || 0,
						firstPlace: tripData?.places[0]?.name || null
					};
				} catch (error) {
					console.error(`Error loading details for trip ${trip.id}:`, error);
					return {
						...trip,
						placesCount: 0,
						routesCount: 0,
						firstPlace: null
					};
				}
			})
		);
		
		return { trips: tripsWithDetails };
	} catch (error) {
		console.error('Error loading trips:', error);
		return { trips: [] };
	}
};

export const actions: Actions = {
	deleteTrip: async ({ request }) => {
		const data = await request.formData();
		const tripId = parseInt(data.get('tripId')?.toString() || '0');

		if (!tripId) {
			return { success: false, error: 'Invalid trip ID.' };
		}

		try {
			const deleted = await deleteTrip(tripId);
			return { success: deleted };
		} catch (error) {
			console.error('Error deleting trip:', error);
			return { success: false, error: 'Failed to delete trip.' };
		}
	},

	updateTrip: async ({ request }) => {
		const data = await request.formData();
		const tripId = parseInt(data.get('tripId')?.toString() || '0');
		const name = data.get('name')?.toString().trim() || '';
		const description = data.get('description')?.toString().trim() || '';

		if (!tripId) {
			return { success: false, error: 'Invalid trip ID.' };
		}

		if (!name) {
			return { success: false, error: 'Trip name is required.' };
		}

		try {
			await initDatabase();
			
			const result = await sql`
				UPDATE trips 
				SET name = ${name}, description = ${description || null}, updated_at = CURRENT_TIMESTAMP
				WHERE id = ${tripId}
				RETURNING id
			`;

			if (result.rows.length === 0) {
				return { success: false, error: 'Trip not found.' };
			}

			return { success: true };
		} catch (error) {
			console.error('Error updating trip:', error);
			return { success: false, error: 'Failed to update trip.' };
		}
	}
};
