import {useEffect, useState} from "react";
import Link from "next/link";
import styles from '@/styles/Algorithms.module.css'
import {useFormInput} from "@/utils/hooks";
import NavigationTree from "@/components/NavigationTree";
import {LanguageSwitcher, useLanguageQuery, useTranslation} from "next-export-i18n";

const ce = require('@cortex-js/compute-engine');


const Compare = () => {
    const {t, i18n} = useTranslation();
    const [query] = useLanguageQuery();
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        if (query) {
            setLanguage(query.lang)
        }
    }, [query])


    const [algorithms, setAlgorithms] = useState([]);
    const [algorithmIdF, setAlgorithmIdF] = useState(undefined);
    const [algorithmIdS, setAlgorithmIdS] = useState(undefined);

    const compareNumber = (x, y) => {
        if (x === y) return 0;
        if (x > y) return 1;
        return -1;

    }

    const compareAlgorithms = () => {

        const firstAlgo = algorithms.find(item => item.algorithmId === algorithmIdF)
        const secondAlgo = algorithms.find(item => item.algorithmId === algorithmIdS)

        const computeEngine = new ce.ComputeEngine();
        computeEngine.set({x_1: 5, x_2: 1, x_3: 1, x_4: 1, x_5: 1, x_6: 1})

        let widthExpr1 = computeEngine.parse(firstAlgo.dataHeight);
        let heightExpr1 = computeEngine.parse(firstAlgo.dataWidth);

        let widthExpr2 = computeEngine.parse(secondAlgo.dataHeight);
        let heightExpr2 = computeEngine.parse(secondAlgo.dataWidth);

        const result1 = compareNumber(widthExpr1.N().valueOf(), widthExpr2.N().valueOf())
        const result2 = compareNumber(heightExpr1.N().valueOf(), heightExpr2.N().valueOf())


        return (
            <table>
                <thead>
                <tr>
                    <th className="typography-subtitle2">{t('table.name')}</th>
                    <th className="typography-subtitle2">{t('table.description')}</th>
                    <th className="typography-subtitle2">{t('table.speed')}</th>
                    <th className="typography-subtitle2">{t('table.number')}</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td className="typography-body2" style={{padding: "5px 10px"}}>
                        {language === 'en' ? firstAlgo.nameEn : firstAlgo.nameRu}
                    </td>
                    <td className="typography-body2" style={{padding: "5px 10px"}}>
                        {language === 'en' ? firstAlgo.descriptionEn : firstAlgo.descriptionRu}
                    </td>
                    <td className="typography-body2" style={{padding: "5px 10px"}}>
                        {result1 === 0 ? t('compare_same') : result1 > 0? t('compare_faster'): t('compare_slower')}

                    </td>
                    <td className="typography-body2" style={{padding: "5px 10px"}}>
                        {result2 === 0 ? t('compare_same'): result2 > 0? t('compare_more'): t('compare_less')}
                    </td>
                </tr>
                <tr>
                    <td className="typography-body2" style={{padding: "5px 10px"}}>
                        {language === 'en' ? secondAlgo.nameEn : secondAlgo.nameRu}
                    </td>
                    <td className="typography-body2" style={{padding: "5px 10px"}}>
                        {language === 'en' ? secondAlgo.descriptionEn : secondAlgo.descriptionRu}
                    </td>
                    <td className="typography-body2" style={{padding: "5px 10px"}}>
                        {result1 === 0 ? t('compare_same'): -result1 > 0? t('compare_faster'): t('compare_slower')}
                    </td>
                    <td className="typography-body2" style={{padding: "5px 10px"}}>
                        {result2 === 0 ? t('compare_same'): -result2 > 0? t('compare_more'): t('compare_less')}
                    </td>
                </tr>
                </tbody>
            </table>
        )
    }

    useEffect(() => {
        getAlgorithms()
    }, [])

    const getAlgorithms = () => {
        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm", {method: "GET"})
            .then(response => response.json())
            .then(result => {
                setAlgorithms(result)
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className="page-template" style={{gap: "30px"}}>

            <nav className="breadcrumb-container" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href={{pathname: "/", query: query}}>{t('pages.main')}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">{t('pages.algorithms_compare')}</li>
                </ol>
            </nav>

            <div style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                margin: "0 auto",
                maxWidth: "1500px",
                alignItems: "center",
                gap: "10px",
                justifyContent: "space-between"
            }}>
                <div>
                    <select value={algorithmIdF} onChange={e => setAlgorithmIdF(e.target.value)}
                            style={{width: "500px"}}>
                        <option value={undefined}/>

                        {algorithms && algorithms.map((algorithm, index) => {
                            return (
                                <option key={index} value={algorithm.algorithmId}>
                                    {language === 'en' ? algorithm.nameEn : algorithm.nameRu}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div>
                    <select value={algorithmIdS} onChange={e => setAlgorithmIdS(e.target.value)}
                            style={{width: "500px"}}>
                        <option value={undefined}/>

                        {algorithms && algorithms.map((algorithm, index) => {
                            return (
                                <option key={index} value={algorithm.algorithmId}>
                                    {language === 'en' ? algorithm.nameEn : algorithm.nameRu}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>


            <div style={{margin: "0 auto", width: "100%", maxWidth: "1500px"}}>
                {algorithms && algorithmIdS && algorithmIdF && compareAlgorithms()}
            </div>

            <div className="language-group">
                <LanguageSwitcher lang={t('another_language')}>
                    <img role="button" src={t('language_icon')} alt="language"/>
                </LanguageSwitcher>
            </div>
        </div>
    )
}

export default Compare;

export async function getStaticProps(context) {

    const resAlgo = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm')
    const algorithms = await resAlgo.json()

    return {
        props: {algorithms}, // will be passed to the page component as props
    }
}

