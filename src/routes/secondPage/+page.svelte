<script lang="ts">
	export let data: {
		country: string;
		capital: string;
		error?: string;
		success?: boolean;
	};
	export let form:
		| {
				success?: boolean;
				country?: string;
				capital?: string;
				error?: string;
		  }
		| undefined;

	// Use form data if available (from form submission), otherwise use loader data
	let country = form?.country || data.country || '';
	let capital = form?.capital || data.capital || '';
	let error = form?.error || data.error || '';
	let success = form?.success ?? data.success ?? false;
</script>

<h1>Country Capital Finder</h1>

<form method="POST">
	<input
		type="text"
		name="country"
		placeholder="Enter a country"
		bind:value={country}
		autocomplete="off"
		required
	/>
	<button type="button">Get Capital</button>
</form>

{#if error}
	<p class="error">{error}</p>
{/if}

{#if success}
	<p class="capital">Capital: {capital}</p>
{/if}

<style>
	.error {
		color: red;
	}
	.capital {
		margin-top: 1rem;
		font-weight: bold;
	}
</style>
