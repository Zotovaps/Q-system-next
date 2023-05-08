import React, {useEffect, useState} from "react"
import styled from "styled-components";
import NavigationTreeItem from "./NavigationTreeItem";
import Link from "next/link";
import {useLanguageQuery, useTranslation} from "next-export-i18n";

const AlgorithmNavigationStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;

  box-sizing: border-box;
  height: 28px;
  padding: 5px 10px;
  margin-left: ${props => `calc(${props.level} * 15px)`};


  background: ${props => props.isFolder ? "#ECEDF4" : "#FAFBFF"};
  border: 1px solid #ECEDF4;
  border-radius: 8px;
  overflow: hidden;


  div {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #2D334D;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`


const NavigationTree = (props) => {
    const {t, i18n} = useTranslation();
    const [query] = useLanguageQuery();
    const [language, setLanguage] = useState('en');

    const [show, setShow] = useState(false)
    const [subFolders, setSubFolders] = useState(undefined)
    const [algorithms, setAlgorithms] = useState(undefined)


    useEffect(() => {
        if(query){
            setLanguage(query.lang)
        }
    }, [query])

    const handleClick = () => {

        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`http://192.168.31.47:3001/api/v1/folder/${props.item.folderId}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setShow(!show)
                setSubFolders(result.subFolders)
                setAlgorithms(result.algorithms)
            })
            .catch(error => console.log('error', error));

    }


    return (
        <>
            <NavigationTreeItem item={language === 'en' ? props.item.nameEn : props.item.nameRu} level={props.level} onClick={() => setShow(!show)} isFolder={true}/>

            {show && props.algorithms && props.algorithms.filter(i => i.folderId === props.item.folderId).map((item, index) => {
                return (
                    <Link key={index} href={{pathname: `/algorithms/${item.algorithmId}`, query: query}} style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                        <NavigationTreeItem
                                            item={language === 'en' ? item.nameEn : item.nameRu}
                                            isFolder={false}
                                            level={props.level + 1}
                        />
                    </Link>

                )
            })}

            {show && props.folders && props.folders.filter(i => i.parentId === props.item.folderId).map((item, index) => {
                return (
                    <NavigationTree key={index}
                                    item={item}
                                    folders={props.folders}
                                    algorithms={props.algorithms}
                                    isFolder={true}
                                    level={props.level + 1}
                                    selectedAlgorithm={props.selectedAlgorithm}/>
                )
            })}
        </>
    )
}

export default NavigationTree