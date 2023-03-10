import Link from "next/link";
import styles from '@/styles/Algorithms.module.css'
import {useState} from "react";
import {useFormInput} from "@/utils/hooks";
import NavigationTree from "@/components/NavigationTree";

const Algorithms = ({algorithms, folders}) => {
    const [tabIndex, setTabIndex] = useState(0)
    const searchInput = useFormInput('')

    return (
        <>
            <div className={styles.algorithmsPage}>



                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "1125px",
                    padding: "20px 0 0"
                }}>
                    <div className={styles.tabs}>
                        <div className={tabIndex === 0 ? styles.checked : styles.tab} onClick={() => setTabIndex(0)}>
                            <span className="typography-subtitle1">Algorithms</span>
                        </div>
                        <div className={tabIndex === 1 ? styles.checked : styles.tab} onClick={() => setTabIndex(1)}>
                            <span className="typography-subtitle1">Folders</span>
                        </div>
                    </div>

                    {tabIndex === 0 && <input value={searchInput.value} onChange={searchInput.onChange} type={"search"}
                           placeholder={"Search..."} style={{width: "300px"}}/>}
                </div>

                <>
                    {tabIndex === 0 && <div className={styles.algoList}>
                        <table>
                            <thead>
                            <tr style={{height: "30px"}}>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2" style={{color: "#6F7CA0"}}>Name</span>
                                </th>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2" style={{color: "#6F7CA0"}}>Description</span>
                                </th>
                                <th className={styles.tableHeader}/>
                            </tr>
                            </thead>

                            <tbody>
                            {algorithms
                                .filter(item => item.nameEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                    item.nameRu.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                    item.descriptionEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                    item.descriptionRu.toUpperCase().includes(searchInput.value.toUpperCase()))
                                .map((item, index) => {
                                    return (

                                        <tr key={index} style={{height: "40px"}}>
                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.nameEn}</span>
                                            </td>
                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">
                                                {item.descriptionEn}
                                            </span>

                                            </td>

                                            <td style={{padding: "0 5px"}}>
                                                <Link key={index} href={`/algorithms/${item.algorithmId}`}>
                                                    <img src={"/eye.svg"}/>
                                                </Link>
                                            </td>

                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>
                    </div>}

                    {tabIndex === 1 && <div className={styles.algoList}>
                        <div style={{alignItems: "flex-end", display: "flex", gap: "10px", flexDirection: "column", maxWidth: "1125px", width: "inherit"}}>
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
                </>

            </div>
        </>

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

