import './globals.css'
import Favicon from '../favicon.ico'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { type Locale, i18n } from '../../i18n.config'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Search Music By Lyrics",
  description: "This is website that lets you search for music by lyrics",
  applicationName: "SAGAKIKI! - Website that search for music by lyrics",
  icons: [{ rel: 'icon', url: Favicon.src }],
  keywords: "search music site, 歌詞で曲を探すアプリ, 가사로 노래찾아주는 사이트, 一个通过歌词查找歌曲的网站, 透過歌詞找出歌曲的網站, 音楽探がすサイト",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "localhost:3000"),
}

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode,
  params: { lang: Locale }
}) {
  return (
    <html lang={lang}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Header lang={lang} />
        <main className="flex min-h-screen flex-col items-center bg-black  p-24">
          {children}
        </main>
      </body>
    </html>
  )
}
