<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PlaceSchema, RouteSchema } from '$lib/ai/schemas';
	import TravelGlobe from '$lib/components/TravelGlobe.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { tick } from 'svelte';

	// Chat messages
	let messages = $state([
		{
			id: 1,
			text: "Hello! I'm your AI travel assistant. How can I help you plan your trip?",
			type: 'ai'
		}
	]);

	let tripPlaces = $state<Array<PlaceSchema>>([]);
	let tripRoutes = $state<Array<RouteSchema>>([]);

	let messagesContainer: HTMLDivElement | null = null;

	async function scrollMessagesToBottom() {
		await tick();
		messagesContainer?.scrollTo({
			top: messagesContainer.scrollHeight,
			behavior: 'smooth'
		});
	}

	// Form state
	let messageInput = $state('');
	let isSubmitting = $state(false);

	// Handle form submission with enhance
	function handleSubmit({ formElement, submitter, cancel }: any) {
		isSubmitting = true;
		// Reset form after submission
		messages.push({
			id: Date.now(),
			text: messageInput,
			type: 'user'
		});
		scrollMessagesToBottom();

		return async ({ result, update }: any) => {
			isSubmitting = false;
			messageInput = ''; // Clear input
			console.log('result', result);

			if (result.type === 'success') {
				result.data.aiResponse.forEach((toolCall: any) => {
					if (toolCall.toolName === 'setTravelPlan') {
						const { places, routes } = toolCall.input.data;
						tripPlaces = places;
						tripRoutes = routes;
					} else if (toolCall.toolName === 'response') {
						messages.push({
							id: Date.now() + 1,
							text: toolCall.input.response,
							type: 'ai'
						});
						scrollMessagesToBottom();
					}
				});
			}
		};
	}
</script>

<!-- Full screen globe -->
<TravelGlobe places={tripPlaces} routes={tripRoutes} />
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<Navbar
		additionalLinks={[
			{ href: '/planner', text: 'Planner' },
			{ href: '/secondPage', text: 'Country Capital Finder' }
		]}
	/>

	<!-- Full screen globe -->

	<!-- Chat Interface at Bottom -->
	<div class="fixed bottom-16 left-16 right-16 h-1/4">
		<div class="w-full mx-auto h-full max-w-5xl bg-white/90 backdrop-blur-md shadow-xl rounded-xl">
			<div class="p-4 h-full flex flex-col">
				<h2 class="text-lg font-semibold mb-3 text-gray-800">Travel Assistant</h2>

				<!-- Chat Messages -->
				<div
					class="flex-1 overflow-y-auto mb-3 p-2 rounded-lg space-y-2"
					bind:this={messagesContainer}
				>
					{#each messages as message}
						<div class="flex {message.type === 'user' ? 'justify-end' : 'justify-start'}">
							<div
								class="max-w-xs px-3 py-2 rounded-lg {message.type === 'user'
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 text-gray-800'}"
							>
								{message.text}
							</div>
						</div>
					{/each}
				</div>

				<!-- Input -->
				<div class="flex gap-2">
					<form method="POST" use:enhance={handleSubmit} class="flex gap-2 w-full">
						<input
							name="message"
							type="text"
							placeholder="Ask about your travel plans..."
							class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={isSubmitting}
							bind:value={messageInput}
						/>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Sending...' : 'Send'}
						</Button>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
