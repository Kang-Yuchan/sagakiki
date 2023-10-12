import { Locale } from '@/i18n.config';
import RootLayout from './[lang]/layout'

type DefaultRootLayoutProps = Omit<{
    children: React.ReactNode;
    params: { lang: Locale };
}, 'params'>

export default async function DefaultIndexPage({ children }: DefaultRootLayoutProps) {
    return await RootLayout({
        params: {
            lang: "en",
        },
        children,
    })
}