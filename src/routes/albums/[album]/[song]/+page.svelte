<script lang="ts">
	import { page } from "$app/stores";
	import lyrics from "$lib/data/lyrics.json";

	const songLyrics = lyrics.data
		.filter(({ album }) => album === $page.params.album)
		.filter(({ song }) => song === $page.params.song)
		.map(({ lyric }) => lyric);
</script>

<svelte:head>
	<title>{$page.params.song} lyrics</title>
</svelte:head>

<h1 class="text-4xl font-bold">{$page.params.song}</h1>

<h2 class="text-2xl font-bold">
	<a class="hover:underline" href={`/albums/${$page.params.album}`}>{$page.params.album}</a>
</h2>

{#each songLyrics as lyric}
	<p>{lyric}</p>
{/each}
