import React from 'react'
import {useSelector} from "react-redux"
import Finishedplayerstyles from "./finishedplayerStyles.module.scss";

export default function Finishedplayers() {

    var finishedplayers = useSelector(state => state.games.finishedplayers)
    finishedplayers = finishedplayers.slice().sort((a,b) => {return a.timetaken - b.timetaken})
    console.log(finishedplayers)
    var i=1
    finishedplayers = finishedplayers.map((e) => {
        if(i ==1 ){
              return (<div className={Finishedplayerstyles.first} key={i++}>
                     {`1st : ${e.name} : ${e.timetaken}s`}
             </div>)
    }
        if(i ==2 ){
              return (<div className={Finishedplayerstyles.second} key={i++}>
                     {`2nd : ${e.name} : ${e.timetaken}s`}
             </div>)
    }
        if(i == 3 ){
              return (<div className={Finishedplayerstyles.third} key={i++}>
                     {`3rd : ${e.name} : ${e.timetaken}s`}
             </div>)
    }

    return (<div key={i++}>
            {`${e.name} : ${e.timetaken}s`}
        </div>)
        })
      
    console.log(finishedplayers)

    return (
        <div className = {Finishedplayerstyles.wrapper}>
            <h3>Competitors </h3>
            {finishedplayers}
        </div>
    )
}
