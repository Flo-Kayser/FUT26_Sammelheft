<script>
	import '../app.css';

	import GlobalMenu from '$lib/svelte/GlobalMenu.svelte';
	import { apiClient } from '$lib/apiClient';
	import { onMount } from 'svelte';
	import { versionIndexStore, resourceMapStore, countriesIndexStore, leaguesIndexStore } from '$lib/stores/sessionStores';
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

</script>

<main class=" relative select-none bg-tri">
	<GlobalMenu />

	{@render children()}
</main>
