/*
Start Axios on terminal: ngrok http [PORT_NUMBER] (eg ngrok http 3000)
Copy Forwarding address corresponding to HTTP
Update/paste baseURL below
*/
import axios from 'axios';

export default axios.create({
    baseURL: 'http://8c4e5aa7.ngrok.io'
});