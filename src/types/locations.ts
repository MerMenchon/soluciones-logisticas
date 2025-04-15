
// Types for location data
export interface Province {
  value: string;
  label: string;
  cities: City[];
}

export interface City {
  value: string;
  label: string;
  hasStorage?: boolean;
}

// Legacy location type for backward compatibility
export interface Location {
  ciudad: string;
  hasStorage: boolean;
}
