"use server"

import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';

export const setToken = () => {
    const cookiesStore = cookies();
    const userToken = uuidv4();
    if (cookiesStore.get("user-token")) {
        return "You have token already!";
    } else {
        cookiesStore.set({
            name: "user-token",
            value: userToken,
            httpOnly: true, // JSからのアクセスを防ぐ
            secure: process.env.NODE_ENV !== 'development', // 開発環境以外ではセキュア属性をつける
            sameSite: 'strict', // CSRF攻撃防止
            maxAge: 60 * 60 * 24 * 7, // 1週間の有効期限
            path: '/', // サイト全体で有効
        })
        return `You are set token!`;
    }
}