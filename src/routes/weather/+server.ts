import { json, error } from '@sveltejs/kit';
import { getWeatherConditionFromSymbol, type WeatherData } from '$lib/weather/types';

export const GET = async ({ url }: { url: URL }) => {
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	if (!lat || !lon) {
		throw error(400, 'Missing lat or lon parameter');
	}

	const apiUrl = new URL('https://api.met.no/weatherapi/locationforecast/2.0/compact');
	apiUrl.searchParams.set('lat', lat);
	apiUrl.searchParams.set('lon', lon);

	try {
		const res = await fetch(apiUrl.toString(), {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!res.ok) {
			const body = await res.text();
			console.error('Yr API error:', body);
			throw error(res.status, `Yr API error: ${res.statusText}`);
		}

		const data = await res.json();

		// Optionally simplify the response here
		const current = data.properties.timeseries[0];
		const details = current.data.instant.details;

		// Get symbol code from next 1 hour forecast (more accurate than instant)
		const symbolCode = current.data.next_1_hours?.summary?.symbol_code || 'partlycloudy';

		// Determine weather condition from symbol code
		const condition = getWeatherConditionFromSymbol(symbolCode);

		const weatherData: WeatherData = {
			time: current.time,
			temperature: details.air_temperature,
			wind_speed: details.wind_speed,
			humidity: details.relative_humidity,
			clouds: details.cloud_area_fraction,
			pressure: details.air_pressure_at_sea_level,
			condition,
			symbol_code: symbolCode
		};

		return json(weatherData);
	} catch (err) {
		console.error('Server error:', err);
		throw error(500, 'Failed to fetch weather data');
	}
};
