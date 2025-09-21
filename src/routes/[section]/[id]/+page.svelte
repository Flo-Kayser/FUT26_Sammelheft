<script>
	import { sessionStore } from '$lib/stores/sessionStores';
	import { toggleCard } from '$lib/helpers/collectionHelpers';
	import RenderedCard from '$lib/svelte/RenderedCard.svelte';
	import {
		collectedCardsStore,
		impossibleCardsStore,
		savedStores,
		cardSettingsStore
	} from '$lib/stores/savedStores';
	import { collectAnimation } from '$lib/helpers/cardAnimationHelper';

	function handleClick(e, card) {
		if (
			$collectedCardsStore.includes(card.resourceId) ||
			$impossibleCardsStore.includes(card.resourceId) ||
			$savedStores.impossibleSwitch
		) {
			toggleCard(card.resourceId);
		} else {
			if ($cardSettingsStore.playAnimation) {
				collectAnimation(card, e.currentTarget);
				setTimeout(() => toggleCard(card.resourceId), 2000);
			} else {
				toggleCard(card.resourceId);
			}
		}
	}
</script>

{#each Object.values($sessionStore.pagedCards) as card}
	<button
		data-card-id={card.resourceId}
		on:click={(e) => handleClick(e, card)}
		on:animationend={() => sessionStore.update((s) => ({ ...s, highlightedCardId: null }))}
		class:pulse={String(card.resourceId) === String($sessionStore.highlightedCardId)}
	>
		<RenderedCard {card} />
	</button>
{/each}
