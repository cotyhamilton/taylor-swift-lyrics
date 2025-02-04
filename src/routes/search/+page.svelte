<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Input } from "$lib/components/ui/input";
	import X from "lucide-svelte/icons/x";
	import SearchCard from "./search-card.svelte";
	import { appendSearchQueryString } from "./utils";

	const { data } = $props();
	let input = $state("");

	function popSearchQueryString(index: number) {
		const search = $page.url.searchParams.getAll("search");
		search.splice(index, 1);
		const searchParams = new URLSearchParams(search.map((word) => ["search", word]));
		return searchParams.toString();
	}
</script>

<svelte:head>
	<title>taylor swift lyrics search</title>
</svelte:head>

<div class="md:mx-12">
	<div class={!data.foundLyrics.length ? "flex min-h-screen items-center" : ""}>
		<div class="w-full">
			<h1
				class={(!data.foundLyrics.length ? "text-6xl lg:text-8xl" : "text-4xl") +
					" my-6 text-center font-bold"}
			>
				<a href="/">taylor swift lyrics</a>
			</h1>
			<form
				class="mt-6 mb-4"
				onsubmit={async (e) => {
					e.preventDefault();
					if (input) {
						goto("?" + appendSearchQueryString($page.url, input));
						input = "";
					}
				}}
			>
				<Input type="search" enterkeyhint="search" placeholder="search lyrics" bind:value={input} />
			</form>
		</div>
	</div>

	{#if data.search.length}
		<p class="text-muted-foreground mb-4 text-sm">
			{`found ${data.foundLyrics.length} lyric${data.foundLyrics.length === 1 ? "" : "s"}, ${data.songCount} song${data.songCount === 1 ? "" : "s"}, and ${data.albumCount} album${data.albumCount === 1 ? "" : "s"}`}
		</p>
	{/if}

	<div class="my-4 flex gap-2 overflow-x-scroll">
		{#each data.searchHistory as query, index}
			<div class="bg-muted flex items-center rounded-full px-3 py-1 text-sm">
				<span class="mr-2">
					{query}
				</span>
				<button
					class="text-muted-foreground hover:text-foreground"
					aria-label={`Remove ${query} from search history`}
					onclick={() => {
						goto("?" + popSearchQueryString(index));
					}}
				>
					<X size={14} />
				</button>
			</div>
		{/each}
	</div>

	<div class="my-4 space-y-4">
		{#each data.foundLyrics as { album, song, lineNumber, lyric, prev, next, section } (song + lineNumber)}
			<SearchCard {album} {song} {lineNumber} {lyric} {prev} {next} {section} search={data.search}
			></SearchCard>
		{/each}
	</div>
</div>
