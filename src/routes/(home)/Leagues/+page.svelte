<script>
	import { onMount } from 'svelte';
	import { leaguesIndexStore, resourceMapStore, sessionStore } from '$lib/stores/sessionStores';
	import { savedStores, collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';
	import { handleScroll } from '$lib/helpers/listScrollControls';
	import { navToCardsSite } from '$lib/helpers/navigationHelper';

	let items = [];
	let filteredLeagues = [];
	let totals = {};      // { [leagueId]: { total, collected } }
	let clubTotals = {};  // { [leagueId]: { [clubId]: { total, collected } } }
	let expandedLeagueId = null;

	const BIT = { all:1, noBase:2, onlyBest:4, onlyBestSpecial:8 };

	onMount(() => handleScroll(items));

	/* ---------------- LIGA- & CLUB-ZÄHLER ---------------- */
	$: {
		const q = ($sessionStore.searchQuery ?? '').toLowerCase().trim();
		const all = Object.entries($leaguesIndexStore.leagues ?? {}).map(([id, c]) => ({ ...c, id }));
		filteredLeagues = q ? all.filter(l => (l?.name ?? '').toLowerCase().includes(q)) : all;
		filteredLeagues.sort((a,b) => a.sortId - b.sortId);
		handleScroll(items);

		const rm        = $resourceMapStore?.data ?? {};
		const variant   = $savedStores.displayedCardsVariant || 'all';
		const bitMask   = BIT[variant] ?? 0;
		const collected = new Set($collectedCardsStore);
		const impossible= new Set($impossibleCardsStore);

		// --- Ligen zählen ---
		const tmp = {};
		for (const l of filteredLeagues) {
			let total = 0, got = 0;

			for (const [rid, e] of Object.entries(rm)) {
				if (!e) continue;
				// Sonderfall Hero-Club bei Liga 2118
				if (Number(l.id) === 2118) {
					if (e.l === 2118 || e.club === 114605) {
						if (variant !== 'all' && !(e.m & bitMask)) continue;
						total++;
						if (collected.has(Number(rid)) || impossible.has(Number(rid))) got++;
					}
				} else if (e.l === Number(l.id)) {
					if (variant !== 'all' && !(e.m & bitMask)) continue;
					total++;
					if (collected.has(Number(rid)) || impossible.has(Number(rid))) got++;
				}
			}
			tmp[l.id] = { total, collected: got };
		}
		totals = tmp;

		// --- Clubs zählen (nur wenn aufgeklappt) ---
		if (expandedLeagueId) {
			const league = $leaguesIndexStore.leagues[expandedLeagueId];
			const cTmp = {};
			for (const c of league.clubIds ?? []) {
				const clubId = String(c.id).includes('_') ? Number(c.id.split('_')[1]) : Number(c.id);
				let total = 0, got = 0;
				for (const [rid, e] of Object.entries(rm)) {
					if (!e) continue;
					// Hero-Club darf ohne Liga-Check mitzählen
					if (e.club === clubId && (expandedLeagueId == 2118 || e.l === Number(expandedLeagueId))) {
						if (variant !== 'all' && !(e.m & bitMask)) continue;
						total++;
						if (collected.has(Number(rid)) || impossible.has(Number(rid))) got++;
					}
				}
				cTmp[c.id] = { total, collected: got };
			}
			clubTotals = { ...clubTotals, [expandedLeagueId]: cTmp };
		}
	}

	function toggleLeague(id) {
		expandedLeagueId = expandedLeagueId === id ? null : id;
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
			<!-- Liga-Kopf -->
			<button
				on:click={() => navToCardsSite('Leagues', league.id)}
				class="flex w-full items-center justify-between px-2 h-16"
			>
				<div class="flex items-center h-full gap-4">
					{#if league.cId === null}
						<img src="https://cdn.easysbc.io/fc25/clubs/114605.png" alt="" class="h-full py-4 contrast-75" />
					{:else}
						<img src={`https://cdn.easysbc.io/fc25/countries/${league.cId}.png`} alt="" class="h-full py-6" />
					{/if}
					<img src={`https://cdn.easysbc.io/fc25/leagues/dark/${league.id}.png`} alt="" class="h-full py-4 contrast-75" />
					<span>{league.name}</span>
				</div>
				<div class="flex items-center text-textC gap-2">
					<span>{totals[league.id]?.collected ?? 0}</span>/
					<span>{totals[league.id]?.total ?? 0}</span>
				</div>
			</button>

			<!-- Expand-Pfeil -->
			<button
				class="absolute top-1/2 -translate-y-1/2 left-2 text-textC transition-all duration-500 {expandedLeagueId === league.id ? 'rotate-90' : ''}"
				on:click={() => toggleLeague(league.id)}>➤</button>
		</div>

		<!-- Clubs -->
		{#if expandedLeagueId === league.id}
			<div class="grid grid-cols-2 px-8 gap-2">
				{#each league.clubIds ?? [] as cid, j}
					{@const club = clubTotals[league.id]?.[cid.id]}
					<button
						on:click={() => {
							const clubId =
								(cid.id === 114605 || String(cid.id).includes('114605')) && league.id != 2118
									? `${cid.id}` : cid.id;
							navToCardsSite('Clubs', clubId);
						}}
						class="flex odd:pl-6 even:pr-6 px-2 py-1 h-8 justify-between"
						style="background:linear-gradient(to {j % 2 === 0 ? 'left' : 'right'}, var(--color-accent) 40%, transparent 100%);"
						bind:this={items[i + 60 + j]}
					>
						<div class="flex h-full items-center gap-2 px-2">
							{#if String(cid.id).includes('114605')}
								<img src="https://cdn.easysbc.io/fc25/clubs/114605.png" class="h-full contrast-75" />
							{:else}
								<img src={`https://cdn.easysbc.io/fc25/clubs/${cid.id}.png`} class="h-full contrast-75" />
							{/if}
							<span>{cid.name}</span>
						</div>
						<div class="flex gap-1">
							<span>{club?.collected ?? 0}</span>/<span>{club?.total ?? 0}</span>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	{/each}
</section>
