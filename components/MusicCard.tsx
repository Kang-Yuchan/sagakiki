'use client';

import { formatDisplayTime } from '@/lib/format';
import {
	VolumeX,
	Volume1,
	Volume2,
	Pause,
	Play,
	RefreshCw,
	RefreshCwOff,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';

type MusicCardProps = {
	title: string;
	artist: string;
	artwork: string;
	audioSrc: string;
};

export default function MusicCard({
	title,
	artist,
	artwork,
	audioSrc,
}: MusicCardProps) {
	const [playing, setPlaying] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [showVolumeTooltip, setShowVolumeTooltip] = useState<boolean>(false);
	const [volume, setVolume] = useState<number>(0.5);
	const [loop, setLoop] = useState<boolean>(false);
	const [duration, setDuration] = useState<number>(0);
	const [currentTime, setCurrentTime] = useState<number>(0);

	const audioRef = useRef<HTMLAudioElement | null>(null);

	const togglePlay = () => {
		const audio = audioRef.current;
		if (audio) {
			if (playing) {
				audio.pause();
			} else {
				audio.play();
			}
			setPlaying(!playing);
		}
	};

	const handleLoadedMetadata = () => {
		const audio = audioRef.current;
		if (audio) {
			setDuration(audio.duration);
		}
	};

	const handleTimeUpdate = () => {
		const audio = audioRef.current;
		if (audio) {
			setProgress((audio.currentTime / audio.duration) * 100);
			setCurrentTime(audio.currentTime);
			if (audio.ended) {
				setPlaying(false);
				setProgress(0);
			}
		}
	};

	const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseFloat(event.target.value);
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const audio = audioRef.current;
		if (audio && audio.duration) {
			audio.currentTime = (parseFloat(e.target.value) / 100) * audio.duration;
		}
	};

	const handleThumbMouseDown = () => {
		const audio = audioRef.current;
		if (audio && playing) {
			audio.pause();
			setPlaying(false);
		}
	};

	const handleThumbMouseUp = () => {
		const audio = audioRef.current;
		if (audio && !playing) {
			audio.play();
			setPlaying(true);
		}
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (audio) {
			audio.loop = loop;
			audio.volume = volume;
		}
	}, [loop]);

	const renderVolumeIcon = () => {
		if (!volume) return <VolumeX />;
		if (volume === 1) return <Volume2 />;
		return <Volume1 />;
	};

	return (
		<div className="bg-white max-w-md mx-auto rounded-xl overflow-hidden shadow-lg relative mt-5">
			<Image
				className="w-full"
				src={artwork}
				width={500}
				height={500}
				layout="responsive"
				alt={title}
			/>
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">{title}</div>
				<p className="text-gray-700 text-base">{artist}</p>
			</div>
			<div className="px-6 py-4 flex justify-between">
				<div className="w-full flex items-center">
					<button onClick={togglePlay}>{playing ? <Pause /> : <Play />}</button>
					<button onClick={() => setLoop(!loop)} className="mx-4">
						{loop ? <RefreshCw /> : <RefreshCwOff />}
					</button>
					<div className='w-full flex items-center'>
						<span className='text-gray-700 block w-7 text-exsm'>{formatDisplayTime(Math.round(currentTime))}</span>
						<input
							type="range"
							value={progress || 0}
							onChange={handleProgressChange}
							className="w-1/2 mx-2"
							onMouseDown={handleThumbMouseDown}
							onMouseUp={handleThumbMouseUp}
						/>
						<span className='text-gray-700 block w-7 text-exsm'>{formatDisplayTime(Math.round(duration))}</span>
					</div>
				</div>
				<div className="relative ml-4 hidden lg:block">
					<button onClick={() => setShowVolumeTooltip(!showVolumeTooltip)}>
						{renderVolumeIcon()}
					</button>
					{showVolumeTooltip && (
						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white p-2 rounded -rotate-90">
							<input
								type="range"
								min="0"
								max="1"
								step="0.01"
								value={volume}
								onChange={handleVolumeChange}
								className="w-20 relative"
							/>
						</div>
					)}
				</div>
			</div>
			<audio
				ref={audioRef}
				src={audioSrc}
				onLoadedMetadata={handleLoadedMetadata}
				onTimeUpdate={handleTimeUpdate}
				preload="metadata"
			></audio>
		</div>
	);
}
