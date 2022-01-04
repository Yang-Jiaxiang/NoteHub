import React from 'react'
import { useParams } from 'react-router-dom'
import {Container,Image,Header,Segment, Icon,Comment, Form} from 'semantic-ui-react'
import firebase from '../utils/firebase'
import "firebase/compat/firestore"
import "firebase/compat/auth"
import ReactQuill from 'react-quill'

function Post(){
    //使用useParams抓取URL postId
    const {postId}=useParams()
    const [post,setPost]=React.useState({
        author:{}
    })
    const [commentContent,setCommentContent]=React.useState('')
    const [isLoading,setIsLoading]=React.useState(false)
    const [comments,setComments]=React.useState([])

    //第一次渲染獲取資料(postdata)->firestore，利用onSnapshot去做監聽是否典藏
    React.useEffect(()=>{
        firebase.firestore().collection("posts").doc(postId).onSnapshot((docSnapshot)=>{
            const data=docSnapshot.data()
            setPost(data)
        })
    })

    //獲取留言
    React.useEffect(()=>{
        firebase.firestore().collection('posts').doc(postId).collection('comments').orderBy('createdAt').onSnapshot((collectionSnapshop)=>{
            const data=collectionSnapshop.docs.map(doc=>{
                return doc.data()
            })
            setComments(data)
        })
    },[])

    //收藏toggle
    function toggleCollected(){
        //獲取使用者id
        const uid=firebase.auth().currentUser.uid

        //firebase方法，可直接將傳進值push至資料中
        //判斷isCollected true為已經收藏過
        if(isCollected){
            firebase.firestore().collection('posts').doc(postId).update({
                collectedBy:firebase.firestore.FieldValue.arrayRemove(uid)
            })
        }else{
            firebase.firestore().collection('posts').doc(postId).update({
                collectedBy:firebase.firestore.FieldValue.arrayUnion(uid)
            })
        }
        
    }

    //讚toggle
    function toggleLiked(){
        //獲取使用者id
        const uid=firebase.auth().currentUser.uid
        //firebase方法，可直接將傳進值push至資料中
        //判斷isLiked true為已經收藏過
        if(isLiked){
            firebase.firestore().collection('posts').doc(postId).update({
                Likedby:firebase.firestore.FieldValue.arrayRemove(uid)
            })
        }else{
            firebase.firestore().collection('posts').doc(postId).update({
                Likedby:firebase.firestore.FieldValue.arrayUnion(uid)
            })
        }
    }

    //判斷user是否典藏過
    const isCollected=post.collectedBy?.includes(firebase.auth().currentUser.uid)

    //判斷user是否典按讚
    const isLiked=post.Likedby?.includes(firebase.auth().currentUser.uid)

    //留言功能
    function onSubmit(){
        setIsLoading(true)
        //重複使用firestore所以const
        const firestore=firebase.firestore()

        const batch=firestore.batch()

        const postRef=firestore.collection('posts').doc(postId)
        //判斷commentsCound是否有存在，若是有則+1
        batch.update(postRef,{
            commentsCound:firebase.firestore.FieldValue.increment(1)
        })

        const commentRef=postRef.collection('comments').doc()
        //送出留言資料
        batch.set(commentRef,{
            content:commentContent,
            createdAt:firebase.firestore.Timestamp.now(),
            author:{
                uid:firebase.auth().currentUser.uid,
                displayName:firebase.auth().currentUser.displayName ||'',
                photoURL:firebase.auth().currentUser.photoURL||'',
            }
        })

        //送出上方兩個batch
        batch.commit().then(()=>{
            setCommentContent('')//送出後設定空字串
            setIsLoading(false)
        })
    }

    return(
        <>
        {/*使用者或名稱沒有的話就顯示Icon ||使用者*/}
        {post.author.photoURL ? (
            <Image src={post.author.photoURL} avatar wrapped/>
            ):(
                <Icon name='user circle'/>
            )}
        {''}
        {post.author.displayName ||'使用者'}
        <Header>
            {post.title}
            <Header.Subheader>
                {post.topic}-
                {/*createdAt抓下來˙為firebase物件，所以需要轉換，?防止bug*/}
                {post.createdAt?.toDate().toLocaleDateString()}
            </Header.Subheader>
        </Header>
        {/*說明*/}
        <Segment basic vertical>{post.content}</Segment>
        {/*筆記照片*/}
        <Image src={post.imageUrl}/>
        {/*筆記內容Quill*/}
        <Container>
            <ReactQuill
                value={post.Quill}
                readOnly={true}
                theme={"bubble"}
            />
        </Container>

        {/*下方按讚典藏*/}
        <Segment basic vertical>
            留言 {post.commentsCound||0}．讚 {post.Likedby?.length||0}．
            <Icon name='thumbs up outline' color={isLiked?'blue':'grey'} link onClick={toggleLiked}/>． 
            <Icon name='bookmark outline' color={isCollected?'blue':'grey'} link onClick={toggleCollected}/>
        </Segment>

        {/*留言功能*/}
        <Comment.Group>
            <Form reply>
                <Form.TextArea value={commentContent} onChange={(e)=>setCommentContent(e.target.value)}/>
                <Form.Button onClick={onSubmit} loading={isLoading}>留言</Form.Button>
            </Form>
            <Header>共{post.commentsCound||'0'}則留言</Header>
            {comments.map((comment)=>{
                return(
                    <Comment>
                        <Comment.Avatar src={comment.author.photoURL}/>
                        <Comment.Content>
                            <Comment.Author as='span'>{comment.author.displayName || '使用者 '}</Comment.Author>
                            <Comment.Metadata>{comment.createdAt.toDate().toLocaleString()}</Comment.Metadata>
                            <Comment.Text>{comment.content}</Comment.Text>
                        </Comment.Content>
                    </Comment>
                )
            })}
            
        </Comment.Group></>
    )
}


export default Post