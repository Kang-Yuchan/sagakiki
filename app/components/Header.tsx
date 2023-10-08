"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LOCALES_ARRAY, type Locale } from "@/i18n.config"
import { useRouter } from 'next/navigation'

type HeaderProps = { lang: Locale }

export default function Header({ lang }: HeaderProps) {
    const router = useRouter();

    const handleSelectChangeLocale = (locale: string) => router.push(`/${locale}`);


    return (
        <header>
            <nav className="bg-black border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href={`${process.env.NEXT_PUBLIC_APP_URL}/${lang}`} className="flex items-center">
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-white">SAGAKIKI!</span>
                    </a>
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                        <Select onValueChange={handleSelectChangeLocale} defaultValue={lang || LOCALES_ARRAY[0].value}>
                            <SelectTrigger className="w-[150px]" aria-label="Food">
                                <SelectValue placeholder={lang} />
                            </SelectTrigger>
                            <SelectContent>
                                {LOCALES_ARRAY.map((locale) => (
                                    <SelectItem key={locale.value} value={locale.value}>
                                        {locale.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </nav>
        </header>
    )
}