import { Menu ,Search} from 'semantic-ui-react' 
import {Link} from 'react-router-dom'
import React from 'react'
import firebase from './utils/firebase'
import {useHistory} from 'react-router-dom'

function Header({user}){
    const history=useHistory()
    return(
        <Menu>
            <Menu.Item as={Link} to="/posts">NoteHub</Menu.Item>
            <Menu.Item>
                <Search/>
            </Menu.Item>
            <Menu.Menu position='right'>
                {/* 判斷user是否登入，登出調用firebase內的signOut(會被useEffect監聽到轉至無user狀態)  */}
                {user ? (<>
                    <Menu.Item as={Link} to='/new-post'>發表筆記</Menu.Item>
                    <Menu.Item as={Link} to='/my/posts'>會員</Menu.Item>
                    <Menu.Item onClick={()=>{
                        firebase.auth().signOut();
                        history.push('/posts')
                    }}>登出</Menu.Item>
                </>):(
                    <Menu.Item as={Link} to='/signin'>註冊/登入</Menu.Item>
                )}
                
            </Menu.Menu>
            
        </Menu>
    )
}

export default Header