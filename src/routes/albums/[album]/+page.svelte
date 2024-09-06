<script lang="ts">
	import { page } from "$app/stores";
	import lyrics from "$lib/data/lyrics.json";

	const songs = lyrics.data
		.filter(({ album }) => album === $page.params.album)
		.map(({ song }) => song)
		.filter((song, index, self) => self.indexOf(song) === index);
</script>

<svelte:head>
	<title>{$page.params.album} songs</title>
</svelte:head>

<h1 class="text-4xl font-bold">{$page.params.album}</h1>

{#each songs as song}
	<p>
		<a class="hover:underline" href={`/albums/${$page.params.album}/${encodeURIComponent(song)}`}
			>{song}</a
		>
	</p>
{/each}
