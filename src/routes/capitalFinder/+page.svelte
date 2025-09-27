<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	interface AIResponse {
		id: number;
		country: string;
		capital: string;
		created_at: Date;
	}

	interface Props {
		data: {
			country: string;
			capital: string;
			error?: string;
			success?: boolean;
			allResponses?: AIResponse[];
		};
		form?: {
			success?: boolean;
			country?: string;
			capital?: string;
			error?: string;
		};
	}

	let { data, form }: Props = $props();

	// Use form data if available (from form submission), otherwise use loader data
	let country = $state(form?.country || data.country || '');
	let capital = $state(form?.capital || data.capital || '');
	let error = $state(form?.error || data.error || '');
	let success = $state(form?.success ?? data.success ?? false);
	let isLoading = $state(false);
	let searchQuery = $state('');
	let sortBy = $state<'country' | 'capital' | 'date'>('date');
	let showHistory = $state(true);

	// Reset loading state when form data changes (server response)
	$effect(() => {
		if (form) {
			isLoading = false;
		}
	});

	// Computed values
	const filteredResponses = $derived(
		(data.allResponses || [])
			.filter(
				(response) =>
					response.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
					response.capital.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.sort((a, b) => {
				switch (sortBy) {
					case 'country':
						return a.country.localeCompare(b.country);
					case 'capital':
						return a.capital.localeCompare(b.capital);
					case 'date':
						return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
					default:
						return 0;
				}
			})
	);

	// Set loading state when form is about to submit
	function handleSubmit() {
		isLoading = true;
	}

	function getCountryFlag(countryName: string): string {
		// Simple flag emoji mapping for common countries
		const flagMap: Record<string, string> = {
			'United States': '🇺🇸',
			'United Kingdom': '🇬🇧',
			France: '🇫🇷',
			Germany: '🇩🇪',
			Italy: '🇮🇹',
			Spain: '🇪🇸',
			Japan: '🇯🇵',
			China: '🇨🇳',
			India: '🇮🇳',
			Brazil: '🇧🇷',
			Canada: '🇨🇦',
			Australia: '🇦🇺',
			Russia: '🇷🇺',
			'South Korea': '🇰🇷',
			Mexico: '🇲🇽',
			Argentina: '🇦🇷',
			'South Africa': '🇿🇦',
			Egypt: '🇪🇬',
			Turkey: '🇹🇷',
			Poland: '🇵🇱',
			Netherlands: '🇳🇱',
			Belgium: '🇧🇪',
			Sweden: '🇸🇪',
			Norway: '🇳🇴',
			Denmark: '🇩🇰',
			Finland: '🇫🇮',
			Switzerland: '🇨🇭',
			Austria: '🇦🇹',
			Portugal: '🇵🇹',
			Greece: '🇬🇷',
			Ireland: '🇮🇪',
			'New Zealand': '🇳🇿',
			Thailand: '🇹🇭',
			Vietnam: '🇻🇳',
			Indonesia: '🇮🇩',
			Malaysia: '🇲🇾',
			Singapore: '🇸🇬',
			Philippines: '🇵🇭',
			Chile: '🇨🇱',
			Peru: '🇵🇪',
			Colombia: '🇨🇴',
			Venezuela: '🇻🇪',
			Cuba: '🇨🇺',
			Jamaica: '🇯🇲',
			'Costa Rica': '🇨🇷',
			Panama: '🇵🇦',
			Guatemala: '🇬🇹',
			Honduras: '🇭🇳',
			Nicaragua: '🇳🇮',
			'El Salvador': '🇸🇻',
			Belize: '🇧🇿',
			Uruguay: '🇺🇾',
			Paraguay: '🇵🇾',
			Bolivia: '🇧🇴',
			Ecuador: '🇪🇨',
			Guyana: '🇬🇾',
			Suriname: '🇸🇷',
			'French Guiana': '🇬🇫'
		};
		return flagMap[countryName] || '🌍';
	}

	function formatDate(dateString: string): string {
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
	<div class="container mx-auto px-4 py-8 max-w-6xl">
		<!-- Header Section -->
		<div class="text-center mb-12">
			<div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
				<svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
			</div>
			<h1 class="text-4xl font-bold text-gray-900 mb-4">Capital City Finder</h1>
			<p class="text-xl text-gray-600 max-w-2xl mx-auto">
				Discover the capital cities of countries around the world with our AI-powered search tool
			</p>
		</div>

		<!-- Search Form -->
		<Card class="max-w-2xl mx-auto mb-8">
			<CardHeader>
				<CardTitle class="text-2xl text-center">Find a Capital City</CardTitle>
				<CardDescription class="text-center">
					Enter any country name to discover its capital city
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form method="POST" use:enhance={handleSubmit} class="space-y-6">
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
						</div>
						<input
							type="text"
							name="country"
							placeholder="Enter a country name (e.g., France, Japan, Brazil)"
							bind:value={country}
							autocomplete="off"
							required
							disabled={isLoading}
							class="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
						/>
					</div>

					<Button
						type="submit"
						disabled={isLoading || !country.trim()}
						class="w-full py-4 text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
					>
						{#if isLoading}
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Finding Capital...
						{:else}
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
							Find Capital City
						{/if}
					</Button>
				</form>
			</CardContent>
		</Card>

		<!-- Results Section -->
		{#if error}
			<Card class="max-w-2xl mx-auto mb-8 border-red-200 bg-red-50">
				<CardContent class="pt-6">
					<div class="flex items-center">
						<svg class="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							></path>
						</svg>
						<span class="text-red-800 font-medium">{error}</span>
					</div>
				</CardContent>
			</Card>
		{/if}

		{#if success && capital}
			<Card class="max-w-2xl mx-auto mb-8 border-green-200 bg-green-50">
				<CardContent class="pt-6">
					<div class="text-center">
						<div class="text-6xl mb-4">{getCountryFlag(country)}</div>
						<h2 class="text-3xl font-bold text-gray-900 mb-2">{country}</h2>
						<div class="flex items-center justify-center gap-3">
							<svg
								class="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
							<span class="text-2xl font-semibold text-green-800">Capital: {capital}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- History Section -->
		{#if data.allResponses && data.allResponses.length > 0}
			<Card class="mb-8">
				<CardHeader>
					<div class="flex items-center justify-between">
						<div>
							<CardTitle class="text-2xl">Search History</CardTitle>
							<CardDescription>
								{data.allResponses.length} previous searches
							</CardDescription>
						</div>
						<Button
							onclick={() => (showHistory = !showHistory)}
							variant="outline"
							class="flex items-center gap-2"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
							{showHistory ? 'Hide' : 'Show'} History
						</Button>
					</div>
				</CardHeader>

				{#if showHistory}
					<CardContent>
						<!-- Search and Filter Controls -->
						<div class="mb-6 space-y-4">
							<div class="flex flex-col sm:flex-row gap-4">
								<div class="flex-1">
									<div class="relative">
										<svg
											class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											></path>
										</svg>
										<input
											type="text"
											placeholder="Search history..."
											bind:value={searchQuery}
											class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								</div>
								<div>
									<select
										bind:value={sortBy}
										class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									>
										<option value="date">Sort by Date</option>
										<option value="country">Sort by Country</option>
										<option value="capital">Sort by Capital</option>
									</select>
								</div>
							</div>
							{#if searchQuery}
								<div class="text-sm text-gray-600">
									Found {filteredResponses.length} result{filteredResponses.length !== 1 ? 's' : ''}
									matching "{searchQuery}"
								</div>
							{/if}
						</div>

						<!-- History Grid -->
						{#if filteredResponses.length === 0}
							<div class="text-center py-8">
								<svg
									class="mx-auto h-12 w-12 text-gray-400 mb-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									></path>
								</svg>
								<h3 class="text-lg font-medium text-gray-900 mb-2">No results found</h3>
								<p class="text-gray-500">Try adjusting your search terms.</p>
							</div>
						{:else}
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{#each filteredResponses as response}
									<div
										class="group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-white"
									>
										<div class="flex items-start gap-3">
											<div class="text-2xl flex-shrink-0">{getCountryFlag(response.country)}</div>
											<div class="flex-1 min-w-0">
												<div class="flex items-center gap-2 mb-1">
													<h3 class="font-semibold text-gray-900 truncate">{response.country}</h3>
													<div class="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
												</div>
												<div class="flex items-center gap-2 mb-2">
													<svg
														class="w-4 h-4 text-blue-500 flex-shrink-0"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
														></path>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
														></path>
													</svg>
													<span class="text-blue-600 font-medium">{response.capital}</span>
												</div>
												<div class="text-xs text-gray-500">
													{formatDate(response.created_at.toString())}
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</CardContent>
				{/if}
			</Card>
		{/if}

		<!-- Empty State -->
		{#if !data.allResponses || data.allResponses.length === 0}
			<Card class="max-w-2xl mx-auto">
				<CardContent class="pt-6">
					<div class="text-center py-8">
						<div
							class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
						>
							<svg
								class="w-8 h-8 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								></path>
							</svg>
						</div>
						<h3 class="text-lg font-medium text-gray-900 mb-2">No search history yet</h3>
						<p class="text-gray-500">Start by searching for a country's capital city above!</p>
					</div>
				</CardContent>
			</Card>
		{/if}
	</div>
</div>
