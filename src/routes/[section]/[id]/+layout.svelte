<script>
	import { page } from '$app/stores';
	import {
		versionIndexStore,
		leaguesIndexStore,
		countriesIndexStore,
		resourceMapStore,
		sessionStore
	} from '$lib/stores/sessionStores';
	import { savedStores, collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/apiClient';

	$: console.log($collectedCardsStore)
	$: console.log(id)

	let cards = [];
	let sortedCards = [];
	export let children;

	// ---- Data & Grid ----
	onMount(async () => {
		cards = await fetchPlayers();
		const resize = () => {
			if (!containerEl) return;
			containerWidth = containerEl.clientWidth;
			containerHeight = window.innerHeight - containerEl.getBoundingClientRect().top - 90;
			updateGrid();
		};
		window.addEventListener('resize', resize);
		resize();
		return () => window.removeEventListener('resize', resize);
	});

	$: sortedCards = Object.values(cards)
		.slice()
		.sort((a, b) =>
			a.rating !== b.rating
				? b.rating - a.rating
				: a.name.localeCompare(b.name) || a.cardName.localeCompare(b.cardName)
		);

	$: id = $page.params.id ?? '';
	$: section = $page.params.section ?? '';

	$: imageUrl =
		section === 'Versions'
			? $versionIndexStore?.versions?.[id]?.details?.url || ''
			: id.includes('_')
				? `https://cdn.easysbc.io/fc25/${section.toLowerCase()}/${id.split('_')[1]}.png`
				: `https://cdn.easysbc.io/fc25/${section.toLowerCase()}/${id}.png`;

	$: title = (() => {
		if (section === 'Versions') return $versionIndexStore?.versions?.[id]?.details?.name ?? '';
		if (section === 'Leagues') return $leaguesIndexStore?.leagues?.[id]?.name ?? '';
		if (section === 'Countries') return $countriesIndexStore?.countries?.[id]?.name ?? '';
		if (section === 'Clubs') {
			for (const league of Object.values($leaguesIndexStore?.leagues ?? {})) {
				for (const club of league.clubIds) if (club.id == id) return club.name;
			}
			return 'Club';
		}
		return '';
	})();

	// ---- Counts ----
	const BIT = { all: 1, noBase: 2, onlyBest: 4, onlyBestSpecial: 8 };

	function matchingIds(rm, section, id, matchesVariant) {
		return Object.entries(rm)
			.filter(([_, e]) => {
				if (!matchesVariant(e)) return false;
				switch (section) {
					case 'Versions':
						return String(e.v) === id;
					case 'Leagues':
						return String(e.l) === id;
					case 'Countries':
						return String(e.c) === id;
					case 'Clubs':
						if (id.includes('_')) {
							const [l, c] = id.split('_');
							return String(e.l) === l && String(e.club) === c;
						}
						return String(e.club) === id;
				}
			})
			.map(([rid]) => rid);
	}

	$: totalPossible = (() => {
		const rm = $resourceMapStore?.data ?? {};
		if (!section || !id) return 0;
		const variant = $savedStores.displayedCardsVariant || 'all';
		const bitMask = BIT[variant] ?? BIT.all;
		const matchesVariant = (e) => variant === 'all' || e.m & bitMask;
		return matchingIds(rm, section, id, matchesVariant).length;
	})();

	$: collectedCount = (() => {
		const rm = $resourceMapStore?.data ?? {};
		if (!section || !id) return 0;
		const variant = $savedStores.displayedCardsVariant || 'all';
		const bitMask = BIT[variant] ?? BIT.all;
		const matchesVariant = (e) => variant === 'all' || e.m & bitMask;
		const ids = matchingIds(rm, section, id, matchesVariant);
		const collected = new Set($collectedCardsStore);
		const impossible = new Set($impossibleCardsStore);
		return ids.filter((rid) => collected.has(Number(rid)) || impossible.has(Number(rid))).length;
	})();

	async function fetchPlayers() {
		if (section === 'Versions') return apiClient.fetchData(`versions/${id}.json`);
		if (section === 'Clubs')
			return id.includes('_')
				? apiClient.fetchData(`clubs/clubs-${$savedStores.displayedCardsVariant}/${id}.json`)
				: (
						await apiClient.fetchData(
							`clubs/clubs-${$savedStores.displayedCardsVariant}/${id}.json`
						)
					).players;
		if (section === 'Countries')
			return apiClient.fetchData(
				`countries/countries-${$savedStores.displayedCardsVariant}/${id}.json`
			);
		if (section === 'Leagues')
			return apiClient.fetchData(
				`leagues/leagues-${$savedStores.displayedCardsVariant}/${id}.json`
			);
	}

	// ---- Grid/Pagination ----
	let cardWidth = 180,
		cardHeight = 260,
		gap = 16;
	let containerEl,
		containerWidth = 0,
		containerHeight = 0;
	let columns = 0,
		rows = 0,
		perPage = 0,
		totalPages = 0;
	let currentPage = 1;

	function updateGrid() {
		if (!containerWidth || !containerHeight) return;
		columns = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
		rows = Math.max(1, Math.floor((containerHeight + gap) / (cardHeight + gap)));
		perPage = columns * rows;
		totalPages = sortedCards.length ? Math.ceil(sortedCards.length / perPage) : 0;
		if (containerEl) {
			containerEl.style.display = 'grid';
			containerEl.style.gap = gap + 'px';
			containerEl.style.gridTemplateColumns = `repeat(${columns}, ${cardWidth}px)`;
			containerEl.style.gridAutoRows = `${cardHeight}px`;
		}
		if (currentPage > totalPages) currentPage = totalPages || 1;
	}

	$: if (sortedCards && containerWidth && containerHeight) updateGrid();

	$: pagedCards = sortedCards.slice((currentPage - 1) * perPage, currentPage * perPage);

	$: sessionStore.update((s) => ({ ...s, pagedCards }));
</script>

<div class="relative h-screen text-black overflow-hidden">
	<div
		class="absolute inset-0 blur-xl contrast-75 opacity-60"
		style="background-image: url({imageUrl});
		       background-size: 150%;
		       background-position: 50% 25%;"
	></div>

	<div class="relative w-full h-full text-white flex flex-col">
		<div class="w-full relative h-20 flex items-center gap-4 px-4">
			<div class="flex -space-x-2 w-full">
				<button
					on:click={() => window.history.back()}
					class="bg-white/60 cursor-pointer text-xl font-bold text-black p-1 pr-2 flex items-center [clip-path:polygon(0_0,100%_0%,calc(100%-16px)_50%,100%_100%,0_100%)]"
				>
					<div
						class="flex gap-1 bg-black/50 text-white pr-6 px-3 py-1 [clip-path:polygon(0_0,calc(100%-1px)_0%,calc(100%-15px)_50%,calc(100%-1px)_100%,0_100%)]"
					>
						<span>Zurück</span>
					</div>
				</button>
				<div
					class="bg-white/60 text-2xl w-full font-bold text-black px-1 flex items-center [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,0_50%)]"
				>
					<div
						class="flex gap-1 bg-white/80 text-black font-black w-full justify-center p-0.5 [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,2px_50%)]"
					>
						<h2>{title}</h2>
					</div>
				</div>
			</div>

			<div class="flex -space-x-2">
				<div
					class="bg-white/60 text-xl font-bold text-black p-1 pr-2 flex items-center [clip-path:polygon(0_0,100%_0%,calc(100%-16px)_50%,100%_100%,0_100%)]"
				>
					<div
						class="flex gap-1 bg-black/50 text-white pr-6 px-3 py-1 [clip-path:polygon(0_0,calc(100%-1px)_0%,calc(100%-15px)_50%,calc(100%-1px)_100%,0_100%)]"
					>
						<span>Gesammelt:</span>
					</div>
				</div>
				<div
					class="bg-white/60 text-xl font-bold text-black p-1 flex items-center [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,0_50%)]"
				>
					<div
						class="flex gap-1 bg-black/50 text-white px-3 pl-6 py-1 [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,2px_50%)]"
					>
						<span>{collectedCount}</span>/
						<span>{totalPossible}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-1 flex-col">
			<!-- Grid-Slot: Page rendert hier ihre Karten -->
			<div bind:this={containerEl} class="flex-1 p-4 content-center justify-center">
				{@render children()}
			</div>

			<!-- Pagination -->
			<div class="p-4 text-sm flex items-center gap-4 bg-black/60">
				Spalten: {columns}, Zeilen: {rows}, Karten pro Seite: {perPage}, Seite {currentPage} von {totalPages}
				<div class="flex gap-2 ml-auto">
					<button
						class="px-2 py-1 border rounded disabled:opacity-40"
						on:click={() => (currentPage = Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}>‹ Prev</button
					>
					<button
						class="px-2 py-1 border rounded disabled:opacity-40"
						on:click={() => (currentPage = Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}>Next ›</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
