<script>
	export let card;
	import { cardSizeStore } from '$lib/stores/savedStores';
	import { versionIndexStore } from '$lib/stores/sessionStores';

	const baseWidth = 180;
	$: cardWidth = $cardSizeStore;
	$: cardHeight = Math.round((cardWidth * 400) / 320);
	$: scale = cardWidth / baseWidth;

	let playerImgEl;

	$: isGoalkeeper =
		card?.preferredPosition === 'GK' ||
		card?.preferredPosition === 'TH' ||
		card?.preferredPosition === 'TW';

	const attributeLabels = {
		TW: ['DIV', 'HAN', 'KIC', 'REF', 'SPD', 'POS'],
		notTW: ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']
	};

	$: labels = attributeLabels[isGoalkeeper ? 'TW' : 'notTW'];

	$: version = $versionIndexStore?.versions?.[card?.versionId] ?? {};

	$: playerImg = `https://cdn.easysbc.io/fc26/players/${card?.resourceId}.png`;
	$: fallbackImg = `https://cdn.easysbc.io/fc26/players/${card?.assetId}.png`;

</script>

{#if card}
	<div class="card" style="width:{cardWidth}px; height:{cardHeight}px;">
		<div
			class="inner flex items-center justify-center"
			style="width:{baseWidth}px; height:{(baseWidth * 400) /
				320}px; transform:scale({scale}); transform-origin: top left;"
		>
			<div class="relative">
				<img src={version?.details?.url} class="w-full" alt="" />

				<img
					src={`https://cdn.easysbc.io/fc26/players/${card.resourceId}.png`}
					bind:this={playerImgEl}
					alt=""
					class={`absolute ${card.hasDynamicImage ? 'top-0 left-0' : 'top-6 left-5 scale-70'}`}
					onerror={(e) => {
						const img = e.currentTarget;
						img.src = `https://cdn.easysbc.io/fc26/players/${card.assetId}.png`;
					}}
				/>

				<div></div>
			</div>
		</div>
	</div>
{/if}
