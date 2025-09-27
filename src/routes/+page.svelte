<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
</script>

<svelte:head>
	<title>TravelAI - AI-Powered Travel Planning with 3D Globe</title>
	<meta
		name="description"
		content="Plan your perfect trip with AI-powered travel assistance and interactive 3D globe visualization."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
	<!-- Navigation -->
	<nav class="relative z-50 px-6 py-6 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
		<div class="max-w-7xl mx-auto flex items-center justify-between">
			<div class="flex items-center space-x-3">
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
			</div>
			<div class="hidden md:flex items-center space-x-8">
				<a href="#features" class="text-gray-600 hover:text-gray-900 transition-colors font-medium"
					>Features</a
				>
				<a
					href="#how-it-works"
					class="text-gray-600 hover:text-gray-900 transition-colors font-medium">How it Works</a
				>
				<Button variant="ghost" class="font-medium">Sign In</Button>
				<Button
					class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
				>
					Get Started Free
				</Button>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative px-6 py-24 overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
		<div class="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>

		<div class="relative max-w-7xl mx-auto">
			<div class="grid lg:grid-cols-2 gap-16 items-center">
				<div class="space-y-8">
					<div class="space-y-6">
						<Badge
							variant="secondary"
							class="w-fit bg-blue-100 text-blue-700 border-blue-200 px-4 py-2"
						>
							<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							AI-Powered Travel Planning
						</Badge>
						<h1 class="text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
							Plan Your Perfect
							<span
								class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
							>
								Adventure
							</span>
						</h1>
						<p class="text-xl text-gray-600 leading-relaxed max-w-lg">
							Discover destinations, plan routes, and get weather insights with our AI-powered
							travel assistant. Visualize your journey on an interactive 3D globe in real-time.
						</p>
					</div>

					<div class="flex flex-col sm:flex-row gap-4">
						<Button
							href="/planner"
							size="lg"
							class="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
						>
							Start Planning Now
							<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</Button>
						<Button variant="outline" size="lg" class="text-lg px-8 py-6 border-2 hover:bg-gray-50">
							<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
								/>
							</svg>
							Watch Demo
						</Button>
					</div>

					<div class="flex items-center space-x-8 text-sm text-gray-500">
						<div class="flex items-center">
							<svg
								class="h-4 w-4 mr-2 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							<span class="font-medium">10,000+ travelers</span>
						</div>
						<div class="flex items-center">
							<svg class="h-4 w-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								/>
							</svg>
							<span class="font-medium">4.9/5 rating</span>
						</div>
						<div class="flex items-center">
							<svg
								class="h-4 w-4 mr-2 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
							<span class="font-medium">Secure & Private</span>
						</div>
					</div>
				</div>

				<!-- 3D Globe Preview -->
				<div class="relative">
					<div
						class="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-2xl border border-white/50"
					>
						<div
							class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center relative overflow-hidden"
						>
							<div
								class="w-48 h-48 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center shadow-inner"
							>
								<svg
									class="h-24 w-24 text-blue-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>

							<!-- Floating pins -->
							<div
								class="absolute top-8 left-8 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse"
							>
								<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
									/>
								</svg>
							</div>
							<div
								class="absolute top-16 right-12 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse"
								style="animation-delay: 0.5s;"
							>
								<svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
									/>
								</svg>
							</div>
							<div
								class="absolute bottom-12 left-12 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse"
								style="animation-delay: 1s;"
							>
								<svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
									/>
								</svg>
							</div>

							<!-- Route lines -->
							<svg class="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
								<path
									d="M50 50 Q100 30 150 80"
									stroke="#3B82F6"
									stroke-width="2"
									fill="none"
									stroke-dasharray="5,5"
									class="animate-pulse"
								/>
								<path
									d="M50 50 Q100 100 120 150"
									stroke="#10B981"
									stroke-width="2"
									fill="none"
									stroke-dasharray="5,5"
									class="animate-pulse"
									style="animation-delay: 0.5s;"
								/>
							</svg>
						</div>
					</div>

					<!-- Floating elements -->
					<div
						class="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce"
					>
						<svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
					</div>
					<div
						class="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl animate-pulse"
					>
						<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
							/>
						</svg>
					</div>
					<div
						class="absolute top-1/2 -right-8 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-ping"
					>
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="py-24 px-6 bg-white">
		<div class="max-w-7xl mx-auto">
			<div class="text-center space-y-4 mb-16">
				<Badge variant="outline" class="w-fit mx-auto">Features</Badge>
				<h2 class="text-4xl lg:text-5xl font-bold text-gray-900">
					Everything you need to plan the perfect trip
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Our AI-powered platform combines cutting-edge technology with intuitive design to make
					travel planning effortless.
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				<Card class="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
					<CardHeader class="p-0 mb-6">
						<div
							class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4"
						>
							<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<CardTitle class="text-xl">3D Globe Visualization</CardTitle>
					</CardHeader>
					<CardContent class="p-0">
						<CardDescription class="text-gray-600 leading-relaxed">
							Explore destinations on an interactive 3D globe. See your route, weather patterns, and
							points of interest in real-time.
						</CardDescription>
					</CardContent>
				</Card>

				<Card class="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
					<CardHeader class="p-0 mb-6">
						<div
							class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4"
						>
							<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
						<CardTitle class="text-xl">AI Conversation</CardTitle>
					</CardHeader>
					<CardContent class="p-0">
						<CardDescription class="text-gray-600 leading-relaxed">
							Chat with our AI assistant to get personalized recommendations, route suggestions, and
							travel insights.
						</CardDescription>
					</CardContent>
				</Card>

				<Card class="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
					<CardHeader class="p-0 mb-6">
						<div
							class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4"
						>
							<svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
								/>
							</svg>
						</div>
						<CardTitle class="text-xl">Smart Routing</CardTitle>
					</CardHeader>
					<CardContent class="p-0">
						<CardDescription class="text-gray-600 leading-relaxed">
							Get optimized routes between destinations with real-time traffic data and multiple
							transportation options.
						</CardDescription>
					</CardContent>
				</Card>

				<Card class="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
					<CardHeader class="p-0 mb-6">
						<div
							class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4"
						>
							<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<CardTitle class="text-xl">Weather Integration</CardTitle>
					</CardHeader>
					<CardContent class="p-0">
						<CardDescription class="text-gray-600 leading-relaxed">
							Get accurate weather forecasts for your travel dates and destinations to pack
							perfectly.
						</CardDescription>
					</CardContent>
				</Card>

				<Card class="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
					<CardHeader class="p-0 mb-6">
						<div
							class="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4"
						>
							<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<CardTitle class="text-xl">Mobile Optimized</CardTitle>
					</CardHeader>
					<CardContent class="p-0">
						<CardDescription class="text-gray-600 leading-relaxed">
							Access your travel plans anywhere with our mobile-optimized interface and offline
							capabilities.
						</CardDescription>
					</CardContent>
				</Card>

				<Card class="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
					<CardHeader class="p-0 mb-6">
						<div
							class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4"
						>
							<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<CardTitle class="text-xl">Real-time Updates</CardTitle>
					</CardHeader>
					<CardContent class="p-0">
						<CardDescription class="text-gray-600 leading-relaxed">
							Get instant updates on flight changes, weather alerts, and route optimizations as you
							travel.
						</CardDescription>
					</CardContent>
				</Card>
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section id="how-it-works" class="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
		<div class="max-w-7xl mx-auto">
			<div class="text-center space-y-4 mb-16">
				<Badge variant="outline" class="w-fit mx-auto">How It Works</Badge>
				<h2 class="text-4xl lg:text-5xl font-bold text-gray-900">
					Plan your trip in 3 simple steps
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Our AI-powered platform makes travel planning effortless and fun.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-12">
				<div class="text-center space-y-6">
					<div
						class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold"
					>
						1
					</div>
					<h3 class="text-2xl font-bold text-gray-900">Start a Conversation</h3>
					<p class="text-gray-600 leading-relaxed">
						Tell our AI assistant about your travel preferences, dates, and interests. It will ask
						questions to understand your needs better.
					</p>
				</div>

				<div class="text-center space-y-6">
					<div
						class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold"
					>
						2
					</div>
					<h3 class="text-2xl font-bold text-gray-900">See Your Route</h3>
					<p class="text-gray-600 leading-relaxed">
						Watch as destinations appear on the 3D globe and routes are drawn between them. Get
						weather data and local insights for each location.
					</p>
				</div>

				<div class="text-center space-y-6">
					<div
						class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold"
					>
						3
					</div>
					<h3 class="text-2xl font-bold text-gray-900">Refine & Travel</h3>
					<p class="text-gray-600 leading-relaxed">
						Adjust your itinerary through conversation, export your plans, and enjoy your perfectly
						planned adventure!
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-24 px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
		<div class="max-w-4xl mx-auto text-center space-y-8">
			<h2 class="text-4xl lg:text-5xl font-bold text-white">Ready to plan your next adventure?</h2>
			<p class="text-xl text-blue-100 max-w-2xl mx-auto">
				Join thousands of travelers who are already using TravelAI to discover amazing destinations
				and create unforgettable memories.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button
					size="lg"
					class="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
				>
					Start Planning Free
					<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</Button>
				<Button
					variant="outline"
					size="lg"
					class="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10"
				>
					Schedule Demo
				</Button>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="py-12 px-6 bg-gray-900">
		<div class="max-w-7xl mx-auto">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-3">
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
					<span class="text-2xl font-bold text-white">TravelAI</span>
				</div>
				<p class="text-gray-400">© 2024 TravelAI. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>
