import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit"

export type SongInfo = {
	artist: string;
	title: string;
	imgUrl: string;
	src: string;
};


const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(1, "10 s")
})

export async function GET(req: NextRequest) {
	const term = req.nextUrl.searchParams.get('term');
	// const geoIp = await axios.get(process.env.GEO_API_URL || ""); /* geo apiを取得しない方向に実装すること */
	const ip = req.ip || req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "192.023.020";

	const { success, reset } = await ratelimit.limit(ip);

	if (!success) {
		const now = Date.now();
		const retryAfter = Math.floor((reset - now) / 1000);
		return new NextResponse("Too many requests", {
			status: 429,
			headers: {
				["retry-after"]: `${retryAfter}`,
			}
		})
	}

	const res = await axios.get(
		`${process.env.RAPIDAPI_URL}?term=${term}`,
		{
			headers: {
				'x-rapidapi-host': 'shazam.p.rapidapi.com',
				'x-rapidapi-key': process.env.RAPIDAPI_KEY,
			},
		},
	);
	if ("tracks" in res.data) {
		const hits: SongInfo[] = (res.data.tracks.hits as any[]).map(
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
		return NextResponse.json(hits)
	}
	return NextResponse.json([]);
}
