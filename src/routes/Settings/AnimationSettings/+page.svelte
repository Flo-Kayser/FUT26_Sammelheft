<script>
	import { animationSettingsStore, cardSettingsStore } from '$lib/stores/savedStores';

	const cardSettingsOptions = [
		{
			key: 'soundVolume',
			label: 'Lautstärke des Sounds beim Sammeln einer Karte',
			step: '0.1',
			type: 'range',
			min: '0',
			max: '1',
            width: '24'
		},
		{
			key: 'cardDisplayDuration',
			label: 'Dauer, wie lange die Karte während des Sammelns im Vordergrund bleibt in Sekunden.',
			step: '0.5',
			type: 'number',
			min: '1',
			max: '10',
			width: '12'
		}
	];
</script>

<div class="flex flex-col gap-4">
	<div class="w-full flex border-b-2 pb-4">
		<label class="flex items-center justify-between w-full gap-8">
			<span class="ml-2 text-end text-white"
				>Dauer der Hervorhebung nach Spielersuche (in Sekunden)</span
			>
			<input
				type="number"
				bind:value={$animationSettingsStore.playerSearchAnimationIterations}
				step="1"
				min="1"
				class="w-12"
				on:blur={(e) => {
					let val = Math.floor(Number(e.target.value));
					if (val < 1) val = 1;
					$animationSettingsStore.playerSearchAnimationIterations = val;
					e.target.value = val;
				}}
			/>
		</label>
	</div>
	<div class="flex flex-col gap-4">
		<label class="flex items-center justify-end gap-8">
			<span class="ml-2 text-center text-white"
				>Animation beim Freischalten der Karte abspielen</span
			>
			<input
				type="checkbox"
				bind:checked={$cardSettingsStore.playAnimation}
				class="min-w-8 h-5 w-5"
			/>
		</label>
		<div
			class={`${$cardSettingsStore.playAnimation ? '' : 'opacity-50 pointer-events-none'} flex flex-col gap-4 w-full`}
		>
			{#each cardSettingsOptions as { key, label, step, min, max, type,width }}
				<div class="flex items-center justify-between w-full">
					<label class="flex ml-2 text-white w-full justify-end gap-4">
						<span class="text-end">
							{label}
						</span>
						<input
							{type}
							bind:value={$animationSettingsStore[key]}
							{step}
							{min}
							{max}
							style="width: ${width};"
                            on:blur={(e) => {
                                let val = type === 'number' ? Number(e.target.value) : parseFloat(e.target.value);
                                if (val < min) val = min;
                                if (val > max) val = max;
                                $cardSettingsStore[key] = val;
                                e.target.value = val;
                            }}
						/>
					</label>
				</div>
			{/each}
		</div>
	</div>
</div>
