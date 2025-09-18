import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function persistent(key, initial) {
	const start = browser
		? JSON.parse(localStorage.getItem(key) || JSON.stringify(initial))
		: initial;

	const store = writable(start);
	if (browser) store.subscribe(v => localStorage.setItem(key, JSON.stringify(v)));
	return store;
}

export const savedStores        = persistent('savedStores', { impossibleSwitch: false, displayedCardsVariant: 'all' });
export const collectedCardsStore = persistent('collectedCards', []);
export const impossibleCardsStore = persistent('impossibleCards', []);
export const cardSizeStore      = persistent('cardSize', 180); 
export const themeStore = persistent('theme-settings', {
	selectedTheme: 'Classic',
	colors: {
		'--color-baseC': '#ffffff',
		'--color-accent': '#aaaaaa',
		'--color-textC': '#000000'
	}
});
