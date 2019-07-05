import React, { Component } from 'react'
import jwt from 'jsonwebtoken'

import api from '../services/api'

export default class Post extends Component {
     constructor(props){
         super(props);
         this.state={
             userId:'', 
            imgUrl:'',
            postedBy:'',
            Liked:false,
            currentComment:'',
            comments:undefined,
            postedbyimageUrl:''
         }
         this.Like=this.Like.bind(this);
         this.UnLike=this.UnLike.bind(this);
         this.onChange=this.onChange.bind(this);
         this.onSubmit=this.onSubmit.bind(this);
         this.setComment=this.setComment.bind(this);
        }   
    
    async componentDidMount(){
        const {_id}= jwt.decode(localStorage.jwt);

        const id=this.props.id;
        const response= await api.call('get',`api/posts/${id}`)
        

        await this.setState({
            ...response.data,
            imgUrl:`http://localhost:4000/api/posts/photo/${id}`,
            userId:_id,
            postedbyimageUrl:`http://localhost:4000/api/users/photo/${response.data.postedBy._id}`
        })

        const{userId,likes}= this.state;
        let result= likes.filter(user=>(userId==user))
        
        result= result.length>0?true:false;
        this.setState({
            Liked:result
        })
        
    }

    async Like(){
        const{userId,_id:postId}=this.state;
        const response= await api.call('put',`api/posts/like`,{userId,postId})
        
        this.setState({
            ...response.data,
            Liked:true
        })

    

    }
    async UnLike(){
        const{userId,_id:postId}=this.state;
        const response= await api.call('put',`api/posts/unlike`,{userId,postId})
        this.setState({
            ...response.data,
            Liked:false
        })        
       

        
    }

    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    async onSubmit(e){
        e.preventDefault();
        const data={
            userId:this.state.userId,
            postId:this.state._id,
            comment:{
                text:this.state.currentComment,
                created:'',
                postedBy:''
                }
        }
        const  response = await api.call('put','api/posts/comment',data)
        this.setState({
            ...response.data,
            currentComment:''
        })
        
    }

     setComment(){
        const {comments,_id:postId}= this.state;
        if(comments){
        return comments.map(comment=>(
           <> <div key={comment._id}>
            <img src={`http://localhost:4000/api/users/photo/${comment.postedBy._id}`} 
            style={{height:'30px',width:'30px',borderRadius:'100%'}}
            alt=""/>
            {comment.postedBy.username} <br/>
            {comment.text} <br/>
            {comment.created } 
            <span onClick={async ()=>{
               const response= await api.call('put',`api/posts/uncomment`,{comment,postId})
               this.setState({
                   ...response.data
               })
               
            }}> Delete</span> 
        </div> <br/> </>
        )).reverse()
        }
    }


    render() {
        const{_id,postedbyimageUrl,postedBy,imgUrl,created,Liked,likes,photo,text,comments}=this.state
        return (
            <div key={_id} className='post'>
                <div className='posteByNameMain'>
                    <div className='postedByName'>
                    <img src={postedbyimageUrl} alt=""  style={{height:'50px',width:'50px',borderRadius:'100%'}}/>
                   <h3> {postedBy.username} </h3> 
                   </div>
                   <h5> {created} </h5>
                  
                </div>
                <div className='text'>{text} </div><br/>
                { photo &&
                <img src={imgUrl} style={{height:'100px',width:'100px'}}/> 
                }
                <br/>
                {  Liked && likes.length}
                {
                !Liked && <span onClick={this.Like}>Like</span> 
                }
                {
                Liked && <span onClick={this.UnLike}>UnLike</span> 
                }
                {comments && comments.length}
                 <span>Comment</span>
                <form onSubmit={this.onSubmit}>
                    <input type="text" placeholder="Write something"
                    value={this.state.currentComment}
                     name='currentComment'
                     onChange={this.onChange}/>
                </form>
                
                {this.setComment()}
                <div className='line'></div>
            </div>
        )
    }
}
