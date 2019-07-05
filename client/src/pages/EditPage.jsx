import React, { Component } from 'react'
import _ from 'underscore'
import api from '../services/api'

export default class EditPage extends Component {
    constructor(props){
        super(props)
        this.state={
            _id:'',
            username:'',
            password:'',
            email:'',
            about:'',
            imgUrl:`http://localhost:4000/api/users/defaultphoto`,
            
            }

        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
    }

    async componentDidMount(){

        this.userData= new FormData();

        const {match}= this.props;
        const {id} = match.params
        const response = await api.call('get',`api/users/${id}`);
        
        const user = response.data;
        const {_id,username,password,email,about,photo,updated}=user;
        this.setState({
            _id,username,password,email,about,photo,updated,
            imgUrl:`http://localhost:4000/api/users/photo/${_id}`,
            loading:false
        })
        
    }

    onChange(e){
        
        const name= e.target.name;
        const value= name=='photo'? e.target.files[0]:e.target.value;
        this.userData.set(name,value)
        this.setState({
            [name] :value
        })
        
    }
   async onSubmit(e){
        e.preventDefault();
           
       const response = await api.call('put',`api/users/${this.state._id}`,this.userData);
       const user = response.data;
        
        const {_id,username,password,email,about,photo,updated}=user;
        this.setState({
            _id,username,password:'',email,about,photo,updated,
            imgUrl:`http://localhost:4000/api/users/photo/${_id}`

        })
        const {history}=this.props;
        history.push(`/user/${_id}`)
               
    }

    render() {
        const {username,password,about,email,imgUrl}= this.state;
        
        
        return (
            <div >
                <div style={{textAlign:'center'}}>
                <h1>Edit Profile</h1>
                </div>

                <div className='myprofile'>
                <img src={imgUrl} style={{
                    width:'100px',
                    height:'100px'
                 }} />
               
                <form onSubmit={this.onSubmit} >
                <label htmlFor="photo">Photo</label>
                <input onChange={this.onChange} type="file" name='photo'  /> <br/>

                <label htmlFor="username">Username</label>
                <input onChange={this.onChange} type="text" name='username' value={username}/> <br/>

                <label htmlFor="about">About</label>
                <input onChange={this.onChange}  type="text" name='about'value={about}/> <br/>

                <label htmlFor="email">Email</label>
                <input onChange={this.onChange}  type="text"name='email'value={email} /><br/>

                <label htmlFor="password">Password</label>
                <input  onChange={this.onChange} type="password" name='password' value={password} /> <br/>

                <button type='submit'>Submit</button>
                </form>
                </div>
            </div>
        )
    }
}
