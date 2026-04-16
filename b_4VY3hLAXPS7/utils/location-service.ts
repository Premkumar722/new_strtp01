export interface LocationDetails {
  zipcode: string;
  area: string;
  city: string;
  state: string;
  country: string;
}

// Location service for detecting user location
export async function detectUserLocation(): Promise<LocationDetails | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const details = getLocationDetailsFromCoordinates(latitude, longitude);
        resolve(details);
      },
      () => {
        resolve(null);
      }
    );
  });
}

// Get location details from ZIP code
export function getLocationDetailsFromZipcode(zipcode: string): LocationDetails | null {
  // Mock ZIP code database - in real app, use an API like OpenCage or Google Geocoding
  const zipcodeDatabase: Record<string, LocationDetails> = {
    '400001': { zipcode: '400001', area: 'Fort', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    '400002': { zipcode: '400002', area: 'Colaba', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    '400003': { zipcode: '400003', area: 'Ballard Estate', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    '110001': { zipcode: '110001', area: 'New Delhi', city: 'Delhi', state: 'Delhi', country: 'India' },
    '110002': { zipcode: '110002', area: 'Central Delhi', city: 'Delhi', state: 'Delhi', country: 'India' },
    '560001': { zipcode: '560001', area: 'Bangalore City', city: 'Bangalore', state: 'Karnataka', country: 'India' },
    '560002': { zipcode: '560002', area: 'Shivajinagar', city: 'Bangalore', state: 'Karnataka', country: 'India' },
    '411001': { zipcode: '411001', area: 'Camp', city: 'Pune', state: 'Maharashtra', country: 'India' },
    '411002': { zipcode: '411002', area: 'Deccan', city: 'Pune', state: 'Maharashtra', country: 'India' },
    '500001': { zipcode: '500001', area: 'Hyderabad City', city: 'Hyderabad', state: 'Telangana', country: 'India' },
    '600001': { zipcode: '600001', area: 'Chennai City', city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  };

  return zipcodeDatabase[zipcode] || null;
}

// Mock function to get location details from coordinates
function getLocationDetailsFromCoordinates(lat: number, lon: number): LocationDetails {
  // Simplified mapping - in real app, use reverse geocoding API
  const locationDatabase: Record<string, LocationDetails> = {
    'Mumbai': { zipcode: '400001', area: 'Fort', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    'Delhi': { zipcode: '110001', area: 'New Delhi', city: 'Delhi', state: 'Delhi', country: 'India' },
    'Bangalore': { zipcode: '560001', area: 'Bangalore City', city: 'Bangalore', state: 'Karnataka', country: 'India' },
    'Pune': { zipcode: '411001', area: 'Camp', city: 'Pune', state: 'Maharashtra', country: 'India' },
    'Hyderabad': { zipcode: '500001', area: 'Hyderabad City', city: 'Hyderabad', state: 'Telangana', country: 'India' },
    'Chennai': { zipcode: '600001', area: 'Chennai City', city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  };

  const cities: Record<string, [number, number]> = {
    Mumbai: [19.0760, 72.8777],
    Delhi: [28.7041, 77.1025],
    Bangalore: [12.9716, 77.5946],
    Pune: [18.5204, 73.8567],
    Hyderabad: [17.3850, 78.4867],
    Chennai: [13.0827, 80.2707],
  };

  let closestCity = 'Mumbai';
  let minDistance = Infinity;

  for (const [city, [cityLat, cityLon]] of Object.entries(cities)) {
    const distance = Math.sqrt((lat - cityLat) ** 2 + (lon - cityLon) ** 2);
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }

  return locationDatabase[closestCity] || {
    zipcode: '400001',
    area: closestCity,
    city: closestCity,
    state: 'Unknown',
    country: 'India',
  };
}

// Validate PIN code format (India)
export function validatePINCode(pin: string): boolean {
  const pinRegex = /^[0-9]{6}$/;
  return pinRegex.test(pin);
}

// Validate phone number format (India)
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}
