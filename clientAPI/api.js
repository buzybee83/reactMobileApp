/*
Start Axios on terminal: ngrok http [PORT_NUMBER] (eg ngrok http 3000)
Copy Forwarding address corresponding to HTTP
Update/paste baseURL below
*/
import axios from 'axios';
import { AsyncStorage } from 'react-native';

const instance =  axios.create({
    baseURL: 'http://755024e6.ngrok.io',
});

instance.interceptors.request.use(
    async config => {
        let currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
            currentUser = JSON.parse(currentUser);
            config.headers.Authorization = `Bearer ${currentUser.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

export default instance;