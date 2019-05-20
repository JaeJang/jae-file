import _ from 'lodash';
import {s3Bucket} from './config';

export default class S3 {

    constructor(app, response){
        this.app = app;
        this.response = response;
    }
    
    getObject(file) {
        const s3 = this.app.get('s3');
        const options = {
            Bucket: s3Bucket,
            Key: _.get(file, 'name'),
        }
        return s3.getObject(options).createReadStream();
    }

    download(file){
        const s3 = this.app.get('s3');
        const response = this.response;

        //get object from s3
        const filename = _.get(file, 'originalName');
        response.attachment(filename);

        const options = {
            Bucket: s3Bucket,
            Key: _.get(file, 'name'),
        }
        const fileS3 = s3.getObject(options).createReadStream();

        fileS3.pipe(response);
    }

    getDownloadUrl(file) {
        const s3 = this.app.get('s3');
        const options = {
            Bucket: s3Bucket,
            Key: _.get(file, 'name'),
            Expires: 3600, //one hour expires
        }

        const url = s3.getSignedUrl('getObject', options);

        return url;
    }

}