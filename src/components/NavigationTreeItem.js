import React, {useState} from "react"
import styled from "styled-components";

const NavigationTreeItemStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex: none;
  gap: 5px;
  
  box-sizing: border-box;
  height: 30px;
  width: ${props => `calc(100% - ${props.level} * 15px)`};
  min-width: 200px;
  padding: 5px 10px;
  //margin-left: ${props => `calc(${props.level} * 15px)`};
  
  background: ${props => props.isFolder ? "#d9def1" : "none"};
  border: 2px solid #d9def1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background: ${props => props.isFolder ? "#64B5F6" : "none"};
    border-color: #64B5F6;
    outline: 1px solid ${props => props.isFolder ? "#64B5F6" : "#64B5F6"};
    color: ${props => props.isFolder ? "#FFFFFF" : "#2D334D"};
  }

  div {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 120%;
    color: ${props => props.isFolder ? "#2D334D" : "#FFFFFF"};

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
  }
`


const NavigationTreeItem = (props) => {

    return (
        <NavigationTreeItemStyled level={props.level} isFolder={props.isFolder} onClick={props.onClick} onDoubleClick={props.onDoubleClick}>
            <div>{props.item}</div>
        </NavigationTreeItemStyled>
    )
}

export default NavigationTreeItem