import Link from "next/link"
import { useRouter } from 'next/router';

import styles from '@/styles/Index.module.css'
import {useEffect, useState} from "react";
import {useFormInput} from "@/utils/hooks";
import { useTranslation, useLanguageQuery, LanguageSwitcher } from 'next-export-i18n';



export default function Index({}) {
    const { t } = useTranslation("en");
    const [query] = useLanguageQuery();

    const router = useRouter();
    const [show, setShow] = useState(false);
    const login = useFormInput('');
    const password = useFormInput('');
    const [token, setToken] = useState(undefined);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAuth = () => {
        if (login.value === process.env.login && password.value === process.env.password) {
            sessionStorage && sessionStorage.setItem("accessToken", "123");
            setShow(false);
        }
    }

    const handleExit = () => {
        sessionStorage && sessionStorage.removeItem("accessToken");
        window.location.reload();
    }

    useEffect(() => {
        setToken(sessionStorage.getItem("accessToken"))
    }, [show])

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
                background: "#fafbff",
                padding: "0 4px",
                position: "relative"
            }}>

                <div className={styles.gridNav}>
                    <Link href={"/algorithms"}>
                        <div className={styles.gridNavItem}>{t('algorithms_and_determinants')}</div>
                    </Link>
                    <div className={styles.gridNavItem}>{t('algorithms_compare')}</div>
                    <div className={styles.gridNavItem}>{t('approximation_service')}</div>
                    <div className={styles.gridNavItem}>{t('documentation')}</div>
                    <div className={styles.gridNavItem}>{t('publications')}</div>
                    {token ?
                        <div className={styles.gridNavItem} onClick={handleExit}>{t('log_out')}</div>
                        :
                        <div className={styles.gridNavItem} onClick={handleShow}>{t('log_in')}</div>
                    }
                    {token &&
                    <Link href={"/admin"}>
                        <div className={styles.gridNavItem}>{t('management')}</div>
                    </Link>}
                </div>


                {show && <div className={styles.back}>
                    <div className={styles.modal}>
                        <input value={login.value}
                               onChange={login.onChange}
                               placeholder="Enter Name En"/>

                        <input value={password.value}
                               onChange={password.onChange}
                               placeholder="Enter Name Ru"
                               type={"password"}/>


                        <div>
                            <button className="primaryButton"
                                    onClick={handleAuth}
                                    disabled={login.value === '' || password.value === ''}>Save
                            </button>
                            <button className="secondaryButton" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </div>}


                <div className="dropdown dropup" style={{position: "absolute", bottom: "5px", left: "4px"}}>
                    <img role="button" src={router.locale === 'en' ? "/local-uk.svg" : "/local-ru.svg"} id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"/>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <LanguageSwitcher lang="ru">
                            <li className="dropdown-item" style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                <img src={"/local-ru.svg"}/>
                                <span className="typography-subtitle2">Русский</span>
                            </li>
                        </LanguageSwitcher>

                        <LanguageSwitcher lang="en">
                        <li className="dropdown-item" style={{display: "flex", gap: "10px", alignItems: "center"}}>
                            <img src={"/local-uk.svg"}/>
                            <span className="typography-subtitle2">English</span>
                        </li>
                        </LanguageSwitcher>
                    </ul>
                </div>

            </div>
        </>
    )
}
