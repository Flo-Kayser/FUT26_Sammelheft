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

export const savedStores        = persistent('savedStores', { impossibleSwitch: false, displayedCardsVariant: 'all', allCardsDisplaySwitch: true });
export const collectedCardsStore = persistent('collectedCards', []);
export const impossibleCardsStore = persistent('impossibleCards', []);
export const cardSizeStore      = persistent('cardSize', 180); 
export const themeStore = persistent('theme-settings', {
	selectedTheme: 'Green',
	colors: {
		'--color-baseC': '#0a0a03',
		'--color-accent': '#06691c',
		'--color-textC': '#fffefc'
	}
});

export const cardSettingsStore = persistent('card-settings', {
	showAlternativePositions: true,
	showWeakFootAndSkillMoves: true,
	showPlaystyles:true,
	showLogosForSBC: true,
	playAnimation: true,
});
