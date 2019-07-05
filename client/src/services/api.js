import axios from 'axios'

const location= 'http://localhost:4000/'

const setToken = (token)=>{
    if(token){
        axios.defaults.headers.common['Authorization']=`Bearer ${token}`
    }
    else{
        delete axios.defaults.headers.common['Authorization']
    }
}

const call = (method,path,data)=>{
    const response = axios[method](location+path,data);
    return response;
}

export default {
    setToken,
    call
}