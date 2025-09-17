import { goto } from '$app/navigation';

export function navToCardsSite(section, id) {
		goto(`/${section}/${id}`);
	}