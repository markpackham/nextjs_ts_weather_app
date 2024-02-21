export function metersToKilometers(visabilityInMeters: number): string{
    const visabilityInKilometers = visabilityInMeters / 1000;
    // Round to 0 decimal places
    return `${visabilityInKilometers.toFixed(0)}km`;
}