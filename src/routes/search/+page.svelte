<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { backgroundImageMap } from "$lib/images";
	import X from "lucide-svelte/icons/x";

	const { data } = $props();
	let input = $state("");

	function appendSearchQueryString(word: string) {
		const searchParams = new URLSearchParams($page.url.search);
		searchParams.append("search", word);
		return searchParams.toString();
	}

	function popSearchQueryString(word: string) {
		const searchParams = new URLSearchParams($page.url.search);
		searchParams.delete("search", word);
		return searchParams.toString();
	}
</script>

<svelte:head>
	<title>taylor swift lyrics search</title>
</svelte:head>

<div class="mt-6 md:mx-12">
	<form
		class="mb-4"
		onsubmit={async (e) => {
			e.preventDefault();
			if (input) {
				goto("?" + appendSearchQueryString(input));
				input = "";
			}
		}}
	>
		<Input type="search" enterkeyhint="search" placeholder="search lyrics" bind:value={input} />
	</form>

	{#if data.search.length}
		<p class="mb-4 text-sm text-muted-foreground">
			{`found ${data.foundLyrics.length} lyric${data.foundLyrics.length === 1 ? "" : "s"}, ${data.songCount} song${data.songCount === 1 ? "" : "s"}, and ${data.albumCount} album${data.albumCount === 1 ? "" : "s"}`}
		</p>
	{/if}

	<div class="my-4 flex gap-2 overflow-x-scroll">
		{#each data.searchHistory as query}
			<div class="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
				<span class="mr-2">
					{query}
				</span>
				<button
					class="text-muted-foreground hover:text-foreground"
					aria-label={`Remove ${query} from search history`}
					onclick={() => {
						goto("?" + popSearchQueryString(query));
					}}
				>
					<X size={14} />
				</button>
			</div>
		{/each}
	</div>

	<div class="my-4 space-y-4">
		{#each data.foundLyrics as { album, song, lineNumber, lyric, prev, next, section } (song + lineNumber)}
			<Card.Root class={`${backgroundImageMap[album]} bg-cover bg-center text-primary-foreground`}>
				<Card.Header>
					<Card.Title>
						<p class="text-shadow">
							<a class="hover:underline" href={`/albums/${album}`}>{album}</a>
						</p>
						<p>
							<a
								class="text-shadow text-2xl font-bold hover:underline"
								href={`/albums/${album}/${encodeURIComponent(song)}`}>{song}</a
							>
						</p>
						<Badge variant="secondary">{section}</Badge>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-shadow grid grid-cols-[auto,1fr]">
						<span class="w-8 pr-2 text-right font-mono text-muted">
							{lineNumber - 1}
						</span>
						<p class="text-muted">
							{prev}
						</p>
					</div>
					<div class="text-shadow grid grid-cols-[auto,1fr]">
						<span class="w-8 pr-2 text-right font-mono text-xl">
							{lineNumber}
						</span>
						<p class="text-lg font-bold">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html lyric
								.split(" ")
								.map(
									(word) =>
										`<a
											class="hover:underline"
											href="?${appendSearchQueryString(word.replace(",", "").toLowerCase())}"
										>
										${word.replace(new RegExp(data.search, "gi"), (match) => `<u>${match}</u>`)}
										</a>`
								)
								.join(" ")}
						</p>
					</div>
					<div class="text-shadow grid grid-cols-[auto,1fr]">
						<span class="w-8 pr-2 text-right font-mono text-muted">
							{lineNumber + 1}
						</span>
						<p class="text-muted">
							{next}
						</p>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>

<style>
	.text-shadow {
		text-shadow: 1px 1px 18px rgba(0, 0, 0, 0.25);
	}
</style>
