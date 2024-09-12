<script lang="ts">
	import { page } from "$app/stores";
</script>

<main class="mt-48 flex flex-col items-center justify-center gap-6">
	<h1 class="text-8xl font-bold">{$page.status}</h1>
	<p>{$page.error?.message}</p>
	<p>{$page.error?.trace}</p>
</main>
