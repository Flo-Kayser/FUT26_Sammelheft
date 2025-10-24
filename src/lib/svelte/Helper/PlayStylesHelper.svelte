<script>
	import { playStylesStore } from '$lib/stores/sessionStores';

	export let lineColor, bgColor, playStyleId;
</script>

{#if Object.values($playStylesStore)?.length > 0}
	{#if playStyleId === 6}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1086 1007" class={$$props.class}>
			<path
				d="M543 1006.7L1086 392.392L833.656 0.69873H254.344L0 393.624L543 1006.7Z"
				fill={bgColor}
			/>
			<path d={`${$playStylesStore[playStyleId]?.path}`} fill={lineColor} />
		</svg>
	{:else if playStyleId === 19}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100" class={$$props.class}>
			<path
				d="M54.8697 100L108.846 38.9357L83.7619 0H26.1763L0.893555 39.0582L54.8697 100Z"
				fill={bgColor}
			/>
			<path d={`${$playStylesStore[playStyleId]?.path}`} fill={lineColor} />
		</svg>
	{:else if playStyleId === 7 || playStyleId == 13 || playStyleId === 29}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 100" class={$$props.class}>
			<path
				d="M54.94 100L108.916 38.9357L83.8323 0H26.2466L0.963867 39.0582L54.94 100Z"
				fill={bgColor}
			/>
			<path d={`${$playStylesStore[playStyleId]?.path}`} fill={lineColor} />
		</svg>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 543 508" class={$$props.class}>
			<path
				d="M271.5 507.35L543 200.196L416.828 4.34961H127.172L0 200.812L271.5 507.35Z"
				fill={bgColor}
			/>
			<path d={`${$playStylesStore[playStyleId]?.path}`} fill={lineColor} />
		</svg>
	{/if}
{/if}
