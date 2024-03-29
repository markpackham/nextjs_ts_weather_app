// 'use client' lets you mark what code runs on the client.
// It is needed for the Search Box that the client types in
"use client";

import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import SuggestionBox from "./SuggestionBox";

// Location of the city
type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  // In case what we're looking for isn't found
  const [error, setError] = useState("");

  // Search suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // atom used for Global State, using "unusedPlaceholder1" since we don't need a first parameter
  const [unusedPlaceholder1, setPlace] = useAtom(placeAtom);
  // Boolean for your loading state
  const [unusedPlaceholder2, setLoadingCity] = useAtom(loadingCityAtom);

  // City Search after suggestion selected
  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    // Check if location not found
    if (suggestions.length === 0) {
      setError("Location not found");
      setLoadingCity(false);
    } else {
      setError("");
      // Time delay added via setTimeout so we can see the loading state in action
      setTimeout(() => {
        // Data is fetched so hide loading state
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  }

  // React when city typed in
  async function handleInputChange(value: string) {
    setCity(value);
    // Don't bother searching unless city 3 or more letters long
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );

        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        // If all is good set error to empty
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        // Hide suggestions
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  // Handle suggestion user clicked on
  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  // Handle current location button click if user has geolocation enabled & permits the app to use it
  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadingCity(true);
          // Pass lat and long in GET request from API
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            // Get place name from api response
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px]     w-full    flex   justify-between items-center  max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </div>
          <section className="flex gap-2 items-center">
            <span className="text-sm ml-1">
              Click on target to get location data &rarr;
            </span>
            <MdMyLocation
              title="Your current location"
              onClick={handleCurrentLocation}
              className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"
            />

            <MdOutlineLocationOn className="text-3xl" />
            {/* "text-slate-900/80" the last part means means giving an opacity of 80 */}
            <p className="text-slate-900/80 text-sm">{location} </p>

            {/* Search Box - hide search on mobile so user can only click on current location for weather*/}
            <div className="relative hidden md:flex">
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />

              <SuggestionBox
                // Use spread operator to avoid having to write all props one by one, error={error}
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                }}
              />
            </div>
          </section>
        </div>
      </nav>

      {/* Only show on mobile screens */}
      <section className="flex max-w-7xl px-3 md:hidden">
        {/* Search Box - hide search on mobile so user can only click on current location for weather*/}
        <div className="relative">
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />

          <SuggestionBox
            // Use spread operator to avoid having to write all props one by one, error={error}
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
            }}
          />
        </div>
      </section>
    </>
  );
}
