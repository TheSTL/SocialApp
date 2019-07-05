import React, { Component } from 'react'
import {Switch,Route,withRouter} from 'react-router-dom'

import Navbar from './Navbar'

import HomePage from '../pages/HomePage'
import AuthHomePage from '../pages/AuthHomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import MyProfilePage from '../pages/MyProfilePage'
import EditPage from '../pages/EditPage'

 class MainRouter extends Component {

    render() {

        const isAuthorized = localStorage.jwt;
        
        return (
            <>
            <Navbar />
            <Switch>
                <Route exact path='/' render={(props)=>(
                    isAuthorized? <AuthHomePage   />:<HomePage/>
                ) } />
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/signup' component={SignupPage} />
                <Route exact path= '/user/:id' component={MyProfilePage} />
                <Route exact path='/user/edit/:id' component={EditPage}/>
                
            </Switch>
            </>
        )
    }
}

export default withRouter(MainRouter)