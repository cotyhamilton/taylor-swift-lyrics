<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card";
	import { page } from "$app/stores";
	import { appendSearchQueryString } from "./utils";

	import TaylorSwiftAlbumImage from "$lib/images/albums/taylor-swift.jpg?enhanced";
	import FearlessAlbumImage from "$lib/images/albums/fearless.jpg?enhanced";
	import SpeakNowAlbumImage from "$lib/images/albums/speak-now.jpg?enhanced";
	import RedAlbumImage from "$lib/images/albums/red.jpg?enhanced";
	import OneNineEightNineAlbumImage from "$lib/images/albums/1989.jpg?enhanced";
	import ReputationAlbumImage from "$lib/images/albums/reputation.jpg?enhanced";
	import LoverAlbumImage from "$lib/images/albums/lover.jpg?enhanced";
	import FolkloreAlbumImage from "$lib/images/albums/folklore.jpg?enhanced";
	import EvermoreAlbumImage from "$lib/images/albums/evermore.jpg?enhanced";
	import MidnightsAlbumImage from "$lib/images/albums/midnights.jpg?enhanced";
	import TTPDAlbumImage from "$lib/images/albums/the-tortured-poets-department.jpg?enhanced";

	import TaylorSwiftBGImage from "$lib/images/backgrounds/taylor-swift.jpg?enhanced";
	import FearlessBGImage from "$lib/images/backgrounds/fearless.jpg?enhanced";
	import SpeakNowBGImage from "$lib/images/backgrounds/speak-now.jpg?enhanced";
	import RedBGImage from "$lib/images/backgrounds/red.jpg?enhanced";
	import OneNineEightNineBGImage from "$lib/images/backgrounds/1989.jpg?enhanced";
	import ReputationBGImage from "$lib/images/backgrounds/reputation.jpg?enhanced";
	import LoverBGImage from "$lib/images/backgrounds/lover.jpg?enhanced";
	import FolkloreBGImage from "$lib/images/backgrounds/folklore.jpg?enhanced";
	import EvermoreBGImage from "$lib/images/backgrounds/evermore.jpg?enhanced";
	import MidnightsBGImage from "$lib/images/backgrounds/midnights.jpg?enhanced";
	import TTPDBGImage from "$lib/images/backgrounds/the-tortured-poets-department.jpg?enhanced";

	type Props = {
		album: string;
		song: string;
		lyric: string;
		section: string;
		lineNumber: number;
		prev: string;
		next: string;
		search: string;
	};

	let data: Props = $props();

	const AlbumImageMap: Record<string, typeof TaylorSwiftBGImage> = {
		"Taylor Swift": TaylorSwiftAlbumImage,
		"Fearless (Taylor's Version)": FearlessAlbumImage,
		"Speak Now (Taylor's Version)": SpeakNowAlbumImage,
		"Red (Taylor's Version)": RedAlbumImage,
		"1989 (Taylor's Version)": OneNineEightNineAlbumImage,
		Reputation: ReputationAlbumImage,
		Lover: LoverAlbumImage,
		folklore: FolkloreAlbumImage,
		evermore: EvermoreAlbumImage,
		midnights: MidnightsAlbumImage,
		"The Tortured Poets Department": TTPDAlbumImage
	};

	const BackgroundImageMap: Record<string, typeof TaylorSwiftBGImage> = {
		"Taylor Swift": TaylorSwiftBGImage,
		"Fearless (Taylor's Version)": FearlessBGImage,
		"Speak Now (Taylor's Version)": SpeakNowBGImage,
		"Red (Taylor's Version)": RedBGImage,
		"1989 (Taylor's Version)": OneNineEightNineBGImage,
		Reputation: ReputationBGImage,
		Lover: LoverBGImage,
		folklore: FolkloreBGImage,
		evermore: EvermoreBGImage,
		midnights: MidnightsBGImage,
		"The Tortured Poets Department": TTPDBGImage
	};
</script>

<Card.Root
	class="card-skeumorphic hover:card-hover relative transform overflow-hidden text-primary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
>
	<enhanced:img
		class="absolute inset-0 z-0 h-full w-full object-cover"
		src={BackgroundImageMap[data.album]}
		alt={`${data.album} background`}
	/>

	<div class="relative z-40">
		<Card.Header>
			<Card.Title>
				<div class="flex">
					<div>
						<enhanced:img
							class="mr-2 rounded"
							height="44"
							width="44"
							src={AlbumImageMap[data.album]}
							alt="album"
						/>
					</div>
					<div>
						<p class="text-shadow">
							<a class="hover:underline" href={`/albums/${data.album}`}>{data.album}</a>
						</p>
						<p>
							<a
								class="text-shadow text-2xl font-bold hover:underline"
								href={`/albums/${data.album}/${encodeURIComponent(data.song)}`}>{data.song}</a
							>
						</p>
					</div>
				</div>
				<Badge variant="secondary">{data.section}</Badge>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-shadow grid grid-cols-[auto_1fr]">
				<span class="w-8 pr-2 text-right font-mono text-muted">
					{data.lineNumber - 1}
				</span>
				<p class="text-muted">
					{data.prev}
				</p>
			</div>
			<div class="text-shadow grid grid-cols-[auto_1fr]">
				<span class="w-8 pr-2 text-right font-mono text-xl">
					{data.lineNumber}
				</span>
				<p class="text-lg font-bold">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html data.lyric
						.split(" ")
						.map(
							(word) =>
								`<a
									class="hover:underline"
									href="?${appendSearchQueryString($page.url, word.replace(",", "").toLowerCase())}"
								>
								${word.replace(new RegExp(data.search, "gi"), (match) => `<u>${match}</u>`)}
								</a>`
						)
						.join(" ")}
				</p>
			</div>
			<div class="text-shadow grid grid-cols-[auto_1fr]">
				<span class="w-8 pr-2 text-right font-mono text-muted">
					{data.lineNumber + 1}
				</span>
				<p class="text-muted">
					{data.next}
				</p>
			</div>
		</Card.Content>
	</div>
</Card.Root>

<style>
	.text-shadow {
		text-shadow: 1px 1px 18px rgba(0, 0, 0, 0.25);
	}

	:global(.card-skeumorphic) {
		position: relative;
		overflow: hidden;
	}
	:global(.card-skeumorphic::before) {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.4);
		pointer-events: none;
		z-index: 30;
	}

	:global(.card-hover) {
		transition:
			transform 0.3s ease-in-out,
			box-shadow 0.3s ease-in-out;
	}
	:global(.card-hover:hover) {
		transform: translateY(-5px) scale(1.02);
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}
</style>
