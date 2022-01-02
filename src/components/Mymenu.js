import React from "react"
import {List} from 'semantic-ui-react'
import firebase from "../utils/firebase"
import "firebase/compat/firestore"
import {Link,useLocation}from 'react-router-dom'

function Mymenu(){
    const Location=useLocation()
    //Menu資料
    const menuItem=[
        {name:'我的筆記',path:'/my/posts'},
        {name:'我的收藏',path:'/my/collections'},
        {name:'會員資料',path:'/my/settings'}]
    

    return(
       <List animated selection>
           {menuItem.map(menuItem=>{
           {/*透過semantic-ui建立Item列表，讀取topics陣列 */}
           return(
               <List.Item key={menuItem.name} as={Link} to={menuItem.path} active={menuItem.path===(Location.pathname)}>
                   {menuItem.name}
               </List.Item>
           )
       })}</List>
    )
}

export default Mymenu