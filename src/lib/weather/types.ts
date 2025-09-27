export enum WeatherCondition {
	SUNNY = 'sunny',
	PARTLY_CLOUDY = 'partly_cloudy',
	LIGHT_RAIN = 'light_rain',
	HEAVY_RAIN = 'heavy_rain'
}

export interface WeatherData {
	time: string;
	temperature: number;
	wind_speed: number;
	humidity: number;
	clouds: number;
	pressure: number;
	condition: WeatherCondition;
	symbol_code?: string; // For debugging
}

export function getWeatherConditionFromSymbol(symbolCode: string): WeatherCondition {
	// Map Yr.no symbol codes to our weather conditions
	const symbol = symbolCode.toLowerCase();

	// Clear/sunny conditions
	if (symbol.includes('clearsky') || symbol.includes('fair')) {
		return WeatherCondition.SUNNY;
	}

	// Partly cloudy conditions
	if (symbol.includes('partlycloudy') || symbol.includes('cloudy')) {
		return WeatherCondition.PARTLY_CLOUDY;
	}

	// Rain conditions - check for intensity
	if (symbol.includes('rain') || symbol.includes('shower')) {
		// Heavy rain indicators
		if (symbol.includes('heavy') || (symbol.includes('rain') && !symbol.includes('light'))) {
			return WeatherCondition.HEAVY_RAIN;
		}
		// Light rain
		return WeatherCondition.LIGHT_RAIN;
	}

	// Snow conditions (treat as rain for simplicity)
	if (symbol.includes('snow')) {
		return WeatherCondition.LIGHT_RAIN;
	}

	// Default to partly cloudy for unknown conditions
	return WeatherCondition.PARTLY_CLOUDY;
}

// Keep the old function for backward compatibility
export function getWeatherCondition(clouds: number, precipitation?: number): WeatherCondition {
	// If there's precipitation, determine rain intensity
	if (precipitation && precipitation > 0) {
		return precipitation > 2.5 ? WeatherCondition.HEAVY_RAIN : WeatherCondition.LIGHT_RAIN;
	}

	// Based on cloud coverage
	if (clouds < 25) {
		return WeatherCondition.SUNNY;
	} else if (clouds < 75) {
		return WeatherCondition.PARTLY_CLOUDY;
	} else {
		// High cloud coverage, assume some rain
		return WeatherCondition.LIGHT_RAIN;
	}
}

export function getWeatherIcon(condition: WeatherCondition): string {
	switch (condition) {
		case WeatherCondition.SUNNY:
			return '☀️';
		case WeatherCondition.PARTLY_CLOUDY:
			return '⛅';
		case WeatherCondition.LIGHT_RAIN:
			return '🌦️';
		case WeatherCondition.HEAVY_RAIN:
			return '🌧️';
		default:
			return '☀️';
	}
}
