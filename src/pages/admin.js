import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Spinner, Table} from "reactstrap";
import {useFormInput} from "@/utils/hooks";
import styles from '@/styles/Admin.module.css';
import {v4 as uuidv4} from 'uuid';
import Link from "next/link";
import styled from "styled-components";


const FilePicker = styled.div`
  display: flex;
  align-items: center;

  position: relative;
  width: 100%;
  height: 36px;

  img {
    content: url("/Upload.svg");
  }

  input {

    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

const Loader = styled.span`

  width: 175px;
  height: 80px;
  display: block;
  margin: auto;
  background-image: radial-gradient(circle 25px at 25px 25px, #FFF 100%, transparent 0), radial-gradient(circle 50px at 50px 50px, #FFF 100%, transparent 0), radial-gradient(circle 25px at 25px 25px, #FFF 100%, transparent 0), linear-gradient(#FFF 50px, transparent 0);
  background-size: 50px 50px, 100px 76px, 50px 50px, 120px 40px;
  background-position: 0px 30px, 37px 0px, 122px 30px, 25px 40px;
  background-repeat: no-repeat;
  position: relative;
  box-sizing: border-box;

  &::after {
    content: '';
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    position: absolute;
    border: 15px solid transparent;
    border-top-color: #FF3D00;
    box-sizing: border-box;
    animation: fadePush 1s linear infinite;
  }

  &::before {
    content: '';
    left: 50%;
    bottom: 30px;
    transform: translate(-50%, 0);
    position: absolute;
    width: 15px;
    height: 15px;
    background: #FF3D00;
    box-sizing: border-box;
    animation: fadePush 1s linear infinite;
  }

  @keyframes fadePush {
    0% {
      transform: translate(-50%, -15px);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, 0px);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 15px);
      opacity: 0;
    }
  }
