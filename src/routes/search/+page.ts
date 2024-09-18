import type { PageLoad } from "./$types";
import lyrics from "$lib/data/lyrics.json";
import type { Lyric } from "$lib/types/lyrics";

function findLyrics(list: typeof lyrics.data, word: string): Lyric[] {
	const foundLyrics: Lyric[] = [];
	if (word.length >= 3) {
		list.forEach(({ album, song, lyric, section }, index) => {
			if (lyric.toLowerCase().includes(word.trim().toLowerCase())) {
				foundLyrics.push({
					album,
					song,
					lineNumber: index - list.map(({ song }) => song).indexOf(song) + 1,
					lyric,
					prev: relativeLyric(list, index, -1),
					next: relativeLyric(list, index, 1),
					section
				});
			}
		});
	}
	return foundLyrics;
}

function relativeLyric(list: typeof lyrics.data, from: number, to: -1 | 1) {
	if (list[from + to]?.song === list[from].song) {
		return list[from + to].lyric;
	}
	return "...";
}

function count(list: Lyric[], item: "album" | "song") {
	return list
		.map(({ [item]: el }) => el)
		.filter((value, index, self) => self.indexOf(value) === index).length;
}

export const load: PageLoad = ({ url }) => {
	const searchHistory = url.searchParams.getAll("search");
	const search = searchHistory.at(-1)?.trim() ?? "";
	const foundLyrics = findLyrics(lyrics.data, search);

	return {
		search,
		searchHistory,
		foundLyrics,
		albumCount: count(foundLyrics, "album"),
		songCount: count(foundLyrics, "song"),
		query: url.search // forces reload on duplicate search params
	};
};
