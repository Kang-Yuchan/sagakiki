import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const songTitle = req.nextUrl.searchParams.get('songTitle');
    const artistName = req.nextUrl.searchParams.get('artistName');
    const searchQuery = `${songTitle} ${artistName} official`;
    const apiUrl = process.env.YOTUBE_DATA_API_URL || "";

    try {
        const response = await axios.get(apiUrl, {
            params: {
                part: 'snippet',
                maxResults: 1,
                key: process.env.YOUTUBE_DATA_API_KEY,
                q: searchQuery,
                type: 'video',
            },
        });

        // 検索結果から動画のIDを抽出
        const videoId: string = response.data.items[0].id.videoId;

        return NextResponse.json(videoId);
    } catch (error) {
        console.error('YouTube Data API request failed:', error);
        throw error;
    }
}