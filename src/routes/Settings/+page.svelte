<script>
	// Deine Variablen-Namen (wie in :root definiert)
	const vars = [
		{ name: '--color-baseC', label: 'Basisfarbe' },
		{ name: '--color-accent', label: 'Akzentfarbe' },
	];

	// aktuelle Werte aus dem :root lesen
	let colors = {};
	$: {
		vars.forEach(v => {
			const val = getComputedStyle(document.documentElement)
				.getPropertyValue(v.name)
				.trim();
			colors[v.name] = val;
		});
	}

	function updateVar(name, value) {
		document.documentElement.style.setProperty(name, value);
		colors[name] = value;
	}
</script>

<div class="space-y-4 p-4">
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
