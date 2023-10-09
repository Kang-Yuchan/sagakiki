'use client';

import axios from 'axios';
import Image from 'next/image';
import React, { type ChangeEvent, useState, useEffect } from 'react';
import type { Dictionary } from '@/lib/dictionary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import NoResultsImage from '@/public/no-results.jpg';
import MusicCard from './MusicCard';

type ContentsProps = { dic: Dictionary };

type SongInfo = {
	artist: string;
	title: string;
	imgUrl: string;
	src: string;
};

export default function Contents({ dic }: ContentsProps) {
	const [input, setInput] = useState('');
	const [songInfos, setSongInfos] = useState<SongInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const hitsParam = searchParams.get('hits');
	const isNotHits = hitsParam === '0';

	const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		const searchInput = e.target.value;
		setInput(searchInput);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
		handleSubmit();
	};

	const handleSubmit = async () => {
		try {
			setSongInfos([]);
			setIsLoading(true);
			router.push(pathname);
			const res = await axios.get('/api/search/', {
				params: { term: input },
			});
			const { data } = res;

			if ('tracks' in data) {
				const hits: SongInfo[] = (data.tracks.hits as any[]).map(
					({ track }) => {
						return {
							artist: track.subtitle,
							title: track.title,
							imgUrl: track.images.background,
							src: track.hub.actions[1]?.uri,
						};
					},
				);
				setSongInfos(hits);
			} else {
				router.push(`${pathname}?hits=0`);
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};

	useEffect(() => {
		return () => {
			setSongInfos([]);
			setIsLoading(false);
			setInput('');
		};
	}, []);

	return (
		<>
			<div className="flex justify-center w-full">
				<Input
					type="text"
					onChange={handleChangeInput}
					onKeyDown={handleKeyDown}
					value={input}
					className="text-sm mr-2 text-black max-w-xl"
					placeholder={dic.placeholder}
				/>
				<Button
					type="button"
					onClick={handleSubmit}
					className="min-w-fit"
					disabled={isLoading}
				>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{!isLoading && dic.search}
				</Button>
			</div>
			{songInfos.length > 0 && !isNotHits && (
				<>
					<MusicCard
						title={songInfos[0].title}
						artist={songInfos[0].artist}
						artwork={songInfos[0].imgUrl}
						audioSrc={songInfos[0].src}
					/>
				</>
			)}
			{isNotHits && (
				<div className="rounded-md bg-white mt-5 w-full max-w-4xl flex flex-col items-center overflow-hidden py-4">
					<Image
						src={NoResultsImage.src}
						width={500}
						height={500}
						alt="No results image"
					/>
					<p className="text-black">No results found</p>
				</div>
			)}
		</>
	);
}
