<script>
	import { resourceMapStore } from '$lib/stores/sessionStores';
	import { savedStores } from '$lib/stores/savedStores';


	$: totalCount =
		$savedStores.displayedCardsVariant === 'all'
			? $resourceMapStore?.meta?.totalAll
			: $savedStores.displayedCardsVariant === 'nobase'
				? $resourceMapStore?.meta?.totalNoBase
				: $savedStores.displayedCardsVariant === 'onlybest'
					? $resourceMapStore?.meta?.totalOnlyBest
					: $resourceMapStore?.meta?.totalOnlyBestSpecial;

	let collectedCount = 1712;
</script>

<div class="h-20 w-full text-white sticky top-0 z-50 left-0 flex items-center contrast-125 justify-between p-4">
	<nav class="flex gap-4">
		<a href="/Versions" class="hover:underline">Cards</a>
		<a href="/Settings" class="hover:underline">Settings</a>
	</nav>

	<div class="flex -space-x-2 contrast-125">
		<div class="bg-accent text-3xl font-black text-baseC p-1 pr-2 flex items-center [clip-path:polygon(0_0,100%_0%,calc(100%-16px)_50%,100%_100%,0_100%)]">
			<div
			class="flex gap-1 bg-baseC text-textC pr-6 px-3 py-1 [clip-path:polygon(0_0,calc(100%-1px)_0%,calc(100%-15px)_50%,calc(100%-1px)_100%,0_100%)]">
				<span>Gesammelt:</span>
			</div>
		</div>
		<div
			class="bg-accent text-3xl font-black text-baseC p-1 flex items-center [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,0_50%)]"
		>
			<div
				class="flex gap-1 bg-baseC text-textC px-3 pl-6 py-1 [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,2px_50%)]"
			>
				<span>{collectedCount}</span>/
				<span>{totalCount}</span>
			</div>
		</div>
	</div>
</div>