`

export default function Admin() {
    const [loadind, setLoading] = useState(false);
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
                if (result.message === "Unauthorized") return
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
                    if (result.message === "Unauthorized") return

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
                if (result.message === "Unauthorized") return

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
                    if (result.message === "Unauthorized") return

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
    const determinantValue = {dimension: useFormInput(''), iteration: useFormInput('')};
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

        const _totalCount = _file.size % chunkSize == 0 ? _file.size / chunkSize : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
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
            var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
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
                },
                body: chunk
            };

            const response = await fetch("https://d5duqpi9k7db8o1dj509.apigw.yandexcloud.net?" + new URLSearchParams({
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

    const DownloadDeterminantHandle = () => {
        var url = 'https://d5duqpi9k7db8o1dj509.apigw.yandexcloud.net/static/upload/11-7.json';


        getJSON(url).then(data => {
            download(JSON.stringify(data), "determinant.json", "application/json");
        }).catch(error => {
            console.error(error);
        });


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

    const handleDeterminantEdit = (item) => {
        setShowDeterminantEdit(true)

        setDeterminantId(item.determinantId)

        determinantValue.dimension.setValue(item.dimensions || '');
        determinantValue.iteration.setValue(item.iterations || '');
    }

    const handleDeterminantCreate = () => {
        let raw = JSON.stringify({
            determinantId: determinantId,
            dimensions: determinantValue.dimension.value,
            iterations: Number(determinantValue.iteration.value)
        });

        console.log(raw)

        let requestOptions = {
            method: 'POST',
            body: raw,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/determinant", requestOptions)
            .then(response => response.json())
            .then(result => {
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
                },
            };

            fetch(`https://d5d603o45jf9c91p4q4q.apigw.yandexcloud.net/determinant/${item.determinantId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
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
            },
        };

        fetch(`https://bba65mmb49ker14nr711.containers.yandexcloud.net/`, requestOptions)
            .then(response => response.json())
            .catch(error => {
                setLoading(false);
                console.log('error', error)
            });
    }


    return (

        <div style={{
            boxSizing: "border-box",
            padding: "10px",
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            background: "rgb(250, 251, 255)"
        }}>

            <Link href={"/"} style={{
                width: "40px",
                transform: "rotate(180deg)",
                position: "absolute",
                left: "30px",
                cursor: "pointer"
            }}>
                <img src={"/back.svg"}/>
            </Link>


            {algorithms && folders && determinants ? <>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "1125px"
                }}>
                    <div className={styles.tabs}>
                        <div className={tabIndex === 0 ? styles.checked : styles.tab} onClick={() => setTabIndex(0)}>
                            <span className="typography-subtitle1">Algorithms</span>
                        </div>
                        <div className={tabIndex === 1 ? styles.checked : styles.tab} onClick={() => setTabIndex(1)}>

                            <span className="typography-subtitle1">Folders</span>
                        </div>
                        <div className={tabIndex === 2 ? styles.checked : styles.tab} onClick={() => setTabIndex(2)}>
                            <span className="typography-subtitle1">Determinants</span>
                        </div>
                    </div>

                    <div>
                        <input value={searchInput.value} onChange={searchInput.onChange} type={"search"}
                               placeholder={"Search..."} style={{width: "300px"}}/>

                        <button onClick={OnBuildHandle}>Собрать</button>
                    </div>

                </div>

                <div style={{width: "100%", flex: "1"}}>
                    {tabIndex === 0 && <div className={styles.tabsBody}>

                        <table>
                            <thead>
                            <tr style={{height: "30px"}}>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Name Ru</span>
                                </th>

                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Description Ru</span>
                                </th>

                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Name En</span>
                                </th>

                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Description En</span>
                                </th>

                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Folder</span>
                                </th>

                                <th style={{width: "50px"}}>
                                    <img width={"20px"} height={"20px"} src={"/add.svg"}
                                         onClick={e => handleAlgoShow(e)}/>
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
                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">
                                                    {item.nameRu}
                                                </span>
                                            </td>

                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.descriptionRu}</span>
                                            </td>

                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.nameEn}</span>
                                            </td>
                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.descriptionEn}</span>
                                            </td>

                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">
                                                    {parent && `${parent.nameEn} (${parent.nameRu})` || item.parentId}
                                                </span>
                                            </td>

                                            <td style={{padding: "5px"}}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "10px"
                                                }}>
                                                    <img width={"20px"} src={"/edit-icon.svg"}
                                                         onClick={e => handleAlgoShow(e, item)}/>

                                                    <img width={"20px"} src={"/delete-icon.svg"}
                                                         onClick={() => handleAlgoDelete(item)}/>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>




                        {/*{algorithms*/}
                        {/*    .filter(item => item.nameEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||*/}
                        {/*        item.nameRu.toUpperCase().includes(searchInput.value.toUpperCase()) ||*/}
                        {/*        item.descriptionEn.toUpperCase().includes(searchInput.value.toUpperCase()) ||*/}
                        {/*        item.descriptionRu.toUpperCase().includes(searchInput.value.toUpperCase()))*/}
                        {/*    .map((item, index) => {*/}
                        {/*        const parent = item.folderId && folders.find(folder => folder.folderId === item.folderId) || undefined*/}

                        {/*        return (*/}
                        {/*            <div key={index} className={styles.algorithmItem}*/}
                        {/*                 onDoubleClick={e => handleAlgoShow(e, item)}>*/}


                        {/*                {parent && <div style={{display: "flex", gap: "5px"}}>*/}
                        {/*                    <img src="/folder.svg" alt={"folder icon"}/>*/}
                        {/*                    <span*/}
                        {/*                        className="typography-caption1">{parent && `${parent.nameEn} (${parent.nameRu})` || item.folderId}</span>*/}
                        {/*                </div>}*/}

                        {/*                <img className={styles.xButton}*/}
                        {/*                    // src="/x.svg"*/}
                        {/*                     alt={"x icon"}*/}
                        {/*                     onClick={() => handleAlgoDelete(item)}/>*/}


                        {/*                <span className="typography-subtitle2">*/}
                        {/*                {item.nameEn} <span className="typography-caption1">({item.nameRu})</span>*/}
                        {/*            </span>*/}
                        {/*                <span className="typography-body2">*/}
                        {/*                {item.descriptionEn} <span*/}
                        {/*                    className="typography-caption1">({item.descriptionRu})</span>*/}
                        {/*            </span>*/}
                        {/*            </div>*/}
                        {/*        )*/}
                        {/*    })}*/}


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

                                <textarea value={approximationAlgo.width.value}
                                          onChange={e => approximationAlgo.width.onChange(e)}
                                          placeholder="Enter approximation width"/>

                                <textarea value={approximationAlgo.height.value}
                                          onChange={e => approximationAlgo.height.onChange(e)}
                                          placeholder="Enter approximation height"/>

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


                        <table>
                            <thead>
                            <tr style={{height: "30px"}}>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Parent Folder</span>
                                </th>

                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Name En</span>
                                </th>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Name Ru</span>
                                </th>
                                <th className={styles.tableHeader} style={{width: "50px"}}>
                                    <img width={"20px"} height={"20px"} src={"/add.svg"}
                                         onClick={e => handleFolderShow(e)}/>
                                </th>
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
                                            <td style={{padding: "5px 10px"}}>
                                                <span
                                                    className="typography-body2">{parent && `${parent.nameEn} (${parent.nameRu})` || item.parentId}</span>
                                            </td>

                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.nameEn}</span>
                                            </td>
                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.nameRu}</span>
                                            </td>

                                            <td style={{padding: "5px"}}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "10px"
                                                }}>
                                                    <img width={"20px"} src={"/edit-icon.svg"}
                                                         onClick={e => handleFolderShow(e, item)}/>

                                                    <img width={"20px"} src={"/delete-icon.svg"}
                                                         onClick={() => handleFolderDelete(item)}/>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>


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
                                    <button className={styles.secondaryButton} onClick={handleFolderClose}>Cancel
                                    </button>
                                </div>
                            </div>
                        </div>}
                    </div>}


                    {tabIndex === 2 && <div className={styles.tabsBody}>
                        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                            <select value={algorithmId} onChange={e => setAlgorithmId(e.target.value)}
                                style={{width: "500px"}}>
                            <option value={undefined}/>

                            {algorithms && algorithms.map((algorithm, index) => {
                                return (
                                    <option key={index} value={algorithm.algorithmId}>{algorithm.nameEn}</option>
                                )
                            })}
                        </select>

                            <button className="secondaryButton" onClick={() => handleApproximateAlgorithm()}>Аппроксимировать</button>
                        </div>

                        {algorithmId && <table>
                            <thead>
                                <tr style={{height: "30px"}}>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Dimensions</span>
                                </th>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Iterations</span>
                                </th>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Processors</span>
                                </th>
                                <th className={styles.tableHeader}>
                                    <span className="typography-subtitle2">Ticks</span>
                                </th>
                                <th className={styles.tableHeader} style={{width: "50px"}}>

                                    <img role={"button"} width={"20px"} height={"20px"} src={"/add.svg"} onClick={() => setShowDeterminantModal(true)}/>


                                    {showDeterminantModal && <div className={styles.back}>
                                        <div className={styles.modal}>
                                            <div className="mb-3">
                                                <label htmlFor="formFile" className="form-label">Default file
                                                    input example</label>
                                                <input className="form-control" type="file" id="formFile" onChange={getFileContext} disabled={showProgress}/>
                                            </div>

                                            <div>
                                                <button className={styles.secondaryButton} disabled={showProgress} onClick={() => {setShowDeterminantModal(false); resetChunkProperties();}}>
                                                    Cancel
                                                </button>

                                                <button className={styles.primaryButton} disabled={showProgress || !(fileSize > 0)} onClick={() => { setShowProgress(true); fileUpload(counter);}}>
                                                    {showProgress ? <>
                                                            <span className="spinner-border spinner-border-sm"
                                                                  role="status"
                                                                  aria-hidden="true"/>
                                                            {progress}%  Loading...
                                                        </>
                                                        :
                                                        <>Upload</>
                                                    }
                                                </button>
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
                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.dimensions}</span>
                                            </td>

                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.iterations || ''}</span>
                                            </td>

                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.processors}</span>
                                            </td>

                                            <td style={{padding: "5px 10px"}}>
                                                <span className="typography-body2">{item.ticks}</span>
                                            </td>

                                            <td style={{padding: "5px"}}>
                                                <img width={"20px"} src={"/edit-icon.svg"} onClick={() => handleDeterminantEdit(item)}/>

                                                <img width={"20px"} src={"/delete-icon.svg"} onClick={() => handleDeterminantDelete(item)}/>

                                                <img src={"/Export.svg"} onClick={DownloadDeterminantHandle}/>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>}

                        {showDeterminantEdit && <div className={styles.back}>
                            <div className={styles.modal}>
                                <input value={determinantValue.dimension.value}
                                       onChange={e => determinantValue.dimension.onChange(e)}
                                       placeholder="Enter dimensions"/>

                                <input value={determinantValue.iteration.value}
                                       onChange={e => determinantValue.iteration.onChange(e)}
                                       placeholder="Enter iterations"/>

                                <div>
                                    <button className={styles.primaryButton}
                                            onClick={handleDeterminantCreate}>Save</button>
                                    <button className={styles.secondaryButton} onClick={() => setShowDeterminantEdit(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>}

                    </div>}
                </div>




                {loadind && <div style={{
                    position: "absolute",
                    top: "0",
                    bottom: "0",
                    right: "0",
                    left: "0",
                    display: "flex",
                    background: "rgba(45,51,77, 0.8)"
                }}>
                    <Loader/>
                </div>}

            </> : <Spinner/>}
        </div>
    );
}
