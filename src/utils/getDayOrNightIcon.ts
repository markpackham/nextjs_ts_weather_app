export function getDayOrNightIcon(
    iconName: string,
    dateTimeString: string
  ): string {
    // Get hours from the given date and time string
    const hours = new Date(dateTimeString).getHours(); 
  
    // Consider daytime from 6 AM to 6 PM
    const isDayTime = hours >= 6 && hours < 18;
  
    return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
  }