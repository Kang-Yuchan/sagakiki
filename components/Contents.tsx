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
	const [isSearched, setIsSearched] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const searchQuery = searchParams.get('q');

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
			setIsLoading(true);
			router.push(`${pathname}?q=${input}`);
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
				).filter((item, index, array) => {
					return index === array.findIndex(({ artist }) => artist === item.artist);
				});
				setSongInfos(hits);
			} else {
				setSongInfos([]);
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
		setIsSearched(true);
	}


	useEffect(() => {
		if (searchQuery) {
			setInput(searchQuery);
		}
	}, [])

	useEffect(() => {
		return () => {
			setSongInfos([]);
			setIsLoading(false);
			setInput('');
			setIsSearched(false);
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
					className="text-sm mr-2 text-black max-w-sm"
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
			{isSearched && (
				songInfos.length > 0 ? (
					<div className='flex flex-col items-center'>
						<MusicCard
							title={songInfos[selectedIndex].title}
							artist={songInfos[selectedIndex].artist}
							artwork={songInfos[selectedIndex].imgUrl}
							audioSrc={songInfos[selectedIndex].src}
						/>
						<span>候補</span>
						<div className='w-full flex space-x-3'>
							{songInfos.map(((song, i) => (
								<button key={i} className="overflow-hidden rounded-md" onClick={() => setSelectedIndex(i)}>
									<Image width={100} height={100} src={song.imgUrl} alt={song.title} />
								</button>
							)))}
						</div>
					</div>
				) : (
					<div className="bg-white max-w-md mx-auto rounded-xl overflow-hidden shadow-lg relative mt-5">
						<Image
							src={NoResultsImage.src}
							width={500}
							height={500}
							alt="No results image"
						/>
						<p className="text-black">No results found</p>
					</div>
				)
			)}
		</>
	);
}
