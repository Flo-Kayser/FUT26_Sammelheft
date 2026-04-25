<script>
	import { sessionStore } from '$lib/stores/sessionStores';
	import { toggleCard } from '$lib/helpers/collectionHelpers';
	import RenderedCard from '$lib/svelte/RenderedCard.svelte';
	import {
		collectedCardsStore,
		impossibleCardsStore,
		missedCardsStore,
		savedStores,
		cardSettingsStore,
		animationSettingsStore,
		totsCardsSettingsStore,
		totsRedStore,
		totsBothStore
	} from '$lib/stores/savedStores';
	import { versionIndexStore } from '$lib/stores/sessionStores';
	import { collectAnimation } from '$lib/helpers/cardAnimationHelper';

	function handleClick(e, card) {
		if (
			$collectedCardsStore.includes(card.resourceId) ||
			$impossibleCardsStore.includes(card.resourceId) ||
			$missedCardsStore.includes(card.resourceId) ||
			$savedStores.impossibleSwitch ||
			$savedStores.missedSwitch
		) {
			toggleCard(card.resourceId);
			totsRedStore.update((cards) => cards.filter((id) => id !== card.resourceId));
			totsBothStore.update((cards) => cards.filter((id) => id !== card.resourceId));
		} else {
			if ($cardSettingsStore.playAnimation) {
				if (!savedStores.missedSwitch) {
					collectAnimation(card, e.currentTarget);
				} else {
				}
				setTimeout(
					() => toggleCard(card.resourceId),
					($animationSettingsStore.cardDisplayDuration ?? 1) * 1000 + 2000
				);
			} else {
				toggleCard(card.resourceId);
			}
		}
	}

	function isTotsCardCollectable(card) {
		return !(
			$collectedCardsStore.includes(card.resourceId) ||
			$impossibleCardsStore.includes(card.resourceId) ||
			$missedCardsStore.includes(card.resourceId) ||
			$savedStores.impossibleSwitch ||
			$savedStores.missedSwitch
		);
	}

	function collectTotsCard(e, card, isRed = false) {
		const cardTarget = e.currentTarget.parentElement.getAttribute('data-card-id');
		if (isRed) {
			totsRedStore.update((cards) => [...cards, card.resourceId]);
		}
		if ($cardSettingsStore.playAnimation) {
			setTimeout(() => {
				collectAnimation(card, document.querySelector(`[data-card-id="${cardTarget}"]`));
			}, 10);
			setTimeout(
				() => toggleCard(card.resourceId),
				($animationSettingsStore.cardDisplayDuration ?? 1) * 1000 + 2010
			);
		} else {
			toggleCard(card.resourceId);
		}
	}

	function activateTOTSBothVersions(card) {
		if($collectedCardsStore.includes(card.resourceId) && !$totsBothStore.includes(card.resourceId)) {
		totsBothStore.update((cards) => [...cards, card.resourceId]);
		totsRedStore.update((cards) => cards.filter((id) => id !== card.resourceId));
		} else {
			totsBothStore.update((cards) => cards.filter((id) => id !== card.resourceId));

			toggleCard(card.resourceId);
		}
	}
</script>

{#each Object.values($sessionStore.pagedCards) as card}
	{#if $totsCardsSettingsStore.useRedCards && ['11', '65', '120'].includes(card.versionId)}
		{#if isTotsCardCollectable(card)}
			<div
				class="relative"
				data-card-id={card.resourceId}
				on:animationend={() => sessionStore.update((s) => ({ ...s, highlightedCardId: null }))}
				class:pulse={String(card.resourceId) === String($sessionStore.highlightedCardId)}
				style={`animation-iteration-count: ${$animationSettingsStore.playerSearchAnimationIterations};`}
			>
				<button
					aria-label="collect TOTS Champion"
					class="absolute h-1/2 w-full z-100 cursor-pointer"
					on:click={(e) => collectTotsCard(e, card, true)}
				>
				</button>
				<button
					aria-label="collect TOTS Player"
					class="absolute h-1/2 top-1/2 w-full z-100 cursor-pointer"
					on:click={(e) => collectTotsCard(e, card)}
				>
				</button>

				<RenderedCard {card} />
			</div>
		{:else if $collectedCardsStore.includes(card.resourceId)}
			<button
				class="cursor-pointer"
				data-card-id={card.resourceId}
				on:click={() => activateTOTSBothVersions(card)}
				on:animationend={() => sessionStore.update((s) => ({ ...s, highlightedCardId: null }))}
				class:pulse={String(card.resourceId) === String($sessionStore.highlightedCardId)}
				style={`animation-iteration-count: ${$animationSettingsStore.playerSearchAnimationIterations};`}
			>
				<RenderedCard {card} />
			</button>
		{:else}
			<button
				class="cursor-pointer"
				data-card-id={card.resourceId}
				on:click={(e) => handleClick(e, card)}
				on:animationend={() => sessionStore.update((s) => ({ ...s, highlightedCardId: null }))}
				class:pulse={String(card.resourceId) === String($sessionStore.highlightedCardId)}
				style={`animation-iteration-count: ${$animationSettingsStore.playerSearchAnimationIterations};`}
			>
				<RenderedCard {card} />
			</button>
		{/if}
	{:else}
		<button
			class="cursor-pointer"
			data-card-id={card.resourceId}
			on:click={(e) => handleClick(e, card)}
			on:animationend={() => sessionStore.update((s) => ({ ...s, highlightedCardId: null }))}
			class:pulse={String(card.resourceId) === String($sessionStore.highlightedCardId)}
			style={`animation-iteration-count: ${$animationSettingsStore.playerSearchAnimationIterations};`}
		>
			<RenderedCard {card} />
		</button>
	{/if}
{/each}
