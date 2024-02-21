"use client";

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import axios from "axios";
// Convert dates
import { format, fromUnixTime, parseISO } from "date-fns";
import { useQuery } from "react-query";

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }

    // fetch rendered obsolete by using axios instead
    // fetch(
    //   `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
    // ).then((res) => res.json())
  );

  // Today's forecast, firstData
  const firstData = data?.list[0];

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="text-red-400">Error</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4">
        {/* Today's forecast */}
        <section>
          <div>
            <h2 className="flex gap-1 text-2xl items-end">
              {/* // Parse date format to show a day eg "Monday" */}
              <div>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</div>
              <div className="text-lg">
                - UK Date Format: (
                {format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </div>
              <div className="text-lg">
                -- Record Keeping Format (
                {format(parseISO(firstData?.dt_txt ?? ""), "yyyy.MM.dd")})
              </div>
            </h2>
            <Container />
          </div>
        </section>
        {/* 7 day forecast */}
        <section></section>
      </main>
    </div>
  );
}
