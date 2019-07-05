import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import jwt from 'jsonwebtoken'

import api from '../services/api'

 class Navbar extends Component {
    constructor(props){
        super(props)
        this.handlLogOut=this.handlLogOut.bind(this);
    }

    handlLogOut(){
        localStorage.clear();
        api.setToken();
        const {history}= this.props;
        history.push('/');
        
    }


    render() {
        const isAuthorized= localStorage.jwt;
        let id;
        api.setToken(localStorage.jwt);
        if(isAuthorized){
         id =jwt.decode(localStorage.jwt)._id; }
        return (
            <ul className='navbar'>
                <Link to='/'>Home </Link>
                {
                    !isAuthorized && 
                    (
                        <>
                        <Link to='/login'>LogIn </Link>
                        <Link to='/signup'>SignUp </Link>
                        </>
                    )

                }
                {
                    isAuthorized &&
                    (
                        <>
                        <Link to={`/user/${id}`}>MyProfile</Link>
                        <Link   onClick={this.handlLogOut} to='#' >LogOut</Link>
                        </>
                    )
                }

            </ul>
        )
    }
}


export default withRouter(Navbar)