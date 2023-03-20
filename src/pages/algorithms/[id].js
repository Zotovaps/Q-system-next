import {useRouter} from "next/router";
import styled from "styled-components";
import Link from "next/link";

const PageStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100vw;
  height: 100vh;
  padding: 30px 10px 0 60px;

  background: rgb(247, 248, 252);
`




export default function Algorithm({algorithm, processors, ticks}) {


    return (
        <PageStyled>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link href="/algorithms">Algorithms</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{algorithm.nameRu}</li>
                </ol>
            </nav>

            <div style={{overflow: "hidden auto", padding: "0 45px 30px 0"}}>
                <div className="accordion" id="accordionPanelsStayOpenExample">
                    {processors && <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseOne">
                                {processors.data.latex}
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show"
                             aria-labelledby="panelsStayOpen-headingOne">
                            <div className="accordion-body">
                                <img src={processors.data.img} style={{width: "100%", maxWidth: "700px"}}/>
                            </div>
                        </div>
                    </div>}
                    {ticks && <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
                                    aria-controls="panelsStayOpen-collapseTwo">
                                {ticks.data.latex}
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse"
                             aria-labelledby="panelsStayOpen-headingTwo">
                            <div className="accordion-body">
                                <img src={ticks.data.img} style={{width: "100%", maxWidth: "700px"}}/>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </PageStyled>

    )
}

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm')
    const algorithms = await res.json()

    // Get the paths we want to pre-render based on posts
    const paths = algorithms.map((algo) => ({
        params: {id: algo.algorithmId},
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return {paths, fallback: false}
}

export async function getStaticProps({params}) {

    const res = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm')
    const algorithms = await res.json()

    const algorithm = algorithms.find(item => item.algorithmId === params.id)

    const processors = await fetch(`https://storage.yandexcloud.net/q.system/approximation/${params.id}/processors.json`)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return null
            }
        })

    const ticks = await fetch(`https://storage.yandexcloud.net/q.system/approximation/${params.id}/ticks.json`)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return null
            }
        })


    return {
        props: {algorithm, processors, ticks},
    }
}