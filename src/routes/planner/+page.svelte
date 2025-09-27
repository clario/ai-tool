<script lang="ts">
	import TravelGlobe from '$lib/components/TravelGlobe.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';

	let props = $props();

	console.log('Props:', props);

	// Test points
	let points = [
		{ lat: 40.7128, lng: -74.006, name: 'New York', color: '#3b82f6' },
		{ lat: 34.0522, lng: -118.2437, name: 'Los Angeles', color: '#ef4444' },
		{ lat: 51.5074, lng: -0.1278, name: 'London', color: '#10b981' }
	];

	// Chat messages
	let messages = $state([
		{
			id: 1,
			text: "Hello! I'm your AI travel assistant. How can I help you plan your trip?",
			type: 'ai'
		}
	]);

	// Track processed messages to avoid duplicates
	let processedMessages = $state(new Set());

	// Form state
	let messageInput = $state('');
	let isSubmitting = $state(false);

	function addRandomPoint() {
		const randomLat = (Math.random() - 0.5) * 180;
		const randomLng = (Math.random() - 0.5) * 360;
		const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

		points = [
			...points,
			{
				lat: randomLat,
				lng: randomLng,
				name: `Point ${points.length + 1}`,
				color: colors[Math.floor(Math.random() * colors.length)]
			}
		];
	}

	// Handle form submission with enhance
	function handleSubmit({ formElement, submitter, cancel }: any) {
		isSubmitting = true;
		// Reset form after submission
		return async ({ result, update }: any) => {
			isSubmitting = false;
		};
	}

	// Handle form result
	$effect(() => {
		const form = props.form;
		console.log('Form effect running, form:', form);
		if (form?.success && form.message) {
			const messageKey = `${form.message}-${form.aiResponse || 'no-ai'}`;

			// Check if we've already processed this message
			if (processedMessages.has(messageKey)) {
				console.log('Message already processed, skipping');
				return;
			}

			console.log('Adding messages, aiResponse:', form.aiResponse);

			// Mark as processed
			processedMessages.add(messageKey);

			// Add user message
			messages = [
				...messages,
				{
					id: Date.now(),
					text: form.message,
					type: 'user'
				}
			];

			// Add AI response from the action
			if (form.aiResponse) {
				messages = [
					...messages,
					{
						id: Date.now() + 1,
						text: form.aiResponse,
						type: 'ai'
					}
				];
			}
		}
	});
</script>

<!-- Full screen globe -->
<TravelGlobe
	features={[
		{
			type: 'Place',
			id: '1',
			name: 'New York',
			coordinates: {
				lat: 40.7128,
				lng: -74.006
			}
		},
		{
			type: 'Place',
			id: '2',
			name: 'Los Angeles',
			coordinates: {
				lat: 34.0522,
				lng: -118.2437
			}
		},
		{
			type: 'Route',
			fromId: '1',
			toId: '2',
			distance: 1000
		}
	]}
/>

<!-- Chat Interface at Bottom -->
<div class="fixed bottom-16 left-16 right-16 h-1/4">
	<div class="w-full mx-auto h-full max-w-5xl bg-white/90 backdrop-blur-md shadow-xl rounded-xl">
		<div class="p-4 h-full flex flex-col">
			<h2 class="text-lg font-semibold mb-3 text-gray-800">Travel Assistant</h2>

			<!-- Chat Messages -->
			<div class="flex-1 overflow-y-auto mb-3 p-2 rounded-lg space-y-2">
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
