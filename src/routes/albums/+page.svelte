<script lang="ts">
	import lyrics from "$lib/data/lyrics.json";

	const albums = lyrics.data
		.map(({ album }) => album)
		.filter((value, index, self) => self.indexOf(value) === index)
		.reverse();
</script>

<svelte:head>
	<title>taylor switf albums</title>
</svelte:head>

<h1 class="text-4xl font-bold">Albums</h1>

{#each albums as album}
	<p>
		<a class="hover:underline" href={`/albums/${album}`}>{album}</a>
	</p>
{/each}
