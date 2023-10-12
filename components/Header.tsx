'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { LOCALES_ARRAY, type Locale } from '@/i18n.config';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type HeaderProps = { lang: Locale };

export default function Header({ lang }: HeaderProps) {
	const router = useRouter();

	const handleSelectChangeLocale = (locale: string) =>
		router.push(`/${locale}`);

	const checkCookie = async () => await axios.post("/api/cookie");

	useEffect(() => {
		checkCookie();
	}, [])

	return (
		<header>
			<nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
				<div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
					<a
						href={`${process.env.NEXT_PUBLIC_APP_URL}/${lang}`}
						className="flex items-center"
					>
						<span className="self-center text-xl font-semibold whitespace-nowrap text-black">
							SAGAKIKI!
						</span>
					</a>
					<div className="flex items-center lg:order-2">
						<Select
							onValueChange={handleSelectChangeLocale}
							defaultValue={lang || LOCALES_ARRAY[0].value}
						>
							<SelectTrigger className="w-[100px]" aria-label="Food">
								<SelectValue placeholder={lang} />
							</SelectTrigger>
							<SelectContent>
								{LOCALES_ARRAY.map((locale) => (
									<SelectItem
										key={locale.value}
										value={locale.value}
										className="cursor-pointer"
									>
										{locale.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</nav>
		</header>
	);
}
