import Container from "./Container";
import { WeatherDetailProps } from "./WeatherDetails";
import WeatherIcon from "./WeatherIcon";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatehrIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetail({}: ForecastWeatherDetailProps) {
  return (
    <Container className="gap-4">
      <section className="flex gap-4 items-center px-4">
        <div>
          <WeatherIcon />
        </div>
      </section>
    </Container>
  );
}
