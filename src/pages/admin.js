import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Spinner, Table} from "reactstrap";
import {useFormInput} from "@/utils/hooks";
import styles from '@/styles/Admin.module.css';
import {v4 as uuidv4} from 'uuid';
import Link from "next/link";


export default function Admin() {
    const [algorithms, setAlgorithms] = useState(undefined)
    const [determinants, setDeterminants] = useState(undefined)
    const [folders, setFolders] = useState(undefined)

    const [tabIndex, setTabIndex] = useState(0)
    const searchInput = useFormInput('')

    useEffect(() => {
        getAlgorithms()
        getDeterminants()
        getFolders()
    }, [])

    const getAlgorithms = () => {

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm", {method: "GET"})
            .then(response => response.json())
            .then(result => {
                setAlgorithms(result)
            })
            .catch(error => console.log('error', error));
    }

    const getDeterminants = () => {

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/determinant", {method: "GET"})
            .then(response => response.json())
            .then(result => {
                setDeterminants(result)
            })
            .catch(error => console.log('error', error));
    }

    const getFolders = () => {

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/folder", {method: "GET"})
            .then(response => response.json())
            .then(result => {
                setFolders(result)
            })
            .catch(error => console.log('error', error));
    }


    // Управление алгоритмами
    const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(undefined);
    const [folderId, setFolderId] = useState(undefined);
    const nameAlgo = {en: useFormInput(''), ru: useFormInput('')};
    const descriptionAlgo = {en: useFormInput(''), ru: useFormInput('')};

    const handleAlgoClose = () => {
        setShowAlgorithmModal(false);
        setSelectedAlgorithm(undefined);
        setFolderId(undefined);
        nameAlgo.en.setValue('');
        nameAlgo.ru.setValue('');
        descriptionAlgo.en.setValue('');
        descriptionAlgo.ru.setValue('');
    }

    const handleAlgoShow = (e, item = undefined) => {
        setShowAlgorithmModal(true);

        if (item) {
            setSelectedAlgorithm(item);
            setFolderId(item.folderId);
            nameAlgo.en.setValue(item.nameEn);
            nameAlgo.ru.setValue(item.nameRu);
            descriptionAlgo.en.setValue(item.descriptionEn);
            descriptionAlgo.ru.setValue(item.descriptionRu);
        }
    }

    const handleAlgoCreate = () => {
        let raw = JSON.stringify({
            algorithmId: selectedAlgorithm ? selectedAlgorithm.algorithmId : uuidv4(),
            folderId: folderId,
            nameRu: nameAlgo.ru.value,
            nameEn: nameAlgo.en.value,
            descriptionEn: descriptionAlgo.en.value,
            descriptionRu: descriptionAlgo.ru.value
        });

        let requestOptions = {
            method: 'POST',
            body: raw,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm", requestOptions)
            .then(response => response.json())
            .then(result => {
                selectedAlgorithm ? setAlgorithms(algorithms.map(a => {
                    if (a.algorithmId === result.algorithmId) {
                        a.folderId = result.folderId
                        a.nameRu = result.nameRu
                        a.nameEn = result.nameEn
                        a.descriptionEn = result.descriptionEn
                        a.descriptionRu = result.descriptionRu
                    }

                    return a
                })) : setAlgorithms(oldArray => [result, ...oldArray]);

                handleAlgoClose()
                console.log(result)
            })
            .catch(error => console.log('error', error));
    }

    const handleAlgoDelete = (item) => {
        let isDelete = confirm("Уверены?");

        if (isDelete) {
            let requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            };


            fetch(`https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm/${item.algorithmId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    // handleClose()
                    setAlgorithms(algorithms.filter(i => i.algorithmId !== item.algorithmId));
                    console.log(result)
                })
                .catch(error => console.log('error', error));
        }

    }


    // Управление папками
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(undefined);
    const [parentId, setParentId] = useState(undefined);
    const nameFolder = {en: useFormInput(''), ru: useFormInput('')};

    const handleFolderClose = () => {
        setShowFolderModal(false);
        setSelectedFolder(undefined);
        setParentId(undefined);
        nameFolder.en.setValue('');
        nameFolder.ru.setValue('');
    }

    const handleFolderShow = (e, item = undefined) => {
        setShowFolderModal(true);

        if (item) {
            setSelectedFolder(item);
            setParentId(item.parentId);
            nameFolder.en.setValue(item.nameEn);
            nameFolder.ru.setValue(item.nameRu);
        }
    }

    const handleFolderCreate = () => {
        let raw = JSON.stringify({
            folderId: selectedFolder ? selectedFolder.folderId : uuidv4(),
            nameRu: nameFolder.ru.value,
            nameEn: nameFolder.en.value,
            parentId: parentId
        });

        let requestOptions = {
            method: 'POST',
            body: raw,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/folder", requestOptions)
            .then(response => response.json())
            .then(result => {
                selectedFolder ? setFolders(folders.map(f => {
                    if (f.folderId === result.folderId) {
                        f.nameRu = result.nameRu
                        f.nameEn = result.nameEn
                        f.parentId = result.parentId
                    }

                    return f
                })) : setFolders(oldArray => [result, ...oldArray]);

                handleFolderClose()
                console.log(result)
            })
            .catch(error => console.log('error', error));
    }

    const handleFolderDelete = (item) => {
        let isDelete = confirm("Уверены?");

        if (isDelete) {
            let requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            fetch(`https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/folder/${item.folderId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setFolders(folders.filter(i => i.folderId !== item.folderId));
                    console.log(result)
                })
                .catch(error => console.log('error', error));
        }
    }

    //
    // //Управление детерминантами
    // const [algorithmId, setAlgorithmId] = useState(undefined);




    const OnBuildHandle = () => {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`https://bba65mmb49ker14nr711.containers.yandexcloud.net/`, requestOptions)
            .then(response => response.json())
            .catch(error => console.log('error', error));
    }
    return (

        <div style={{
            boxSizing: "border-box",
            padding: "30px 10px 0 60px",
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            background: "rgb(250, 251, 255)"
        }}>

            <Link href={"/"}>
                <img src={"/back.svg"}
                     style={{width: "40px", transform: "rotate(180deg)", position: "absolute", left: "30px", cursor: "pointer"}}/>
            </Link>


            {algorithms && folders && determinants ? <>

                <div style={{display: "flex", justifyContent: "space-between", width: "80%", maxWidth: "1125px", padding: "0 25px 0 0"}}>
                    <div className={styles.tabs}>
                        <div className={tabIndex === 0 ? styles.checked : styles.tab} onClick={() => setTabIndex(0)}>
                            <img width={"20px"} height={"20px"} src={"/add.svg"} onClick={e => handleAlgoShow(e)}/>
                            <span className="typography-subtitle1">Algorithms</span>
                            <span className="typography-caption2">{algorithms.length}</span>
                        </div>
                        <div className={tabIndex === 1 ? styles.checked : styles.tab} onClick={() => setTabIndex(1)}>
                            <img width={"20px"} height={"20px"} src={"/add.svg"} onClick={e => handleFolderShow(e)}/>
                            <span className="typography-subtitle1">Folders</span>
                            <span className="typography-caption2">{folders.length}</span>
                        </div>
                        <div className={tabIndex === 2 ? styles.checked : styles.tab} onClick={() => setTabIndex(2)}>
                            <span className="typography-subtitle1">Determinants</span>
                            <span className="typography-caption2">{determinants.length}</span>
                        </div>
                    </div>

                    <input value={searchInput.value} onChange={searchInput.onChange} type={"search"} placeholder={"Search..."} style={{width: "300px"}}/>
                </div>

                <div style={{overflow: "hidden auto"}}>
                    {tabIndex === 0 && <div className={styles.tabsBody}>
                        {algorithms
                            .filter(item => item.nameEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                            item.nameRu.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                            item.descriptionEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                            item.descriptionRu.toUpperCase().includes(searchInput.value.toUpperCase()))
                            .map((item, index) => {
                            const parent = item.folderId && folders.find(folder => folder.folderId === item.folderId) || undefined

                            return (
                                <div key={index} className={styles.algorithmItem}
                                     onDoubleClick={e => handleAlgoShow(e, item)}>


                                    {parent && <div style={{display: "flex", gap: "5px"}}>
                                        <img src="/folder.svg" alt={"folder icon"}/>
                                        <span
                                            className="typography-caption1">{parent && `${parent.nameEn} (${parent.nameRu})` || item.folderId}</span>
                                    </div>}

                                    <img className={styles.xButton}
                                        // src="/x.svg"
                                         alt={"x icon"}
                                         onClick={() => handleAlgoDelete(item)}/>


                                    <span className="typography-subtitle2">
                                        {item.nameEn} <span className="typography-caption1">({item.nameRu})</span>
                                    </span>
                                    <span className="typography-body2">
                                        {item.descriptionEn} <span className="typography-caption1">({item.descriptionRu})</span>
                                    </span>
                                </div>
                            )
                        })}


                        {showAlgorithmModal && <div className={styles.back}>
                            <div className={styles.modal}>
                                <input value={nameAlgo.en.value}
                                       onChange={e => nameAlgo.en.onChange(e)}
                                       placeholder="Enter Name En"/>

                                <textarea value={descriptionAlgo.en.value}
                                          onChange={e => descriptionAlgo.en.onChange(e)}
                                          placeholder="Enter Description En"/>

                                <input value={nameAlgo.ru.value}
                                       onChange={e => nameAlgo.ru.onChange(e)}
                                       placeholder="Enter Name Ru"/>

                                <textarea value={descriptionAlgo.ru.value}
                                          onChange={e => descriptionAlgo.ru.onChange(e)}
                                          placeholder="Enter Description Ru"/>

                                <select value={folderId} onChange={e => setFolderId(e.target.value)}>
                                    <option value={undefined}/>

                                    {folders && folders.map((folder, index2) => {
                                        return (
                                            <option key={index2} value={folder.folderId}>{folder.nameEn}</option>
                                        )
                                    })}
                                </select>

                                <div>
                                    <button className={styles.primaryButton}
                                            onClick={handleAlgoCreate}
                                            disabled={nameAlgo.en.value === '' || nameAlgo.ru.value === '' || descriptionAlgo.en.value === '' || descriptionAlgo.ru.value === ''}>Save
                                    </button>
                                    <button className={styles.secondaryButton} onClick={handleAlgoClose}>Cancel</button>
                                </div>
                            </div>
                        </div>}
                    </div>}


                    {tabIndex === 1 && <div className={styles.tabsBody}>
                        {folders
                            .filter(item => item.nameEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                            item.nameRu.toUpperCase().includes(searchInput.value.toUpperCase()))
                            .map((item, index) => {
                                const parent = item.parentId && folders.find(folder => folder.folderId === item.parentId) || undefined

                                return (
                                    <div key={index} className={styles.algorithmItem} onDoubleClick={e => handleFolderShow(e, item)}>


                                        {parent && <div style={{display: "flex", gap: "5px"}}>
                                            <img src="/folder.svg" alt={"folder icon"}/>
                                            <span
                                                className="typography-caption1">{parent && `${parent.nameEn} (${parent.nameRu})` || item.parentId}</span>
                                        </div>}

                                        <img className={styles.xButton}
                                            // src="/x.svg"
                                             alt={"x icon"}
                                             onClick={() => handleFolderDelete(item)}/>


                                        <span className="typography-subtitle2">{item.nameEn}</span>

                                        <span className="typography-caption1">({item.nameRu})</span>

                                    </div>
                                )
                            })}


                        {showFolderModal && <div className={styles.back}>
                            <div className={styles.modal}>
                                <input value={nameFolder.en.value}
                                       onChange={e => nameFolder.en.onChange(e)}
                                       placeholder="Enter Name En"/>


                                <input value={nameFolder.ru.value}
                                       onChange={e => nameFolder.ru.onChange(e)}
                                       placeholder="Enter Name Ru"/>


                                <select value={parentId} onChange={e => setParentId(e.target.value)}>
                                    <option value={undefined}/>

                                    {folders && folders.map((folder, index2) => {
                                        return (
                                            <option key={index2} value={folder.folderId}>{folder.nameEn}</option>
                                        )
                                    })}
                                </select>

                                <div>
                                    <button className={styles.primaryButton}
                                            onClick={handleFolderCreate}
                                            disabled={nameFolder.en.value === '' || nameFolder.ru.value === ''}>Save
                                    </button>
                                    <button className={styles.secondaryButton} onClick={handleFolderClose}>Cancel</button>
                                </div>
                            </div>
                        </div>}
                    </div>}


                </div>



                <button onClick={OnBuildHandle}>Собрать</button>

            </> : <Spinner/>}
            {/*{algorithms && folders && determinants ?*/}
            {/*    <Tabs defaultActiveKey="algorithms" className="mb-3">*/}
            {/*        <Tab eventKey="algorithms" title="Algorithms">*/}
            {/*            {algorithms &&*/}
            {/*            <div style={{overflow: "hidden auto", height: "calc(100vh - 80px)"}}>*/}
            {/*                <Table striped bordered hover>*/}
            {/*                    <thead>*/}
            {/*                    <tr>*/}
            {/*                        <th>Name En</th>*/}
            {/*                        <th>Name Ru</th>*/}
            {/*                        <th>Description En</th>*/}
            {/*                        <th>Description Ru</th>*/}
            {/*                        <th>Folder</th>*/}
            {/*                        <th onClick={handleAlgoShow}> Add</th>*/}
            {/*                    </tr>*/}
            {/*                    </thead>*/}

            {/*                    <tbody>*/}
            {/*                    {algorithms.map((item, index) => {*/}
            {/*                        return (*/}
            {/*                            <tr key={index}>*/}
            {/*                                <td>{item.nameEn}</td>*/}
            {/*                                <td>{item.nameRu}</td>*/}
            {/*                                <td>{item.descriptionEn}</td>*/}
            {/*                                <td>{item.descriptionRu}</td>*/}
            {/*                                <td>{folders && folders.find(folder => folder.folderId === item.folderId) && folders.find(folder => folder.folderId === item.folderId).nameRu || item.folderId}</td>*/}
            {/*                                <td>*/}
            {/*                                    <div onClick={e => handleAlgoShow(e, item)}>Edit</div>*/}
            {/*                                    <div onClick={() => handleAlgoDelete(item)}>Delete</div>*/}
            {/*                                </td>*/}
            {/*                            </tr>*/}
            {/*                        )*/}
            {/*                    })}*/}
            {/*                    </tbody>*/}
            {/*                </Table>*/}
            {/*            </div>}*/}

            {/*            <Modal show={showAlgorithmModal} onHide={handleAlgoClose}>*/}
            {/*                <Modal.Header closeButton>*/}
            {/*                    <Modal.Title>{selectedAlgorithm ? "Редактирование алгоритма" : "Создание алгоритма"}</Modal.Title>*/}
            {/*                </Modal.Header>*/}
            {/*                <Modal.Body style={{display: "flex", flexDirection: "column", gap: "10px"}}>*/}
            {/*                    <input value={nameAlgo.en.value}*/}
            {/*                           onChange={e => nameAlgo.en.onChange(e)}*/}
            {/*                           placeholder="Enter Name En"/>*/}

            {/*                    <textarea value={descriptionAlgo.en.value}*/}
            {/*                              onChange={e => descriptionAlgo.en.onChange(e)}*/}
            {/*                              placeholder="Enter Description En"/>*/}

            {/*                    <input value={nameAlgo.ru.value}*/}
            {/*                           onChange={e => nameAlgo.ru.onChange(e)}*/}
            {/*                           placeholder="Enter Name Ru"/>*/}

            {/*                    <textarea value={descriptionAlgo.ru.value}*/}
            {/*                              onChange={e => descriptionAlgo.ru.onChange(e)}*/}
            {/*                              placeholder="Enter Description Ru"/>*/}

            {/*                    <select value={folderId} onChange={e => setFolderId(e.target.value)}>*/}
            {/*                        <option value={undefined}/>*/}

            {/*                        {folders && folders.map((folder, index2) => {*/}
            {/*                            return (*/}
            {/*                                <option key={index2} value={folder.folderId}>{folder.nameEn}</option>*/}
            {/*                            )*/}
            {/*                        })}*/}
            {/*                    </select>*/}
            {/*                </Modal.Body>*/}
            {/*                <Modal.Footer>*/}
            {/*                    <Button variant="primary"*/}
            {/*                            onClick={handleAlgoCreate}*/}
            {/*                            disabled={nameAlgo.en.value === '' || nameAlgo.ru.value === '' || descriptionAlgo.en.value === '' || descriptionAlgo.ru.value === ''}>*/}
            {/*                        Сохранить*/}
            {/*                    </Button>*/}
            {/*                </Modal.Footer>*/}
            {/*            </Modal>*/}
            {/*        </Tab>*/}

            {/*        /!*<Tab eventKey="folders" title="Folders">*!/*/}
            {/*        /!*    {folders &&*!/*/}
            {/*        /!*    <div style={{overflow: "hidden auto", height: "calc(100vh - 80px)"}}>*!/*/}
            {/*        /!*        <Table striped bordered hover>*!/*/}
            {/*        /!*            <thead>*!/*/}
            {/*        /!*            <tr>*!/*/}
            {/*        /!*                <th>Name En</th>*!/*/}
            {/*        /!*                <th>Name Ru</th>*!/*/}
            {/*        /!*                <th>Parent Id</th>*!/*/}
            {/*        /!*                <th onClick={handleFolderShow}> Add</th>*!/*/}
            {/*        /!*            </tr>*!/*/}
            {/*        /!*            </thead>*!/*/}

            {/*        /!*            <tbody>*!/*/}
            {/*        /!*            {folders.map((item, index) => {*!/*/}
            {/*        /!*                const parent = folders.find(f => f.folderId === item.parentId)*!/*/}
            {/*        /!*                return (*!/*/}
            {/*        /!*                    <tr key={index}>*!/*/}
            {/*        /!*                        <td>{item.nameEn}</td>*!/*/}
            {/*        /!*                        <td>{item.nameRu}</td>*!/*/}
            {/*        /!*                        <td>{parent ? parent.nameRu : "Empty"}</td>*!/*/}
            {/*        /!*                        <td>*!/*/}
            {/*        /!*                            <GrEdit onClick={e => handleFolderShow(e, item)}/>*!/*/}
            {/*        /!*                            <RiDeleteBin6Line onClick={() => handleFolderDelete(item)}/>*!/*/}
            {/*        /!*                        </td>*!/*/}
            {/*        /!*                    </tr>*!/*/}
            {/*        /!*                )*!/*/}
            {/*        /!*            })}*!/*/}
            {/*        /!*            </tbody>*!/*/}
            {/*        /!*        </Table>*!/*/}
            {/*        /!*    </div>}*!/*/}

            {/*        /!*    <Modal show={showFolderModal} onHide={handleFolderClose}>*!/*/}
            {/*        /!*        <Modal.Header closeButton>*!/*/}
            {/*        /!*            <Modal.Title>{selectedFolder ? "Редактирование папки" : "Создание папки"}</Modal.Title>*!/*/}
            {/*        /!*        </Modal.Header>*!/*/}
            {/*        /!*        <Modal.Body style={{display: "flex", flexDirection: "column", gap: "10px"}}>*!/*/}
            {/*        /!*            <input value={nameFolder.en.value}*!/*/}
            {/*        /!*                   onChange={e => nameFolder.en.onChange(e)}*!/*/}
            {/*        /!*                   placeholder="Enter Name En"/>*!/*/}

            {/*        /!*            <input value={nameFolder.ru.value}*!/*/}
            {/*        /!*                   onChange={e => nameFolder.ru.onChange(e)}*!/*/}
            {/*        /!*                   placeholder="Enter Name Ru"/>*!/*/}

            {/*        /!*            <select value={parentId} onChange={e => setParentId(e.target.value)}>*!/*/}
            {/*        /!*                <option value={undefined}/>*!/*/}

            {/*        /!*                {folders && folders.map((folder, index2) => {*!/*/}
            {/*        /!*                    return (*!/*/}
            {/*        /!*                        <option value={folder.folderId}>{folder.nameEn}</option>*!/*/}
            {/*        /!*                    )*!/*/}
            {/*        /!*                })}*!/*/}
            {/*        /!*            </select>*!/*/}
            {/*        /!*        </Modal.Body>*!/*/}
            {/*        /!*        <Modal.Footer>*!/*/}
            {/*        /!*            <Button variant="primary"*!/*/}
            {/*        /!*                    onClick={handleFolderCreate}*!/*/}
            {/*        /!*                    disabled={nameFolder.en.value === '' || nameFolder.ru.value === ''}>*!/*/}
            {/*        /!*                Сохранить*!/*/}
            {/*        /!*            </Button>*!/*/}
            {/*        /!*        </Modal.Footer>*!/*/}
            {/*        /!*    </Modal>*!/*/}

            {/*        /!*</Tab>*!/*/}

            {/*        /!*<Tab eventKey="determinants" title="Determinants"*!/*/}
            {/*        /!*     style={{display: "flex", flexDirection: "column", gap: "20px"}}>*!/*/}

            {/*        /!*    <select value={algorithmId} onChange={e => setAlgorithmId(e.target.value)}>*!/*/}
            {/*        /!*        <option value={undefined}/>*!/*/}
            {/*        /!*        {algorithms && algorithms.map((item, index) => {*!/*/}
            {/*        /!*            return (*!/*/}
            {/*        /!*                <option value={item.algorithmId}>{item.nameRu}</option>*!/*/}
            {/*        /!*            )*!/*/}
            {/*        /!*        })}*!/*/}
            {/*        /!*    </select>*!/*/}

            {/*        /!*    {determinants && algorithmId &&*!/*/}
            {/*        /!*    <div style={{overflow: "hidden auto", height: "calc(100vh - 134px)"}}>*!/*/}
            {/*        /!*        <Table striped bordered hover>*!/*/}
            {/*        /!*            <thead>*!/*/}
            {/*        /!*            <tr>*!/*/}
            {/*        /!*                <th>Dimensions</th>*!/*/}
            {/*        /!*                <th>Iterations</th>*!/*/}
            {/*        /!*                <th>Processors</th>*!/*/}
            {/*        /!*                <th>Ticks</th>*!/*/}
            {/*        /!*                <th> Add</th>*!/*/}
            {/*        /!*            </tr>*!/*/}
            {/*        /!*            </thead>*!/*/}

            {/*        /!*            <tbody>*!/*/}
            {/*        /!*            {determinants.filter(item => item.algorithmId === algorithmId).map((item, index) => {*!/*/}
            {/*        /!*                return (*!/*/}
            {/*        /!*                    <tr key={index}>*!/*/}
            {/*        /!*                        <td>{item.dimensions}</td>*!/*/}
            {/*        /!*                        <td>{item.iterations}</td>*!/*/}
            {/*        /!*                        <td>{item.processors}</td>*!/*/}
            {/*        /!*                        <td>{item.ticks}</td>*!/*/}
            {/*        /!*                        <td>*!/*/}
            {/*        /!*                            <GrEdit/>*!/*/}
            {/*        /!*                            <RiDeleteBin6Line/>*!/*/}
            {/*        /!*                        </td>*!/*/}
            {/*        /!*                    </tr>*!/*/}
            {/*        /!*                )*!/*/}
            {/*        /!*            })}*!/*/}
            {/*        /!*            </tbody>*!/*/}
            {/*        /!*        </Table>*!/*/}
            {/*        /!*    </div>}*!/*/}


            {/*        /!*</Tab>*!/*/}
            {/*    </Tabs>*/}
            {/*    :*/}
            {/*    <Spinner animation="border"/>*/}
            {/*}*/}

        </div>
    );
}
