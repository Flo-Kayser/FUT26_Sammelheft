<script>
	export let children;
	import { page } from '$app/stores';
    import { goto } from '$app/navigation';

	const navItems = [
		{ href: '/Settings/CardSettings', label: 'Karten Einstellungen' },
		{ href: '/Settings/Backup', label: 'Sicherungskopie' },
		{ href: '/Settings/Themes', label: 'Farbschema' }
	];

    $: activeHref = 
		navItems.find((item) => $page.url.pathname.includes(item.href))?.href

</script>

<div class="flex lg:px-20 py-10">
	<div
		class="hidden lg:grid grid-cols-[1fr_3fr] w-full p-2 backdrop:blur-2xl bg-white/30 divide-accent divide-x-2"
	>
		<nav class="flex flex-col text-textC px-4">
			{#each navItems as item}
				<a
					href={item.href}
					class="p-2 m-1 hover:bg-accent hover:text-baseC hover:translate-x-3 hover:brightness-125 font-bold transition-all duration-300"
					class:bg-accent={$page.url.pathname === item.href}
					class:text-baseC={$page.url.pathname === item.href}
					class:translate-x-3={$page.url.pathname === item.href}
				>
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="text-white p-4">
			{@render children()}
		</div>
	</div>
	<div class="lg:hidden w-full p-4 flex flex-col gap-4">
		<div class="relative">
			<select
				bind:value={activeHref}
				on:change={(e) => goto(e.target.value)}
				class="px-3 py-2 text-textC font-black outline-none bg-accent w-full appearance-none"
			>
				{#each navItems as item}
					<option value={item.href}>{item.label}</option>
				{/each}
			</select>
			<span
				class="absolute top-1/2 transform -translate-y-1/2 text-textC text-xl right-1 flex items-center pr-2 pointer-events-none"
				>☰</span
			>
		</div>
		<div class="relative bg-white/30 backdrop:blur-2xl p-4 text-white">
			{@render children()}
		</div>
	</div>
</div>
