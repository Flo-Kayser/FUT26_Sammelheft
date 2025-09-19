<script>
	export let children;
	import { page } from '$app/state';
	import { sessionStore } from '$lib/stores/sessionStores';
	import { savedStores } from '$lib/stores/savedStores';
</script>

<div class="text-center select-none text-textC contrast-125 font-bold scroll-smooth">
	<h1 class="font-fl text-5xl my-20 text-white">FUT26 Sammelheft</h1>

	<div class="sticky top-24 w-full justify-center border-b-4 mb-10 pb-5 border-accent px-4 flex">
		<div class="grid grid-cols-5 md:gap-1 w-[80vw] text-sm md:text-lg md:gap-y-4">
			<nav class="col-start-2 col-span-3 grid grid-cols-subgrid">
				{#each [{ href: '/Versions', label: 'Versionsübersicht', label_small: 'Versionen' }, { href: '/Countries', label: 'Länderübersicht', label_small: 'Länder' }, { href: '/Leagues', label: 'Ligenübersicht', label_small: 'Ligen' }] as item}
					<a
						href={item.href}
						class="SubNav w-full after:bg-baseC font-bold"
						class:activeSubNav={page.url.pathname === item.href}
					>
						<span class="md:hidden flex ml-2">
							{item.label_small}
						</span>
						<span class="hidden md:flex">
							{item.label}
						</span>
					</a>
				{/each}
			</nav>

			<div
				class="w-full SubNav px-4 col-span-2 row-start-2 after:bg-accent focus-within:after:bg-baseC {page.url.pathname.includes(
					'/Versions'
				)
					? 'col-span-3 col-start-2'
					: 'col-span-2 col-start-1'}"
			>
				<input
					type="text"
					bind:value={$sessionStore.searchQuery}
					placeholder="Schnellsuche ..."
					class="w-full p-2 rounded outline-none placeholder:text-baseC placeholder:font-base"
				/>
			</div>

			<div
				class="row-start-2 col-span-3 flex w-full text-sm -space-x-2 items-center py-0.5 px-1 bg-accent [clip-path:polygon(0px_0,calc(100%-14px)_0,calc(100%-0px)_50%,calc(100%-14px)_100%,0px_100%,14px_50%)] {page.url.pathname.includes(
					'/Versions'
				)
					? 'hidden'
					: ''}"
			>
				{#each [{ value: 'all', label: 'Alle' }, { value: 'noBase', label: 'Ohne Basis' }, { value: 'onlyBest', label: 'Beste' }, { value: 'onlyBestSpecial', label: 'Beste Spezial' }] as option}
					<label
						class="bg-baseC px-1 cursor-pointer items-center h-full w-full whitespace-nowrap py-1 flex [clip-path:polygon(2px_0,calc(100%-13px)_0,calc(100%-1px)_50%,calc(100%-13px)_100%,2px_100%,15px_50%)]"
					>
						<input
							type="radio"
							class="sr-only peer"
							bind:group={$savedStores.displayedCardsVariant}
							value={option.value}
						/>
						<span
							class="bg-accent w-full flex items-center justify-center text-baseC peer-checked:text-accent peer-checked:bg-baseC px-8 h-full [clip-path:polygon(6px_0,calc(100%-12px)_0,calc(100%-2px)_50%,calc(100%-12px)_100%,6px_100%,16px_50%)]"
							>{option.label}</span
						>
					</label>
				{/each}
			</div>
		</div>
	</div>

	{@render children()}
</div>
