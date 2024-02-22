"use client";

import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import axios from "axios";
// Convert dates
import { format, fromUnixTime, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

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

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Home() {
  // Global state for city search which must be at a function level
  const [place, setPlace] = useAtom(placeAtom);
  const [unusedPlaceholder2, setLoadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`
      );
      return data;
    }

    // fetch rendered obsolete by using axios instead
    // fetch(
    //   `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
    // ).then((res) => res.json())
  );

  // Everytime "place" changes useEffect called
  useEffect(() => {
    refetch();
  }, [place, refetch]);

  // Today's forecast, firstData
  const firstData = data?.list[0];

  // Get Unique Dates
  // tsconfig.json needs to be modified in "compilerOptions" so "target": "es2015",
  // otherwise "Set" won't be recognized
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  // Filter data to get only the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      // The letter “T” is commonly used as a separator in ISO 8601 date-time format strings
      // eg 2020-01-22T11:22:22
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

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
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4">
        {/* Today's forecast */}
        <section className="space-y-4">
          <div className="space-y-2">
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

            <Container className="gap-10 px-6 items-center">
              {/* Temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {/* If we have no data/null then pass a 0 */}
                  {convertKelvinToCelsius(firstData?.main.temp ?? 0)}&deg;C
                  <p className="text-xs space-x-1 whitespace-nowrap">
                    <span> Feels like </span>
                    <span>
                      {" "}
                      {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}
                      &deg;C
                    </span>
                  </p>
                  <p className="text-xs space-x-1">
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                    &deg;C Min
                  </p>
                  <p className="text-xs space-x-1">
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                    &deg;C Max
                  </p>
                </span>
              </div>

              {/* Time & Weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((dat, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    {/* Show time with AM or PM */}
                    {/* <p className="whitespace-nowrap">{format(parseISO(dat.dt_txt), "h:mm a")}</p> */}
                    {/* Show with 24 hour clock  */}
                    <p>{format(parseISO(dat.dt_txt), "HH:MM")}</p>

                    {/* Default if we had no day/night icon function */}
                    {/* <WeatherIcon iconName={dat.weather[0].icon} /> */}

                    <WeatherIcon
                      iconName={getDayOrNightIcon(
                        dat.weather[0].icon,
                        dat.dt_txt
                      )}
                    />

                    {/* Temperature throughout the day */}
                    <p>{convertKelvinToCelsius(dat?.main.temp ?? 0)}&deg;C</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* Left Container */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {firstData?.weather[0].description}
              </p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData?.weather[0].icon ?? "",
                  firstData?.dt_txt ?? ""
                )}
              />
            </Container>

            {/* Right Container */}
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                // 10000 is the default visability if we get null
                visability={metersToKilometers(firstData?.visibility ?? 10000)}
                // Pressure is measured in hectoPascals (hPa), also called millibars
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(
                  fromUnixTime(data?.city.sunrise ?? 1702949452),
                  "H:mm"
                )}
                sunset={format(
                  fromUnixTime(data?.city.sunset ?? 1702517657),
                  "H:mm"
                )}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
              />
            </Container>
          </div>
        </section>

        {/* 7 day forecast */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">7 Day Forecast</p>
          {/* D is the supplied data*/}
          {firstDataForEachDate.map((d, index) => (
            <ForecastWeatherDetail
              key={index}
              description={d?.weather[0].description ?? ""}
              weatherIcon={d?.weather[0].icon ?? "01d"}
              date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
              day={d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              airPressure={`${d?.main.pressure} hPa `}
              humidity={`${d?.main.humidity}% `}
              sunrise={format(
                // Using the Global data & not one specific to firstDataForEachDate
                fromUnixTime(data?.city.sunrise ?? 1702517657),
                "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1702517657),
                "H:mm"
              )}
              visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
              windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
