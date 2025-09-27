export interface GlobePoint {
	lat: number;
	lng: number;
	name: string;
	color?: string;
	size?: number;
}

export interface GlobePath {
	id: string;
	start: GlobePoint;
	end: GlobePoint;
	color?: string;
	width?: number;
	dashLength?: number;
}

export interface GlobeData {
	points: GlobePoint[];
	paths: GlobePath[];
}

export interface GlobeConfig {
	width?: number;
	height?: number;
	backgroundColor?: string;
	showAtmosphere?: boolean;
	showGlobe?: boolean;
	showGraticules?: boolean;
}
