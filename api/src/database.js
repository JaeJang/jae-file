import {MongoClient} from 'mongodb';
import {mongodbUrl} from './config';

export const connect = (callback) => {
    MongoClient.connect(mongodbUrl, {useNewUrlParser: true}, (err, db) => {
        
        return callback(err, db);
    });
}