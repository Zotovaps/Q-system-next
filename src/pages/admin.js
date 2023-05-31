import {useEffect, useState} from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner} from "reactstrap";
import {useFormInput} from "@/utils/hooks";
import styles from '@/styles/Admin.module.css';
import {v4 as uuidv4} from 'uuid';
import Link from "next/link";
import {LanguageSwitcher, useLanguageQuery, useTranslation} from "next-export-i18n";


export default function Admin() {
    const {t, i18n} = useTranslation();
    const [query] = useLanguageQuery();
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        if (query) {
            setLanguage(query.lang)
        }
    }, [query])

    const [loading, setLoading] = useState(false);
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
    const approximationAlgo = {width: useFormInput(''), height: useFormInput('')};

    const handleAlgoClose = () => {
        setShowAlgorithmModal(false);
        setSelectedAlgorithm(undefined);
        setFolderId(undefined);
        nameAlgo.en.setValue('');
        nameAlgo.ru.setValue('');
        descriptionAlgo.en.setValue('');
        descriptionAlgo.ru.setValue('');
        approximationAlgo.width.setValue('');
        approximationAlgo.height.setValue('');
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
            approximationAlgo.width.setValue(item.dataWidth || '');
            approximationAlgo.height.setValue(item.dataHeight || '');
        }
    }

    const handleAlgoCreate = () => {
        let raw = JSON.stringify({
            algorithmId: selectedAlgorithm ? selectedAlgorithm.algorithmId : uuidv4(),
            folderId: folderId,
            nameRu: nameAlgo.ru.value,
            nameEn: nameAlgo.en.value,
            descriptionEn: descriptionAlgo.en.value,
            descriptionRu: descriptionAlgo.ru.value,
            dataWidth: approximationAlgo.width.value,
            dataHeight: approximationAlgo.height.value
        });

        let requestOptions = {
            method: 'POST',
            body: raw,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("accessToken"),
            },
        };

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.message === "Unauthorized") {
                    localStorage && localStorage.removeItem("accessToken");
                    window.location.replace("/");
                    return
                }

                selectedAlgorithm ? setAlgorithms(algorithms.map(a => {
                    if (a.algorithmId === result.algorithmId) {
                        a.folderId = result.folderId
                        a.nameRu = result.nameRu
                        a.nameEn = result.nameEn
                        a.descriptionEn = result.descriptionEn
                        a.descriptionRu = result.descriptionRu
                        a.dataWidth = result.dataWidth
                        a.dataHeight = result.dataHeight
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
                    'Authorization': localStorage.getItem("accessToken"),
                },
            };

            fetch(`https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/algorithm/${item.algorithmId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.message === "Unauthorized") {
                        localStorage && localStorage.removeItem("accessToken");
                        window.location.replace("/");
                        return
                    }

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
                'Authorization': localStorage.getItem("accessToken"),
            },
            redirect: 'follow'
        };

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/folder", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.message === "Unauthorized") {
                    localStorage && localStorage.removeItem("accessToken");
                    window.location.replace("/");
                    return
                }

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
                    'Authorization': localStorage.getItem("accessToken"),
                },
            };

            fetch(`https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/folder/${item.folderId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.message === "Unauthorized") {
                        localStorage && localStorage.removeItem("accessToken");
                        window.location.replace("/");
                        return
                    }

                    setFolders(folders.filter(i => i.folderId !== item.folderId));
                    console.log(result)
                })
                .catch(error => console.log('error', error));
        }
    }


    //Управление детерминантами
    const [algorithmId, setAlgorithmId] = useState(undefined);
    const [showDeterminantModal, setShowDeterminantModal] = useState(false);
    const [showDeterminantEdit, setShowDeterminantEdit] = useState(false);
    const determinantValue = {
        dimension: useFormInput(''),
        iteration: useFormInput(''),
        processors: useFormInput(''),
        ticks: useFormInput('')
    };
    const [determinantId, setDeterminantId] = useState(undefined)

    const chunkSize = 1024 * 1024 * 2;//its 3MB, increase the number measure in mb
    const [showProgress, setShowProgress] = useState(false)
    const [counter, setCounter] = useState(1)
    const [fileToBeUpload, setFileToBeUpload] = useState({})
    const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0)
    const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize)
    const [progress, setProgress] = useState(0)
    const [fileGuid, setFileGuid] = useState("")
    const [fileSize, setFileSize] = useState(0)
    const [chunkCount, setChunkCount] = useState(0)
    const [previous, setPrevious] = useState("")

    useEffect(() => {
        if (fileSize > 0) {
            fileUpload(counter);
        }

        if (progress === 100) {
            setShowProgress(false);
            setShowDeterminantModal(false);
            resetChunkProperties();
        }
    }, [progress])

    const getFileContext = (e) => {
        resetChunkProperties();
        let _file = e.target.files[0];
        setFileSize(_file.size)

        const _totalCount = _file.size % chunkSize === 0 ? _file.size / chunkSize : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
        setChunkCount(_totalCount)

        setFileToBeUpload(_file)

        if (_totalCount > 1) {
            const _fileID = uuidv4();
            setFileGuid(_fileID)
        } else {
            setFileGuid(`${algorithmId}/${uuidv4()}.json`)
        }
    }

    const fileUpload = () => {
        setCounter(counter + 1);

        if (counter <= chunkCount) {
            let chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
            uploadChunk(chunk)
        } else {
            setPrevious("")
        }
    }

    const uploadChunk = async (chunk) => {
        try {
            let requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("accessToken"),
                },
                body: chunk
            };

            const response = await fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/upload?" + new URLSearchParams({
                previous: previous,
                next: fileGuid,
            }), requestOptions)
                .then(data => data.json())
                .then((data) => {
                    if (data.request) {
                        setBeginingOfTheChunk(endOfTheChunk);
                        setEndOfTheChunk(endOfTheChunk + chunkSize);
                        setPrevious(fileGuid)
                        if (counter === chunkCount) {
                            setProgress(100);
                        }
                        if (counter === chunkCount - 1) {
                            setFileGuid(`${algorithmId}/${uuidv4()}.json`)
                            setProgress((counter / chunkCount) * 100);

                        } else {
                            const _fileID = uuidv4();
                            setFileGuid(_fileID)
                            var percentage = (counter / chunkCount) * 100;
                            setProgress(percentage);
                        }
                    } else {
                        console.log('Error Occurred:', data.errorMessage)
                    }
                });
        } catch (error) {
            debugger
            console.log('error', error)
        }
    }

    const resetChunkProperties = () => {
        setPrevious("")
        setFileSize(0)
        setProgress(0)
        setCounter(1)
        setBeginingOfTheChunk(0)
        setEndOfTheChunk(chunkSize)
        setFileToBeUpload({})
    }

    function download(content, fileName, contentType) {
        const a = document.createElement("a");
        const file = new Blob([content], {type: "application/json"});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    const getJSON = async url => {
        const response = await fetch(url, {method: "GET", headers: {'Content-Type': 'application/json'}});
        if (!response.ok) // check if response worked (no 404 errors etc...)
            throw new Error(response.statusText);

        return response.json(); // returns a promise, which resolves to this data value
    }

    const handleDeterminantDownload = (item) => {

        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`https://d5duqpi9k7db8o1dj509.apigw.yandexcloud.net?target=${algorithmId}/${item.determinantId}.json`, requestOptions)
            .then(response => response.text())
            .then(result => {

                getJSON(result).then(data => {
                    download(JSON.stringify(data), `${item.determinantId}.json`, "application/json");
                }).catch(error => {
                    console.error(error);
                });

            })
            .catch(error => console.log('error', error));


        // var url = 'https://d5duqpi9k7db8o1dj509.apigw.yandexcloud.net/static/upload/11-7.json';
        //
        //
        // getJSON(url).then(data => {
        //     download(JSON.stringify(data), "determinant.json", "application/json");
        // }).catch(error => {
        //     console.error(error);
        // });
        //

        // let requestOptions = {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // };
        //
        // fetch(`https://functions.yandexcloud.net/d4egcpdu3hs37ansi2g9?target=11-13.json`, requestOptions)
        //     .then(response => response.json())
        //     .then(result => {
        //         console.log(result)
        //     })
        //     .catch(error => console.log('error', error));
    }

    const handleDeterminantShow = (item) => {
        setShowDeterminantEdit(true)

        setDeterminantId(item.determinantId)

        determinantValue.dimension.setValue(item.dimensions || '');
        determinantValue.iteration.setValue(item.iterations || '');
        determinantValue.processors.setValue(item.processors);
        determinantValue.ticks.setValue(item.ticks);

    }

    const handleDeterminantEdit = () => {
        let raw = JSON.stringify({
            algorithmId: algorithmId,
            determinantId: determinantId,
            dimensions: determinantValue.dimension.value,
            iterations: Number(determinantValue.iteration.value),
            processors: determinantValue.processors.value,
            ticks: determinantValue.ticks.value
        });

        let requestOptions = {
            method: 'POST',
            body: raw,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("accessToken"),
            },
        };

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/determinant", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.message === "Unauthorized") {
                    localStorage && localStorage.removeItem("accessToken");
                    window.location.replace("/");
                    return
                }


                setDeterminants(determinants.map(d => {
                    if (d.determinantId === result.determinantId) {
                        d.dimensions = result.dimensions
                        d.iterations = result.iterations
                        d.processors = result.processors
                        d.ticks = result.ticks
                    }
                    return d
                }))

                setShowDeterminantEdit(false)
                console.log(result)
            })
            .catch(error => console.log('error', error));
    }

    const handleDeterminantDelete = (item) => {
        let isDelete = confirm("Уверены?");

        if (isDelete) {
            let requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("accessToken"),
                },
            };

            fetch(`https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/determinant/${item.determinantId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.message === "Unauthorized") {
                        localStorage && localStorage.removeItem("accessToken");
                        window.location.replace("/");
                        return
                    }
                    setDeterminants(determinants.filter(i => i.determinantId !== item.determinantId));
                    console.log(result)
                })
                .catch(error => console.log('error', error));
        }
    }

    const handleApproximateAlgorithm = () => {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`https://functions.yandexcloud.net/d4e12ndvlmlqba1r28vq?algorithmId=${algorithmId}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log('error', error));
    }

    const OnBuildHandle = () => {
        setLoading(true);

        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("accessToken"),
            },
        };

        fetch(`https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/rebuild`, requestOptions)
            .then(response => response.json())
            .catch(error => {
                setLoading(false);
                console.log('error', error)
            });
    }


    return (

        <div className="page-template">

            <nav className="breadcrumb-container" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href={{pathname: "/", query: query}}>{t('pages.main')}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">{t('pages.management')}</li>
                </ol>
            </nav>

            {algorithms && folders && determinants ?
                <>
                    <div className="tabs-header">
                        <div className={styles.tabs}>
                            <div className={tabIndex === 0 ? styles.checked : styles.tab}
                                 onClick={() => setTabIndex(0)}>
                                <span className="typography-subtitle1">{t('algorithms')}</span>
                            </div>
                            <div className={tabIndex === 1 ? styles.checked : styles.tab}
                                 onClick={() => setTabIndex(1)}>

                                <span className="typography-subtitle1">{t('folders')}</span>
                            </div>
                            <div className={tabIndex === 2 ? styles.checked : styles.tab}
                                 onClick={() => setTabIndex(2)}>
                                <span className="typography-subtitle1">{t('determinants')}</span>
                            </div>
                        </div>

                        <div className="management">
                            <input value={searchInput.value} onChange={searchInput.onChange} type={"search"}
                                   placeholder={t('search')}/>

                            <button className="secondaryButton" onClick={OnBuildHandle}>{t('button.build')}</button>
                        </div>
                    </div>

                    <div className="tabs-body">

                        {tabIndex === 0 && <div className="tabs-body-content">
                            <table>
                                <thead>
                                <tr>
                                    <th className="typography-subtitle2">{t('table.name_ru')}</th>

                                    <th className="typography-subtitle2">{t('table.description_ru')}</th>

                                    <th className="typography-subtitle2">{t('table.name_en')}</th>

                                    <th className="typography-subtitle2">{t('table.description_en')}</th>

                                    <th className="typography-subtitle2">{t('table.folder')}</th>

                                    <th>
                                        <img src={"/add.svg"} onClick={e => handleAlgoShow(e)}/>
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {algorithms
                                    .filter(item => item.nameEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                        item.nameRu.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                        item.descriptionEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                        item.descriptionRu.toUpperCase().includes(searchInput.value.toUpperCase()))
                                    .map((item, index) => {
                                        const parent = item.folderId && folders.find(folder => folder.folderId === item.folderId) || undefined

                                        return (
                                            <tr key={index} style={{height: "40px"}}>
                                                <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                    {item.nameRu}
                                                </td>

                                                <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                    {item.descriptionRu}
                                                </td>

                                                <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                    {item.nameEn}
                                                </td>

                                                <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                    {item.descriptionEn}
                                                </td>

                                                <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                    {parent && `${parent.nameEn} (${parent.nameRu})` || item.parentId}
                                                </td>

                                                <td>
                                                    <div style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "5px"
                                                    }}>
                                                        <img src={"/edit-icon.svg"}
                                                             onClick={e => handleAlgoShow(e, item)}/>

                                                        <img src={"/delete-icon.svg"}
                                                             onClick={() => handleAlgoDelete(item)}/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {showAlgorithmModal && <div className="backdrop">
                                <div className="modal-container">
                                    <div className="in-group">
                                        <label className="typography-subtitle2"
                                               style={{color: "#6F7CA0"}}>{t('table.name_ru')}</label>
                                        <input value={nameAlgo.ru.value}
                                               onChange={e => nameAlgo.ru.onChange(e)}
                                               placeholder="Enter Name Ru"/>
                                    </div>

                                    <div className="in-group">
                                        <label className="typography-subtitle2"
                                               style={{color: "#6F7CA0"}}>{t('table.description_ru')}</label>
                                        <textarea value={descriptionAlgo.ru.value}
                                                  onChange={e => descriptionAlgo.ru.onChange(e)}
                                                  placeholder="Enter Description Ru"/>
                                    </div>

                                    <div className="in-group">
                                        <label className="typography-subtitle2"
                                               style={{color: "#6F7CA0"}}>{t('table.name_en')}</label>
                                        <input value={nameAlgo.en.value}
                                               onChange={e => nameAlgo.en.onChange(e)}
                                               placeholder="Enter Name En"/>
                                    </div>

                                    <div className="in-group">
                                        <label className="typography-subtitle2"
                                               style={{color: "#6F7CA0"}}>{t('table.description_en')}</label>
                                        <textarea value={descriptionAlgo.en.value}
                                                  onChange={e => descriptionAlgo.en.onChange(e)}
                                                  placeholder="Enter Description En"/>
                                    </div>

                                    <div className="in-group">
                                        <label className="typography-subtitle2"
                                               style={{color: "#6F7CA0"}}>{t('table.folder')}</label>
                                        <select value={folderId} onChange={e => setFolderId(e.target.value)}>
                                            <option value={undefined}/>

                                            {folders && folders.map((folder, index2) => {
                                                return (
                                                    <option key={index2}
                                                            value={folder.folderId}>{folder.nameEn}</option>
                                                )
                                            })}
                                        </select>
                                    </div>

                                    <textarea value={approximationAlgo.width.value}
                                              onChange={e => approximationAlgo.width.onChange(e)}
                                              placeholder="Enter approximation width"/>

                                    <textarea value={approximationAlgo.height.value}
                                              onChange={e => approximationAlgo.height.onChange(e)}
                                              placeholder="Enter approximation height"/>

                                    <div>
                                        <button className="primaryButton" onClick={handleAlgoCreate}
                                                disabled={nameAlgo.en.value === '' || nameAlgo.ru.value === '' || descriptionAlgo.en.value === '' || descriptionAlgo.ru.value === ''}>{t('button.save')}</button>
                                        <button className="secondaryButton"
                                                onClick={handleAlgoClose}>{t('button.cancel')}</button>
                                    </div>
                                </div>
                            </div>}
                        </div>}


                        {tabIndex === 1 && <div className="tabs-body-content">
                            <table>
                                <thead>
                                <tr>
                                    <th className="typography-subtitle2">{t('table.name_en')}</th>

                                    <th className="typography-subtitle2">{t('table.name_ru')}</th>

                                    <th className="typography-subtitle2">{t('table.folder')}</th>

                                    <th><img src={"/add.svg"} onClick={e => handleFolderShow(e)}/></th>
                                </tr>
                                </thead>

                                <tbody>
                                {folders
                                    .filter(item => item.nameEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||
                                        item.nameRu.toUpperCase().includes(searchInput.value.toUpperCase()))
                                    .map((item, index) => {
                                        const parent = item.parentId && folders.find(folder => folder.folderId === item.parentId) || undefined

                                        return (
                                            <tr key={index} style={{height: "40px"}}>
                                                <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                    {item.nameEn}
                                                </td>

                                                <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                    {item.nameRu}
                                                </td>

                                                <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                    {parent && `${parent.nameEn} (${parent.nameRu})` || item.parentId}
                                                </td>

                                                <td>
                                                    <div style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "5px"
                                                    }}>
                                                        <img src={"/edit-icon.svg"}
                                                             onClick={e => handleFolderShow(e, item)}/>

                                                        <img src={"/delete-icon.svg"}
                                                             onClick={() => handleFolderDelete(item)}/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {showFolderModal && <div className="backdrop">
                                <div className="modal-container">
                                    <div className="in-group">
                                        <label className="typography-subtitle2"
                                               style={{color: "#6F7CA0"}}>{t('table.name_en')}</label>
                                        <input value={nameFolder.en.value}
                                               onChange={e => nameFolder.en.onChange(e)}
                                               placeholder="Enter Name En"/>
                                    </div>

                                    <div className="in-group">
                                        <label className="typography-subtitle2"
                                               style={{color: "#6F7CA0"}}>{t('table.name_ru')}</label>
                                        <input value={nameFolder.ru.value}
                                               onChange={e => nameFolder.ru.onChange(e)}
                                               placeholder="Enter Name Ru"/>
                                    </div>

                                    <div className="in-group">
                                        <label className="typography-subtitle2"
                                               style={{color: "#6F7CA0"}}>{t('table.folder')}</label>
                                        <select value={parentId} onChange={e => setParentId(e.target.value)}>
                                            <option value={undefined}/>

                                            {folders && folders.map((folder, index2) => {
                                                if (!selectedFolder || folder.folderId !== selectedFolder.folderId) {
                                                    return (
                                                        <option key={index2}
                                                                value={folder.folderId}>{language === 'en' ? folder.nameEn : folder.nameRu}</option>
                                                    )
                                                }
                                            })}
                                        </select>
                                    </div>

                                    <div>
                                        <button className="primaryButton"
                                                onClick={handleFolderCreate}
                                                disabled={nameFolder.en.value === '' || nameFolder.ru.value === ''}>{t('button.save')}</button>
                                        <button className="secondaryButton"
                                                onClick={handleFolderClose}>{t('button.cancel')}</button>
                                    </div>
                                </div>
                            </div>}
                        </div>}


                        {tabIndex === 2 && <>
                            <div className="tabs-header">
                                <select value={algorithmId} onChange={e => setAlgorithmId(e.target.value)}
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

                                <button className="secondaryButton"
                                        onClick={() => handleApproximateAlgorithm()}>{t('button.approximate')}</button>
                            </div>

                            <div style={{height: "calc(100vh - 133px)"}}>
                                <div className="tabs-body-content">
                                    {algorithmId && <table>
                                        <thead>
                                        <tr>
                                            <th className="typography-subtitle2">{t('table.dimensions')}</th>
                                            <th className="typography-subtitle2">{t('table.iterations')}</th>
                                            <th className="typography-subtitle2">{t('table.processors')}</th>
                                            <th className="typography-subtitle2">{t('table.ticks')}</th>
                                            <th><img src={"/add.svg"} onClick={() => setShowDeterminantModal(true)}/>

                                                {showDeterminantModal && <div className="backdrop">
                                                    <div className="modal-container">
                                                        <input className="form-control"
                                                               type="file" style={{height: "auto", minHeight: "auto"}}
                                                               onChange={getFileContext} disabled={showProgress}/>

                                                        <div>
                                                            <button className="primaryButton"
                                                                    disabled={showProgress || !(fileSize > 0)}
                                                                    onClick={() => {
                                                                        setShowProgress(true);
                                                                        fileUpload(counter);
                                                                    }}>
                                                                {showProgress ?
                                                                    <>{Math.floor(progress)}%</>
                                                                    :
                                                                    <>{t('button.upload')}</>
                                                                }
                                                            </button>

                                                            <button className="secondaryButton" disabled={showProgress}
                                                                    onClick={() => {
                                                                        setShowDeterminantModal(false);
                                                                        resetChunkProperties();
                                                                    }}>{t('button.cancel')}</button>
                                                        </div>
                                                    </div>
                                                </div>}
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {determinants
                                            .filter(item => item.algorithmId === algorithmId)
                                            .map((item, index) => {
                                                return (
                                                    <tr key={index} style={{height: "40px"}}>
                                                        <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                            {item.dimensions}
                                                        </td>

                                                        <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                            {item.iterations || ''}
                                                        </td>

                                                        <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                            {item.processors}
                                                        </td>

                                                        <td className="typography-body2" style={{padding: "5px 10px"}}>
                                                            {item.ticks}
                                                        </td>

                                                        <td>
                                                            <div style={{
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: "5px"
                                                            }}>
                                                                <img src={"/edit-icon.svg"}
                                                                     onClick={() => handleDeterminantShow(item)}/>

                                                                <img src={"/delete-icon.svg"}
                                                                     onClick={() => handleDeterminantDelete(item)}/>

                                                                <img width="16" height="16" src={"/export.svg"}
                                                                     onClick={() => handleDeterminantDownload(item)}/>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>}

                                    {showDeterminantEdit && <div className="backdrop">
                                        <div className="modal-container">
                                            <div className="in-group">
                                                <label className="typography-subtitle2"
                                                       style={{color: "#6F7CA0"}}>{t('table.dimensions')}</label>
                                                <input value={determinantValue.dimension.value}
                                                       onChange={e => determinantValue.dimension.onChange(e)}
                                                       placeholder="Enter dimensions"/>
                                            </div>

                                            <div className="in-group">
                                                <label className="typography-subtitle2"
                                                       style={{color: "#6F7CA0"}}>{t('table.iterations')}</label>
                                                <input value={determinantValue.iteration.value}
                                                       onChange={e => determinantValue.iteration.onChange(e)}
                                                       placeholder="Enter iterations"/>
                                            </div>

                                            <div>
                                                <button className="primaryButton"
                                                        onClick={handleDeterminantEdit}>{t('button.save')}</button>
                                                <button className="secondaryButton"
                                                        onClick={() => setShowDeterminantEdit(false)}>{t('button.cancel')}</button>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </>}
                    </div>

                    {loading && <div className="build-loader"><span>.</span></div>}
                </>
                :
                <Spinner/>
            }

            <div className="language-group">
                <LanguageSwitcher lang={t('another_language')}>
                    <img role="button" src={t('language_icon')} alt="language"/>
                </LanguageSwitcher>
            </div>
        </div>
    );
}
