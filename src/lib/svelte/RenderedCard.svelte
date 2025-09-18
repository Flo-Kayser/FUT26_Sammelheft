<script>
	export let card;
	import {
		cardSizeStore,
		collectedCardsStore,
		impossibleCardsStore
	} from '$lib/stores/savedStores';
	import { versionIndexStore } from '$lib/stores/sessionStores';

	const fallbackImg = 'https://cdn.easysbc.io/fc26/players/240333.png';
	const baseWidth = 180;

	$: cardWidth = $cardSizeStore;
	$: cardHeight = Math.round((cardWidth * 400) / 320);
	$: scale = cardWidth / baseWidth;

	let isGoalkeeper =
		card?.preferredPosition === 'GK' ||
		card?.preferredPosition === 'TH' ||
		card?.preferredPosition === 'TW';

	const attributeLabels = {
		TW: ['DIV', 'HAN', 'KIC', 'REF', 'SPD', 'POS'],
		notTW: ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']
	};
	$: labels = attributeLabels[isGoalkeeper ? 'TW' : 'notTW'];
	$: version = $versionIndexStore?.versions?.[card?.versionId] ?? {};

	let imgErrored = false;
	let dynamicPos = card?.hasDynamicImage;
	function checkRealSize(e) {
		imgErrored = false;
		if (e.currentTarget.src === fallbackImg) imgErrored = true;
		const img = e.currentTarget;
		const ratio = img.naturalHeight / img.naturalWidth;
		if (ratio < 1.3 && ratio > 0.7) {
			dynamicPos = false;
		} else {
			dynamicPos = true;
		}
	}

	function handleError(e) {
		imgErrored = true;
		e.currentTarget.src = fallbackImg;
	}

	$: primaryColor = version.details?.primaryColor;
	$: secondaryColor = version.details?.secondaryColor;
	$: tertiaryColor = version.details?.tertiaryColor;

	$: isCollected = $collectedCardsStore.includes(card.resourceId);
	$: isImpossible = $impossibleCardsStore.includes(card.resourceId);
	$: shouldGray = (!isCollected || isImpossible);
</script>

{#if card}
	<div class="card" style="width:{cardWidth}px; height:{cardHeight}px;">
		<div
			class="flex items-center justify-center relative *:absolute contrast-100"
            class:contrast-50={isImpossible}
			class:grayscale-100={shouldGray}
			style="width:{baseWidth}px;
		       height:{(baseWidth * 400) / 320}px;
		       transform:scale({scale});
		       transform-origin: top left;
               color: {primaryColor};"
		>
			<!-- Impossible Label -->
			{#if isImpossible}
				<div class="top-13 -left-6 z-50 px-10 rounded -rotate-50 bg-black/80 text-white/60">Impossible</div>
			{/if}
			<!-- Card Background -->
			<img src={version?.details?.url} class="w-full" alt="" />
			<!-- Player Image -->
			<img
				src={`https://cdn.easysbc.io/fc26/players/${card.resourceId}.png`}
				alt=""
				on:load={checkRealSize}
				on:error={(e) => {
					handleError(e);
				}}
				class="{dynamicPos ? '-top-2.5 left-0' : 'top-2.5 left-5 scale-70'} {imgErrored
					? 'contrast-0'
					: ''}"
			/>
			<!-- Rating and Pos -->
			<div class="top-[18%] left-[15%] flex flex-col -space-y-2 font-b">
				<span class="text-[20px]">{card.rating}</span>
				<span class=" text-[10px]">{card.preferredPosition}</span>
			</div>
			<!-- Name  -->
			<div class="top-[64%] left-1/2 -translate-x-1/2 whitespace-nowrap font-b">
				{card.cardName}
			</div>
			<!-- Attributes -->
			<div class="flex justify-between w-[70%] top-[74%] left-1/2 -translate-x-1/2">
				{#each card?.attributes as attribute, i}
					<div class="flex flex-col items-center tracking-[-.5px]">
						<span class="text-[9px] font-b leading-1.5">{labels[i]}</span>
						<span class="text-[13px] font-b">{attribute}</span>
					</div>
				{/each}
			</div>
			<!-- Nation Club and League -->
			<div class="flex gap-1 top-[84.5%] left-1/2 -translate-x-1/2 justify-center items-center">
				<img
					src={`https://cdn.easysbc.io/fc26/countries/${card?.countryId}.png`}
					alt="."
					class="w-4.5 scale-y-[.95] text-[0px]"
				/>
				<img
					src={`https://cdn.easysbc.io/fc26/leagues/dark/${card?.leagueId}.png`}
					alt="."
					class="h-4 text-[0px]"
					on:error={(e) => {
						const img = e.currentTarget;
						img.src = `https://cdn.easysbc.io/fc26/leagues/${card?.leagueId}.png`;
						img.onerror = null;
					}}
				/>

				{#if card?.clubId !== 112658}
					<img
						src={`https://cdn.easysbc.io/fc26/clubs/dark/${card?.clubId}.png`}
						alt="."
						class="h-4 text-[0px]"
						on:error={(e) => {
							const img = e.currentTarget;
							img.src = `https://cdn.easysbc.io/fc26/clubs/${card?.clubId}.png`;
							img.onerror = null;
						}}
					/>
				{/if}
			</div>
		</div>
	</div>
{/if}
