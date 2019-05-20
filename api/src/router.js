import path from 'path';
import {version} from '../package.json';
import _ from 'lodash';
import File from './models/file';
import Post from './models/post';
import {ObjectId} from 'mongodb';
import FileArchiver from './archiver';
import Email from './email';
import S3 from './s3';

class AppRouter {

    constructor(app) {
        this.app = app;
        this.setupRouter();
    }

    setupRouter() {
        const app = this.app;
        const db = app.get('db');
        const uploadDir = app.get('storageDir');
        const upload = app.get('upload');

        //root routing
        app.get('/', (req,res,next) => {
            return res.status(200).json({
                version: version
            });
        });

        //post

        // Upload routing
        app.post('/api/upload', upload.array('files'), (req,res,next) => {
            const files = _.get(req,'files', []);
            console.log(files);
            let fileModels = [];

            _.each(files, (fileObject) => {
                
                const newFile = new File(app).initWithObject(fileObject).toJSON();

                fileModels.push(newFile);
            });

            if(fileModels.length){
                db.collection('files').insertMany(fileModels, (err, result) => {
                    if(err){
                        return res.status(503).json({
                            error: {
                                message: "Unable to save the files"
                            }
                        });
                    }

                    //post
                    let post = new Post(app).initWithObject({
                        from: _.get(req, 'body.from'),
                        to: _.get(req, 'body.to'),
                        message: _.get(req, 'body.message'),
                        files: result.insertedIds,
                    }).toJSON();

                    db.collection('posts').insertOne(post, (err, result) => {
                        if(err){
                            return res.status(503).json({
                                error: {
                                    message: 'Your upload could not be saved'
                                }
                            });
                        }

                        // implement email sending to user with download link.
                        const sendEmail = new Email(app);
                        sendEmail.sendLink(post, (error, info) => {
                            if(error) {
                                console.log("An error occured sending email ", error);
                            }
                        });


                        return res.json({post:post});
                    })


                    /* return res.json({
                        files: fileModels
                    }); */
                });
            } else {
                return res.status(503).json({
                    error:{
                        message: "File upload is required",
                    }
                });
            }

        });
    
        // Download routing
        app.get('/api/download/:id', (req,res,next) => {

            const fieldId = req.params.id;

            db.collection('files').find({_id:ObjectId(fieldId)}).toArray((err, result) =>{
                const fileName = _.get(result, '[0].name');

                if(err || !fileName){
                    return res.status(503).json({
                        error: {
                            message: "File not found",
                        },
                    });
                }

                //LOCAL
                /* const filePath = path.join(uploadDir, fileName);
                
                return res.download(filePath,_.get(result, '[0].originalName'), (err) => {
                    if(err){
                        return res.status(404).json({
                            error: {
                                message: "File not found"
                            }
                        });
                    } else {
                        console.log("File downloaded");
                    }
                }); */

                // Download files from S3
                const file = _.get(result, '[0]');
                const downloader = new S3(app, res);
                
                //Proxy download from s3 service
                //return downloader.download(file);
                
                // Download Directly from S3
                const downloadUrl = downloader.getDownloadUrl(file);
                //return res.json({downloadURL: downloadUrl});
                return res.redirect(downloadUrl);
            });
        });

        app.get('/api/posts/:id', (req,res,next) => {
            const postId = _.get(req,'params.id');
            
            this.getPostById(postId, (err, result) => {

                if(err){
                    return res.status(404).json({error: {message: 'File not found'}});
                }

                return res.json(result);
            })
        });

        app.get('/api/posts/:id/download', (req,res,next) => {

            const postId = _.get(req,'params.id', null);

            this.getPostById(postId, (err, result) => {
                
                if(err){
                    return res.status(404).json({error: {message: 'File not found'}});
                }

                const files = _.get(result, 'files',[]);
                const archiver = new FileArchiver(app, files, res).download();
                return archiver;

            });
        });
    }


    getPostById(id, cb = () => {}) {

        const app = this.app;
        const db = app.get('db');

        let postObjectId = null;
        try{
            postObjectId = new ObjectId(id);
        } catch(err) {
            return cb(err, null);
        }
        db.collection('posts').find({_id: postObjectId}).limit(1).toArray((err, results) => {
            const result = _.get(results,'[0]');
            if(err || !result) {
                return cb(err ? err: new Error("File not found."));
            }
            const fileIds = _.get(result,'files',[]);
            let fileIdsArr = []
            for(let i in fileIds){
                fileIdsArr.push(fileIds[i]);
            }
            db.collection('files').find({_id: {$in: fileIdsArr}}).toArray((err, files) => {
                if(err || !files || !files.length) {
                    return cb(err ? err: new Error("File not found."));
                }
                result.files = files;
                return cb(null, result);

            })
        });
    }
}


export default AppRouter;