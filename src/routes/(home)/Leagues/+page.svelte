<script>
	import { onMount } from 'svelte';
	import { leaguesIndexStore, resourceMapStore, sessionStore } from '$lib/stores/sessionStores';
	import { savedStores } from '$lib/stores/savedStores';
	import { handleScroll } from '$lib/helpers/listScrollControls';
	import { navToCardsSite } from '$lib/helpers/navigationHelper';

	let items = [];
	let filteredLeagues = [];
	let totals = {}; // Liga-Gesamtzahlen
	let clubTotals = {}; // Club-Counts je Liga (lazy)

	let expandedLeagueId = null;

	const BIT = {
		all: 1,
		noBase: 2,
		onlyBest: 4,
		onlyBestSpecial: 8
	};

	onMount(() => handleScroll(items));

	/* ---------------- LIGA-GESAMTZAHLEN ---------------- */
	$: {
		const q = ($sessionStore.searchQuery ?? '').toLowerCase().trim();
		const all = Object.entries($leaguesIndexStore.leagues ?? {}).map(([id, c]) => ({ ...c, id }));

		filteredLeagues = q ? all.filter((c) => (c?.name ?? '').toLowerCase().includes(q)) : all;
		filteredLeagues.sort((a, b) => a.sortId - b.sortId);
		handleScroll(items);

		const rm = $resourceMapStore?.data ?? {};
		const variant = $savedStores.displayedCardsVariant;
		const bitMask = BIT[variant] ?? 0;

		const tmp = {};
		for (const l of filteredLeagues) {
			if (Number(l.id) === 2118) {
				// normale Liga-Spieler zählen
				const baseCount = Object.values(rm).filter(
					(e) => e && e.l === 2118 && (variant === 'all' || (e.m & bitMask) !== 0)
				).length;

				// Hero-Club 114605 mitzählen (ebenfalls nach Variant filtern!)
				const heroCount = Object.values(rm).filter(
					(e) => e && e.club === 114605 && (variant === 'all' || (e.m & bitMask) !== 0)
				).length;

				tmp[l.id] = baseCount + heroCount;
			} else {
				tmp[l.id] = Object.values(rm).filter(
					(e) => e && e.l === Number(l.id) && (variant === 'all' || (e.m & bitMask) !== 0)
				).length;
			}
		}
		totals = tmp;
	}

	/* ---------------- CLUB-ZAHLEN ---------------- */
	function recalcClubTotals() {
		if (!expandedLeagueId) return;
		const rm = $resourceMapStore?.data ?? {};
		const variant = $savedStores.displayedCardsVariant;
		const bitMask = BIT[variant] ?? 0;

		const league = $leaguesIndexStore.leagues[expandedLeagueId];
		const counts = {};

		for (const c of league.clubIds ?? []) {
			if (String(c.id).includes('_')) c.id = Number(c.id.split('_')[1]);

			if (expandedLeagueId == 2118) {
				counts[c.id] = Object.values(rm).filter((e) => {
					if (!e || e.club !== Number(c.id)) return false;
					return variant === 'all' ? true : (e.m & bitMask) !== 0;
				}).length;
			} else {
				counts[c.id] = Object.values(rm).filter((e) => {
					if (!e || e.l !== Number(expandedLeagueId) || e.club !== Number(c.id)) return false;
					return variant === 'all' ? true : (e.m & bitMask) !== 0;
				}).length;
			}
		}
		clubTotals = { ...clubTotals, [expandedLeagueId]: counts };
	}

	function toggleLeague(id) {
		expandedLeagueId = expandedLeagueId === id ? null : id;
		recalcClubTotals();
	}

	// <<=== Reaktiv: neu zählen wenn Variant ODER Liga geändert
	$: if (expandedLeagueId && $savedStores.displayedCardsVariant) {
		recalcClubTotals();
	}
</script>

<svelte:window on:scroll={() => handleScroll(items)} />

<section class="grid grid-cols-1 gap-4 px-4 py-4">
	{#each filteredLeagues as league, i}
		<div
			bind:this={items[i]}
			class="border-2 pl-8 border-accent group/listItem relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:brightness-110"
			style="background:linear-gradient(110deg,var(--color-baseC) 30%,var(--color-accent) 70%);
			       opacity:0;pointer-events:none;"
		>
			<!-- Kopfzeile Liga -->
			<button
				on:click={() => navToCardsSite('Leagues', league.id)}
				class="flex w-full items-center justify-between px-2 h-16 cursor-pointer"
			>
				<div class="flex items-center h-full gap-4">
					{#if league.cId === null}
						<img
							src={`https://cdn.easysbc.io/fc25/clubs/114605.png`}
							class="h-full py-4 contrast-75"
							alt=""
						/>
					{:else}
						<img
							src={`https://cdn.easysbc.io/fc25/countries/${league.cId}.png`}
							class="h-full py-6"
							alt=""
						/>
					{/if}
					<img
						src={`https://cdn.easysbc.io/fc25/leagues/dark/${league.id}.png`}
						class="h-full py-4 contrast-75"
						alt=""
					/>
					<span>{league.name}</span>
				</div>
				<div class="flex items-center text-textC gap-2">
					<span>{totals[league.id] ?? 0}</span>/<span>{totals[league.id] ?? 0}</span>
				</div>
			</button>

			<!-- Pfeil für Expand -->
			<button
				class="absolute top-1/2 -translate-y-1/2 left-2 cursor-pointer transition-all duration-500 text-textC {expandedLeagueId ===
				league.id
					? 'rotate-90'
					: ''}"
				on:click={() => toggleLeague(league.id)}>➤</button
			>
		</div>

		<!-- Clubs -->
		<!-- Clubs -->
		{#if expandedLeagueId === league.id}
			<div class="grid grid-cols-2 px-8 gap-2">
				{#each league.clubIds ?? [] as cid, j}
					<button
						on:click={() => {
							const clubId =
								(cid.id === 114605 || String(cid.id).includes('114605')) && league.id != 2118
									? `${league.id}_${cid.id}`
									: cid.id;
							console.log(clubId);
							navToCardsSite('Clubs', clubId);
						}}
						class="flex odd:pl-6 even:pr-6 px-2 py-1 h-8 justify-between cursor-pointer"
						style="background: linear-gradient(
					to {j % 2 === 0 ? 'left' : 'right'},
					var(--color-accent) 40%,
					transparent 100%
				);"
						bind:this={items[i + 60 + j]}
					>
						<div class="flex h-full items-center gap-2 px-2">
							{#if String(cid.id).includes('114605')}
								<img
									src="https://cdn.easysbc.io/fc25/clubs/114605.png"
									class="h-full contrast-75"
									alt=""
								/>
							{:else}
								<img
									src={`https://cdn.easysbc.io/fc25/clubs/${cid.id}.png`}
									class="h-full contrast-75"
									alt=""
								/>
							{/if}
							<span>{cid.name}</span>
						</div>
						<div class="flex gap-1">
							<span>{clubTotals[league.id]?.[cid.id] ?? 0}</span>/
							<span>{clubTotals[league.id]?.[cid.id] ?? 0}</span>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	{/each}
</section>
