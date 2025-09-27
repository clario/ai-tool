<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	// Props for customization
	let {
		showSignIn = true,
		showGetStarted = true,
		additionalLinks = []
	} = $props<{
		showSignIn?: boolean;
		showGetStarted?: boolean;
		additionalLinks?: Array<{ href: string; text: string }>;
	}>();

	// Default navigation links
	const defaultLinks: Array<{ href: string; text: string }> = [];

	// Combine default and additional links
	const allLinks = [...defaultLinks, ...additionalLinks];
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-white/80 backdrop-blur-md border-b border-gray-200/50 w-full"
	style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 50 !important;"
>
	<div class="max-w-7xl mx-auto flex items-center justify-between">
		<a href="/" class="flex items-center space-x-3">
			<div class="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
				<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<span
				class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
				>TravelAI</span
			>
		</a>
		<div class="hidden md:flex items-center space-x-8">
			{#each allLinks as link}
				<a href={link.href} class="text-gray-600 hover:text-gray-900 transition-colors font-medium">
					{link.text}
				</a>
			{/each}
			{#if showSignIn}
				<Button variant="ghost" class="font-medium">Sign In</Button>
			{/if}
			{#if showGetStarted}
				<Button
					class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
				>
					Get Started Free
				</Button>
			{/if}
		</div>
	</div>
</nav>
