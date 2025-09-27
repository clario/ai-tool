<script lang="ts">
	import { browser } from '$app/environment';
	import { type MappedRoute, type PlaceSchema, type RouteSchema } from '$lib/ai/schemas';
	import type { GlobeInstance } from 'globe.gl';
	import { onDestroy, onMount } from 'svelte';

	let { places, routes }: { places: Array<PlaceSchema>; routes: Array<RouteSchema> } = $props();

	let globeContainer: HTMLDivElement;
	let globe: GlobeInstance | null = null;

	onMount(async () => {
		if (!browser || !globeContainer) {
			return;
		}

		const { default: Globe } = await import('globe.gl');

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

		updatePlaceFeatures();
		updateRouteFeatures();
	});

	$effect(() => {
		if (globe && places) {
			updatePlaceFeatures();
		}
	});

	$effect(() => {
		if (globe && routes) {
			updateRouteFeatures();
		}
	});

	function updatePlaceFeatures() {
		if (!globe) return;

		globe
			.labelsData(places)
			.labelLat((d) => (d as PlaceSchema).coordinates.lat)
			.labelLng((d) => (d as PlaceSchema).coordinates.lng)
			.labelText((d) => (d as PlaceSchema).name)
			.labelColor(() => '#FFFFFF');
	}

	function updateRouteFeatures() {
		if (!globe) return;

		const mappedRoutes = routes.reduce<MappedRoute[]>((acc, route) => {
			const from = places.find((p) => p.id === route.fromId);
			const to = places.find((p) => p.id === route.toId);

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
	<div class="absolute inset-0 bg-radial-[at_50%_30%] from-transparent to-white/50 to-100%"></div>
</div>
