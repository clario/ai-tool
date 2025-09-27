<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { Trip } from '$lib/db';

	let { data }: { data: { trips: Trip[] } } = $props();

	let deleteMessage = $state('');
	let isDeleting = $state<number | null>(null);

	function handleDelete({ formElement, submitter, cancel }: any) {
		const tripId = parseInt(formElement.querySelector('input[name="tripId"]').value);
		isDeleting = tripId;

		return async ({ result, update }: any) => {
			isDeleting = null;

			if (result.type === 'success') {
				deleteMessage = 'Trip deleted successfully!';
				// Invalidate all data to force reload
				await invalidateAll();
			} else {
				deleteMessage = 'Failed to delete trip. Please try again.';
			}

			setTimeout(() => {
				deleteMessage = '';
			}, 3000);
		};
	}

	function loadTrip(tripId: number) {
		goto(`/planner?load=${tripId}`);
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<Navbar
		additionalLinks={[
			{ href: '/planner', text: 'Planner' },
			{ href: '/saved-trips', text: 'Saved Trips' },
			{ href: '/secondPage', text: 'Country Capital Finder' }
		]}
	/>

	<div class="container mx-auto px-4 py-8 max-w-6xl">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Saved Trips</h1>
			<p class="text-gray-600">Manage your saved travel plans</p>
		</div>

		{#if deleteMessage}
			<div class="mb-4 p-4 rounded-lg {deleteMessage.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
				{deleteMessage}
			</div>
		{/if}

		{#if data.trips.length === 0}
			<div class="text-center py-12">
				<div class="text-gray-500 mb-4">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No saved trips yet</h3>
				<p class="text-gray-500 mb-4">Create a travel plan and save it to see it here.</p>
				<Button onclick={() => goto('/planner')}>Go to Planner</Button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.trips as trip}
					<Card class="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle class="text-lg">{trip.name}</CardTitle>
							{#if trip.description}
								<CardDescription>{trip.description}</CardDescription>
							{/if}
						</CardHeader>
						<CardContent>
							<div class="space-y-3">
								<div class="text-sm text-gray-600">
									<div class="flex justify-between">
										<span class="font-medium">Created:</span>
										<span>{formatDate(trip.created_at.toString())}</span>
									</div>
									<div class="flex justify-between">
										<span class="font-medium">Updated:</span>
										<span>{formatDate(trip.updated_at.toString())}</span>
									</div>
								</div>
								
								<div class="flex gap-2 pt-2">
									<Button 
										onclick={() => loadTrip(trip.id)} 
										class="flex-1"
									>
										Load Trip
									</Button>
									<form method="POST" action="?/deleteTrip" use:enhance={handleDelete} class="flex-1">
										<input type="hidden" name="tripId" value={trip.id} />
										<Button 
											type="submit" 
											variant="destructive" 
											disabled={isDeleting === trip.id}
											class="w-full"
										>
											{isDeleting === trip.id ? 'Deleting...' : 'Delete'}
										</Button>
									</form>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		{/if}
	</div>
</div>
