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

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/auth", requestOptions)
            .then(response => {
                if (!response.ok) throw new Error("HTTP status " + response.status);

                return response.text()
            })
            .then(result => {
                if (result === 'false') throw new Error("Auth error");

                localStorage && localStorage.setItem("accessToken", "Bearer " + result);
                setShow(false);
            })
            .catch(error => {
                console.log('error', error)
                alert("Ошибка авторизации!")
            });
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

                <Link href={{pathname: "/compare", query: query}}>
                    <div className={styles.gridNavItem}>{t('pages.algorithms_compare')}</div>
                </Link>

                <div className={styles.gridNavItem}>{t('pages.approximation_service')}</div>

                <Link href={{pathname: "/documentation", query: query}}>
                    <div className={styles.gridNavItem}>{t('pages.documentation')}</div>
                </Link>

                <Link href={{pathname: "/publications", query: query}}>
                    <div className={styles.gridNavItem}>{t('pages.publications')}</div>
                </Link>

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

            <div className="language-group">
                <LanguageSwitcher lang={t('another_language')}>
                    <img role="button" src={t('language_icon')} alt="language"/>
                </LanguageSwitcher>
            </div>
        </div>
    )
}
