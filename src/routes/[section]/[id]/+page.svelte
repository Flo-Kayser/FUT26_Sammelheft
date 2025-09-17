<script>
	import { sessionStore } from '$lib/stores/sessionStores';
    import { toggleCard } from '$lib/helpers/collectionHelpers';

</script>

{#each Object.values($sessionStore.pagedCards) as card}
	<button
    onclick={()=>toggleCard(card.resourceId)}
		class="bg-white text-baseC border shadow rounded flex items-center justify-center text-center"
	>
		{card.cardName} / {card.name} / {card.rating}
	</button>
{/each}
