<script>
	import { cardSizeStore, savedStores } from '$lib/stores/savedStores';
	import { sessionStore } from '$lib/stores/sessionStores';
	import { writable } from 'svelte/store';

	// internes Toggle für Ein-/Ausklappen
	let open = false;

	// direkt an cardSizeStore binden
	$: size = $cardSizeStore;

	// Höhe automatisch 5:4-Verhältnis
	$: height = Math.round(size * (400 / 320));
</script>

<div class="fixed bottom-4 right-4 z-50">
	<!-- Toggle-Button -->
	<button
		class="bg-black/70 text-white px-3 py-1 rounded shadow hover:bg-black/90 cursor-pointer"
		on:click={() => (open = !open)}
	>
		{open ? '▼' : '▲'} <span class="font-black text-xl">&#x2699</span>
	</button>

	{#if open}
		<div class="mt-2 w-64 rounded bg-white/90 p-4 text-black shadow-lg backdrop-blur-sm">
			<label for="cardSizeSlider" class="block text-sm font-bold mb-1">
				Kartenbreite: {size}px
				<input
					type="range"
					min="100"
					max="400"
					step="1"
					id="cardSizeSlider"
					bind:value={$cardSizeStore}
					class="w-full"
				/>
			</label>
			<label for="impSwitch" class="text-sm flex justify-between pr-2 mb-2">
				Markiere Karten als Unmöglich
				<input
					type="checkbox"
					id="impSwitch"
					bind:checked={$savedStores.impossibleSwitch}
					class="ml-2"
				/>
			</label>
			<div class="flex flex-col gap-2 border-t-1 pt-2">
				{#each [{ id: 'colCardsDisplay', label: 'Gesammelte Karten anzeigen', store: 'showCollectedCards' }, { id: 'misCardsDisplay', label: 'Noch fehlende Karten anzeigen', store: 'showMissingCards' }, { id: 'impCardsDisplay', label: 'Unmögliche Karten anzeigen', store: 'showImpossibleCards' }] as opt}
					<label for={opt.id} class="text-sm flex justify-between pr-2">
						{opt.label}
						<input
							type="checkbox"
							id={opt.id}
							bind:checked={$sessionStore[opt.store]}
							class="ml-2"
						/>
					</label>
				{/each}
			</div>
		</div>
	{/if}
</div>
