<script>
	import { resourceMapStore } from '$lib/stores/sessionStores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { savedStores, collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';

	const navItems = [
		{ href: '/Versions', label: 'Kartenübersicht' },
		{ href: '/Batches', label: 'Batches' },
		{ href: '/allCardsFrom', label: 'Alle Karten von' },
		{ href: '/FAQ', label: 'FAQ' },
		{ href: '/Settings', label: 'Einstellungen' }
	];

	const variantOptions = [
		{ value: 'all', label: 'Alle Karten' },
		{ value: 'noBase', label: 'Keine Basic Karten' },
		{ value: 'onlyBest', label: 'Beste Version' },
		{ value: 'onlyBestSpecial', label: 'Beste Special-Version' }
	];

	const BIT = {
		all: 1,
		noBase: 2,
		onlyBest: 4,
		onlyBestSpecial: 8
	};

	function matchesVariant(entry, variant) {
		if (!entry) return false;
		if (variant === 'all') return true;
		const mask = BIT[variant] ?? 0;
		return (entry.m & mask) !== 0;
	}

	$: totalCount = (() => {
		const variant = $savedStores.displayedCardsVariant;
		const rm = $resourceMapStore?.data ?? {};
		return Object.values(rm).filter((e) => matchesVariant(e, variant)).length;
	})();

	$: collectedCount = (() => {
		const variant = $savedStores.displayedCardsVariant;
		const rm = $resourceMapStore?.data ?? {};
		const allCollected = [...$collectedCardsStore, ...$impossibleCardsStore];
		return allCollected.filter((rid) => matchesVariant(rm[rid], variant)).length;
	})();

	$: activeHref = navItems.find((item) => item.href === $page.url.pathname)?.href || '/Versions';
</script>

<div class="h-20 w-full text-white sticky top-0 z-50 left-0 flex contrast-125 md:px-4 p-2">
	<!-- lg display -->
	<div class="w-full lg:flex hidden justify-between items-center">
		<nav class="flex -space-x-1">
			{#each navItems as item, i}
				<a
					href={item.href}
					class=" bg-accent py-2 px-1
				       first:[clip-path:polygon(0_0,calc(100%-10px)_0%,100%_50%,calc(100%-10px)_100%,0_100%)]
				       [clip-path:polygon(0_0,calc(100%-10px)_0%,100%_50%,calc(100%-10px)_100%,0_100%,10px_50%)]
				       last:[clip-path:polygon(0_0,100%_0%,100%_100%,0_100%,10px_50%)]"
				>
					<span
						class={`text-base w-full font-b py-2 px-5
						${
							i === 0
								? '[clip-path:polygon(0_0,calc(100%-8px)_0%,100%_50%,calc(100%-8px)_100%,0_100%)]'
								: i === navItems.length - 1
									? '[clip-path:polygon(2px_0,100%_0%,100%_100%,2px_100%,10px_50%)]'
									: '[clip-path:polygon(2px_0,calc(100%-8px)_0%,100%_50%,calc(100%-8px)_100%,2px_100%,10px_50%)]'
						}
						${activeHref === item.href ? 'bg-accent text-baseC' : 'bg-baseC text-textC'}             
					`}
					>
						{item.label}
					</span>
				</a>
			{/each}
		</nav>

		<div class="flex -space-x-2 contrast-125">
			<div
				class="bg-accent text-2xl font-black p-1 pr-2 flex items-center [clip-path:polygon(0_0,100%_0%,calc(100%-16px)_50%,100%_100%,0_100%)]"
			>
				<div
					class="flex gap-1 bg-baseC text-textC pr-6 px-3 py-1 [clip-path:polygon(0_0,calc(100%-1px)_0%,calc(100%-15px)_50%,calc(100%-1px)_100%,0_100%)]"
				>
					<span>Gesammelt:</span>
				</div>
			</div>
			<div
				class="bg-accent text-2xl font-black p-1 flex items-center [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,0_50%)]"
			>
				<div
					class="flex gap-1 bg-baseC text-textC px-3 pl-6 py-1 [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,2px_50%)]"
				>
					<span>{collectedCount}</span>/<span>{totalCount}</span>
				</div>
			</div>
		</div>
	</div>

	<div class="flex lg:hidden flex-col w-full gap-2 relative">
		<select
			class="px-3 py-2 text-textC outline-none bg-baseC border-4 border-accent w-full appearance-none"
			on:change={(e) => goto(e.target.value)}
			bind:value={activeHref}
		>
			{#each navItems as item}
				<option value={item.href}>{item.label}</option>
			{/each}
		</select>
		<span class="absolute right-2 top-3 text-xl pointer-events-none">☰</span>
		<div class="flex gap-2 justify-between flex-row-reverse">
			<div
				class="flex max-w-1/2 bg-baseC text-sm md:text-xl text-textC py-2 px-2 border-2 md:border-4 border-accent gap-2"
			>
				<span class="block md:hidden">Ges:</span>
				<span class="hidden md:block">Gesammelt:</span>
				<div class="flex gap-1">
					<span>{collectedCount}</span> /
					<span>{totalCount}</span>
				</div>
			</div>

			<div class="flex relative">
				<select
					class="px-3 py-2 text-textC text-xs md:text-lg bg-baseC border-2 md:border-4 border-accent appearance-none focus:outline-none pr-8"
					bind:value={$savedStores.displayedCardsVariant}
				>
					{#each variantOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				<span class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none md:text-lg">☰</span>
			</div>
		</div>
	</div>
</div>
