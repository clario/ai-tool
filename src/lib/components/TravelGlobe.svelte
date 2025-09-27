<script lang="ts">
	import { browser } from '$app/environment';
	import { type MappedRoute, type PlaceSchema, type RouteSchema } from '$lib/ai/schemas';
	import type { GlobeInstance } from 'globe.gl';
	import { onDestroy, onMount } from 'svelte';

	let { places, routes, zoomToPlace = $bindable() }: { 
		places: Array<PlaceSchema>; 
		routes: Array<RouteSchema>;
		zoomToPlace?: (place: PlaceSchema) => void;
	} = $props();

	let globeContainer: HTMLDivElement;
	let globe: GlobeInstance | null = null;

	function resizeGlobe() {
		if (globe) {
			globe.width(globeContainer.clientWidth);
			globe.height(globeContainer.clientHeight);
		}
	}

	// Function to zoom to a specific place
	export function zoomToLocation(place: PlaceSchema) {
		console.log('Zooming to', place);
		if (globe) {
			globe.pointOfView({
				lat: place.coordinates.lat,
				lng: place.coordinates.lng,
				altitude: 0.2 // Closer zoom level
			}, 1000); // 1 second animation
		}
	}

	// Expose the zoom function to parent component
	$effect(() => {
		if (zoomToPlace !== undefined) {
			zoomToPlace = zoomToLocation;
		}
	});

	onMount(() => {
		if (!browser || !globeContainer) {
			return;
		}

		import('globe.gl').then(({ default: Globe }) => {
			globe = new Globe(globeContainer)
				.globeImageUrl('/2_no_clouds_16k.jpg')
				.width(window.innerWidth)
				.height(window.innerHeight)
				.backgroundColor('#00000000');

			globe.pointOfView({
				lat: 60,
				lng: 5.3,
				altitude: 0.6
			});

			updatePlaceFeatures(places);
			updateRouteFeatures(routes, places);
			resizeGlobe();
		});

		window.addEventListener('resize', resizeGlobe);

		return () => {
			window.removeEventListener('resize', resizeGlobe);
		};
	});

	$effect(() => {
		updatePlaceFeatures(places);
		updateRouteFeatures(routes, places);
	});

	function updatePlaceFeatures(places: Array<PlaceSchema>) {
		if (!globe) return;

		const deepCopyOfPlaces: Array<PlaceSchema> = JSON.parse(JSON.stringify(places));

		globe
			.labelsData(deepCopyOfPlaces)
			.labelLat((d) => (d as PlaceSchema).coordinates.lat)
			.labelLng((d) => (d as PlaceSchema).coordinates.lng)
			.labelText((d) => (d as PlaceSchema).name)
			.labelColor(() => '#FFFFFF');
	}

	function updateRouteFeatures(routes: Array<RouteSchema>, places: Array<PlaceSchema>) {
		if (!globe) return;

		const deepCopyOfRoutes: Array<RouteSchema> = JSON.parse(JSON.stringify(routes));
		const deepCopyOfPlaces: Array<PlaceSchema> = JSON.parse(JSON.stringify(places));

		const mappedRoutes = deepCopyOfRoutes.reduce<MappedRoute[]>((acc, route) => {
			const from = places.find((p) => p.id === route.fromId);
			const to = deepCopyOfPlaces.find((p) => p.id === route.toId);

			if (from && to) {
				acc.push({
					...route,
					from,
					to
				});
			}

			return acc;
		}, []);

		globe
			.arcsData(mappedRoutes)
			.arcStartLat((d) => (d as MappedRoute).from.coordinates.lat)
			.arcStartLng((d) => (d as MappedRoute).from.coordinates.lng)
			.arcEndLat((d) => (d as MappedRoute).to.coordinates.lat)
			.arcEndLng((d) => (d as MappedRoute).to.coordinates.lng)
			.arcStroke(0.1)
			.arcColor(() => '#FFFFFF');
	}

	onDestroy(() => {
		if (globe) {
			globe._destructor();
		}
	});
</script>

<div bind:this={globeContainer} class="fixed inset-0 w-screen h-screen">
	<!-- Globe will be rendered here -->
</div>

<div class="fixed inset-0 w-screen h-screen pointer-events-none">
	<p>{places.length} places</p>
	<p>{routes.length} routes</p>
	<div class="absolute inset-0 bg-radial-[at_50%_30%] from-transparent to-white/50 to-100%"></div>
</div>
