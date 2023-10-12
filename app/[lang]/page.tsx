import type { Metadata } from 'next';
import { Locale } from '../../i18n.config';
import { getDictionary } from '../../lib/dictionary';
import Contents from '../../components/Contents';
import { setToken } from '@/lib/token';

type PageParamsType = { params: { lang: Locale } };

export async function generateMetadata({
	params: { lang },
}: PageParamsType): Promise<Metadata> {
	const dic = await getDictionary(lang);
	return {
		title: dic.title,
		description: dic.description,
		authors: {
			name: 'SAGAKIKI!',
			url: `${process.env.NEXT_PUBLIC_APP_URL}/${lang}`,
		},
		openGraph: {
			title: dic.title,
			siteName: dic.description,
			url: `${process.env.NEXT_PUBLIC_APP_URL}/${lang}`,
		},
	};
}

export default async function Home({ params: { lang } }: PageParamsType) {
	const dic = await getDictionary(lang);
	const token = setToken();
	console.log(token)
	return (
		<main
			className="flex min-h-screen flex-col items-center py-10 lg:pt-24 px-10"
			style={{ backgroundColor: '#24222A' }}
		>
			<Contents dic={dic} />
		</main>
	);
}
