<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { sessionStore } from '$lib/stores/sessionStores';

	export let sortedCards = [];
	export let perPage = 0;
	const dispatch = createEventDispatcher();

	let query = '';
	let results = [];

	onMount(() => {
		query = '';
		results = [];
	});

	$: if (query.length >= 2) {
		const q = query.toLowerCase();
		results = sortedCards
			.filter(
				(p) =>
					(p.name ?? '').toLowerCase().includes(q) || (p.cardName ?? '').toLowerCase().includes(q)
			)
			.slice(0, 15);
	} else {
		results = [];
	}

	function gotoPlayer(player) {
		const index = sortedCards.findIndex((c) => String(c.resourceId) === String(player.resourceId));
		if (index === -1) return;
		const page = Math.floor(index / perPage) + 1;

		sessionStore.update((s) => ({ ...s, highlightedCardId: player.resourceId }));

		dispatch('jump', { page });
		query = '';
		results = [];
	}
</script>

<div class="fixed bottom-4 left-4 w-64">
	<input
		type="text"
		class="w-full rounded border px-3 py-1 text-black bg-white/40 outline-none focus:outline-black/80"
		placeholder="Spieler suchen…"
		bind:value={query}
		on:keydown={(e) => {
			if (e.key === 'Enter' && results.length > 0) gotoPlayer(results[0]);
		}}
	/>
	{#if results.length}
		<ul class="absolute bottom-full mb-1 w-full rounded border bg-white shadow z-10">
			{#each results as p}
				<li>
					<button
						class="w-full text-left cursor-pointer px-3 py-1 hover:bg-gray-200 flex"
						on:click={() => gotoPlayer(p)}
					>
						<span class="text-gray-500">{p.name} - {p.rating}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
