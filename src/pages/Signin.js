import React from 'react'
import firebase from '../utils/firebase'
import {Menu,Form,Container,Message,Icon} from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'
import {getAuth, signInWithRedirect,signInWithPopup, GoogleAuthProvider} from 'firebase/auth'


function Signin(){
    //Google登入建構
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    //history跳轉畫面(為React跳轉function)
    const history =useHistory()

    //useState監聽參數變動只要啟動function都會更改值，做下方Input雙向綁定
    const [activeItem,setActiveItem]=React.useState('register');
    const [email,setEmail]=React.useState('');
    const [password,setPassword]=React.useState('');

    //監聽錯誤訊息errorMessage
    const [errorMessage,setErrorMessage]=React.useState('')

    const [isLoading,setIsLoading]=React.useState(false)

    //判斷點選註冊register 或是登入signin，成功後跳轉畫面history.push('/')回首頁面
    //.catch (error.code)接收錯誤資訊並傳給setErrorMessage的useState去做監聽，給下方errorMessage渲染
    function onSubmit(){
        if(activeItem==='register'){
            //註冊跳轉Loading畫面true，try、catch後轉為false，透過setIsLoading useState監聽
            setIsLoading(true)
            firebase.auth().createUserWithEmailAndPassword(email,password).then(()=>{
                history.push('/my/settings')
                setIsLoading(false)
            }).catch((error)=>{
                switch(error.code){
                    case "auth/email-already-in-use":
                        setErrorMessage('信箱已被使用')
                        break
                    case "auth/invalid-email":
                        setErrorMessage('輸入信箱格式錯誤')
                        break
                    case "auth/weak-password":
                        setErrorMessage('密碼需6位數')
                        break
                    default:
                }
                setIsLoading(false)
            })
        }else if(activeItem==='signin'){
            //登入跳轉Loading畫面true，try、catch後轉為false，透過setIsLoading useState監聽
            setIsLoading(true)
            firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
                history.push('/posts')
                setIsLoading(false)
            }).catch((error)=>{
                switch(error.code){
                    case "auth/invalid-email":
                        setErrorMessage('輸入信箱格式錯誤')
                        break
                    case "auth/user-not-found":
                        setErrorMessage('信箱不存在')
                        break
                    case "auth/wrong-password":
                        setErrorMessage('密碼錯誤')
                        break
                    default:
                }
                setIsLoading(false)
            })
        }
    }

    function onSubmitApiRegister(){
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
            signInWithRedirect(auth, provider);
    }

    return(
        <>
            <Container>
                <Menu widths={2}>
                    <Menu.Item active={activeItem==='register'} onClick={()=>{setErrorMessage('');setActiveItem('register')}}>註冊</Menu.Item>
                    <Menu.Item active={activeItem==='signin'} onClick={()=>{setErrorMessage(''); setActiveItem('signin')}}>登入</Menu.Item>
                </Menu>
                <Form onSubmit={onSubmit}>
                    <Form.Input label='信箱' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='請輸入信箱'/>
                    <Form.Input label='密碼' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='請輸入密碼' type='password'/>
                    
                    {/* 錯誤訊息顯示 negative加強顯示  */}
                    {errorMessage && <Message negative>{errorMessage}</Message>}

                    {/* loading->isLoding動畫  */}
                    <Form.Button loading={isLoading}>
                        {activeItem==='register' && '註冊'}
                        {activeItem==='signin' && '登入'}
                    </Form.Button>
                </Form>


                {/* 透過GOOGLE登入或註冊  */}
                <Form style={{margin:'10px 0'}} onSubmit={onSubmitApiRegister}>
                    <Form.Button loading={isLoading}>
                            <Icon name='google'/>
                            透過 GOOGLE {activeItem==='register' && '註冊'}{activeItem==='signin' && '登入'}
                    </Form.Button>
                </Form>
            </Container>
        </>
    )
}

export default Signin