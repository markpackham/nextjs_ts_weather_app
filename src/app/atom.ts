import { atom } from "jotai";

// Handles global state similar to store with Redux
export const placeAtom = atom("Republic of India");

export const loadingCityAtom = atom(false);