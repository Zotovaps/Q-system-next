import React, {useEffect, useState} from "react";
import Link from "next/link";
import styles from '@/styles/Algorithms.module.css'
import {useFormInput} from "@/utils/hooks";
import NavigationTree from "@/components/NavigationTree";
import {LanguageSwitcher, useLanguageQuery, useTranslation} from "next-export-i18n";
import {xml2json} from "xml-js";
import NavigationTreeItem from "@/components/NavigationTreeItem";

const Documentation = ({docs}) => {
    const {t, i18n} = useTranslation();
    const [query] = useLanguageQuery();
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        if (query) {
            setLanguage(query.lang)
        }
    }, [query])

    return (
        <div className="page-template">

            <nav className="breadcrumb-container" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href={{pathname: "/", query: query}}>{t('pages.main')}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">{t('pages.documentation')}</li>
                </ol>
            </nav>

            <div
                style={{display: "flex", flexDirection: "column", flexWrap: "wrap", gap: "10px", width: "100%", maxWidth: "1500px"}}>
                {docs.map((item, index) => {
                    if (index !== 0) {
                        return (
                            <NavigationTreeItem
                                key={index}
                                item={item.Key._text.split("/")[1]}
                                isFolder={true}
                                level={0}
                                onClick={() => {
                                    window.open("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/static/" + item.Key._text)
                                }}/>
                        )
                    }
                })}

            </div>

            <div className="language-group">
                <LanguageSwitcher lang={t('another_language')}>
                    <img role="button" src={t('language_icon')} alt="language"/>
                </LanguageSwitcher>
            </div>
        </div>
    )
}

export default Documentation;

export async function getStaticProps(context) {

    const resDocs = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/list/doc')
    const docsXML = await resDocs.text()

    const docs = JSON.parse(xml2json(docsXML, {spaces: 2, compact: true})).ListBucketResult.Contents

    return {
        props: {docs}, // will be passed to the page component as props
    }
}

