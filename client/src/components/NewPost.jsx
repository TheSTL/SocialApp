import React, { Component } from 'react'
import jwt from 'jsonwebtoken'

import api from '../services/api'

export default class NewPost extends Component {
    constructor(props){
        super(props)
        this.state={
           text:'',
           photo:'',
           imgUrl:`http://localhost:4000/api/users/defaultphoto`,
           username:'',
           _id:''
        }
        this.onChange=this.onChange.bind(this);
        this.onSubmit= this.onSubmit.bind(this);
    }

    async componentDidMount(){
        const decode= jwt.decode(localStorage.jwt);
        const{username,_id}=decode;

        this.setState({
            username,
            _id,
            imgUrl:`http://localhost:4000/api/users/photo/${_id}`,
        })

        this.data= new FormData();
        this.data.set('postedBy',_id)

    }

    onChange(e){
        const name= e.target.name;
        const value= name=='photo'? e.target.files[0]:e.target.value;
        this.setState({
            [name]:value
        })
        
        this.data.set(name,value);
    }

    async onSubmit(e){
        e.preventDefault();
         const response = await api.call('post',`api/posts/new/${this.state._id}`,this.data);
         const {data}= response;
         console.log(data);
         this.props.addUpdate(data)
        this.setState({
            text:'',
            photo:''
        })

    }


    render() {
        const{imgUrl,username,photo,text}= this.state
        return (
             <form onSubmit={this.onSubmit}>
                 <div className='postedByName'> 
                <img src={imgUrl} style={{ width:'50px',height:'50px',borderRadius:'100%' }}/>
                <h3>{username}</h3>
                </div> <br/>
                <textarea name="text" id="" cols="30" rows="10" 
                value={text}
                onChange={this.onChange}
                /><br/>
                <input type="file" name='photo' 
                onChange={this.onChange}
                 /> <br/>

                <button type='submit'  >Post</button>



             </form>   
                
        )
    }
}
