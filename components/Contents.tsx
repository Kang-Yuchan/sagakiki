'use client';

import axios from 'axios';
import Image from 'next/image';
import React, { type ChangeEvent, useState, useEffect } from 'react';
import UAParser from 'ua-parser-js';
import type { Dictionary } from '@/lib/dictionary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import NoResultsImage from '@/public/no-results.jpg';
import MusicCard from './MusicCard';
import type { SongInfo } from '@/app/api/search/route';

export type YoutubeVideo = {
	artist: string;
	title: string;
	videoId: string;
}

type ContentsProps = { dic: Dictionary };

export default function Contents({ dic }: ContentsProps) {
	const [input, setInput] = useState('');
	const [songInfos, setSongInfos] = useState<SongInfo[]>([]);
	const [isSearched, setIsSearched] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [error, setError] = useState<string>("");
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);

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
			setError("");
			setYoutubeVideos([]);
			router.push(`${pathname}?q=${input}`);
			const res = await axios.get('/api/search/', {
				params: { term: input },
			});
			const { data } = res;
			setSongInfos(data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			if (axios.isAxiosError(error) && error.response) {
				if (error.response.status === 429) {
					setError(dic.apiRequestError);
				} else {
					setError(error.message);
				}
			}
		}
		setIsSearched(true);
	}


	useEffect(() => {
		if (searchQuery) {
			setInput(searchQuery);
		}
	}, []);

	useEffect(() => {
		if (error) {
			alert(error);
			setError('');
		}
	}, [error]);

	useEffect(() => {
		// ユーザーエージェントを解析してデバイスタイプを取得
		const parser = new UAParser();
		const result = parser.getResult();
		const deviceType = result.device && result.device.type;

		// モバイルデバイスかどうかを判断
		setIsMobile(deviceType === 'mobile' || deviceType === 'tablet');
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
			{(isSearched && !error) && (
				songInfos.length > 0 ? (
					<div className='flex flex-col items-center'>
						<MusicCard
							title={songInfos[selectedIndex].title}
							artist={songInfos[selectedIndex].artist}
							artwork={songInfos[selectedIndex].imgUrl}
							audioSrc={songInfos[selectedIndex].src}
							isMobile={isMobile}
							youtubeVideos={youtubeVideos}
							setYoutubeVidoes={setYoutubeVideos}
						/>
						<div className='w-full max-w-md mt-3 flex space-x-3 border-solid border-2 border-white  rounded-lg p-2'>
							{songInfos.map(((song, i) => (
								<button key={i} className={`overflow-hidden rounded-md border-blue-500 border-solid ${i === selectedIndex && "border-2"}`} onClick={() => setSelectedIndex(i)}>
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
