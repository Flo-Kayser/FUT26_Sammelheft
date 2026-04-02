import { savedStores, collectedCardsStore, impossibleCardsStore, missedCardsStore } from '$lib/stores/savedStores';
import { get } from 'svelte/store';

export function toggleCard(cardId) {
	const impSwitch = get(savedStores).impossibleSwitch;
	const missSwitch = get(savedStores).missedSwitch;

	const collectedCards = get(collectedCardsStore);
	const impossibleCards = get(impossibleCardsStore);
	const missedCards = get(missedCardsStore);

	if (!impSwitch && !missSwitch) {
		if (impossibleCards.includes(cardId)) return;
		if (missedCards.includes(cardId)) return
		if (!collectedCards.includes(cardId)) {
			collectedCardsStore.update((cards) => [...cards, cardId]);
		} else {
			collectedCardsStore.update((cards) => cards.filter((id) => id !== cardId));
		}
	} else if (!missSwitch) {
		if (collectedCards.includes(cardId)) return;
		if (missedCards.includes(cardId)) return
		if (!impossibleCards.includes(cardId)) {
			impossibleCardsStore.update((cards) => [...cards, cardId]);
		} else {
			impossibleCardsStore.update((cards) => cards.filter((id) => id !== cardId));
		}
	} else if(!impSwitch) {
		if (collectedCards.includes(cardId)) return;
		if (impossibleCards.includes(cardId)) return
		if (!missedCards.includes(cardId)) {
			missedCardsStore.update((cards) => [...cards, cardId]);
		} else {
			missedCardsStore.update((cards) => cards.filter((id) => id !== cardId));
		}
	}
}
