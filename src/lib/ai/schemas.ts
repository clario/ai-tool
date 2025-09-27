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
	coordinates: coordinatesSchema,
	type: z.literal('Place')
});
type PlaceSchema = z.infer<typeof placeSchema>;

const routeSchema = z.object({
	fromId: z.string().describe('The ID of the starting place'),
	toId: z.string().describe('The ID of the destination place'),
	distance: z.number().describe('The distance between the two places in kilometers'),
	type: z.literal('Route')
});
type RouteSchema = z.infer<typeof routeSchema>;

interface MappedRoute extends RouteSchema {
	from: PlaceSchema;
	to: PlaceSchema;
}

export { placeSchema, routeSchema, type PlaceSchema, type RouteSchema, type MappedRoute };
