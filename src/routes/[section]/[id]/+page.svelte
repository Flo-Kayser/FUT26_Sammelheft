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
		animationSettingsStore
	} from '$lib/stores/savedStores';
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
</script>

{#each Object.values($sessionStore.pagedCards) as card}
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
{/each}
