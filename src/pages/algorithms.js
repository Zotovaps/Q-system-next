import {useEffect, useState} from "react";
import Link from "next/link";
import styles from '@/styles/Algorithms.module.css'
import {useFormInput} from "@/utils/hooks";
import NavigationTree from "@/components/NavigationTree";
import {LanguageSwitcher, useLanguageQuery, useTranslation} from "next-export-i18n";

const Algorithms = ({algorithms, folders}) => {
    const {t, i18n} = useTranslation();
    const [query] = useLanguageQuery();
    const [language, setLanguage] = useState('en');

    const [tabIndex, setTabIndex] = useState(0);
    const searchInput = useFormInput('');

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
                    <li className="breadcrumb-item active" aria-current="page">{t('algorithms')}</li>
                </ol>
            </nav>

            <div className="tabs-header">

                <div className={styles.tabs}>
                    <div className={tabIndex === 0 ? styles.checked : styles.tab} onClick={() => setTabIndex(0)}>
                        <span className="typography-subtitle1">{t('list')}</span>
                    </div>
                    <div className={tabIndex === 1 ? styles.checked : styles.tab} onClick={() => setTabIndex(1)}>
                        <span className="typography-subtitle1">{t('hierarchy')}</span>
                    </div>
                </div>

                {tabIndex === 0 && <input value={searchInput.value} onChange={searchInput.onChange} type={"search"}
                                          placeholder={t('search')}/>}
            </div>

            <div className="tabs-body">
                {tabIndex === 0 && <div className="tabs-body-content">
                    <table>
                        <thead>
                            <tr>
                                <th className="typography-subtitle2">{t('table.name')}</th>
                                <th className="typography-subtitle2">{t('table.description')}</th>
                                <th/>
                            </tr>
                        </thead>

                        <tbody>
                        {algorithms && algorithms
                            .filter(item => item.nameEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                item.nameRu.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                item.descriptionEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                item.descriptionRu.toUpperCase().includes(searchInput.value.toUpperCase()))
                            .map((item, index) => {
                                return (
                                    <tr key={index} style={{height: "40px"}}>
                                        <td className="typography-body2" style={{padding: "5px 10px"}}>
                                            {language === 'en' ? item.nameEn : item.nameRu}
                                        </td>

                                        <td className="typography-body2" style={{padding: "5px 10px"}}>
                                            {language === 'en' ? item.descriptionEn : item.descriptionRu}
                                        </td>

                                        <td>
                                            <Link href={{pathname: `/algorithms/${item.algorithmId}`, query: query}}>
                                                <img src={"/eye.svg"}/>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>}

                {tabIndex === 1 && <div className="tabs-body-content">
                    <div style={{
                        alignItems: "flex-end",
                        display: "flex",
                        gap: "10px",
                        flexDirection: "column",
                        maxWidth: "1500px",
                        width: "inherit"
                    }}>
                        {folders && folders
                            .filter(item => !item.parentId)
                            .map((item, index) => {
                                return (
                                    <NavigationTree key={index}
                                                    item={item}
                                                    folders={folders}
                                                    algorithms={algorithms}
                                                    isFolder={true}
                                                    level={0}/>
                                )
                            })
                        }
                    </div>

                </div>}
            </div>

            <div className="language-group">
                <LanguageSwitcher lang={t('another_language')}>
                    <img role="button" src={t('language_icon')} alt="language"/>
                </LanguageSwitcher>
            </div>
        </div>
    )
}

export default Algorithms;

export async function getStaticProps(context) {

    const resAlgo = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm')
    const algorithms = await resAlgo.json()

    const resFolder = await fetch('https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/folder')
    const folders = await resFolder.json()


    return {
        props: {algorithms, folders}, // will be passed to the page component as props
    }
}

