import { getAllTrips, getTripById, deleteTrip, initDatabase } from '$lib/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	try {
		await initDatabase();
		const trips = await getAllTrips();
		return { trips };
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
	}
};
