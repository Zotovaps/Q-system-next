import {useRouter} from "next/router";

export default function Algorithm({algorithm}) {


    return (
        <div>
            <span className="typography-h1">{algorithm.nameRu}</span>
            <span className="typography-subtitle1">{algorithm.nameRu}</span>


        </div>
    )
}

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm')
    const algorithms = await res.json()

    // Get the paths we want to pre-render based on posts
    const paths = algorithms.map((algo) => ({
        params: { id: algo.algorithmId },
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

export async function getStaticProps({params}) {

    const res = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm')
    const algorithms = await res.json()

    const algorithm = algorithms.find(item => item.algorithmId === params.id)

    return{
        props: {algorithm},
    }
}