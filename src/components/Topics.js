import React from "react"
import {List} from 'semantic-ui-react'
import { Link ,useLocation} from "react-router-dom"
import firebase from "../utils/firebase"
import "firebase/compat/firestore"

function Topics(){
    //監聽setTopics()，Topics為陣列
    const [topics,setTopics]=React.useState([])
    //取的URL Menu的hover
    const location=useLocation()
    const urlSearchParams=new URLSearchParams(location.search)
    const currentTopic=urlSearchParams.get('topic')

    //第一次渲染畫面獲取firebase內topics內容
    React.useEffect(()=>{
        firebase
        .firestore()
        .collection('topics')
        .get()
        .then((collectionSnapshot)=>{
            const data = collectionSnapshot.docs.map((doc)=>{
                return doc.data()
            })
            setTopics(data)
        })
    },[])

    return(
       <List animated selection>{topics.map((topic)=>{
           {/*透過semantic-ui建立Item列表，讀取topics陣列 */}
           return(
               <List.Item key={topic.name} as={Link} to={`/posts?topic=${topic.name}`} active={currentTopic===topic.name}>
                   {topic.name}
               </List.Item>
           )
       })}</List>
    )
}

export default Topics