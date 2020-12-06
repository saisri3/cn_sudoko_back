import React, {useState, useEffect} from 'react'
import Cellstyles from "./cell.module.scss";
import {useSelector, useDispatch} from 'react-redux' 
import { highlighter} from "./boardSlice"; 



export default function Cell(props) {
    const {i,j} = props; //destructuring  object
    const [value, visibility, inputnum] = props.cellinfo; //destructuring array
    const cellid = (i*10)+j; //a two digit integer
    var rightborder, bottomborder;
    const {right, bottom} = props.borderinfo; //destructuring
    rightborder = Cellstyles.rightborder;
    bottomborder = Cellstyles.bottomborder;
    var elementtorender;

    const dispatch = useDispatch()
    const clientid = useSelector(state => state.board.clientid);
    const highlightcell = () => {
        dispatch(highlighter(cellid))
        // window.io.emit("cellhighlight", cellid)
    }

    const hightlightedcell = useSelector(state => state.board.highlightedcell);
    const mistakes = useSelector(state => state.result.mistakes);
    const showmistake = useSelector(state => state.result.showmistake)
   
    
    
    useEffect(() => {
        var element = document.getElementById(cellid);
        const clientids = hightlightedcell.filter((e) => { //clientids is an array of objects
        return e.cellid == cellid
        }); //array.filter in js . 
        const clientsarray = clientids.map(e => {
            return e.clientid
        })//extract only the clientids and store them in an array
        const isthisclient = clientsarray.includes(clientid,0);
        const otherclients = clientsarray.filter((e) => {
            return e != clientid
        }); //removes this client id from the array
        if(isthisclient)
            element.classList.add(Cellstyles.highlight);
        else
            element.classList.remove(Cellstyles.highlight);
        if(otherclients.length)
            element.classList.add(Cellstyles.highlightother);
        else
            element.classList.remove(Cellstyles.highlightother);
        if(isthisclient && otherclients.length)
            element.classList.add(Cellstyles.samecell)
        else 
            element.classList.remove(Cellstyles.samecell)

    })
    useEffect(() => {
        var element = document.getElementById(cellid);
        if(inputnum){
            element.innerHTML = inputnum;
        }
    })

    // useEffect(() => {
    //     var element = document.getElementById(cellid);
    //     if(showmistake){
    //     if(mistakes.includes(cellid,0))
    //         element.classList.add(Cellstyles.mistake)
    //     }
    //     setTimeout(clearmistake, 2000)
    // },[showmistake, mistakes])

    useEffect(() => {
        var element = document.getElementById(cellid)
        if(inputnum){
            if(inputnum != value){
                element.classList.add(Cellstyles.mistake)
            }
            setTimeout(clearmistake, 2000)
        }
    },[showmistake])

    const clearmistake = () => {
        document.getElementById(cellid).classList.remove(Cellstyles.mistake)
    }
    

    if(visibility)
        elementtorender =  <div id={cellid} className ={`${Cellstyles.cell} ${right ? rightborder : "" } ${bottom ? bottomborder : ""} ${Cellstyles.visible} `} >
            {value}
        </div>
    else
        elementtorender =  <div id={cellid} className ={`${Cellstyles.cell} ${right ? rightborder : "" } ${bottom ? bottomborder : ""} ${Cellstyles.hidden} `} onClick={highlightcell} ></div>

   

    return elementtorender
       
    
}
