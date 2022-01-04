import React from "react";
import firebase from "./utils/firebase";
import Header from "./Header";
import Signin from "./pages/Signin";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import NewPost from "./pages/NewPost";
import Topics from './components/Topics'
import Mymenu from "./components/Mymenu";
import MyPosts from "./pages/MyPosts";
import MyCollections from "./pages/MyCollections";
import MySettings from './pages/MySettings'
import {BrowserRouter,Switch,Route, Redirect}from 'react-router-dom'
import {Grid,Container} from 'semantic-ui-react'

function App() {
  //監聽user
  const [user,setUser]=React.useState(null)
  React.useEffect(()=>{
    firebase.auth().onAuthStateChanged((currentUser)=>{
      setUser(currentUser)
    })
  },[])

  return (
    <BrowserRouter>
      <Header user={user}/>
      <Switch>
        <Route path='/posts'>
          <Container>
              <Grid>
                  {/* Grid可以想像為Table Row代表直排、Column代表橫排(Column分為16等分，可用width切割)  */}
                  <Grid.Row>
                      <Grid.Column width={3}><Topics/></Grid.Column>
                      <Grid.Column width={10}>
                          <Switch>
                            <Route path='/posts' exact><Posts/></Route>
                            <Route path='/posts/:postId' exact>{user ?<Post/>:<Redirect to='/signin'/>}</Route>
                          </Switch>
                      </Grid.Column>
                      <Grid.Column></Grid.Column>
                  </Grid.Row>
              </Grid>
          </Container>
        </Route>

        <Route path='/my'>
          {user ?
          <Container>
              <Grid>
                  {/* Grid可以想像為Table Row代表直排、Column代表橫排(Column分為16等分，可用width切割)  */}
                  <Grid.Row>
                      <Grid.Column width={3}><Mymenu/></Grid.Column>
                      <Grid.Column width={10}>
                          <Switch>
                            <Route path='/my/posts' exact><MyPosts/></Route>
                            <Route path='/my/collections' exact ><MyCollections/></Route>
                            <Route path='/my/settings' exact ><MySettings user={user}/></Route>
                          </Switch>
                      </Grid.Column>
                      <Grid.Column></Grid.Column>
                  </Grid.Row>
              </Grid>
          </Container>:<Redirect to='/posts'/>}
        </Route> 

        <Route path='/signin' exact>{user ?<Redirect to='/posts'/>:<Signin/>}</Route>

        
        <Route path='/new-post' exact>{user ?<NewPost/>:<Redirect to='/posts'/>}</Route>
      </Switch>
    </BrowserRouter>
    
  );
}

export default App;
