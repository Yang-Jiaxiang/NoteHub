import React from 'react'
import {Item,Header} from 'semantic-ui-react'
import firebase from '../utils/firebase'
import "firebase/compat/firestore"
import Post from '../components/Post'

function MyCollections(){
    const [posts,setPosts]=React.useState([])
    //第一次選染文章
    React.useEffect(()=>{
        firebase.firestore().collection('posts').where('collectedBy','array-contains',firebase.auth().currentUser.uid).get().then((collectionSnapshot)=>{
            const data=collectionSnapshot.docs.map(docSnapshot=>{
                //React需要ID，解構post傳入
                const id=docSnapshot.id
                return {...docSnapshot.data(),id}
            })
            setPosts(data)
        })
    },[])

    const [user,setUser]=React.useState(null)

    //透過useEffect監聽是否有user
    React.useEffect(()=>{
        firebase.auth().onAuthStateChanged((currentUser)=>{
            setUser(currentUser)
        })
    },[])

    return(<>
        <Header>我的收藏</Header>
        <Item.Group>
            {posts.map((post)=>{
                return(<Post post={post} key={post.id}/>)
            }
        )}     
        </Item.Group></>
    )
}

export default MyCollections