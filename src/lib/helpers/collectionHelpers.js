import { savedStores, collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';
import { get } from 'svelte/store';

export function toggleCard(cardId) {
	const impSwitch = get(savedStores).impossibleSwitch;

	const collectedCards = get(collectedCardsStore);
	const impossibleCards = get(impossibleCardsStore);

	if (!impSwitch) {
		if (impossibleCards.includes(cardId)) return;
		if (!collectedCards.includes(cardId)) {
			collectedCardsStore.update((cards) => [...cards, cardId]);
		} else {
			collectedCardsStore.update((cards) => cards.filter((id) => id !== cardId));
		}
	} else {
		if (collectedCards.includes(cardId)) return;
		if (!impossibleCards.includes(cardId)) {
			impossibleCardsStore.update((cards) => [...cards, cardId]);
		} else {
			impossibleCardsStore.update((cards) => cards.filter((id) => id !== cardId));
		}
	}
}
