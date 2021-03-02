import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burguer-project-f35fe-default-rtdb.firebaseio.com/',
});

export default instance;
