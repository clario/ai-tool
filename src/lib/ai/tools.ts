import { tool } from 'ai';
import z from 'zod';
import { placeSchema, routeSchema } from './schemas';

const setTravelPlanToolInputSchema = z.union([placeSchema, routeSchema]);
type SetTravelPlanToolInput = z.infer<typeof setTravelPlanToolInputSchema>;

export const createSetTravelPlanTool = (
	onExecute: (input: SetTravelPlanToolInput) => Promise<void> | void
) =>
	tool({
		name: 'Set travel plan',
		description: `Set the travel plan. Provide the entire travel plan in one call. 
			This tool does not update travel plans partially, but will replace the entire travel plan.
			Create "Place" objects to add a new place to the travel plan.
			Create "Route" objects to describe the travel between two places.
			`,
		inputSchema: z.object({
			data: setTravelPlanToolInputSchema
		}),
		execute: async (input) => {
			console.log('input', input);
			console.log('input.data', input.data);
			try {
				await onExecute(input.data);
				return 'The travel plan has been set';
			} catch (error) {
				return 'Failed to set the travel plan: ' + error;
			}
		}
	});
