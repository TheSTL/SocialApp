import React, { Component } from 'react'

import api from '../services/api'

export default class LoginPage extends Component {

    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            err:''
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    async handleSubmit(event){
        event.preventDefault();

        const response = await api.call('post','auth/login',this.state);
        const {err,token} = response.data;
        
            if(!err){
            await api.setToken(token)
            localStorage.setItem('jwt',token)
            const {history}= this.props;
            history.push('/');
            }
            else{
                this.setState({
                    err
                })
            }
            
        
        
        

    }

    render() {
        const {username,password,err}= this.state;
           
        return (
            <div className='login'>
                <h1>Login</h1>
                {err}
                <form onSubmit={this.handleSubmit}>
                <label htmlFor="usename">Username</label>
                <input type='text' name='username' onChange={this.handleChange} value={username} /> <br/>
                <label htmlFor="password">Password</label>
                <input type="text" name='password' onChange={this.handleChange} value={password} /> <br/>
                <button type='submit'>Submit</button>
                </form>
            </div>
        )
    }
}
