<script>
	import '../app.css';

	import GlobalMenu from '$lib/svelte/GlobalMenu.svelte';
    import { page } from '$app/stores';
	import { apiClient } from '$lib/apiClient';
	import { onMount } from 'svelte';
	import {
		versionIndexStore,
		resourceMapStore,
		countriesIndexStore,
		leaguesIndexStore
	} from '$lib/stores/sessionStores';
	export let children;

	onMount(() => {
		[
			['index-data/versionIndex.json', versionIndexStore],
			['index-data/countriesIndex.json', countriesIndexStore],
			['index-data/leaguesIndex.json', leaguesIndexStore],
			['index-data/resourceMap.json', resourceMapStore]
		].forEach(([url, store]) => {
			apiClient.fetchData(url).then(store.set);
		});
	});

	const hideMenuOn = /^\/(Countries|Leagues|Versions|Clubs)\/[^/]+$/;
</script>

<main class="relative select-none bg-tri">
    {#if !hideMenuOn.test($page.url.pathname)}
		<GlobalMenu />
	{/if}

	{@render children()}
</main>
