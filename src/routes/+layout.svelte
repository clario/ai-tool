<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Toaster from '$lib/components/ui/sonner/sonner.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar
	additionalLinks={[
		{ href: '/planner', text: 'Planner' },
		{ href: '/saved-trips', text: 'Saved Trips' },
		{ href: '/secondPage', text: 'Country Capital Finder' }
	]}
/>

<main class="pt-24">
	{@render children?.()}
</main>

<Toaster />
