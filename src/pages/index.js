import {useEffect, useState} from "react";
import Link from "next/link"
import styles from '@/styles/Index.module.css'
import {useFormInput} from "@/utils/hooks";
import {LanguageSwitcher, useLanguageQuery, useTranslation} from 'next-export-i18n';


export default function Index({}) {
    const {t} = useTranslation("en");
    const [query] = useLanguageQuery();

    const [show, setShow] = useState(false);
    const login = useFormInput('');
    const password = useFormInput('');
    const [token, setToken] = useState(undefined);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAuth = () => {
        let raw = JSON.stringify({
            login: login.value,
            password: password.value
        });

        let requestOptions = {
            method: 'PUT',
            body: raw,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/http/basic/authorize", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result !== 'false') {
                    localStorage && localStorage.setItem("accessToken", "Bearer " + result);
                    setShow(false);
                }
            })
            .catch(error => console.log('error', error));
    }

    const handleExit = () => {
        localStorage && localStorage.removeItem("accessToken");
        window.location.reload();
    }

    useEffect(() => {
        setToken(localStorage.getItem("accessToken"))
    }, [show])

    return (
        <div className={styles.indexPage}>
            <div className={styles.gridNav}>
                <Link href={{pathname: "/algorithms", query: query}}>
                    <div className={styles.gridNavItem}>{t('pages.algorithms_and_determinants')}</div>
                </Link>

                <div className={styles.gridNavItem}>{t('pages.algorithms_compare')}</div>

                <div className={styles.gridNavItem}>{t('pages.approximation_service')}</div>

                <div className={styles.gridNavItem}>{t('pages.documentation')}</div>

                <div className={styles.gridNavItem}>{t('pages.publications')}</div>

                <div className={styles.gridNavItem} onClick={token ? handleExit : handleShow}>
                    {token ? t('log_out') : t('log_in')}
                </div>

                {token &&
                <Link href={{pathname: "/admin", query: query}}>
                    <div className={styles.gridNavItem}>{t('pages.management')}</div>
                </Link>
                }
            </div>


            {show && <div className="backdrop">
                <div className="modal-container">
                    <input value={login.value} onChange={login.onChange} placeholder={t('enter_login')}/>

                    <input value={password.value} onChange={password.onChange} placeholder={t('enter_password')}
                           type={"password"}/>

                    <div>
                        <button className="primaryButton"
                                onClick={handleAuth}
                                disabled={login.value === '' || password.value === ''}>{t('button.login')}</button>
                        <button className="secondaryButton" onClick={handleClose}>{t('button.cancel')}</button>
                    </div>
                </div>
            </div>}


            <div className="language-group dropup">
                <img role="button" src={t('language_icon')} id="dropdownLanguage" data-bs-toggle="dropdown"
                     aria-expanded="false"/>

                <ul className="dropdown-menu" aria-labelledby="dropdownLanguage">
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
    )
}
