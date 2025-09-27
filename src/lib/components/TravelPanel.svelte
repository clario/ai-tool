<script lang="ts">
	import type { MappedRoute, PlaceSchema, RouteSchema } from '$lib/ai/schemas';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Button from './ui/button/button.svelte';
	import { getWeatherIcon, type WeatherData, WeatherCondition } from '$lib/weather/types';
	import { onMount } from 'svelte';
	import { weatherIconMap } from '../../routes/weather/symbolMapper';

	let {
		places,
		routes,
		saveIsPending,
		startDate = $bindable(new Date().toISOString().split('T')[0]),
		zoomToPlace
	}: {
		places: Array<PlaceSchema>;
		routes: Array<RouteSchema>;
		saveIsPending: boolean;
		startDate?: string;
		zoomToPlace?: (place: PlaceSchema) => void;
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

	// Helper function to format distance
	function formatDistance(distance: number) {
		return distance < 1000 ? `${Math.round(distance)} km` : `${(distance / 1000).toFixed(1)}k km`;
	}

	// Weather data for each place
	let weatherData = $state<Map<string, WeatherData>>(new Map());

	// Fetch weather data for a place
	async function fetchWeatherData(place: PlaceSchema) {
		try {
			const response = await fetch(`/weather?lat=${place.coordinates.lat}&lon=${place.coordinates.lng}`);
			if (response.ok) {
				const data: WeatherData = await response.json();
				// Create a new Map to trigger reactivity
				weatherData = new Map(weatherData.set(place.id, data));
			}
		} catch (error) {
			console.error('Failed to fetch weather data for', place.name, error);
		}
	}

	// Fetch weather data for all places when component mounts
	onMount(() => {
		places.forEach(place => {
			fetchWeatherData(place);
		});
	});

	// Get weather icon for a place
	function getPlaceWeatherIcon(placeId: string): string | undefined {
		const weather = weatherData.get(placeId);
		return weather?.symbol_code ? weatherIconMap[weather.symbol_code] : undefined;
	}

	// Get temperature for a place
	function getPlaceTemperature(placeId: string): string {
		const weather = weatherData.get(placeId);
		return weather ? `${Math.round(weather.temperature)}°C` : '--°C';
	}

	// Handle clicking on a destination to zoom the globe
	function handleDestinationClick(place: PlaceSchema) {
		if (zoomToPlace) {
			zoomToPlace(place);
		}
	}
</script>

<!-- Right Sidebar - Travel Plan -->
<div
	class="fixed top-40 right-16 w-full max-w-xl h-[calc(100vh-14rem)] bg-white/90 backdrop-blur-md shadow-xl rounded-xl"
>
	<div class="p-6 h-full flex flex-col">
		<h2 class="text-xl font-semibold mb-4 text-gray-800">Your Travel Plan</h2>

		<!-- Start Date Picker -->
		<div>
			<label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
				Start Date
			</label>
			<input
				id="startDate"
				type="date"
				bind:value={startDate}
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
			/>
		</div>

		<!-- Route-based Travel Plan -->
		<div class="flex-1 overflow-y-auto py-4">
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
						<button 
							type="button" 
							class="w-full text-left cursor-pointer" 
							onclick={() => handleDestinationClick(route.from)}
							aria-label={`Zoom to ${route.from.name}`}
						>
							<Card class="hover:shadow-md transition-shadow">
								<CardHeader class="pb-2">
									<CardTitle class="text-base flex items-center gap-2">
										<span class="w-2 h-2 bg-green-500 rounded-full"></span>
										{route.from.name}
										<span class="ml-auto flex items-center gap-1">
											<!--I have a folder in static called weather, so the icons are there-->
											<!--Only show the icon if it exists-->
											{#if getPlaceWeatherIcon(route.from.id)}
												<img src={`/weather/${getPlaceWeatherIcon(route.from.id)}.png`} alt="Weather Icon" class="w-6 h-6" />
											{/if}
											<span class="text-sm text-gray-600">{getPlaceTemperature(route.from.id)}</span>
										</span>
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
									<div class="mt-3 pt-3 border-t border-gray-200 space-y-2">
										<div>
											<span class="font-medium text-gray-700 text-xs uppercase tracking-wide">What to do:</span>
											<p class="text-sm text-gray-600 mt-1">{route.from.whatToDo}</p>
										</div>
										<div>
											<span class="font-medium text-gray-700 text-xs uppercase tracking-wide">What to eat:</span>
											<p class="text-sm text-gray-600 mt-1">{route.from.whatToEat}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</button>
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
					<button 
						type="button" 
						class="w-full text-left cursor-pointer" 
						onclick={() => handleDestinationClick(route.to)}
						aria-label={`Zoom to ${route.to.name}`}
					>
						<Card class="hover:shadow-md transition-shadow">
							<CardHeader class="pb-2">
								<CardTitle class="text-base flex items-center gap-2">
									<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
									{route.to.name}
									<span class="ml-auto flex items-center gap-1">
										{#if getPlaceWeatherIcon(route.to.id)}
											<img src={`/weather/${getPlaceWeatherIcon(route.to.id)}.png`} alt="Weather Icon" class="w-6 h-6" />
										{/if}

										<span class="text-sm text-gray-600">{getPlaceTemperature(route.to.id)}</span>
									</span>
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
								<div class="mt-3 pt-3 border-t border-gray-200 space-y-2">
									<div>
										<span class="font-medium text-gray-700 text-xs uppercase tracking-wide">What to do:</span>
										<p class="text-sm text-gray-600 mt-1">{route.to.whatToDo}</p>
									</div>
									<div>
										<span class="font-medium text-gray-700 text-xs uppercase tracking-wide">What to eat:</span>
										<p class="text-sm text-gray-600 mt-1">{route.to.whatToEat}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</button>
				{/each}
			{/if}
		</div>

		<!-- Save Trip Button -->
		{#if sortedMappedRoutes().length > 0}
			<div class="pt-4 border-t border-gray-200">
				<Button class="w-full" type="submit" disabled={saveIsPending}>Save Trip</Button>
			</div>
		{/if}
	</div>
</div>
