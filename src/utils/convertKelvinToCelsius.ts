export function convertKelvinToCelsius(temptInKelvin: number): number {
    const temptInCelsius = temptInKelvin - 273.15;
    // Changes float into an integer
    return Math.floor(temptInCelsius);
}