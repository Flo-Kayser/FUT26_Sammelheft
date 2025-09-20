<script>
	import { browser } from '$app/environment';
	import { themeStore } from '$lib/stores/savedStores';
	import { get } from 'svelte/store';

	const vars = [
		{ name: '--color-baseC', label: 'Basisfarbe' },
		{ name: '--color-accent', label: 'Akzentfarbe' },
		{ name: '--color-textC', label: 'Textfarbe' }
	];

	// Themes mit Farben + Beschreibung
	const themes = {
		Classic: {
			colors: {
				'--color-baseC': '#ffffff',
				'--color-accent': '#aaaaaa',
				'--color-textC': '#000000'
			},
			desc: 'Klassisches, neutrales Farbschema mit hellen Flächen und dunklem Text.'
		},
		Purple: {
			colors: {
				'--color-baseC': '#121212',
				'--color-accent': '#8B58CC',
				'--color-textC': '#e0e0e0'
			},
			desc: 'Dunkler Hintergrund mit kräftigem Lila-Akzent für einen modernen Look.'
		},
		Cyan: {
			colors: {
				'--color-baseC': '#2A6F7D',
				'--color-accent': '#d2d2d2',
				'--color-textC': '#000000'
			},
			desc: 'Frisches Blaugrün mit hellen Akzenten – klar und lebendig.'
		},
		Green: {
			colors: {
				'--color-baseC': '#0a0a03',
				'--color-accent': '#06691c',
				'--color-textC': '#fffefc'
			},
			desc: 'Dunkles Grün mit natürlichen Akzenten für ein ruhiges Erscheinungsbild.'
		},
		Yellow: {
			colors: {
				'--color-baseC': '#000000',
				'--color-accent': '#D6B413',
				'--color-textC': '#ffffff'
			},
			desc: 'Kräftiges Gelb auf schwarzem Hintergrund – hoher Kontrast, sehr auffällig.'
		},
		Custom: {
			colors: {
				'--color-baseC': '#444444',
				'--color-accent': '#f33a3a',
				'--color-textC': '#ffffff'
			},
			desc: 'Eigene Farbkombination erstellen und individuell anpassen.'
		}
	};

	let { selectedTheme, colors } = get(themeStore);

	function applyColors(cs) {
		if (!browser) return;
		Object.entries(cs).forEach(([n, v]) => document.documentElement.style.setProperty(n, v));
	}

	if (browser) applyColors(colors);

	function applyTheme(themeName) {
		const themeVars = themes[themeName].colors;
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

	if (browser) {
		const match = Object.entries(themes).find(
			([key, t]) =>
				key !== 'Custom' &&
				Object.entries(t.colors).every(([n, v]) => colors[n]?.toLowerCase() === v.toLowerCase())
		);
		if (match) {
			selectedTheme = match[0];
			themeStore.set({ selectedTheme, colors });
		}
	}
</script>

<div class="p-1 space-y-6">
	<!-- Themes mit eigener Farb-Demo -->
	<div class="space-y-4 flex flex-col w-full">
		{#each Object.entries(themes) as [name, t]}
			<div class="flex items-center justify-between gap-4">
				<button
					on:click={() => applyTheme(name)}
					class="min-w-20 md:min-w-32 h-12 text-sm md:text-base flex items-center justify-center font-bold border-2 transition-transform duration-150 hover:scale-105"
					style="background-color: {t.colors['--color-baseC'] || '#f0f0f0'};
							border-color: {t.colors['--color-accent'] || '#ccc'};
							color: {t.colors['--color-textC'] || '#000'};"
				>
					{name}
				</button>

				<span class="text-sm">{t.desc}</span>
			</div>
		{/each}
	</div>

	<!-- Farbwähler für Custom -->
	{#if selectedTheme === 'Custom'}
		<div class="space-y-4 pt-4">
			{#each vars as v}
				<label class="flex items-center justify-between gap-4">
					<span class="w-full">{v.label}</span>
					<input
						type="color"
						bind:value={colors[v.name]}
						on:input={(e) => updateVar(v.name, e.target.value)}
						class="w-full h-8 cursor-pointer border"
					/>
				</label>
			{/each}
		</div>
	{/if}
</div>
