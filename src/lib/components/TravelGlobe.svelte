<script lang="ts">
	import { browser } from '$app/environment';
	import { type MappedRoute, type PlaceSchema, type RouteSchema } from '$lib/ai/schemas';
	import type { GlobeInstance } from 'globe.gl';
	import { onDestroy, onMount } from 'svelte';

	let {
		places,
		routes,
		zoomToPlace = $bindable(),
		onPlaceClick = $bindable()
	}: {
		places: Array<PlaceSchema>;
		routes: Array<RouteSchema>;
		zoomToPlace?: (place: PlaceSchema) => void;
		onPlaceClick?: (place: PlaceSchema) => void;
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
		if (globe) {
			globe.pointOfView(
				{
					lat: place.coordinates.lat,
					lng: place.coordinates.lng,
					altitude: 0.2 // Closer zoom level
				},
				1000
			); // 1 second animation
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

	const markerSvg = `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="36"
		height="36"
		viewBox="0 0 36 36"
		fill="none"
	>
		<path
			d="M18 0.5C25.5066 0.5 31.4998 5.96518 31.5 12.5996C31.5 18.1014 28.0958 23.8361 24.6074 28.251C22.873 30.4461 21.1374 32.2909 19.835 33.5869C19.1842 34.2345 18.6421 34.7445 18.2637 35.0918C18.1639 35.1834 18.0741 35.2626 17.998 35.3311C17.9225 35.2635 17.8343 35.1848 17.7354 35.0947C17.357 34.75 16.8148 34.2442 16.1641 33.6006C14.8618 32.3126 13.1259 30.4768 11.3916 28.2881C7.90429 23.887 4.5 18.1521 4.5 12.5996C4.50024 5.96518 10.4934 0.5 18 0.5Z"
			fill="#0F66D8"
			stroke="white"
		/>
		<path
			d="M18 21C21.866 21 25 17.866 25 14C25 10.134 21.866 7 18 7C14.134 7 11 10.134 11 14C11 17.866 14.134 21 18 21Z"
			fill="white"
		/>
	</svg>`;

	function updatePlaceFeatures(places: Array<PlaceSchema>) {
		if (!globe) return;

		const deepCopyOfPlaces: Array<PlaceSchema> = JSON.parse(JSON.stringify(places));

		globe
			.htmlElementsData(deepCopyOfPlaces)
			.htmlElement((d) => {
				const el = document.createElement('div');
				el.innerHTML = markerSvg;
				el.style.width = `36px`;
				el.style.height = `36px`;
				el.style.translate = `0 -50%`;
				el.style.transition = 'opacity 250ms';
				el.style.pointerEvents = 'auto';
				el.style.cursor = 'pointer';
				el.onclick = () => onPlaceClick?.(d as PlaceSchema);
				return el;
			})
			.htmlLat((d) => (d as PlaceSchema).coordinates.lat)
			.htmlLng((d) => (d as PlaceSchema).coordinates.lng);

		globe
			.labelsData(deepCopyOfPlaces)
			.labelLat((d) => (d as PlaceSchema).coordinates.lat)
			.labelLng((d) => (d as PlaceSchema).coordinates.lng)
			.labelText((d) => (d as PlaceSchema).name)
			.labelColor(() => '#FFFF00')
			.labelDotRadius(0.1)
			.labelAltitude(0);
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
	<div
		class="fixed inset-0 w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center"
	>
		<div class="text-center">
			<!-- Spinning globe animation -->
			<div class="relative mb-8">
				<div class="w-24 h-24 mx-auto relative">
					<!-- Outer ring -->
					<div class="absolute inset-0 border-4 border-blue-200/20 rounded-full"></div>
					<!-- Spinning ring -->
					<div
						class="absolute inset-0 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"
					></div>
					<!-- Inner globe -->
					<div
						class="absolute inset-3 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center"
					>
						<svg class="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Loading text with animation -->
			<div class="space-y-4">
				<h2 class="text-2xl font-bold text-white animate-fade-in">Loading Globe</h2>
				<div class="flex items-center justify-center space-x-1">
					<div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
					<div
						class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
						style="animation-delay: 0.1s"
					></div>
					<div
						class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
						style="animation-delay: 0.2s"
					></div>
				</div>
				<p class="text-blue-200 text-sm animate-pulse">Preparing your travel visualization...</p>
			</div>
		</div>
	</div>
</div>

<div class="fixed inset-0 w-screen h-screen pointer-events-none">
	<p>{places.length} places</p>
	<p>{routes.length} routes</p>
	<div class="absolute inset-0 bg-radial-[at_50%_30%] from-transparent to-white/50 to-100%"></div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 1s ease-out;
	}
</style>
