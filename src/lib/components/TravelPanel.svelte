<script lang="ts">
	import { type PlaceSchema, type RouteSchema } from '$lib/ai/schemas';

	interface MappedRoute extends RouteSchema {
		from: PlaceSchema;
		to: PlaceSchema;
	}

	let { features }: { features: Array<PlaceSchema | RouteSchema> } = $props();
</script>

<p>Panel</p>
