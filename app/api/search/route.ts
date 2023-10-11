import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(1, "10 s")
})

export async function GET(req: NextRequest) {
	const term = req.nextUrl.searchParams.get('term');
	const geoIp = await axios.get(process.env.GEO_API_URL || "");
	const ip = req.ip || req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || geoIp.data?.IPv4;

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
	return NextResponse.json(res.data);
}
