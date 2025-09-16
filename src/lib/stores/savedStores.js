import { writable } from "svelte/store";

export const savedStores = writable({
    
    displayedCardsVariant: "all"
});