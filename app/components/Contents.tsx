"use client"

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, useState } from "react";
import type { Dictionary } from "@/lib/dictionary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ContentsProps = { dic: Dictionary };

type SongInfo = {
    artist: string;
    title: string;
    imgUrl: string;
    url: string;
};

export default function Contents({ dic }: ContentsProps) {
    const [input, setInput] = useState("");
    const [songInfos, setSongInfos] = useState<SongInfo[]>([]);

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const searchInput = e.target.value;
        setInput(searchInput);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || e.key !== 'Enter') return
        handleSubmit()
    }

    const handleSubmit = async () => {
        try {
            const res = await axios.get('/api/search/', {
                params: { term: input }
            });
            const { data } = res;
            const hits: SongInfo[] = (data.tracks.hits as any[]).map(({ track }) => {
                return {
                    artist: track.subtitle,
                    title: track.title,
                    imgUrl: track.images.background,
                    url: track.url
                }
            });
            if (hits.length > 0) {
                setSongInfos(hits)
            }

        } catch (error) {
            console.log(error);
        }

    }
    return (
        <>
            <div className="flex">
                <Input type="text" onChange={handleChangeInput} onKeyDown={handleKeyDown} value={input} className='text-sm mr-2 text-black' placeholder={dic.placeholder} />
                <Button type="button" onClick={handleSubmit}>{dic.search}</Button>
            </div>
            {songInfos.length > 0 && (
                <div className="rounded-md bg-white">
                    <Image
                        src={songInfos[0].imgUrl}
                        width={500}
                        height={500}
                        alt="artist album image"
                    />
                    <p>{dic.artist}: {songInfos[0].artist}</p>
                    <p>{dic.musicTitle}: {songInfos[0].title}</p>
                    <p>URL: <Link href={songInfos[0].url} target="_blank">{songInfos[0].url}</Link></p>
                </div>
            )}
        </>
    )
}