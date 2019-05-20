import axios from 'axios';
import _ from 'lodash';

import {apiUrl} from '../config';

export const upload = (form, cb = () => {}) => {

    const url = `${apiUrl}/upload`;

    let files = _.get(form, 'files', []);

    let data = new FormData();

    _.each(files, (file)=>{
        data.append('files', file);

    });

    data.append('to', _.get(form, 'to'));
    data.append('from', _.get(form, 'from'));
    data.append('message', _.get(form, 'message'));

    const config = {
        onUploadProgress: (event) => {
            return cb({
                type: 'onUploadProgress',
                payload: event,
            });
        }
    }

    axios.post(url, data, config).then((res) => {
        return cb({
            type: 'success',
            payload: res.data,
        });
    }).catch((err) => {
        return cb({
            type: 'error',
            payload: err,
        });
    })
}