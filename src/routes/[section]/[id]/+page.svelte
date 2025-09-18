<script>
	import { sessionStore } from '$lib/stores/sessionStores';
    import { toggleCard } from '$lib/helpers/collectionHelpers';

import { savedStores, collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';

</script>

{#each Object.values($sessionStore.pagedCards) as card}
	<button
    onclick={()=>toggleCard(card.resourceId)}
		class="bg-white text-baseC border shadow rounded flex items-center justify-center text-center"
	>
		{card.cardName} / {card.name} / {card.rating}
	</button>
{/each}
