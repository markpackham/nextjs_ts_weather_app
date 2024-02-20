// 'use client' lets you mark what code runs on the client.
// It is needed for the Search Box
"use client";

import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useState } from "react";

type Props = {};

export default function Navbar({}: Props) {
  const [city, setCity] = useState("");

  // Search
  function handleSubmitSearch() {}

  function handleInputChange() {}

  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px]     w-full    flex   justify-between items-center  max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
        </div>
        <section className="flex gap-2 items-center">
          <MdMyLocation className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer" />
          <MdOutlineLocationOn className="text-3xl" />
          {/* "text-slate-900/80" the last part means means giving an opacity of 80 */}
          <p className="text-slate-900/80 text-sm"> UK </p>

          {/* Search Box */}
          <div>
            <SearchBox
              value={city}
              onSubmit={handleSubmitSearch}
              onChange={(e) => handleInputChange()}
            />
          </div>
        </section>
      </div>
    </nav>
  );
}
