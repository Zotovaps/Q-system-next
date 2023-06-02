import styled from "styled-components";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';
import {useEffect, useState} from "react";
import styles from "@/styles/Admin.module.css";
import {LanguageSwitcher, useLanguageQuery, useTranslation} from "next-export-i18n";

const ce = require('@cortex-js/compute-engine');


export default function Algorithm({algorithm, processors, ticks, determinants}) {
    const {t, i18n} = useTranslation();
    const [query] = useLanguageQuery();
    const [language, setLanguage] = useState('en');

    const [tabIndex, setTabIndex] = useState(0);


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
        if (query) {
            setLanguage(query.lang)
        }
    }, [query])

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
        <div className="page-template">
            <nav className="breadcrumb-container" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href={{pathname: "/", query: query}}>{t('pages.main')}</Link>
                    </li>
                    <li className="breadcrumb-item"><Link
                        href={{pathname: "/algorithms", query: {lang: language}}}>{t('algorithms')}</Link></li>
                    <li className="breadcrumb-item active"
                        aria-current="page">{language === 'en' ? algorithm.nameEn : algorithm.nameRu}</li>
                </ol>
            </nav>


            {algorithm && processors && ticks && determinants &&
            <>

                <div className="tabs-header">
                    <div className={styles.tabs}>
                        <div className={tabIndex === 0 ? styles.checked : styles.tab} onClick={() => setTabIndex(0)}>
                            <span className="typography-subtitle1">{t('approximation')}</span>
                        </div>
                        <div className={tabIndex === 1 ? styles.checked : styles.tab} onClick={() => setTabIndex(1)}>
                            <span className="typography-subtitle1">{t('determinants')}</span>
                        </div>
                    </div>
                </div>

                <div className="tabs-body">
                    {tabIndex === 0 && <div className="tabs-body-content">

                        <div style={{display: "flex", gap: "10px", width: "100%", maxWidth: "1500px", flexWrap: "wrap"}}>
                            {variables && variables.length > 0 && variables.map((item, index) => {
                                return (
                                    <div key={index} className="in-group" style={{width: "max-content"}}>
                                        <label className={"typography-subtitle2"}>X{index+1}</label>
                                        <input  type="number" value={variables[index]} onChange={(e) => {
                                            if (e.target.value >= 0)
                                            {
                                                setVariables(variables.map((v, i) => {
                                                    if (index === i) return e.target.value;
                                                    return v;
                                                }))
                                            }

                                        }} style={{maxWidth: "1500px"}} min="0"/>
                                    </div>


                                )
                            })}
                        </div>


                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: "20px",
                            justifyContent: "space-between",
                            width: "100%",
                            maxWidth: "1500px"
                        }}>
                            <div className="card" style={{width: "calc(50% - 20px)", minWidth: "700px"}}>
                                {ticks.data.img && <img src={ticks.data.img} className="card-img-top"
                                                        style={{width: "100%", maxWidth: "700px"}} alt="..."/>}

                                <div className="card-body">
                                    <h5 className="card-title" data-bs-toggle="collapse" href="#collapseHeight"
                                        role="button" aria-expanded="false" aria-controls="collapseHeight">
                                        {t('algo_height')}: {height}
                                    </h5>
                                    <div className="collapse" id="collapseHeight">
                                        <InlineMath>{algorithm.dataHeight.replaceAll('cdot', '\\cdot').replaceAll('*', ' \\cdot ')}</InlineMath>
                                    </div>
                                </div>
                            </div>

                            <div className="card" style={{width: "calc(50% - 20px)", minWidth: "700px"}}>
                                {processors.data.img && <img src={processors.data.img} className="card-img-top"
                                                             style={{width: "100%", maxWidth: "700px"}} alt="..."/>}

                                <div className="card-body">
                                    <h5 className="card-title" data-bs-toggle="collapse" href="#collapseWidth"
                                        role="button" aria-expanded="false" aria-controls="collapseWidth">
                                        {t('algo_width')}: {width}
                                    </h5>
                                    <div className="collapse" id="collapseWidth">
                                        <InlineMath>{algorithm.dataWidth.replaceAll('cdot', '\\cdot').replaceAll('*', ' \\cdot ')}</InlineMath>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}

                    {tabIndex === 1 && <div className="tabs-body-content">
                        {determinants.length > 0 && <table>
                            <thead>
                            <tr>
                                <th className="typography-subtitle2">{t('table.dimensions')}</th>
                                {determinants[0].iterations &&
                                <th className="typography-subtitle2">{t('table.iterations')}</th>}

                                <th className="typography-subtitle2">{t('table.processors')}</th>
                                <th className="typography-subtitle2">{t('table.ticks')}</th>
                                <th style={{width: "30px"}}></th>
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
                                            <img width={"16px"} src={"/export.svg"}/>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>}
                    </div>}
                </div>
            </>}

            <div className="language-group">
                <LanguageSwitcher lang={t('another_language')}>
                    <img role="button" src={t('language_icon')} alt="language"/>
                </LanguageSwitcher>
            </div>
        </div>
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