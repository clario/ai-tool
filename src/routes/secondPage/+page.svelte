<script lang="ts">
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

	// Reset loading state when form data changes (server response)
	$effect(() => {
		console.log(country);
		if (form) {
			isLoading = false;
		}
	});

	// Set loading state when form is about to submit
</script>


<form method="POST">
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

{#if data.allResponses && data.allResponses.length > 0}
	<div class="responses-section">
		<h2>Previous Responses</h2>
		<div class="responses-grid">
			{#each data.allResponses as response}
				<div class="response-card">
					<div class="response-country">{response.country}</div>
					<div class="response-capital">{response.capital}</div>
					<div class="response-date">
						{new Date(response.created_at).toLocaleDateString()}
					</div>
				</div>
			{/each}
		</div>
	</div>
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

	.responses-section {
		margin-top: 3rem;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}

	.responses-section h2 {
		text-align: center;
		color: #333;
		margin-bottom: 2rem;
		font-size: 1.5rem;
	}

	.responses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.response-card {
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 8px;
		padding: 1rem;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.response-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.response-country {
		font-weight: bold;
		font-size: 1.1rem;
		color: #007bff;
		margin-bottom: 0.5rem;
	}

	.response-capital {
		font-size: 1rem;
		color: #28a745;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.response-date {
		font-size: 0.85rem;
		color: #6c757d;
		font-style: italic;
	}
</style>
