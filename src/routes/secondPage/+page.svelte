<script lang="ts">
	interface Props {
		data: {
			country: string;
			capital: string;
			error?: string;
			success?: boolean;
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

	// Reset loading state when form data changes (server response)
	$effect(() => {
		console.log(country)
		if (form) {
			isLoading = false;
		}
	});

	// Set loading state when form is about to submit

</script>

<h1>Country Capital Finder</h1>

<form method="POST" >
	<input
		type="text"
		name="country"
		placeholder="Enter a country"
		bind:value={country}
		autocomplete="off"
		required
		disabled={isLoading}
	/>
	<button type="submit" disabled={isLoading}>
		{#if isLoading}
			<span class="loading-spinner"></span>
			Getting Capital...
		{:else}
			Get Capital
		{/if}
	</button>
</form>

{#if error}
	<p class="error">{error}</p>
{/if}

{#if success}
	<p class="capital">Capital: {capital}</p>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		background: #f8f9fa;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	input {
		padding: 0.75rem;
		border: 2px solid #e9ecef;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}

	input:disabled {
		background-color: #f8f9fa;
		cursor: not-allowed;
		opacity: 0.6;
	}

	button {
		background: linear-gradient(135deg, #007bff, #0056b3);
		color: white;
		border: none;
		padding: 0.875rem 1.5rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
	}

	button:hover {
		background: linear-gradient(135deg, #0056b3, #004085);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
	}

	button:active {
		transform: translateY(0);
		box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
	}

	button:disabled {
		background: #6c757d;
		cursor: not-allowed;
		transform: none;
		box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2);
	}

	button:disabled:hover {
		background: #6c757d;
		transform: none;
		box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2);
	}

	.loading-spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid #ffffff;
		border-radius: 50%;
		border-top-color: transparent;
		animation: spin 1s ease-in-out infinite;
		margin-right: 8px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error {
		color: #dc3545;
		background: #f8d7da;
		border: 1px solid #f5c6cb;
		padding: 0.75rem;
		border-radius: 6px;
		margin-top: 1rem;
	}

	.capital {
		margin-top: 1rem;
		font-weight: bold;
		font-size: 1.2rem;
		color: #28a745;
		background: #d4edda;
		border: 1px solid #c3e6cb;
		padding: 0.75rem;
		border-radius: 6px;
		text-align: center;
	}

	h1 {
		text-align: center;
		color: #333;
		margin-bottom: 0.5rem;
	}
</style>
