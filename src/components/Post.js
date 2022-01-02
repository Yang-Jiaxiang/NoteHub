import {Item,Image,Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import React from 'react'

function Post({post}){
    return(
        <Item as={Link} to={`/posts/${post.id}`}>
            {/*渲染Item*/}
            <Item.Image src={post.imageUrl || 'https://react.semantic-ui.com/images/wireframe/image.png'}  />
            <Item.Content>
                <Item.Meta>
                    {post.author.photoURL ? <Image src={post.author.photoURL}/>:<Icon name='user circle'/>}
                    {post.topic}-
                    {post.author.displayname || '使用者'}
                </Item.Meta>
                <Item.Header>{post.title}</Item.Header>
                <Item.Description>{post.content}</Item.Description>
                <Item.Extra>
                    留言 {post.commentsCound||0}．讚 {post.Likedby?.length ||0}
                </Item.Extra>
            </Item.Content>
        </Item>
    )
}

export default Post