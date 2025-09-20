<script>
	import { cardSettingsStore } from '$lib/stores/savedStores';

	const cardSettingsOptions = [
		{ key: 'showAlternativePositions', label: 'Alternative Positionen anzeigen' },
		{ key: 'showWeakFootAndSkillMoves', label: 'Schwacher Fuß und Skills anzeigen' },
		{ key: 'showPlaystyles', label: 'PlayStyles anzeigen' },
		{ key: 'showLogosForSBC', label: 'Logos als Markierung für SBC und Objectives anzeigen' },
		{ key: 'playAnimation', label: 'Animation beim Freischalten der Karte abspielen' }
	];
</script>

<div>
	<h1 class="text-lg md:text-2xl font-bold mb-4">Anzeige-Optionen für Kartenattribute</h1>
    <p class="text-xs md:text-sm opacity-80">In diesem Abschnitt können Sie auswählen, welche Attribute auf den Karten erscheinen und die Anzeigeoptionen individuell konfigurieren, um Ihre Sammlung optimal darzustellen.</p>
	<div class="flex flex-col gap-4 mt-10">
		{#each cardSettingsOptions as option}
			<label class="flex items-center justify-end gap-8">
				<span class="ml-2 text-end text-white">{option.label}</span>
				<input
					type="checkbox"
					bind:checked={$cardSettingsStore[option.key]}
					class="min-w-8 h-5 w-5"
				/>
			</label>
		{/each}
	</div>
</div>
