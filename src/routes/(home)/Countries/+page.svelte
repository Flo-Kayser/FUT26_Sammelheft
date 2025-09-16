<script>
	import { onMount } from 'svelte';
	import { countriesIndexStore, resourceMapStore, sessionStore } from '$lib/stores/sessionStores';
	import { savedStores } from '$lib/stores/savedStores';
	import { handleScroll } from '$lib/helpers/listScrollControls';

	let items = [];
	let filteredCountries = [];
	let totals = {};

	const BIT = {
		all: 1,
		nobase: 2,
		onlybest: 4,
		onlybestspecial: 8
	};

	onMount(() => handleScroll(items));

	$: {
		const q = ($sessionStore.searchQuery ?? '').toLowerCase().trim();
		const all = Object.entries($countriesIndexStore.countries ?? {}).map(([id, c]) => ({
			...c,
			id
		}));

		filteredCountries = q
			? all.filter(
					(c) =>
						(c?.name ?? '').toLowerCase().includes(q) || (c?.deName ?? '').toLowerCase().includes(q)
				)
			: all;

		filteredCountries.sort((a, b) => a.sortId - b.sortId);
		handleScroll(items);

		const rm = $resourceMapStore?.data ?? {};
		const variant = $savedStores.displayedCardsVariant;
		const bitMask = BIT[variant] ?? 0;

		const tmp = {};
		for (const c of filteredCountries) {
			tmp[c.id] = Object.values(rm).filter((e) => {
				if (!e || e.c !== Number(c.id)) return false;
				return variant === 'all' ? true : (e.m & bitMask) !== 0;
			}).length;
		}
		totals = tmp;
	}
</script>

<svelte:window on:scroll={() => handleScroll(items)} />

<section class="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2 xl:grid-cols-3">
	{#each filteredCountries as country, i}
		<div
			bind:this={items[i]}
			class="relative flex h-16 w-full transform border-2 border-accent transition-all duration-300 group/listItem hover:-translate-y-1 hover:brightness-110"
			style="background:linear-gradient(110deg,var(--color-baseC) 30%,var(--color-accent) 70%);
			       opacity:0;pointer-events:none;"
		>
			<button
				on:click={() => console.log(country.name, country.id)}
				class="absolute right-0 -top-6 aspect-square rounded-t-sm bg-accent px-2 text-2xl opacity-0 transition-opacity duration-300 group-hover/listItem:opacity-100"
			>
				☆
			</button>

			<button
				on:click={() => console.log(country.name)}
				class="relative flex h-full w-full items-center justify-between px-2"
			>
				<div class="flex h-full items-center gap-2">
					<img
						src={`https://cdn.easysbc.io/fc25/countries/${country.id}.png`}
						class="h-full py-4 contrast-75"
                        loading="lazy"
						alt="flagImg"
					/>
					<span>{country.deName}</span>
				</div>
				<div class="flex h-full items-center text-textC">
					<span>{totals[country.id] ?? 0}</span>/<span>{totals[country.id] ?? 0}</span>
				</div>
			</button>
		</div>
	{/each}
</section>
