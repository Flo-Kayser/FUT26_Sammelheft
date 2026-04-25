<script>
	import { totsCardsSettingsStore } from '$lib/stores/savedStores.js';
</script>

<div class="flex flex-col gap-4">
	<div class="w-full flex border-b-2 justify-center pb-4">
		<label class="flex items-center justify-end gap-8">
			<span class="ml-2 text-end text-white">Aktiviere Rote Tots Karten</span>
			<input
				type="checkbox"
				bind:checked={$totsCardsSettingsStore.useRedCards}
				class="min-w-8 h-5 w-5"
			/>
		</label>
	</div>
	<div class="w-full items-center justify-center text-center flex flex-col gap-6">
		<span class="text-sm">
			Sobald die Option aktiviert ist, können TOTS-Champion-Karten angezeigt werden.</span>
		<span>
			Beim Sammeln drückst du dafür auf den oberen Bereich der Karte, um sie als rote TOTS-Champion-Version zu sammeln,
			und auf den unteren Bereich für die Standardversion. Hast du beide Versionen, kannst du durch
			erneuten Klick auf die gesammlte Karte eine geteilte Ansicht anzeigen lassen.
		</span>
		<span class="text-sm"> Funktioniert nur für TOTS, TOTS Breakthrough und TOTS Honorable Mentions. </span>
	</div>
</div>
