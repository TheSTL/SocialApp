import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'


import MainRouter from './MainRouter'

export default function App() {
    return (
        <Router> 
         <MainRouter />   
        </Router>
    )
}
