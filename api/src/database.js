import {MongoClient} from 'mongodb';

const url = 'mongodb://localhost:27017/file';

export const connect = (callback) => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, db) => {
        
        return callback(err, db);
    });
}