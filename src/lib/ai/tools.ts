import { tool } from 'ai';
import z from 'zod';
import { placeSchema, routeSchema } from './schemas';

export const createSetTravelPlanTool = tool({
	description: `Set the travel plan. Provide the entire travel plan in one call. 
			This tool does not update travel plans partially, but will replace the entire travel plan.
			Create "Place" objects to add a new place to the travel plan.
			Create "Route" objects to describe the travel between two places.
			`,
	inputSchema: z.object({
		places: z.array(placeSchema).describe('The places in the travel plan'),
		routes: z.array(routeSchema).describe('The routes in the travel plan')
	})
});
