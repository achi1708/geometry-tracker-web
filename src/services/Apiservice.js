import axios from "axios";

const httpInstance = axios.create( {
    baseURL: process.env.REACT_APP_API
});

let token = localStorage.getItem('tkn');

httpInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

httpInstance.interceptors.request.use(function (config) {
    console.log("INTERCEPTOR AXIOS");
    const token = localStorage.getItem('tkn');
    config.headers.Authorization = `Bearer ${token}`;
    console.log(token);

    return config;
});

export default httpInstance;