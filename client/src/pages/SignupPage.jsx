import React, { Component } from 'react'

import api from '../services/api'

export default class SignupPage extends Component {

    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            email:'',
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChange(e){
        this.setState({
            [e.target.name]:e.target.value
        })
    
        
    }

    async handleSubmit(e){
        e.preventDefault();
        const response = await api.call('post','auth/signup',this.state);
        const {data}=response;
        
        const{history} = this.props;
        history.push('/login')

    }

    render() {
        return (
            <div className='signup'>
                <h1>Signup</h1>
                {this.state.message}
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name='username' onChange={this.handleChange} /> <br/>
                    <label htmlFor="email">Email</label>
                    <input type="text" name='email' onChange={this.handleChange} /> <br/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' onChange={this.handleChange} /> <br/>
                    <button type='submit'>Submit </button>
                    
                </form>
            </div>
        )
    }
}
