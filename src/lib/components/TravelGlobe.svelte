<script lang="ts">
	import { browser } from '$app/environment';
	import type { GlobeInstance } from 'globe.gl';
	import { onDestroy, onMount } from 'svelte';

	export let points: Array<{ lat: number; lng: number; name: string; color?: string }> = [];

	let globeContainer: HTMLDivElement;
	let globe: GlobeInstance | null = null;

	onMount(async () => {
		if (!browser || !globeContainer) return;

		// Dynamic import to avoid SSR issues
		const { default: Globe } = await import('globe.gl');

		// Initialize simple globe with Apple Maps style
		globe = new Globe(globeContainer)
			.globeImageUrl('/2_no_clouds_16k.jpg')
			.width(window.innerWidth)
			.height(window.innerHeight)
			.backgroundColor('#00000000')
			.pointColor('color');

		const controls = globe.controls();
		globe.pointOfView({
			lat: 60,
			lng: 5.3,
			altitude: 0.6
		});

		// Initial data load
		updatePoints();
	});

	// Reactive update when points change
	$: if (globe && points) {
		updatePoints();
	}

	function updatePoints() {
		if (!globe) return;

		const pointsData = points.map((point) => ({
			lat: point.lat,
			lng: point.lng,
			size: 1,
			color: point.color || '#3b82f6',
			name: point.name
		}));

		globe.pointsData(pointsData);
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
