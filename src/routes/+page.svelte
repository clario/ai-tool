<script>
	import TravelGlobe from '$lib/components/TravelGlobe.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	// Test points
	let points = [
		{ lat: 40.7128, lng: -74.0060, name: 'New York', color: '#3b82f6' },
		{ lat: 34.0522, lng: -118.2437, name: 'Los Angeles', color: '#ef4444' },
		{ lat: 51.5074, lng: -0.1278, name: 'London', color: '#10b981' }
	];

	function addRandomPoint() {
		const randomLat = (Math.random() - 0.5) * 180;
		const randomLng = (Math.random() - 0.5) * 360;
		const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
		
		points = [...points, {
			lat: randomLat,
			lng: randomLng,
			name: `Point ${points.length + 1}`,
			color: colors[Math.floor(Math.random() * colors.length)]
		}];
	}

	function clearPoints() {
		points = [];
	}
</script>

<!-- Full screen globe -->
<TravelGlobe {points} />

<!-- Chat Interface at Bottom -->
<div class="fixed bottom-16 left-16 right-16 h-1/4 ">
    <div class="w-full mx-auto h-full max-w-5xl bg-white/90 backdrop-blur-md shadow-xl rounded-xl">
        <div class="p-4 h-full flex flex-col">
            <h2 class="text-lg font-semibold mb-3 text-gray-800">Travel Assistant</h2>
            
            <!-- Chat Messages -->
            <div class="flex-1 overflow-y-auto mb-3 p-2 rounded-lg">
                <div class="text-sm text-gray-600">Chat messages will appear here...</div>
            </div>
            
            <!-- Input -->
            <div class="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Ask about your travel plans..." 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button>
                    Send
                </Button>
            </div>
        </div>
    </div>
</div>
