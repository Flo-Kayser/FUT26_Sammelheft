import { writable } from "svelte/store";

export const versionIndexStore = writable({});
export const resourceMapStore = writable({});
export const countriesIndexStore = writable({});
export const leaguesIndexStore = writable({});

export const sessionStore = writable({
    searchQuery: "",
    pagedCards: [],
    highlightedCardId: null,
});

