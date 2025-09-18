<script>
	import { resourceMapStore } from '$lib/stores/sessionStores';
	import { page } from '$app/stores';
	import { savedStores, collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';

	const navItems = [
		{ href: '/Versions', label: 'Kartenübersicht' },
		{ href: '/Batches', label: 'Batches' },
		{ href: '/allCardsFrom', label: 'Alle Karten von' },
		{ href: '/FAQ', label: 'FAQ' },
		{ href: '/Settings', label: 'Einstellungen' }
	];

	$: totalCount =
		$savedStores.displayedCardsVariant === 'all'
			? $resourceMapStore?.meta?.totalAll
			: $savedStores.displayedCardsVariant === 'noBase'
				? $resourceMapStore?.meta?.totalNoBase
				: $savedStores.displayedCardsVariant === 'onlyBest'
					? $resourceMapStore?.meta?.totalOnlyBest
					: $resourceMapStore?.meta?.totalOnlyBestSpecial;

	$: collectedCount = $impossibleCardsStore.length + $collectedCardsStore.length;

	// /Versions ist Fallback, falls die aktuelle URL nicht in navItems steht
	$: activeHref = navItems.find((item) => item.href === $page.url.pathname)?.href || '/Versions';
</script>

<div
	class="h-20 w-full text-white sticky top-0 z-50 left-0 flex items-center contrast-125 justify-between p-4"
>
	<nav class="lg:flex -space-x-1 hidden">
		{#each navItems as item, i}
			<a
				href={item.href}
				class="hover:underline bg-accent py-2 px-1
				       first:[clip-path:polygon(0_0,calc(100%-10px)_0%,100%_50%,calc(100%-10px)_100%,0_100%)]
				       [clip-path:polygon(0_0,calc(100%-10px)_0%,100%_50%,calc(100%-10px)_100%,0_100%,10px_50%)]
				       last:[clip-path:polygon(0_0,100%_0%,100%_100%,0_100%,10px_50%)]"
			>
				<span
					class={`text-base  font-b py-2 px-5
						${
							i === 0
								? '[clip-path:polygon(0_0,calc(100%-8px)_0%,100%_50%,calc(100%-8px)_100%,0_100%)]'
								: i === navItems.length - 1
									? '[clip-path:polygon(2px_0,100%_0%,100%_100%,2px_100%,10px_50%)]'
									: '[clip-path:polygon(2px_0,calc(100%-8px)_0%,100%_50%,calc(100%-8px)_100%,2px_100%,10px_50%)]'
						}
						${activeHref === item.href ? 'bg-accent text-baseC' : 'bg-baseC text-white'}             
					`}
				>
					{item.label}
				</span>
			</a>
		{/each}
	</nav>

	<!-- Zähler rechts -->
	<div class="flex -space-x-2 contrast-125">
		<div
			class="bg-accent text-3xl font-black text-baseC p-1 pr-2 flex items-center [clip-path:polygon(0_0,100%_0%,calc(100%-16px)_50%,100%_100%,0_100%)]"
		>
			<div
				class="flex gap-1 bg-baseC text-textC pr-6 px-3 py-1 [clip-path:polygon(0_0,calc(100%-1px)_0%,calc(100%-15px)_50%,calc(100%-1px)_100%,0_100%)]"
			>
				<span>Gesammelt:</span>
			</div>
		</div>
		<div
			class="bg-accent text-3xl font-black text-baseC p-1 flex items-center [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,0_50%)]"
		>
			<div
				class="flex gap-1 bg-baseC text-textC px-3 pl-6 py-1 [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,2px_50%)]"
			>
				<span>{collectedCount}</span>/<span>{totalCount}</span>
			</div>
		</div>
	</div>
</div>
