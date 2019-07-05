import React, { Component } from 'react'
import jwt from 'jsonwebtoken'
import {withRouter} from 'react-router-dom'

import NewPost from '../components/NewPost'
import Post from '../components/Post'
import api from '../services/api'

 class AuthHomePage extends Component {
    constructor(props){
        super(props);
        this.state={
            posts:[],
            people:[]
        }
        this.posts=this.posts.bind(this);
        this.setPeople=this.setPeople.bind(this);
        this.addUpdate=this.addUpdate.bind(this);
    }
    async componentDidMount(){
        const {_id}= jwt.decode(localStorage.jwt);
        const postRespponse = await api.call('get',`api/posts/feed/${_id}`)
        const peopleResponse= await api.call('get',`api/users/findpeople/${_id}`,);
        
        this.setState({
            posts:[...postRespponse.data],
            people:[...peopleResponse.data]
        })
    }

    posts (){
        const{posts}= this.state;

        return posts.map(post=>(
            <>
            <Post id={post._id} key={post._id} />
            <br/>
            </> 
        )
        )
        
    }

    addUpdate(post){
        let {posts}=this.state
        posts.unshift(post)
        this.setState({
            posts
        })
        
    }


    setPeople(){
        const{people}= this.state;
        return people.map(pep=>(
            <div className='postedByName' onClick={()=>{
               const {history}=this.props
               history.push(`/user/${pep._id}`)

            }}>
            <img 
            src={`http://localhost:4000/api/users/photo/${pep._id}`}
            style={{
                width:'40px',
                height:'40px',
                borderRadius:"100%"
            }}
            alt=""/>
            <h3> {pep.username} </h3>  
            </div>
        ))
    }

    render() {
        return (
            <div className='home' >
                <div className='mainHome'>
                <div className='feed'>
                <h1>NewsFeeds </h1>
                <NewPost addUpdate={this.addUpdate} />
                <div className='post'>
                {this.posts()}
                </div>
                </div>
                <div className='people'>
                <h1>Who to follow</h1>
                {this.setPeople()}
                </div>
                </div>
            </div>
        )
    }
}

export default withRouter(AuthHomePage)