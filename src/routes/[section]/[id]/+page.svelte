<script>
	import { sessionStore } from '$lib/stores/sessionStores';
	import { toggleCard } from '$lib/helpers/collectionHelpers';
	import RenderedCard from '$lib/svelte/RenderedCard.svelte';

	import { savedStores, collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';

</script>

{#each Object.values($sessionStore.pagedCards) as card}
	<button
		on:click={() => toggleCard(card.resourceId)}
		class:pulse={$sessionStore.highlightedCardId === card.resourceId}
		on:animationend={() => {
			if ($sessionStore.highlightedCardId === card.resourceId) {
				sessionStore.update((s) => ({ ...s, highlightedCardId: null }));
			}
		}}
	>
		<RenderedCard {card} />
	</button>
{/each}
