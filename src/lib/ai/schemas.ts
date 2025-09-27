import z from 'zod';

const coordinatesSchema = z.object({
	lat: z.number().describe('The latitude of the place'),
	lng: z.number().describe('The longitude of the place')
});

const placeSchema = z.object({
	id: z
		.string()
		.describe('A self-defined ID of the place, used to identify the place in the routes'),
	name: z.string().describe('The name of the place'),
	coordinates: coordinatesSchema
});
type PlaceSchema = z.infer<typeof placeSchema>;

const routeSchema = z.object({
	fromId: z.string().describe('The ID of the starting place'),
	toId: z.string().describe('The ID of the destination place'),
	distance: z.number().describe('The distance between the two places in kilometers'),
	order: z
		.number()
		.describe(
			'The order of the route in the trip. If this is the first route, the order should be 1.'
		)
});

type RouteSchema = z.infer<typeof routeSchema>;

interface MappedRoute extends RouteSchema {
	from: PlaceSchema;
	to: PlaceSchema;
}

// Database schema types
interface Trip {
	id: number;
	name: string;
	description?: string;
	created_at: Date;
	updated_at: Date;
}

interface TripPlace {
	id: number;
	trip_id: number;
	place_id: string;
	name: string;
	lat: number;
	lng: number;
	created_at: Date;
}

interface TripRoute {
	id: number;
	trip_id: number;
	from_id: string;
	to_id: string;
	distance: number;
	created_at: Date;
}

// Utility functions for converting between schemas
function tripPlaceToPlaceSchema(tripPlace: TripPlace): PlaceSchema {
	return {
		id: tripPlace.place_id,
		name: tripPlace.name,
		coordinates: {
			lat: tripPlace.lat,
			lng: tripPlace.lng
		}
	};
}

function tripRouteToRouteSchema(tripRoute: TripRoute): RouteSchema {
	return {
		fromId: tripRoute.from_id,
		toId: tripRoute.to_id,
		distance: tripRoute.distance
	};
}

export {
	placeSchema,
	routeSchema,
	type MappedRoute,
	type PlaceSchema,
	type RouteSchema,
	type Trip,
	type TripPlace,
	type TripRoute,
	tripPlaceToPlaceSchema,
	tripRouteToRouteSchema
};
