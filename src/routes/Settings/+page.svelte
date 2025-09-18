<script>
	import { browser } from '$app/environment';
	import { themeStore } from '$lib/stores/savedStores';
	import { get, derived } from 'svelte/store';

	const vars = [
		{ name: '--color-baseC', label: 'Basisfarbe' },
		{ name: '--color-accent', label: 'Akzentfarbe' },
		{ name: '--color-textC', label: 'Textfarbe' }
	];

	const themes = {
		Classic: { '--color-baseC': '#ffffff', '--color-accent': '#aaaaaa', '--color-textC': '#000000' },
		Purple:  { '--color-baseC': '#121212', '--color-accent': '#8B58CC', '--color-textC': '#e0e0e0' },
		Cyan:    { '--color-baseC': '#2A6F7D', '--color-accent': '#d2d2d2', '--color-textC': '#000000' },
		Green:   { '--color-baseC': '#0a0a03', '--color-accent': '#06691c', '--color-textC': '#fffefc' },
		Yellow:  { '--color-baseC': '#000000', '--color-accent': '#D6B413', '--color-textC': '#ffffff' },
		Custom:  {}
	};

	// Lokale Refs
	let { selectedTheme, colors } = get(themeStore);

	// CSS Variablen aus Store anwenden
	function applyColors(cs) {
		if (!browser) return;
		Object.entries(cs).forEach(([n, v]) => document.documentElement.style.setProperty(n, v));
	}

	// initial anwenden
	if (browser) applyColors(colors);

	function applyTheme(themeName) {
		const themeVars = themes[themeName];
		applyColors(themeVars);
		selectedTheme = themeName;
		colors = { ...themeVars };
		themeStore.set({ selectedTheme, colors });
	}

	function updateVar(name, value) {
		colors = { ...colors, [name]: value };
		applyColors({ [name]: value });
		selectedTheme = 'Custom';
		themeStore.set({ selectedTheme, colors });
	}

	// Wenn gespeicherte Farben einem Preset entsprechen -> Preset auswählen
	if (browser) {
		const match = Object.entries(themes).find(([key, t]) =>
			key !== 'Custom' &&
			Object.entries(t).every(([n, v]) => colors[n]?.toLowerCase() === v.toLowerCase())
		);
		if (match) {
			selectedTheme = match[0];
			themeStore.set({ selectedTheme, colors });
		}
	}
</script>

<div class="p-4 space-y-6">
	<div class="flex flex-wrap gap-3">
		{#each Object.keys(themes) as t}
			<button
				on:click={() => applyTheme(t)}
				class="px-4 py-2 rounded border transition-colors
				       {selectedTheme === t ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}"
			>
				{t}
			</button>
		{/each}
	</div>

	{#if selectedTheme === 'Custom'}
		<div class="space-y-4">
			{#each vars as v}
				<label class="flex items-center space-x-3">
					<span class="w-32">{v.label}</span>
					<input
						type="color"
						bind:value={colors[v.name]}
						on:input={(e) => updateVar(v.name, e.target.value)}
						class="w-12 h-8 cursor-pointer border rounded"
					/>
					<span class="font-mono text-sm">{colors[v.name]}</span>
				</label>
			{/each}
		</div>
	{/if}
</div>
