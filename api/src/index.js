import http from 'http';
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';
import nodemailer from 'nodemailer'; 
import AppRouter from './router';
import {connect} from "./database";
import {smtp,s3Config,s3Region, s3Bucket} from './config';
import multerS3 from 'multer-s3';

//Amazon S3 Setup
import AWS from 'aws-sdk';
AWS.config.update(s3Config);
AWS.config.region = s3Region;
const s3 = new AWS.S3();


// Setup Email
let email = nodemailer.createTransport(smtp);

//File storage config
const storageDir = path.join(__dirname,'..','storage');
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storageDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
//const upload = multer({storage: storageConfig}); //local upload

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: s3Bucket,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
          const filename = `${Date.now().toString()}-${file.originalname}`;
        cb(null, filename);
      }
    })
  })

//End file storage config


const PORT = 3001;
const app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(cors({
    exposedHeaders: "*",
}));

app.use(bodyParser.json({
    limit: '50mb',
}));

app.set('root', __dirname);
app.set('storageDir', storageDir);
app.set('upload', upload);
app.set('s3', s3);
app.email = email;

//Connect to the database
connect((err, db) => {
    if(err) {
        console.log("Failed to connect to the database");
        throw (err);
    }
    
    app.set('db', db.db('file'));
    new AppRouter(app);

    app.server.listen(process.env.PORT || PORT, () => {
        console.log(`The app is running on port ${app.server.address().port}`);
    })
});

export default app;


