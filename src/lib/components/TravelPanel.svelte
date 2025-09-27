<script lang="ts">
	import type { MappedRoute, PlaceSchema, RouteSchema } from '$lib/ai/schemas';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Button from './ui/button/button.svelte';

	let {
		places,
		routes,
		startDate = $bindable(new Date().toISOString().split('T')[0]),
		onSaveTrip
	}: {
		places: Array<PlaceSchema>;
		routes: Array<RouteSchema>;
		startDate?: string;
		onSaveTrip?: () => void;
	} = $props();

	// Sort routes by order and map them with corresponding places
	const sortedMappedRoutes = $derived(() => {
		// Sort routes by order (lowest to highest)
		const sortedRoutes = [...routes].sort((a, b) => a.order - b.order);

		// Map each route with its corresponding from and to places
		return sortedRoutes
			.map((route) => {
				const fromPlace = places.find((place) => place.id === route.fromId);
				const toPlace = places.find((place) => place.id === route.toId);

				return {
					...route,
					from: fromPlace,
					to: toPlace
				} as MappedRoute;
			})
			.filter((route) => route.from && route.to); // Only include routes where both places are found
	});

	// Helper function to calculate arrival and departure dates based on route order
	function calculateRouteDates(routeIndex: number, daysAtDestination: number = 3) {
		const start = new Date(startDate);
		let arrivalDate = new Date(start);

		// Add days for previous destinations (assuming 3 days each)
		for (let i = 0; i < routeIndex; i++) {
			arrivalDate.setDate(arrivalDate.getDate() + daysAtDestination);
		}

		const departureDate = new Date(arrivalDate);
		departureDate.setDate(departureDate.getDate() + daysAtDestination);

		return {
			arrival: arrivalDate.toISOString().split('T')[0],
			departure: departureDate.toISOString().split('T')[0]
		};
	}

	// Helper function to format date for display
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	// Sort routes by order and create a combined itinerary
	const sortedRoutes = $derived(
		routes
			.filter((route) => route.order !== undefined)
			.sort((a, b) => (a.order || 0) - (b.order || 0))
	);

	// Create itinerary with places and routes in order
	const itinerary = $derived(() => {
		const result: Array<{ type: 'place' | 'route'; data: any; index: number }> = [];

		for (let i = 0; i < sortedRoutes.length; i++) {
			const route = sortedRoutes[i];
			const fromPlace = places.find((p) => p.id === route.fromId);
			const toPlace = places.find((p) => p.id === route.toId);

			// Add from place (only for first route to avoid duplicates)
			if (i === 0 && fromPlace) {
				result.push({ type: 'place', data: fromPlace, index: i * 2 });
			}

			// Add route
			result.push({ type: 'route', data: route, index: i * 2 + 1 });

			// Add to place
			if (toPlace) {
				result.push({ type: 'place', data: toPlace, index: i * 2 + 2 });
			}
		}

		return result;
	});

	// Helper function to format distance
	function formatDistance(distance: number) {
		return distance < 1000 ? `${Math.round(distance)} km` : `${(distance / 1000).toFixed(1)}k km`;
	}
</script>

<!-- Right Sidebar - Travel Plan -->
<div
	class="fixed top-40 right-16 w-full max-w-xl h-[calc(100vh-14rem)] bg-white/90 backdrop-blur-md shadow-xl rounded-xl"
>
	<div class="p-6 h-full flex flex-col">
		<h2 class="text-xl font-semibold mb-4 text-gray-800">Your Travel Plan</h2>

		<!-- Start Date Picker -->
		<div class="mb-4">
			<label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
				Start Date
			</label>
			<input
				id="startDate"
				type="date"
				bind:value={startDate}
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<!-- Route-based Travel Plan -->
		<div class="flex-1 overflow-y-auto">
			{#if sortedMappedRoutes().length === 0}
				<div class="text-center text-gray-500 py-8">
					<p>No travel routes planned yet.</p>
					<p class="text-sm">Ask the AI to create a travel plan!</p>
				</div>
			{:else}
				{#each sortedMappedRoutes() as route, index}
					{@const fromDates = calculateRouteDates(index)}
					{@const toDates = calculateRouteDates(index + 1)}

					<!-- Starting Place Card (only for first route) -->
					{#if index === 0}
						<Card class="hover:shadow-md transition-shadow">
							<CardHeader class="pb-2">
								<CardTitle class="text-base flex items-center gap-2">
									<span class="w-2 h-2 bg-green-500 rounded-full"></span>
									{route.from.name}
								</CardTitle>
							</CardHeader>
							<CardContent class="pt-0">
								<div class="space-y-2 text-sm text-gray-600">
									<div class="flex justify-between">
										<span class="font-medium">Days:</span>
										<span>3 days</span>
									</div>
									<div class="flex justify-between">
										<span class="font-medium">Arriving:</span>
										<span>{formatDate(fromDates.arrival)}</span>
									</div>
									<div class="flex justify-between">
										<span class="font-medium">Leaving:</span>
										<span>{formatDate(fromDates.departure)}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					{/if}

					<!-- Route Distance Line (Vertical Timeline) -->
					<div class="flex items-center pl-6">
						<div class="flex flex-col items-center mr-4">
							<div class="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-blue-400"></div>
							<div class="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
							<div class="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-gray-300"></div>
						</div>
						<div class="bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
							<span class="text-sm font-medium text-blue-700">
								{formatDistance(route.distance)}
							</span>
						</div>
					</div>

					<!-- Destination Place Card -->
					<Card class="hover:shadow-md transition-shadow">
						<CardHeader class="pb-2">
							<CardTitle class="text-base flex items-center gap-2">
								<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
								{route.to.name}
							</CardTitle>
						</CardHeader>
						<CardContent class="pt-0">
							<div class="space-y-2 text-sm text-gray-600">
								<div class="flex justify-between">
									<span class="font-medium">Days:</span>
									<span>3 days</span>
								</div>
								<div class="flex justify-between">
									<span class="font-medium">Arriving:</span>
									<span>{formatDate(toDates.arrival)}</span>
								</div>
								<div class="flex justify-between">
									<span class="font-medium">Leaving:</span>
									<span>{formatDate(toDates.departure)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			{/if}
		</div>

		<!-- Save Trip Button -->
		{#if sortedMappedRoutes().length > 0}
			<div class="mt-4 pt-4 border-t border-gray-200">
				<Button class="w-full" onclick={() => onSaveTrip?.()}>Save Trip</Button>
			</div>
		{/if}
	</div>
</div>
