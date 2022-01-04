import React from 'react'
import {Item} from 'semantic-ui-react'
import firebase from '../utils/firebase'
import "firebase/compat/firestore"
import Post from '../components/Post'
import{useLocation}from 'react-router-dom'

function Posts(){
    const location=useLocation()
    const urlSearchParams=new URLSearchParams(location.search)
    const currentTopic=urlSearchParams.get('topic')
    const [posts,setPosts]=React.useState([])
    //第一次選染文章
    React.useEffect(()=>{
        if(currentTopic){
            firebase.firestore().collection('posts').where('topic','==',currentTopic).get().then((collectionSnapshot)=>{
                const data=collectionSnapshot.docs.map(docSnapshot=>{
                    //React需要ID，解構post傳入
                    const id=docSnapshot.id
                    return {...docSnapshot.data(),id}
                })
                setPosts(data)
            })
        }else{
            firebase.firestore().collection('posts').orderBy('createdAt', 'desc').get().then((collectionSnapshot)=>{
                const data=collectionSnapshot.docs.map(docSnapshot=>{
                    //React需要ID，解構post傳入
                    const id=docSnapshot.id
                    return {...docSnapshot.data(),id}
                })
                setPosts(data)
            })
        }
        
        
    },[currentTopic])

    const [user,setUser]=React.useState('')||{}

    //透過useEffect監聽是否有user
    React.useEffect(()=>{
        firebase.auth().onAuthStateChanged((currentUser)=>{
            setUser(currentUser)
        })
    },[])
    return(
        <Item.Group>
            {posts.map((post)=>{
                return(<Post post={post} key={post.id}/>)
            }
        )}     
        </Item.Group>
    )
}

export default Posts