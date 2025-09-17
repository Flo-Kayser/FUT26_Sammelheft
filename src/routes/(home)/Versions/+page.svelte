<script>
	import { onMount } from 'svelte';
	import { versionIndexStore, sessionStore } from '$lib/stores/sessionStores';
	import { savedStores } from '$lib/stores/savedStores';
	import { getTotalValue } from '$lib/helpers/CounterValue';
	import { handleScroll } from '$lib/helpers/listScrollControls';
	import { navToCardsSite } from '$lib/helpers/navigationHelper';
	let items = [];
	let filteredVersions = [];

	$: console.log($versionIndexStore)

	onMount(() => {
		handleScroll(items);
	});

	$: {
		const q = ($sessionStore.searchQuery ?? '').toLowerCase().trim();
		const all = Object.entries($versionIndexStore?.versions ?? {}).map(([id, v]) => ({ ...v, id }));

		filteredVersions = q
			? all.filter((v) => (v?.details?.name ?? '').toLowerCase().includes(q))
			: all;

		filteredVersions.sort((a, b) => new Date(b.details.createdAt) - new Date(a.details.createdAt));
		handleScroll(items);
	}
</script>

<svelte:window on:scroll={() => handleScroll(items)} />

<section
	class="gap-4 lg:grid-cols-2 grid grid-cols-1 xl:grid-cols-3 px-4 py-4"
	on:scroll={() => handleScroll(items)}
>
	{#each filteredVersions as version, i}
		<div
			bind:this={items[i]}
			class="relative flex group/listItem w-full h-16 transform border-r-0 hover:brightness-110 hover:-translate-y-1 transition-all duration-300 border-2 border-accent"
			style="background: linear-gradient(110deg, var(--color-baseC) 30%, var(--color-accent) 70%); opacity: 0; pointer-events: none;"
		>
			<button
				on:click={() => {
					console.log(version.details.name, version.id);
				}}
				class="group-hover/listItem:opacity-100 cursor-pointer bg-accent opacity-0 transition-opacity rounded-t-sm duration-300 absolute px-2 aspect-square text-2xl -top-6 right-0"
			>
				☆
			</button>

			<button
				on:click={() => {
					navToCardsSite('Versions', version.id);
				}}
				class="h-full flex justify-between px-2 w-full items-center cursor-pointer relative"
			>
				<div class="h-full flex gap-2 items-center">
					<img src={version.details.url} class="h-full contrast-75 py-1" alt="" />
					<span>
						{version.details.name}
					</span>
				</div>
				<div class="text-textC h-full flex items-center">
					<span
						>{getTotalValue(
							version.id,
							'version'
						)}</span
					>/
					<span
						>{getTotalValue(
							version.id,
							'version'
						)}</span
					>
				</div>
			</button>
		</div>
	{/each}
</section>
