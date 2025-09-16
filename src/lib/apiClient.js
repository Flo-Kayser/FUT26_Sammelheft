class ApiClient {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}

	async fetchData(endpoint) {
		const response = await fetch(`${this.baseUrl}${endpoint}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}
}

export const apiClient = new ApiClient('https://raw.githubusercontent.com/Flo-Kayser/db_futCards/refs/heads/main/db/');
