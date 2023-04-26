import {useRouter} from "next/router";
import styled from "styled-components";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import {InlineMath, BlockMath} from 'react-katex';
import {evaluate} from 'mathjs'
import {useEffect, useRef, useState} from "react";
import styles from "@/styles/Admin.module.css";
import {useLanguageQuery, useTranslation} from "next-export-i18n";
import NavigationTree from "@/components/NavigationTree";

const ce = require('@cortex-js/compute-engine');


const PageStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  width: 100vw;
  height: 100vh;
  padding: 30px 10px 0 60px;

  background: rgb(247, 248, 252);
`


export default function Algorithm({algorithm, processors, ticks, determinants}) {
    const [tabIndex, setTabIndex] = useState(0);
    const {t, i18n} = useTranslation();
    const [query] = useLanguageQuery();

    const [variables, setVariables] = useState([]);
    const [coef, setCoef] = useState(undefined);
    const [width, setWidth] = useState(undefined);
    const [height, setHeight] = useState(undefined);

    const computeEngine = new ce.ComputeEngine();

    let widthExpr = computeEngine.parse(processors ? processors.data.latex : "0");
    let heightExpr = computeEngine.parse(ticks ? ticks.data.latex : "0");


    useEffect(() => {
        if (determinants && determinants.length > 0) {
            let dimensionsCount = determinants[0].dimensions ? determinants[0].dimensions.split(', ').length : 0;
            let iterationsCount = determinants[0].iterations ? 1 : 0;

            setVariables(Array(dimensionsCount + iterationsCount).fill(0))
        }
    }, [])

    useEffect(() => {
        if (variables.length > 0) {
            computeEngine.set(getVariables())

            setWidth(widthExpr.N().valueOf())
            setHeight(heightExpr.N().valueOf())
        }


    }, [variables])

    const getVariables = () => {
        let tmp = "{"

        variables.forEach((v, index) => {
            tmp += `\"x_${index + 1}\": ${/^-?\d+\.?\d*$/.test(v) ? Number(v) : 0}`

            if (variables.length - 1 !== index) {
                tmp += ", "
            } else {
                tmp += "}"
            }
        })


        return JSON.parse(tmp)
    }

    return (
        <PageStyled>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link href="/algorithms">Algorithms</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{algorithm.nameRu}</li>
                </ol>
            </nav>


            {algorithm && processors && ticks && determinants &&
            <div style={{
                padding: "0 45px 30px 0",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}>

                <div className={styles.tabs}>
                    <div className={tabIndex === 0 ? styles.checked : styles.tab} onClick={() => setTabIndex(0)}>
                        <span className="typography-subtitle1">{t('approximation')}</span>
                    </div>
                    <div className={tabIndex === 1 ? styles.checked : styles.tab} onClick={() => setTabIndex(1)}>
                        <span className="typography-subtitle1">{t('determinants')}</span>
                    </div>
                </div>

                <>
                    {tabIndex === 0 && <div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            overflow: "hidden auto",
                            height: "calc(100vh - 115px)",
                            padding: "0 0 30px 0"
                        }}>
                            {variables && variables.length > 0 && variables.map((item, index) => {
                                return (
                                    <input key={index} type="number" value={variables[index]} onChange={(e) => {
                                        setVariables(variables.map((v, i) => {
                                            if (index === i) return e.target.value;
                                            return v;
                                        }))
                                    }}/>
                                )
                            })}

                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: "20px",
                                justifyContent: "space-between"
                            }}>

                                <div className="card" style={{width: "calc(50% - 20px)", minWidth: "700px"}}>
                                    {processors.data.img && <img src={processors.data.img} className="card-img-top"
                                         style={{width: "100%", maxWidth: "700px"}} alt="..."/>}

                                    <div className="card-body">
                                        <h5 className="card-title" data-bs-toggle="collapse" href="#collapseWidth"
                                            role="button" aria-expanded="false" aria-controls="collapseWidth">
                                            Algorithm width: {width}
                                        </h5>
                                        <div className="collapse" id="collapseWidth">
                                            <InlineMath>{algorithm.dataWidth.replaceAll('cdot', '\\cdot').replaceAll('*', ' \\cdot ')}</InlineMath>
                                        </div>
                                    </div>
                                </div>

                                <div className="card" style={{width: "calc(50% - 20px)", minWidth: "700px"}}>
                                    {ticks.data.img && <img src={ticks.data.img} className="card-img-top"
                                         style={{width: "100%", maxWidth: "700px"}} alt="..."/>}

                                    <div className="card-body">
                                        <h5 className="card-title" data-bs-toggle="collapse" href="#collapseHeight"
                                            role="button" aria-expanded="false" aria-controls="collapseHeight">
                                            Algorithm height: {height}
                                        </h5>
                                        <div className="collapse" id="collapseHeight">
                                            <InlineMath>{algorithm.dataHeight.replaceAll('cdot', '\\cdot').replaceAll('*', ' \\cdot ')}</InlineMath>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>}

                    {tabIndex === 1 && <div style={{
                        alignItems: "flex-end",
                        display: "flex",
                        gap: "10px",
                        flexDirection: "column",
                        maxWidth: "1125px",
                        width: "inherit",
                        overflow: "hidden auto",
                        height: "calc(100vh - 115px)", padding: "0 0 30px 0"
                    }}>
                        {determinants.length > 0 && <table>
                            <thead>
                            <tr style={{height: "30px"}}>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Dimensions</span>
                                </th>
                                {determinants[0].iterations && <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Iterations</span>
                                </th>}

                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Processors</span>
                                </th>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Ticks</span>
                                </th>
                                <th className={styles.tableHeader} style={{width: "50px"}}>

                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {determinants.map((item, index) => {
                                return (
                                    <tr key={index} style={{height: "40px"}}>
                                        <td style={{padding: "5px 10px"}}>
                                            <span className="typography-body2">{item.dimensions}</span>
                                        </td>
                                        {item.iterations &&
                                        <td style={{padding: "5px 10px"}}>
                                            <span className="typography-body2">{item.iterations}</span>
                                        </td>
                                        }
                                        <td style={{padding: "5px 10px"}}>
                                            <span className="typography-body2">{item.processors}</span>
                                        </td>
                                        <td style={{padding: "5px 10px"}}>
                                            <span className="typography-body2">{item.ticks}</span>
                                        </td>

                                        <td style={{padding: "0 5px"}}>
                                            <img src={"/Export.svg"}/>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>}
                    </div>}
                </>


            </div>}
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

    const res = await fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm")
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

    const determinants = await fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/determinant")
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return null
            }
        })
        .then(data => {
            return data.filter(item => item.algorithmId === params.id)
        })


    return {
        props: {algorithm, processors, ticks, determinants},
    }
}