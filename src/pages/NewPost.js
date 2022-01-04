import React from 'react'
import {useHistory} from 'react-router-dom'
import {Container,Header,Form,Image, Button} from 'semantic-ui-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import firebase from "../utils/firebase"
import "firebase/compat/auth"
import "firebase/compat/storage"
import "firebase/compat/firestore"

function NewPost(){
    const history=useHistory()
    const [quillValue, setQuillValue] = React.useState('');
    const [title,setTitle]=React.useState('')
    const [content, setContent] = React.useState('');
    const [topics,setTopics]=React.useState([])
    const [topicName, setTopicName] = React.useState('');
    const [file,setFile]=React.useState(null)
    const [isLoading,setIsLoading]=React.useState(false)

    //類別讀取firebase，在第一次渲染時候
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

    //轉換格式obj
    const options=topics.map(topic=>{
        return{
            text:topic.name,
            value:topic.name,
        }
    })

    //預設圖片網址，若是有上傳圖片則顯示圖片，與下方Form.Input type='file'做綁定
    const previewUrl=file ?URL.createObjectURL(file) : "https://react.semantic-ui.com/images/wireframe/image.png"
    
    //按下按鈕
    function onSubmit(){
        //Loading畫面
        setIsLoading(true)
        //指定存處firestore位置
        const documentRef=firebase.firestore().collection('posts').doc()
        //上傳照片功能 將圖片名稱命名為文章ID
        const fileRef=firebase.storage().ref('post-images/'+documentRef.id)
        const metadata={
            contentType:file.types
        }
        fileRef.put(file,metadata).then(()=>{
            //讀取imageUrl存至firestore
            fileRef.getDownloadURL().then((imageUrl)=>{
                documentRef.set({
                    //因為上方變數命名一樣所以可縮寫(topicName、quillValue除外)
                    title,
                    content,
                    topic:topicName,
                    Quill:quillValue,
                    //createdAt在firebase為特別欄位
                    createdAt:firebase.firestore.Timestamp.now(),
                    //firebase內的map對應js為obj
                    author:{
                        displayName:firebase.auth().currentUser.displayName || "", //判斷沒有值為null
                        photoURL:firebase.auth().currentUser.photoURL || "", //判斷沒有值為null
                        uid:firebase.auth().currentUser.uid,
                        email:firebase.auth().currentUser.email,
                    },
                    imageUrl,
                }).then(()=>{
                    //成功透過React.useHistory倒回至首頁
                    setIsLoading(false)
                    history.push('/posts')
                })
            })
        })
    }
    
    return(
        <Container>
            <Header>發表文章</Header>
            <Form onSubmit={onSubmit}>
                <Image src={previewUrl} size='small' floated='left'/>
                <Button basic as='label' htmlFor='post-image'>上傳筆記相片</Button>
                <Form.Input type='file' id='post-image' style={{display:'none'}} onChange={(e)=>{
                    setFile(e.target.files[0])
                }}/>
                <Form.Input placeholder='請輸入筆記名稱' value={title} onChange={(e)=>{
                    setTitle(e.target.value)
                }}></Form.Input>
                <Form.TextArea placeholder='請輸入文章說明' value={content} onChange={(e)=>{
                    setContent(e.target.value)
                }}></Form.TextArea>
                <Form.Dropdown
                    placeholder="選擇筆記類別"
                    options={options}
                    selection
                    value={topicName}
                    onChange={(e,{value})=>setTopicName(value)}
                />

                {/*Quill套件 EditorToolbar為上方選取單 */}
                <EditorToolbar />
                <ReactQuill theme="snow" value={quillValue} onChange={setQuillValue} modules={modules} formats={formats}/>
                <Form.Button style={{margin:'10px'}} loading={isLoading}>送出</Form.Button>
                <Form.TextArea value={quillValue} style={{display:'none'}}></Form.TextArea>
            </Form>

            {/*渲染Quill內容 綁訂製quillValue，共用serQuillValue的useState監聽 */}
            <Container>
                <ReactQuill
                    value={quillValue}
                    readOnly={true}
                    theme={"bubble"}
                />
            </Container>
        </Container>
    )
}
export default NewPost