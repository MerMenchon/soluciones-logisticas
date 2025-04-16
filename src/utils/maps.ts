
/**
 * Utility functions for maps and distance calculations
 */

/**
 * Fetches the approximate distance between two locations using a simple calculation.
 * In a real application, this would use a maps API like Google Maps or Mapbox.
 * 
 * @param origin - The origin location (e.g., "Buenos Aires, Argentina")
 * @param destination - The destination location (e.g., "Córdoba, Argentina")
 * @returns Promise that resolves to the distance as a string (e.g., "750")
 */
export const fetchDistance = async (origin: string, destination: string): Promise<string> => {
  // This is a simplified mock implementation
  // In a real application, you would integrate with a maps API
  
  // console.log(`Calculating distance from "${origin}" to "${destination}"`);
  
  // Simulate API call latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock distances between major cities in Argentina (very rough approximations)
  const knownRoutes: Record<string, string> = {
    // Format: "Origin,Destination": "Distance in km"
    "Buenos Aires, Buenos Aires, Argentina,Córdoba, Córdoba, Argentina": "700",
    "Córdoba, Córdoba, Argentina,Buenos Aires, Buenos Aires, Argentina": "700",
    "Buenos Aires, Buenos Aires, Argentina,Rosario, Santa Fe, Argentina": "300",
    "Rosario, Santa Fe, Argentina,Buenos Aires, Buenos Aires, Argentina": "300",
    "Buenos Aires, Buenos Aires, Argentina,Mendoza, Mendoza, Argentina": "1050",
    "Mendoza, Mendoza, Argentina,Buenos Aires, Buenos Aires, Argentina": "1050",
    "Córdoba, Córdoba, Argentina,Mendoza, Mendoza, Argentina": "500",
    "Mendoza, Mendoza, Argentina,Córdoba, Córdoba, Argentina": "500",
  };
  
  // Check if we have a predefined distance for this route
  const routeKey = `${origin},${destination}`;
  if (knownRoutes[routeKey]) {
    return knownRoutes[routeKey];
  }
  
  // For routes we don't have predefined, generate a plausible random distance
  // between 100 and 1500 kilometers, rounded to the nearest 10
  const randomDistance = Math.round(Math.floor(100 + Math.random() * 1400) / 10) * 10;
  return randomDistance.toString();
};
