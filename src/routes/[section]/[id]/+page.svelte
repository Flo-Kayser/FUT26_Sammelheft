<script>
	import { sessionStore } from '$lib/stores/sessionStores';
	
</script>

{#each Object.values($sessionStore.pagedCards) as card}
	<div
		class="bg-white text-baseC border shadow rounded flex items-center justify-center text-center"
	>
		{card.cardName} / {card.name} / {card.rating}
	</div>
{/each}
