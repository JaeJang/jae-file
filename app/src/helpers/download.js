import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../config';

export const getDownLoadInfo = (id) => {

    const url = `${apiUrl}/posts/${id}`

    return axios.get(url);
}