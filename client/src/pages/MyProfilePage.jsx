import React, { Component } from 'react'
import jwt from 'jsonwebtoken'
import {withRouter} from 'react-router-dom'

import api from '../services/api'
import  Post from '../components/Post'

 class MyProfilePage extends Component {

    constructor(props){
        super(props);
        this.state={
            user:'',
            posts:'',
            nowShow:'',
            imgUrl:`http://localhost:4000/api/users/defaultphoto`,
            Authorized:false,
            areyou:"follow"
        }
        this.onCLickFollowing= this.onCLickFollowing.bind(this);
        this.onClickFollowers=this.onClickFollowers.bind(this);
        this.onCLickPosts=this.onCLickPosts.bind(this);
        this.init=this.init.bind(this);
        this.onClickFollowOrUnFollow=this.onClickFollowOrUnFollow.bind(this);
    }

    async init(_id){        
        const {_id:LoggedId}=jwt.decode(localStorage.jwt)
        
        const response = await api.call('get',`api/users/${_id}`);
        const isFollower= response.data.followers.filter(ff=>(LoggedId==ff._id))
        console.log(isFollower);
        
        const postResponse = await api.call('get',`api/posts/by/${_id}`);
        const  posts= postResponse.data;
        this.setState({
            user:response.data,
            imgUrl:`http://localhost:4000/api/users/photo/${_id}`,
            posts,
            Authorized: LoggedId==_id?true:false,
            followerId:LoggedId,
            followingId:_id,
            nowShow:'',
            areyou:isFollower.length>0?'unfollow':'follow'
        
        })

        console.log(this.state);
        
    
    }
   async componentDidMount(){
        await this.init(this.props.match.params.id);
        
        
    }    
    
   async componentWillReceiveProps(props){
     await this.init(props.match.params.id)
    
    }
    


    clickGotTo(e,id){
        const {history}= this.props;
        history.push(`/user/${id}`);
    }

    onClickFollowers(){
        const {followers}= this.state.user;
        
        
        const followersList = followers.map(follower=>(
            <div>
            <li className='postedByName' key={follower._id} onClick={(e)=>this.clickGotTo(e,follower._id)} >
                <img src={`http://localhost:4000/api/users/photo/${follower._id}`} alt="" style={{height:'40px',width:"40px",borderRadius:'100%'}}/>
                 <h3>{follower.username}</h3>
            </li>
            <div className='line'></div>
            </div>
        ))
        
        this.setState({nowShow:followersList})
    }
    onCLickFollowing(){
        const {following}= this.state.user;
        console.log(following);
        const followingList = following.map(following=>(
            <div>
            <li className='postedByName' key={following._id} onClick={(e)=>this.clickGotTo(e,following._id)} >
                <img src={`http://localhost:4000/api/users/photo/${following._id}`} alt="" style={{height:'40px',width:"40px",borderRadius:'100%'}}/>
                 <h3>{following.username}</h3>
                 </li>
                <div className='line'></div> 
            </div>    
        ))
        this.setState({nowShow:followingList});
    }
    onCLickPosts(){
        const{posts}= this.state;

        let designPost= posts.map(post=>(
            <>
            <Post id={post._id} key={post._id} />
            <br/>
            </> 
        )
        )
            this.setState({
                nowShow:designPost
            })
    }
    
  async onClickFollowOrUnFollow(){
      
      const {followerId,followingId,areyou} =this.state
    const response =await api.call('put',`api/users/${areyou}`,{followingId,followerId});
    let newFollower=this.state.user.followers;
    const {username}= jwt.decode(localStorage.jwt);
    if(areyou=='follow'){
    newFollower.push({username,_id:followerId})
    }
    else{
        newFollower=newFollower.filter(follower=>{
            if(follower._id==followerId) return false;
            return true;
        })
    }
    
    if(response.data.sucess){
        this.setState(pre=>{
            return {
                areyou: pre.areyou=='follow'?'unfollow':'follow',
                user:{
                   ...pre.user, followers: newFollower
                }
            }
        })
    }
    console.log(this.state);
    
    
    }


    render() {
        const {nowShow,user,imgUrl,Authorized}=this.state
        
        const {_id,username,email,created,about}= user;
        const {history}= this.props;
    
        return (
            <div>
            <div style={{textAlign:'center'}}>
                <h1>My Profile</h1>
            </div>
            <div className='myprofilepage'>
            <div className='myProfile'>
                    
                    <img src={imgUrl} style={{
                        width:'100px',
                        height:'100px'
                    }} />
                    

                    { Authorized  &&
                    (<>
                     <a href='#' onClick={()=>{history.push(`/user/edit/${_id}`)} } >Edit</a> 
                      <a href='#' onClick={()=>{
                          api.call('delete',`api/users/${this.state.user._id}`) 
                          localStorage.clear();
                          api.setToken();
                          history.push('/')
                          } }>Delete</a>
                    </>)}
                    {
                        !Authorized && <button 
                        onClick={this.onClickFollowOrUnFollow} >{this.state.areyou}</button>

                    }  
                         <br/> <br/>
                        
                        {username}<br/>
                        {email}<br/>
                        {about}<br/>
                        {created}<br/>
                    <button onClick={this.onCLickPosts}>Posts</button>
                    <button onClick={this.onCLickFollowing}>Following</button>
                    <button onClick={this.onClickFollowers}>Followers</button>

                    {nowShow}
            </div>
            </div>
            </div>
        )
    }
}
export default withRouter(MyProfilePage)