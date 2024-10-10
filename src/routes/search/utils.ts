export function appendSearchQueryString(url: URL, word: string) {
	const searchParams = new URLSearchParams(url.search);
	searchParams.append("search", word);
	return searchParams.toString();
}
