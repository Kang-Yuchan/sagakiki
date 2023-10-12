import IndexPage from "./[lang]/page";

export default async function DefaultIndexPage() {
    return await IndexPage({
        params: {
            lang: "en",
        },
    })
}