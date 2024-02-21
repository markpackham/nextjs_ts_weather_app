export function convertWindSpeed(speedInMetersPerSecond: number): string {
    // Conversion from meters per second to kilometers per hour
    const speedInKilometersPerHour = speedInMetersPerSecond * 3.6; 
    return `${speedInKilometersPerHour.toFixed(0)}km/hour`;
  }