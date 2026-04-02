import { savedStores } from '$lib/stores/savedStores.js';
export function toggleSwitch(switchName) {

	if (switchName === 'impossibleSwitch') {
		savedStores.update((store) => ({
			...store,
			missedSwitch: false
		}));
	}
	if (switchName === 'missedSwitch') {
		savedStores.update((store) => ({
			...store,
			impossibleSwitch: false
		}));
	}
}
