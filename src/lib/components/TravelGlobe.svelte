<script lang="ts">
	import { browser } from '$app/environment';
	import type { Feature, LineString, Point } from 'geojson';
	import type { GlobeInstance } from 'globe.gl';
	import { onDestroy, onMount } from 'svelte';

	let { features }: { features: Array<Feature> } = $props();

	let globeContainer: HTMLDivElement;
	let globe: GlobeInstance | null = null;

	const labelFeatures = $derived(features.filter((f) => f.geometry.type === 'Point'));
	const lineStringFeatures = $derived(features.filter((f) => f.geometry.type === 'LineString'));

	onMount(async () => {
		if (!browser || !globeContainer) return;

		// Dynamic import to avoid SSR issues
		const { default: Globe } = await import('globe.gl');

		// Initialize simple globe with Apple Maps style
		globe = new Globe(globeContainer)
			.globeImageUrl('/2_no_clouds_16k.jpg')
			.width(window.innerWidth)
			.height(window.innerHeight)
			.backgroundColor('#000000')
			.pointColor('#000fff');

		globe.pointOfView({
			lat: 60,
			lng: 5.3,
			altitude: 0.6
		});

		// Initial data load
		updateLabelFeatures();
		updateLineStringFeatures();
	});

	// Reactive update when points change
	$effect(() => {
		if (globe && labelFeatures) {
			updateLabelFeatures();
		}
	});

	$effect(() => {
		if (globe && lineStringFeatures) {
			updateLineStringFeatures();
		}
	});

	function updateLabelFeatures() {
		if (!globe) return;

		globe
			.labelsData(labelFeatures)
			.labelLat((d) => (d as Feature<Point>).geometry.coordinates[1])
			.labelLng((d) => (d as Feature<Point>).geometry.coordinates[0])
			.labelText((d) => (d as Feature<Point>).properties?.name || '');
	}

	function updateLineStringFeatures() {
		if (!globe) return;
		console.log(lineStringFeatures);
		globe
			.pathsData(lineStringFeatures)
			.pathPoints((d) => (d as Feature<LineString>).geometry.coordinates.map(([a, b]) => [b, a]))
			.pathStroke('#000000')
			.pathDashLength(10);
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

<!-- Inner shadow overlay -->
<div class="fixed inset-0 w-screen h-screen pointer-events-none">
	<div class="absolute inset-0 bg-radial-[at_50%_30%] from-transparent to-white/50 to-100%"></div>
</div>
