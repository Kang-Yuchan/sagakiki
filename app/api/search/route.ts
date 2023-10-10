import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const term = req.nextUrl.searchParams.get('term');

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
