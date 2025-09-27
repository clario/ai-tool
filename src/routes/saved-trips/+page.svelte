<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { Trip } from '$lib/db';

	interface TripWithDetails extends Trip {
		placesCount: number;
		routesCount: number;
		firstPlace: string | null;
	}

	let { data }: { data: { trips: TripWithDetails[] } } = $props();

	let deleteMessage = $state('');
	let isDeleting = $state<number | null>(null);
	let searchQuery = $state('');
	let sortBy = $state<'name' | 'created' | 'updated' | 'places'>('updated');
	let showDeleteConfirm = $state<number | null>(null);
	let editingTrip = $state<number | null>(null);
	let editName = $state('');
	let editDescription = $state('');
	let isUpdating = $state<number | null>(null);

	// Computed values
	const filteredTrips = $derived(
		data.trips
			.filter(trip => 
				trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(trip.firstPlace && trip.firstPlace.toLowerCase().includes(searchQuery.toLowerCase()))
			)
			.sort((a, b) => {
				switch (sortBy) {
					case 'name':
						return a.name.localeCompare(b.name);
					case 'created':
						return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
					case 'updated':
						return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
					case 'places':
						return b.placesCount - a.placesCount;
					default:
						return 0;
				}
			})
	);

	function handleDelete({ formElement, submitter, cancel }: any) {
		const tripId = parseInt(formElement.querySelector('input[name="tripId"]').value);
		isDeleting = tripId;
		showDeleteConfirm = null;

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

	function confirmDelete(tripId: number) {
		showDeleteConfirm = tripId;
	}

	function cancelDelete() {
		showDeleteConfirm = null;
	}

	function startEdit(trip: TripWithDetails) {
		editingTrip = trip.id;
		editName = trip.name;
		editDescription = trip.description || '';
	}

	function cancelEdit() {
		editingTrip = null;
		editName = '';
		editDescription = '';
	}

	function handleUpdate({ formElement, submitter, cancel }: any) {
		const tripId = parseInt(formElement.querySelector('input[name="tripId"]').value);
		isUpdating = tripId;

		return async ({ result, update }: any) => {
			isUpdating = null;

			if (result.type === 'success') {
				editingTrip = null;
				editName = '';
				editDescription = '';
				deleteMessage = 'Trip updated successfully!';
				// Invalidate all data to force reload
				await invalidateAll();
			} else {
				deleteMessage = 'Failed to update trip. Please try again.';
			}

			setTimeout(() => {
				deleteMessage = '';
			}, 3000);
		};
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

	function formatRelativeDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
		
		if (diffInDays === 0) return 'Today';
		if (diffInDays === 1) return 'Yesterday';
		if (diffInDays < 7) return `${diffInDays} days ago`;
		if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<div class="container mx-auto px-4 py-8 max-w-7xl">
		<!-- Header Section -->
		<div class="mb-8">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 class="text-4xl font-bold text-gray-900 mb-2">Saved Trips</h1>
					<p class="text-gray-600">Manage and organize your travel plans</p>
				</div>
				<div class="flex gap-2">
					<Button onclick={() => goto('/planner')} class="bg-blue-600 hover:bg-blue-700">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
						</svg>
						New Trip
					</Button>
				</div>
			</div>
		</div>

		<!-- Search and Filter Section -->
		{#if data.trips.length > 0}
			<div class="mb-6 bg-white rounded-lg shadow-sm border p-4">
				<div class="flex flex-col sm:flex-row gap-4">
					<div class="flex-1">
						<div class="relative">
							<svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
							<input
								type="text"
								placeholder="Search trips by name, description, or places..."
								bind:value={searchQuery}
								class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
					<div class="flex gap-2">
						<select bind:value={sortBy} class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="updated">Last Updated</option>
							<option value="created">Date Created</option>
							<option value="name">Name</option>
							<option value="places">Most Places</option>
						</select>
					</div>
				</div>
				{#if searchQuery}
					<div class="mt-2 text-sm text-gray-600">
						Found {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''} matching "{searchQuery}"
					</div>
				{/if}
			</div>
		{/if}

		<!-- Status Messages -->
		{#if deleteMessage}
			<div
				class="mb-4 p-4 rounded-lg {deleteMessage.includes('successfully')
					? 'bg-green-100 text-green-800 border border-green-200'
					: 'bg-red-100 text-red-800 border border-red-200'}"
			>
				<div class="flex items-center">
					<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
						{#if deleteMessage.includes('successfully')}
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
						{:else}
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
						{/if}
					</svg>
					{deleteMessage}
				</div>
			</div>
		{/if}

		<!-- Empty State -->
		{#if data.trips.length === 0}
			<div class="text-center py-16">
				<div class="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
					<svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-semibold text-gray-900 mb-3">No saved trips yet</h3>
				<p class="text-gray-500 mb-8 max-w-md mx-auto">Start planning your next adventure! Create a travel plan and save it to see it here.</p>
				<Button onclick={() => goto('/planner')} class="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
					</svg>
					Create Your First Trip
				</Button>
			</div>
		{:else if filteredTrips.length === 0}
			<div class="text-center py-12">
				<div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
					<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
				<p class="text-gray-500 mb-4">Try adjusting your search terms or filters.</p>
				<Button onclick={() => searchQuery = ''} variant="outline">Clear Search</Button>
			</div>
		{:else}
			<!-- Trips Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{#each filteredTrips as trip}
					<Card class="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
						<CardHeader class="pb-3">
							{#if editingTrip === trip.id}
								<!-- Edit Mode -->
								<form
									method="POST"
									action="?/updateTrip"
									use:enhance={handleUpdate}
									class="space-y-3"
								>
									<input type="hidden" name="tripId" value={trip.id} />
									<div>
										<label for="edit-name-{trip.id}" class="block text-sm font-medium text-gray-700 mb-1">
											Trip Name
										</label>
										<input
											id="edit-name-{trip.id}"
											type="text"
											name="name"
											bind:value={editName}
											required
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											placeholder="Enter trip name"
										/>
									</div>
									<div>
										<label for="edit-description-{trip.id}" class="block text-sm font-medium text-gray-700 mb-1">
											Description (Optional)
										</label>
										<textarea
											id="edit-description-{trip.id}"
											name="description"
											bind:value={editDescription}
											rows="2"
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
											placeholder="Enter trip description"
										></textarea>
									</div>
									<div class="flex gap-2">
										<Button
											type="submit"
											disabled={isUpdating === trip.id}
											class="flex-1 bg-blue-600 hover:bg-blue-700"
										>
											{isUpdating === trip.id ? 'Saving...' : 'Save'}
										</Button>
										<Button
											type="button"
											onclick={() => cancelEdit()}
											variant="outline"
											class="flex-1"
										>
											Cancel
										</Button>
									</div>
								</form>
							{:else}
								<!-- View Mode -->
								<div class="flex items-start justify-between">
									<div class="flex-1 min-w-0">
										<CardTitle class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
											{trip.name}
										</CardTitle>
										{#if trip.description}
											<CardDescription class="mt-1 text-sm text-gray-600 line-clamp-2">
												{trip.description}
											</CardDescription>
										{/if}
									</div>
									<div class="ml-2 flex-shrink-0">
										<div class="w-2 h-2 bg-green-400 rounded-full"></div>
									</div>
								</div>
							{/if}
						</CardHeader>
						
						{#if editingTrip !== trip.id}
							<CardContent class="pt-0">
								<!-- Trip Stats -->
								<div class="flex items-center gap-4 mb-4 text-sm text-gray-600">
									<div class="flex items-center gap-1">
										<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
										<span class="font-medium">{trip.placesCount}</span>
										<span class="text-gray-500">places</span>
									</div>
						
								</div>

								<!-- First Place Preview -->
								{#if trip.firstPlace}
									<div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
										<div class="flex items-center gap-2 text-sm">
											<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											</svg>
											<span class="text-blue-800 font-medium">Starting point:</span>
											<span class="text-blue-700">{trip.firstPlace}</span>
										</div>
									</div>
								{/if}

								<!-- Date Info -->
								<div class="text-xs text-gray-500 mb-4">
									<div class="flex justify-between">
										<span>Updated {formatRelativeDate(trip.updated_at.toString())}</span>
										<span>Created {formatRelativeDate(trip.created_at.toString())}</span>
									</div>
								</div>

								<!-- Action Buttons -->
								<div class="flex gap-2">
									<Button 
										onclick={() => loadTrip(trip.id)} 
										class="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
									>
										<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
										</svg>
										Load Trip
									</Button>
									
									<Button
										onclick={() => startEdit(trip)}
										variant="outline"
										class="px-3 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
										</svg>
									</Button>
									
									{#if showDeleteConfirm === trip.id}
										<div class="flex gap-1">
											<Button
												onclick={() => cancelDelete()}
												variant="outline"
												class="px-3"
											>
												Cancel
											</Button>
											<form
												method="POST"
												action="?/deleteTrip"
												use:enhance={handleDelete}
											>
												<input type="hidden" name="tripId" value={trip.id} />
												<Button
													type="submit"
													variant="destructive"
													disabled={isDeleting === trip.id}
													class="px-3"
												>
													{isDeleting === trip.id ? 'Deleting...' : 'Confirm'}
												</Button>
											</form>
										</div>
									{:else}
										<Button
											onclick={() => confirmDelete(trip.id)}
											variant="outline"
											disabled={isDeleting === trip.id}
											class="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
											</svg>
										</Button>
									{/if}
								</div>
							</CardContent>
						{/if}
					</Card>
				{/each}
			</div>

			<!-- Results Summary -->
			{#if data.trips.length > 0}
				<div class="mt-8 text-center text-sm text-gray-500">
					Showing {filteredTrips.length} of {data.trips.length} trips
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
