import { get } from 'svelte/store';
import { savedStores } from '$lib/stores/savedStores';
import {
	versionIndexStore,
	countriesIndexStore,
	resourceMapStore
} from '$lib/stores/sessionStores';

const BIT = {
	all: 0,
	nobase: 1,
	onlybest: 4,
	onlybestspecial: 8
};

export function getTotalValue(id, type = 'default', resourceMap, variant) {
	
	const bitMask = BIT[variant] ?? 0;

	if (type === 'version') {
		const versions = get(versionIndexStore)?.versions ?? {};
		return versions[id]?.count ?? 0;
	}

	if (type === 'country') {
		const countryId = id;

		if (!resourceMap) return 1;

		return (
			Object.values(resourceMap)?.filter((e) => {
				if (!e || e.c !== countryId) return false;
				if (variant === 'all') return true;
				return (e.m & bitMask) !== 0;
			}).length + 2
		);
	}

	return 0;
}
