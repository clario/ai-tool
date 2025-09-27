<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PlaceSchema, RouteSchema } from '$lib/ai/schemas';
	import TravelGlobe from '$lib/components/TravelGlobe.svelte';
	import TravelPanel from '$lib/components/TravelPanel.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ModelMessage } from 'ai';
	import { onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';

	let {
		data
	}: { data: { loadedTrip?: { name: string; places: PlaceSchema[]; routes: RouteSchema[] } } } =
		$props();

	// Chat messages
	let messages = $state<ModelMessage[]>([
		{
			content: "Hello! I'm your AI travel assistant. How can I help you plan your trip?",
			role: 'assistant'
		}
	]);

	let tripPlaces = $state<Array<PlaceSchema>>([]);
	let tripRoutes = $state<Array<RouteSchema>>([]);

	// Load trip data if provided
	onMount(() => {
		if (data.loadedTrip) {
			tripPlaces = data.loadedTrip.places;
			tripRoutes = data.loadedTrip.routes;
			messages = [
				{
					content: `Loaded trip: ${data.loadedTrip.name}`,
					role: 'assistant'
				}
			];
		}
	});

	// Start date state - default to today
	let startDate = $state(new Date().toISOString().split('T')[0]);

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
	let isSaving = $state(false);
	let globeRef: TravelGlobe | null = null;

	// Handle form submission with enhance
	function handleSubmit({ formElement, submitter, cancel }: any) {
		isSubmitting = true;
		// Reset form after submission
		messages.push({
			content: messageInput,
			role: 'user'
		});

		messageInput = '';
		document.getElementById('message')?.focus();

		scrollMessagesToBottom();

		return async ({ result, update }: any) => {
			console.log(result);
			isSubmitting = false;
			messageInput = ''; // Clear input

			if (result.type === 'success') {
				result.data.aiResponse.forEach((toolCall: any) => {
					if (toolCall.toolName === 'setTravelPlan') {
						const { places, routes } = toolCall.input;
						tripPlaces = places;
						tripRoutes = routes;
						messages.push({
							content: toolCall.input.response,
							role: 'assistant'
						});
					} else if (toolCall.toolName === 'response') {
						messages.push({
							content: toolCall.input.response,
							role: 'assistant'
						});
					}
					scrollMessagesToBottom();
				});
			}
		};
	}

	// Handle save trip
	function handleSaveTrip({ formElement, submitter, cancel }: any) {
		isSaving = true;

		return async ({ result, update }: any) => {
			isSaving = false;

			if (result.type === 'success') {
				toast.success('Trip saved successfully!', {
					description: 'Your travel plan has been saved and can be accessed later.',
					duration: 4000
				});
			} else {
				toast.error('Failed to save trip', {
					description: 'Please try again. If the problem persists, check your connection.',
					duration: 4000
				});
			}
		};
	}

	function handleZoom(place: PlaceSchema) {
		globeRef.zoomToLocation(place);
	}
</script>



<!-- Full screen globe -->
<TravelGlobe places={tripPlaces} routes={tripRoutes} bind:this={globeRef} />
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<!-- Full screen globe -->

	<!-- Chat Interface at Bottom -->
	<div class="fixed bottom-16 left-16 right-16 h-1/4">
		<div
			class="w-full mx-auto h-full max-w-5xl bg-white/90 backdrop-blur-md shadow-xl rounded-xl overflow-hidden"
		>
			<div class="p-4 pt-0 h-full flex flex-col">
				<!-- Chat Messages -->
				<div
					class="flex-1 overflow-y-auto px-6 rounded-lg space-y-2 -mx-4 pt-6 pb-4"
					bind:this={messagesContainer}
				>
					{#each messages as message}
						<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
							<div
								class="max-w-xs px-3 py-2 rounded-lg {message.role === 'user'
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 text-gray-800'}"
							>
								{message.content}
							</div>
						</div>
					{/each}

					<!-- AI Loading Indicator -->
					{#if isSubmitting}
						<div class="flex justify-start">
							<div class="max-w-xs px-4 py-4 rounded-lg bg-gray-200 text-gray-800">
								<div class="flex space-x-1">
									<div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
									<div
										class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
										style="animation-delay: 0.1s"
									></div>
									<div
										class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
										style="animation-delay: 0.2s"
									></div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Input -->
				<div class="flex gap-2">
					<form method="POST" use:enhance={handleSubmit} action="?/chat" class="flex gap-2 w-full">
						<input type="hidden" name="messages" value={JSON.stringify(messages)} />
						<input type="hidden" name="tripPlaces" value={JSON.stringify(tripPlaces)} />
						<input type="hidden" name="tripRoutes" value={JSON.stringify(tripRoutes)} />
						<input
							name="message"
							id="message"
							type="text"
							placeholder="Ask about your travel plans..."
							class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={isSubmitting}
							bind:value={messageInput}
						/>
						<Button type="submit" disabled={isSubmitting} class="h-full self-center">Send</Button>
					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Sidebar - Travel Plan -->
	{#if tripPlaces.length > 0 && tripRoutes.length > 0}
		<form method="POST" use:enhance={handleSaveTrip} action="?/saveTrip">
			<input type="hidden" name="tripPlaces" value={JSON.stringify(tripPlaces)} />
			<input type="hidden" name="tripRoutes" value={JSON.stringify(tripRoutes)} />
			<TravelPanel places={tripPlaces} routes={tripRoutes} {startDate} saveIsPending={isSaving} zoomToPlace={handleZoom} />
		</form>
	{/if}
</div>
