import { browser } from "$app/environment";

export function handleScroll(items) {
		if(!items || !browser) return;
		const y = window.scrollY;

		items.forEach((el) => {
			if (!el) return
			const rect = el?.getBoundingClientRect();
			el.style.opacity = rect?.top > 250 ? 1 : 0;
			el.style.pointerEvents = rect?.top > 250 ? 'auto' : 'none';
		});
	}