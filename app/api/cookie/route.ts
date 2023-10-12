import { serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    const userToken = uuidv4();

    if (req.cookies.get("sagakiki-token")) {
        return new NextResponse(JSON.stringify({ message: "You have token already!" }));;
    } else {
        const serialized = serialize("sagakiki-token", userToken, {
            httpOnly: true, // JSからのアクセスを防ぐ
            secure: process.env.NODE_ENV !== 'development', // 開発環境以外ではセキュア属性をつける
            sameSite: 'strict', // CSRF攻撃防止
            maxAge: 60 * 60 * 24 * 7, // 1週間の有効期限
            path: '/', // サイト全体で有効
        })
        return new NextResponse(JSON.stringify({ message: "You are set token!" }), { status: 200, headers: { "Set-Cookie": serialized } });

    }
}