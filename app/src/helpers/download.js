import axios from 'axios';
import {apiUrl} from '../config';

export const getDownLoadInfo = (id) => {

    const url = `${apiUrl}/posts/${id}`

    return axios.get(url);
}